// ============================================================
// Booking Engine — Core service with distributed locking
// CRITICAL: Prevents double-bookings via Redis + PostgreSQL
// ============================================================

import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { PaginationDto, createPaginatedResponse } from '../../common/dto/pagination.dto';
import { nanoid } from 'nanoid';

const SLOT_LOCK_TTL = 300; // 5 minutes
const BOOKING_HOLD_TTL = 600; // 10 minutes

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @InjectQueue('booking-queue') private bookingQueue: Queue,
  ) {}

  // ==========================================================
  // BOOKING FLOW — With distributed locking
  // ==========================================================

  /**
   * Step 1: Reserve a slot
   * - Acquires Redis distributed lock on the slot
   * - Validates capacity
   * - Creates a temporary booking hold
   * - Returns booking reference for payment
   */
  async reserveSlot(
    userId: string,
    slotId: string,
    serviceId: string,
    attendeeCount: number = 1,
    notes?: string,
  ) {
    const lockKey = `lock:slot:${slotId}`;
    const holdKey = `hold:booking`;

    // Step 1: Acquire distributed lock
    const lockValue = await this.redis.acquireLock(lockKey, SLOT_LOCK_TTL);
    if (!lockValue) {
      throw new ConflictException(
        'Slot is currently being booked by another user. Please try again.',
      );
    }

    try {
      // Step 2: Validate slot availability within transaction
      const result = await this.prisma.$transaction(async (tx: any) => {
        // Fetch slot with pessimistic locking intent
        const slot = await tx.bookingSlot.findUnique({
          where: { id: slotId },
          include: { service: { include: { merchant: true } } },
        });

        if (!slot) {
          throw new NotFoundException('Slot not found');
        }

        if (slot.isBlocked || !slot.isAvailable) {
          throw new BadRequestException('Slot is not available');
        }

        if (slot.serviceId !== serviceId) {
          throw new BadRequestException('Slot does not belong to this service');
        }

        // Step 3: Validate capacity
        const remainingCapacity = slot.maxCapacity - slot.bookedCount;
        if (attendeeCount > remainingCapacity) {
          throw new BadRequestException(
            `Only ${remainingCapacity} spots remaining. Requested: ${attendeeCount}`,
          );
        }

        // Step 4: Generate booking reference
        const bookingReference = `BK-${nanoid(10).toUpperCase()}`;
        const totalAmount = Number(slot.price) * attendeeCount;

        // Step 5: Create booking in PENDING state
        const booking = await tx.booking.create({
          data: {
            bookingReference,
            userId,
            serviceId,
            merchantId: slot.service.merchantId,
            slotId,
            status: 'PENDING',
            totalAmount,
            currency: slot.service.currency,
            attendeeCount,
            notes,
            scheduledStart: slot.startTime,
            scheduledEnd: slot.endTime,
          },
        });

        // Step 6: Increment booked count (optimistic)
        await tx.bookingSlot.update({
          where: { id: slotId },
          data: {
            bookedCount: { increment: attendeeCount },
            isAvailable: slot.bookedCount + attendeeCount < slot.maxCapacity,
          },
        });

        return {
          booking,
          slot,
          totalAmount,
        };
      });

      // Step 7: Set booking hold in Redis (expires if payment not completed)
      await this.redis.setJson(
        `${holdKey}:${result.booking.id}`,
        {
          bookingId: result.booking.id,
          slotId,
          attendeeCount,
          createdAt: Date.now(),
        },
        BOOKING_HOLD_TTL,
      );

      // Step 8: Queue expiry check job
      await this.bookingQueue.add(
        'check-booking-expiry',
        { bookingId: result.booking.id, slotId, attendeeCount },
        { delay: BOOKING_HOLD_TTL * 1000 },
      );

      this.logger.log(
        `Booking reserved: ${result.booking.bookingReference} for slot ${slotId}`,
      );

      return {
        bookingId: result.booking.id,
        bookingReference: result.booking.bookingReference,
        totalAmount: result.totalAmount,
        currency: result.booking.currency,
        holdExpiresAt: new Date(Date.now() + BOOKING_HOLD_TTL * 1000),
        slot: {
          startTime: result.slot.startTime,
          endTime: result.slot.endTime,
        },
      };
    } finally {
      // Always release lock
      await this.redis.releaseLock(lockKey, lockValue);
    }
  }

  /**
   * Step 2: Confirm booking after payment
   */
  async confirmBooking(bookingId: string, paymentId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(`Booking is ${booking.status}, cannot confirm`);
    }

    const confirmed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        service: true,
        merchant: true,
        slot: true,
        user: true,
      },
    });

    // Clear the hold from Redis
    await this.redis.del(`hold:booking:${bookingId}`);

    // Queue notification
    await this.bookingQueue.add('send-confirmation', {
      bookingId: confirmed.id,
      userId: confirmed.userId,
      bookingReference: confirmed.bookingReference,
    });

    this.logger.log(`Booking confirmed: ${confirmed.bookingReference}`);
    return confirmed;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) {
      throw new BadRequestException('Not authorized to cancel this booking');
    }
    if (['CANCELLED', 'COMPLETED', 'REFUNDED'].includes(booking.status)) {
      throw new BadRequestException(`Cannot cancel a ${booking.status} booking`);
    }

    const result = await this.prisma.$transaction(async (tx: any) => {
      // Cancel booking
      const cancelled = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: reason,
        },
      });

      // Restore slot capacity
      await tx.bookingSlot.update({
        where: { id: booking.slotId },
        data: {
          bookedCount: { decrement: booking.attendeeCount },
          isAvailable: true,
        },
      });

      return cancelled;
    });

    // Queue refund if payment was completed
    await this.bookingQueue.add('process-refund', { bookingId });

    return result;
  }

  /**
   * Handle expired booking holds
   */
  async expireBookingHold(bookingId: string, slotId: string, attendeeCount: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.status !== 'PENDING') return;

    // Check if hold still exists in Redis
    const hold = await this.redis.getJson(`hold:booking:${bookingId}`);
    if (hold) return; // Hold still active, was extended

    await this.prisma.$transaction(async (tx: any) => {
      // Cancel the expired booking
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED', cancelReason: 'Payment timeout' },
      });

      // Restore slot capacity
      await tx.bookingSlot.update({
        where: { id: slotId },
        data: {
          bookedCount: { decrement: attendeeCount },
          isAvailable: true,
        },
      });
    });

    this.logger.warn(`Booking expired: ${booking.bookingReference}`);
  }

  // ==========================================================
  // QUERY METHODS
  // ==========================================================

  async findById(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException('Booking not found');
    }
    const booking = await this.prisma.booking.findUnique({
      where: { id, deletedAt: null },
      include: {
        service: true,
        merchant: { select: { id: true, name: true, logoUrl: true, address: true, phone: true } },
        slot: true,
        payment: true,
        qrCheckin: true,
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByReference(reference: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingReference: reference, deletedAt: null },
      include: {
        service: true,
        merchant: true,
        slot: true,
        payment: true,
        qrCheckin: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByMerchant(merchantId: string, pagination: PaginationDto, status?: string) {
    const where: any = { merchantId, deletedAt: null };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { scheduledStart: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
          service: { select: { id: true, name: true } },
          slot: true,
          payment: true,
          qrCheckin: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return createPaginatedResponse(data, total, pagination);
  }

  async findByUser(userId: string, status?: string) {
    const where: any = { userId, deletedAt: null };
    if (status) where.status = status;

    return this.prisma.booking.findMany({
      where,
      orderBy: { scheduledStart: 'desc' },
      include: {
        service: { select: { id: true, name: true, images: true, durationMinutes: true } },
        merchant: { select: { id: true, name: true, logoUrl: true, address: true } },
        slot: true,
        payment: true,
        qrCheckin: true,
      },
    });
  }
}
