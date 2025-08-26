// src/store/slices/sellerSlice.ts (Enhanced version)
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import sellerService from '../../services/sellerService';
import type { SellerAnalytics } from '../../types/sellerAnalytics';

// Types
export interface SellerStats {
  totalAuctions: number;
  completedAuctions: number;
  completionRate: number;
  averageRating: number;
  totalSales: number;
}

export interface SellerProfile {
  id: number;
  userId: number;
  tier: 'basic' | 'verified' | 'trusted';
  tierUpdatedAt: string;
  stats: SellerStats;
  createdAt: string;
  updatedAt: string;
}

export interface TierRequirement {
  name: string;
  maxValue: number;
  maxActive: number;
  features: string[];
  nextTier: string | null;
  requirements?: {
    completedAuctions?: number;
    completionRate?: number;
    averageRating?: number;
    monthsActive?: number;
  };
}

export interface TierProgress {
  completedAuctions?: {
    current: number;
    required: number;
    percentage: number;
  };
  completionRate?: {
    current: number;
    required: number;
    percentage: number;
  };
  averageRating?: {
    current: number;
    required: number;
    percentage: number;
  };
  monthsActive?: {
    current: number;
    required: number;
    percentage: number;
  };
}

export interface SellerAuction {
  id: number;
  productId: number;
  title: string;
  startingPrice: number;
  currentPrice?: number;
  status: 'draft' | 'scheduled' | 'active' | 'ended' | 'cancelled';
  startTime: string;
  endTime: string;
  viewCount: number;
  totalBids: number;
  totalWatchers: number;
  category: {
    name: string;
  };
  product: {
    title: string;
    condition: string;
    images: string[];
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  color_code?: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface SellerState {
  // Profile data
  profile: SellerProfile | null;
  currentTier: TierRequirement | null;
  nextTier: TierRequirement | null;
  progress: TierProgress | null;

  // analytics: SellerAnalytics | null;
  // Auctions data
  auctions: SellerAuction[];
  auctionsPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;

  };
  
  // Categories for auction creation
  categories: Category[];
  
  // Analytics data
  analytics: SellerAnalytics | null;
  earnings: {
    earnings: Array<{
      id: number;
      auction_title: string;
      gross_amount: number;
      platform_fee: number;
      net_amount: number;
      payment_status: string;
      availability_status: string;
      created_at: string;
    }>;
    summary: {
      total_gross: number;
      total_fees: number;
      total_net: number;
      available_amount: number;
      on_hold_amount: number;
    };
  } | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    category?: number;
    sortBy?: string;
  };
}

const initialState: SellerState = {
  profile: null,
  currentTier: null,
  nextTier: null,
  progress: null,
  auctions: [],
  auctionsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  categories: [],
  analytics: null,
  earnings: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all'
  }
};

// Async thunks
export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerService.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller profile');
    }
  }
);

export const fetchSellerAuctions = createAsyncThunk(
  'seller/fetchAuctions',
  async (params: {
    status?: string;
    category?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await sellerService.getAuctions(params);

       // DEBUG: Log the structure
      console.log('🔧 API Response:', response.data);
      console.log('🔧 Auctions:', response.data.data.auctions);
      console.log('🔧 Pagination:', response.data.data.pagination);

      //fix return the nested data
      return response.data.data; // This ensures action.payload = { auctions: [...], pagination: {...} }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch auctions');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'seller/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerService.getCategories();
      console.log('Categories API responses:', response.data.data.categories);
      return response.data.data.categories;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createAuction = createAsyncThunk(
  'seller/createAuction',
  async (auctionData: {
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
  }, { rejectWithValue, dispatch }) => { //added dispatch
    try {
      const response = await sellerService.createAuction(auctionData);

      //after successful creation, we can fetch the updated auctions
      await dispatch(fetchSellerAuctions({status: 'all', page: 1, limit: 10})); // Fetch all auctions after creation

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create auction');
    }
  }
);

// ✅ FIXED: Proper async thunk with correct types
/// ✅ FIXED: fetchAnalytics thunk with proper typing
export const fetchAnalytics = createAsyncThunk<SellerAnalytics, number | undefined, { rejectValue: string }>(
  'seller/fetchAnalytics',
  async (days: number = 30, { rejectWithValue }) => {
    try {
      console.log('🚀 Redux: Fetching analytics for', days, 'days');
      const analyticsData = await sellerService.getAnalytics(days);
      console.log('✅ Redux: Received analytics data:', analyticsData);
      return analyticsData; // This is already unwrapped by the service
    } catch (error: any) {
      console.error('❌ Redux: Analytics fetch failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);


export const fetchEarnings = createAsyncThunk(
  'seller/fetchEarnings',
  async (params: { status?: string; period?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await sellerService.getEarnings(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch earnings');
    }
  }
);



export const deleteSellerAuction = createAsyncThunk(
  'seller/deleteAuction',
  async (auctionId: number, { rejectWithValue }) => {
    try {
      await sellerService.deleteAuction(auctionId);
      return auctionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete auction');
    }
  }
);


// Slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuctions: (state) => {
      state.auctions = [];
      state.auctionsPagination = initialState.auctionsPagination;
    }
  },
  extraReducers: (builder) => {
    // Fetch seller profile
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
        state.currentTier = action.payload.currentTier;
        state.nextTier = action.payload.nextTier;
        state.progress = action.payload.progress;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch seller auctions
      .addCase(fetchSellerAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('🔧 Redux received auctions:', action.payload.auctions);
        state.auctions = action.payload.auctions;
        state.auctionsPagination = action.payload.pagination;
      })
      .addCase(fetchSellerAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch categories
      // .addCase(fetchCategories.fulfilled, (state, action) => {
      //   state.categories = action.payload;
      // })

    .addCase(fetchCategories.pending, (state, action) => {
      state.isLoading = true
      state.error = null;
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {

      state.isLoading = false;
      state.categories = action.payload;
      console.log('Categories set in state:', action.payload); // Debug
    })
    .addCase(fetchCategories.rejected, (state, action) => {
      state.error = action.payload as string;
      console.error('Categories fetch failed:', action.payload);
    })

    // Create auction
      .addCase(createAuction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally refresh auctions after creation
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
    // // Fetch analytics
    //   .addCase(fetchAnalytics.fulfilled, (state, action) => {
    //     state.analytics = action.payload;
    //   })
    //✅ FIXED: Reducer that handles the unwrapped data
.addCase(fetchAnalytics.pending, (state) => {
  console.log('⏳ Redux: Analytics loading...');
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchAnalytics.fulfilled, (state, action) => {
  console.log('✅ Redux: Analytics loaded successfully:', action.payload);
  state.isLoading = false;
  state.analytics = action.payload; // Now contains { tier, totalAuctions, ... } directly
  state.error = null;
})
.addCase(fetchAnalytics.rejected, (state, action) => {
  console.log('❌ Redux: Analytics failed:', action.payload);
  state.isLoading = false;
  state.error = action.payload as string;
})
// ✅ FIXED: Remove unused action parameter
.addCase(fetchEarnings.fulfilled, (state, action) => {
  state.earnings = action.payload;
});
  }
});

export const { setFilters, clearError, resetAuctions } = sellerSlice.actions;
export default sellerSlice.reducer;
