import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import { auctionService } from '../../services/auctionService';
import { type Auction, type AuctionFilters } from '../../types/auction';

export interface AuctionState {
  auctions: Auction[];
  currentAuction: Auction | null;
  featuredAuctions: Auction[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: AuctionFilters;
}

// Define error type for better TypeScript support
interface ApiError {
  message: string;
}

const initialState: AuctionState = {
  auctions: [],
  currentAuction: null,
  featuredAuctions: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  },
  filters: {}
};

// Async thunks with proper error typing
export const fetchAuctions = createAsyncThunk<
  any,
  AuctionFilters,
  { rejectValue: ApiError }
>(
  'auctions/fetchAuctions',
  async (filters: AuctionFilters = {}, { rejectWithValue }) => {
    try {
      const response = await auctionService.getAuctions(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Failed to fetch auctions' });
    }
  }
);

export const fetchAuctionById = createAsyncThunk<
  any,
  number,
  { rejectValue: ApiError }
>(
  'auctions/fetchAuctionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await auctionService.getAuction(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Failed to fetch auction details' });
    }
  }
);

export const fetchAuctionsByCategory = createAsyncThunk<
  any,
  { categorySlug: string; filters?: AuctionFilters },
  { rejectValue: ApiError }
>(
  'auctions/fetchAuctionsByCategory',
  async ({ categorySlug, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await auctionService.getAuctionsByCategory(categorySlug, filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Failed to fetch category auctions' });
    }
  }
);

export const fetchFeaturedAuctions = createAsyncThunk<
  any,
  { type?: 'ending_soon' | 'popular' | 'new'; limit?: number },
  { rejectValue: ApiError }
>(
  'auctions/fetchFeaturedAuctions',
  async ({ type = 'new', limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await auctionService.getFeaturedAuctions(type, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Failed to fetch featured auctions' });
    }
  }
);

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<AuctionFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentAuction: (state) => {
      state.currentAuction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch auctions
      .addCase(fetchAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions = action.payload.auctions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch auctions';
      })
      
      // Fetch auction by ID
      .addCase(fetchAuctionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAuction = action.payload.auction;
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch auction details';
      })
      
      // Fetch auctions by category
      .addCase(fetchAuctionsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctionsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions = action.payload.auctions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuctionsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch category auctions';
      })
      
      // Fetch featured auctions
      .addCase(fetchFeaturedAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredAuctions = action.payload.auctions;
      })
      .addCase(fetchFeaturedAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch featured auctions';
      });
  }
});

export const { clearError, setFilters, clearFilters, clearCurrentAuction } = auctionSlice.actions;
export default auctionSlice.reducer;
