// Base entity interface
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// User types
export interface User extends BaseEntity {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  is_verified: boolean;
  is_admin: boolean;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Category types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  color_code?: string;
  sort_order: number;
  is_active: boolean;
}

// Auction types
export interface Auction extends BaseEntity {
  product_id: number;
  start_time: string;
  end_time: string;
  current_price?: number;
  current_winner_id?: number;
  total_bids: number;
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  reserve_met: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}
