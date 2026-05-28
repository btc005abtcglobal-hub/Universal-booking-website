// ============================================================
// API Client — BETA Universal Service Marketplace
// ============================================================

const API_BASE = typeof window !== 'undefined'
  ? `${window.location.origin}/api/v1`
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api/v1');

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// ---- Booking Types ----
export const api = {
  bookingTypes: {
    list: () => apiFetch<BookingType[]>('/booking-types'),
    featured: () => apiFetch<BookingType[]>('/booking-types?featured=true'),
    bySlug: (slug: string) => apiFetch<BookingTypeDetail>(`/booking-types/${slug}`),
  },
  categories: {
    list: () => apiFetch<Category[]>('/services/categories'),
  },
  services: {
    featured: (limit = 8) => apiFetch<Service[]>(`/services/featured?limit=${limit}`),
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<PaginatedResponse<Service>>(`/services${qs}`);
    },
    byId: (id: string) => apiFetch<Service>(`/services/${id}`),
  },
  merchants: {
    nearby: (lat: number, lng: number, params?: Record<string, string>) => {
      const qs = new URLSearchParams({ lat: String(lat), lng: String(lng), ...params }).toString();
      return apiFetch<Merchant[]>(`/geo/nearby?${qs}`);
    },
    bySlug: (slug: string) => apiFetch<Merchant>(`/merchants/slug/${slug}`),
  },
};

// ---- Types ----
export interface BookingType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  coverImage?: string;
  color?: string;
  gradient?: string;
  sortOrder: number;
  isFeatured: boolean;
  _count?: { categories: number; merchants: number };
}

export interface BookingTypeDetail extends BookingType {
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  iconUrl?: string;
  coverImage?: string;
  color?: string;
  bookingTypeId?: string;
  _count?: { services: number };
  children?: Category[];
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  images: string[];
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  amenities: string[];
  tags: string[];
  latitude?: number;
  longitude?: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  serviceType: string;
  basePrice: string;
  currency: string;
  durationMinutes: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  merchant: Merchant;
  category: Category;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
