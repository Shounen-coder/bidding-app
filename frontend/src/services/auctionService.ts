import api from './api';
// import { Auction, AuctionFilters } from '../types/auction';
import { type Auction, type AuctionFilters } from '../types/auction';

export const auctionService = {
  // Get all auctions with filters
  getAuctions: async (filters: AuctionFilters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.status) params.append('status', filters.status);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await api.get(`/auctions?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch auctions'
      };
    }
  },

  // Get single auction by ID
  getAuction: async (id: number) => {
    try {
      const response = await api.get(`/auctions/${id}`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch auction details'
      };
    }
  },

  // Get auctions by category
  getAuctionsByCategory: async (categorySlug: string, filters: AuctionFilters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.status) params.append('status', filters.status);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await api.get(`/auctions/category/${categorySlug}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch category auctions'
      };
    }
  },

  // Get featured auctions
  getFeaturedAuctions: async (type: 'ending_soon' | 'popular' | 'new' = 'new', limit = 10) => {
    try {
      const response = await api.get(`/auctions/featured?type=${type}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch featured auctions'
      };
    }
  }
};
