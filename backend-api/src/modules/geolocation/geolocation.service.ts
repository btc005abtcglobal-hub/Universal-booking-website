// ============================================================
// Geolocation Service — PostGIS-based geospatial search
// ============================================================

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Find nearby merchants using Haversine formula
   * PostGIS would be more performant at scale, this works for initial setup
   */
  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 25,
    limit: number = 20,
    offset: number = 0,
  ) {
    // Using raw SQL with Haversine formula for geo-distance
    const merchants = await this.prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        slug: string;
        logo_url: string | null;
        cover_image_url: string | null;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        rating: number;
        review_count: number;
        distance_km: number;
      }>
    >`
      SELECT * FROM (
        SELECT
          id, name, slug, logo_url, cover_image_url,
          address, city, latitude, longitude,
          rating, review_count,
          (
            6371 * acos(
              cos(radians(${latitude})) *
              cos(radians(latitude)) *
              cos(radians(longitude) - radians(${longitude})) +
              sin(radians(${latitude})) *
              sin(radians(latitude))
            )
          ) AS distance_km
        FROM merchants
        WHERE is_active = true AND deleted_at IS NULL
      ) sub
      WHERE distance_km <= ${radiusKm}
      ORDER BY distance_km ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return merchants.map((m: any) => ({
      ...m,
      distanceKm: Math.round(m.distance_km * 10) / 10,
      logoUrl: m.logo_url,
      coverImageUrl: m.cover_image_url,
      reviewCount: m.review_count,
    }));
  }

  /**
   * Get merchants for map pins in a bounding box
   */
  async getMerchantsInBounds(
    swLat: number,
    swLng: number,
    neLat: number,
    neLng: number,
    limit: number = 100,
  ) {
    return this.prisma.merchant.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        latitude: { gte: swLat, lte: neLat },
        longitude: { gte: swLng, lte: neLng },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        rating: true,
        reviewCount: true,
        _count: { select: { services: true } },
      },
      take: limit,
    });
  }
}
