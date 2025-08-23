// src/store/slices/sellerSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SellerStats {
  totalAuctions: number;
  completedAuctions: number;
  completionRate: number;
  averageRating: number;
}

export interface SellerProfile {
  tier: 'basic' | 'verified' | 'trusted';
  stats: SellerStats;
  tierUpdatedAt: string;
}

interface SellerState {
  profile: SellerProfile;
  isLoading: boolean;
  error: string | null;
}

const initialState: SellerState = {
  profile: {
    tier: 'basic',
    stats: {
      totalAuctions: 0,
      completedAuctions: 0,
      completionRate: 0,
      averageRating: 0
    },
    tierUpdatedAt: new Date().toISOString()
  },
  isLoading: false,
  error: null
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSellerProfile: (state, action: PayloadAction<SellerProfile>) => {
      state.profile = action.payload;
    },
    updateSellerStats: (state, action: PayloadAction<Partial<SellerStats>>) => {
      state.profile.stats = { ...state.profile.stats, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setSellerProfile, updateSellerStats, setLoading, setError } = sellerSlice.actions;
export default sellerSlice.reducer;
