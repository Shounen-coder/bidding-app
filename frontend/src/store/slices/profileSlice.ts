import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Fixed import path
import type { User } from './authSlice'; // Import User type from authSlice

// Interface for profile data
interface ProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialMedia?: Record<string, any>;
  preferences?: Record<string, any>;
  notificationSettings?: Record<string, any>;
  timezone?: string;
  language?: string;
}

// Interface for notification parameters
interface NotificationParams {
  page?: number;
  limit?: number;
}

// Interface for API response structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Interface for complete profile response
interface CompleteProfileData {
  user: User;
  statistics: {
    totalBids: number;
    totalAuctionsWon: number;
    totalAmountSpent: number;
    totalAuctionsCreated: number;
    totalRevenueEarned: number;
    averageBidAmount: number;
    totalWatchlistItems: number;
    lastBidDate?: string;
    lastAuctionCreatedDate?: string;
  };
  recentActivity: any[];
  biddingHistory: any[];
  watchlist: any[];
}

// Interface for profile state
interface ProfileState {
  user: User | null;
  statistics: CompleteProfileData['statistics'] | null;
  notifications: any[];
  watchlist: any[];
  isLoadingWatchlist: boolean;
  watchlistError: string | null;
  orders: any[];
  bids: any[];
  recentActivity: any[];
  biddingHistory: any[];
  isLoading: boolean;
  error: string | null;
}

// Async thunks for API calls
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<CompleteProfileData>>('/users/profile');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: ProfileData, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<CompleteProfileData>>('/users/profile', profileData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'profile/fetchNotifications',
  async (params: NotificationParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20 } = params;
      const response = await api.get<ApiResponse<any>>(`/users/notifications?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

export const fetchWatchlist = createAsyncThunk(
  'profile/fetchWatchlist',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 40 } = params;
      // Adjust the endpoint if you use /api/users/
      const response = await api.get(`/users/watchlist?page=${page}&limit=${limit}`);
      // Expecting shape { success: true, data: { watchlist: [...] } }
      return response.data.data.watchlist;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch watchlist'
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'profile/fetchOrders',
  async (params: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 50, status } = params;
      let url = `/users/orders?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await api.get<ApiResponse<any>>(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchBids = createAsyncThunk(
  'profile/fetchBids',
  async (params: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, status } = params;
      let url = `/users/bids?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await api.get<ApiResponse<any>>(url);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bids'
      );
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'profile/addToWatchlist',
  async (auctionId: number, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<any>>(`/users/watchlist/${auctionId}`);
      return { auctionId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to watchlist'
      );
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'profile/removeFromWatchlist',
  async (auctionId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<any>>(`/users/watchlist/${auctionId}`);
      return { auctionId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from watchlist'
      );
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'profile/updateNotificationSettings',
  async (settings: Record<string, boolean>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>('/users/settings/notifications', {
        notificationSettings: settings
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update notification settings'
      );
    }
  }
);

// Add this new thunk action after your existing thunks
export const markNotificationAsRead = createAsyncThunk(
  'profile/markNotificationAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>('/users/notifications/read', {
        notificationIds: [notificationId]
      });
      return { notificationId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'profile/markAllNotificationsAsRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const unreadNotificationIds = state.profile.notifications
        .filter((notif: any) => !notif.is_read)
        .map((notif: any) => notif.id);
      
      if (unreadNotificationIds.length === 0) {
        return { message: 'No unread notifications' };
      }

      const response = await api.put<ApiResponse<any>>('/users/notifications/read', {
        notificationIds: unreadNotificationIds
      });
      return { notificationIds: unreadNotificationIds, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark all notifications as read'
      );
    }
  }
);


// Initial state
const initialState: ProfileState = {
  user: null,
  statistics: null,
  notifications: [],
  watchlist: [],
   isLoadingWatchlist: false,
  watchlistError: null,

  orders: [],
  bids: [],
  recentActivity: [],
  biddingHistory: [],
  isLoading: false,
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.user = null;
      state.statistics = null;
      state.notifications = [];
      state.watchlist = [];
      state.orders = [];
      state.bids = [];
      state.recentActivity = [];
      state.biddingHistory = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.statistics = action.payload.statistics;
        state.recentActivity = action.payload.recentActivity || [];
        state.biddingHistory = action.payload.biddingHistory || [];
        state.watchlist = action.payload.watchlist || [];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.statistics = action.payload.statistics;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Notifications
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications || action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch Watchlist
      // ADD WATCHLIST CASES:
    .addCase(fetchWatchlist.pending, (state) => {
        state.isLoadingWatchlist = true;
        state.watchlistError = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.isLoadingWatchlist = false;
        state.watchlist = action.payload; // Store the array
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.isLoadingWatchlist = false;
        state.watchlistError = action.payload as string;
      })
     

      // Fetch Orders
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders || action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch Bids
      .addCase(fetchBids.fulfilled, (state, action) => {
        console.log('📦 fetchBids.fulfilled payload:', action.payload);
        state.bids = action.payload.bids || action.payload;
      })
      .addCase(fetchBids.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Add to Watchlist
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        // Optionally update local state
        console.log('Added to watchlist:', action.payload.auctionId);
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove from Watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        // Remove from local watchlist
        state.watchlist = state.watchlist.filter(
          (item: any) => item.auction?.id !== action.payload.auctionId
        );
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update Notification Settings
    //   .addCase(updateNotificationSettings.fulfilled, (state, action) => {
    //     if (state.user) {
    //       state.user.notificationSettings = action.payload;
    //     }
    //   })

    // Update Notification Settings
.addCase(updateNotificationSettings.fulfilled, (state, action) => {
  if (state.user) {
    // Update both individual properties and nested object
    state.user.notificationSettings = action.payload;
    
    // Also update individual properties for backward compatibility
    if (action.payload.emailNotifications !== undefined) {
      state.user.emailNotifications = action.payload.emailNotifications;
    }
    if (action.payload.bidNotifications !== undefined) {
      state.user.bidNotifications = action.payload.bidNotifications;
    }
    if (action.payload.auctionUpdates !== undefined) {
      state.user.auctionUpdates = action.payload.auctionUpdates;
    }
    if (action.payload.marketingEmails !== undefined) {
      state.user.marketingEmails = action.payload.marketingEmails;
    }
    if (action.payload.twoFactorEnabled !== undefined) {
      state.user.twoFactorEnabled = action.payload.twoFactorEnabled;
    }
  }
})

      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.error = action.payload as string;
      })
        // Mark Notification as Read
        .addCase(markNotificationAsRead.fulfilled, (state, action) => {
  // Update the specific notification as read
  state.notifications = state.notifications.map((notif: any) =>
    notif.id === action.payload.notificationId
      ? { ...notif, is_read: true }
      : notif
  );
})
.addCase(markNotificationAsRead.rejected, (state, action) => {
  state.error = action.payload as string;
})

.addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
  // Mark all notifications as read
  state.notifications = state.notifications.map((notif: any) => ({
    ...notif,
    is_read: true
  }));
})
.addCase(markAllNotificationsAsRead.rejected, (state, action) => {
  state.error = action.payload as string;
})
      
  }
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

// Export types for use in components
export type { ProfileData, NotificationParams, CompleteProfileData, ProfileState };
