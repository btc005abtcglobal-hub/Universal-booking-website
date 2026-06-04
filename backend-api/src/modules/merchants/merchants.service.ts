import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../../common/dto/pagination.dto';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateMerchantDto) {
    return this.prisma.merchant.create({
      data: {
        ...dto,
        ownerId,
        slug: this.generateSlug(dto.name),
      },
    });
  }

  async findAll(pagination: PaginationDto, city?: string) {
    const where = {
      isActive: true,
      deletedAt: null,
      ...(city ? { city: { contains: city, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'desc' },
        include: {
          services: { where: { isActive: true, deletedAt: null }, take: 5 },
          _count: { select: { services: true, bookings: true, reviews: true } },
        },
      }),
      this.prisma.merchant.count({ where }),
    ]);

    return createPaginatedResponse(data, total, pagination);
  }

  async findBySlug(slug: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { slug, deletedAt: null },
      include: {
        services: {
          where: { isActive: true, deletedAt: null },
          include: { category: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
        _count: { select: { services: true, bookings: true, reviews: true } },
      },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async findById(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException('Merchant not found');
    }
    const merchant = await this.prisma.merchant.findUnique({
      where: { id, deletedAt: null },
      include: {
        services: { where: { isActive: true, deletedAt: null } },
        staff: true,
        _count: { select: { services: true, bookings: true, reviews: true } },
      },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async update(id: string, ownerId: string, dto: UpdateMerchantDto) {
    const merchant = await this.findById(id);
    if (merchant.ownerId !== ownerId) {
      throw new ForbiddenException('Not authorized to update this merchant');
    }
    return this.prisma.merchant.update({
      where: { id },
      data: dto,
    });
  }

  async getMerchantDashboard(merchantId: string) {
    const [totalBookings, todayBookings, revenue, recentBookings] = await Promise.all([
      this.prisma.booking.count({
        where: { merchantId, deletedAt: null },
      }),
      this.prisma.booking.count({
        where: {
          merchantId,
          deletedAt: null,
          scheduledStart: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          booking: { merchantId },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      this.prisma.booking.findMany({
        where: { merchantId, deletedAt: null },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, avatarUrl: true } },
          service: { select: { name: true } },
          slot: true,
        },
      }),
    ]);

    return {
      totalBookings,
      todayBookings,
      totalRevenue: revenue._sum.amount || 0,
      recentBookings,
    };
  }

  async addStaff(merchantId: string, userId: string, role: string, name = 'Staff Member') {
    return this.prisma.merchantStaff.create({
      data: {
        merchantId,
        userId,
        name,
        role: role as any,
      },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Math.random().toString(36).slice(2, 6);
  }
}
