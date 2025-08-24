// src/services/sellerService.ts
import api from './api';

const sellerService = {
  // Get seller profile with tier progress
  getProfile: () => {
    return api.get('/seller/profile');
  },

  // Get categories for auction creation
  getCategories: () => {
    console.log('Fetching categories...');
    return api.get('/seller/categories');
  },

  // Create new auction
  createAuction: (auctionData: {
    title: string;
    description: string;
    category_id: number;
    subcategory_id?: number;
    starting_price: number;
    reserve_price?: number;
    buy_now_price?: number;
    bid_increment?: number;
    condition?: string;
    images?: string[];
    start_time?: string;
    end_time: string;
  }) => {
      // DEBUG: Log the exact payload being sent
    console.log('🚀 Sending auction data:', JSON.stringify(auctionData, null, 2));
    
    return api.post('/seller/auctions', auctionData)
      .catch(error => {
        // DEBUG: Log the full error response
        console.error('❌ Create auction failed:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', error.response?.data);
        console.error('Request Data:', auctionData);
        throw error;
      });
  },
  // Get seller's auctions
  getAuctions: (params: {
    status?: string;
    category?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) => {
    return api.get('/seller/auctions', { params });
  },

  
  // Update auction status
  updateAuctionStatus: (auctionId: number, status: string) => {
    return api.patch(`/seller/auctions/${auctionId}/status`, { status });
  },

  // Get seller analytics
  getAnalytics: (days: number = 30) => {
    return api.get('/seller/analytics', { params: { days } });
  },

  // Get seller earnings
  getEarnings: (params: { status?: string; period?: string } = {}) => {
    return api.get('/seller/earnings', { params });
  }
};

export default sellerService;
