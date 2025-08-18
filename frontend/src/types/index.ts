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

export interface Subcategory extends BaseEntity {
  parent_category_id: number;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  color_code?: string;
  sort_order: number;
  is_active: boolean;
  subcategories?: Subcategory[];
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



// Add these new interfaces to your existing types file

// Product interface (enhanced)
export interface Product extends BaseEntity {
  title: string;
  description: string;
  category_id: number;
  subcategory_id?: number; // New subcategory reference
  category?: Category;
  subcategory?: Subcategory; // New subcategory relationship
  starting_price: number;
  reserve_price?: number;
  buy_now_price?: number;
  bid_increment: number;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  images: string[];
  created_by: number;
  creator?: User;
}

// Enhanced Auction interface
export interface Auction extends BaseEntity {
  product_id: number;
  product?: Product;
  start_time: string;
  end_time: string;
  current_price?: number;
  current_winner_id?: number;
  current_winner?: User;
  total_bids: number;
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  reserve_met: boolean;
  time_remaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

// Bid interface (enhanced)
export interface Bid extends BaseEntity {
  auction_id: number;
  auction?: Auction;
  bidder_id: number;
  bidder?: User;
  amount: number;
  bid_time: string;
  status: 'active' | 'cancelled' | 'outbid' | 'winning';
  priority_rank?: number;
  is_auto_bid: boolean;
}

// Auction filtering interface
// Update AuctionFilters to support subcategories
// export interface AuctionFilters {
//   category?: string;
//   subcategory?: string; // New subcategory filter
//   status?: 'scheduled' | 'active' | 'ended';
//   price_min?: number;
//   price_max?: number;
//   condition?: string[];
//   search?: string;
//   sort_by?: 'ending_soon' | 'newest' | 'price_low' | 'price_high' | 'most_bids';
//   page?: number;
//   limit?: number;
// }



