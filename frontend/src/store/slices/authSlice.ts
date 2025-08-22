import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Define types for our auth state
// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   profileImage?: string;
//   isVerified: boolean;
//   isAdmin: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Extended profile fields
   profileCompletionScore?: number;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
  website?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  
  // Notification settings
  notificationSettings?: {
    emailNotifications?: boolean;
    bidNotifications?: boolean;
    auctionUpdates?: boolean;
    marketingEmails?: boolean;
    twoFactorEnabled?: boolean;
  };
  
  // Individual notification properties for backward compatibility
  emailNotifications?: boolean;
  bidNotifications?: boolean;
  auctionUpdates?: boolean;
  marketingEmails?: boolean;
  twoFactorEnabled?: boolean;
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  accessToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Refresh access token
export const refreshAccessToken = createAsyncThunk<
  { accessToken: string },
  void,
  { rejectValue: ApiError }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('accessToken', data.data.accessToken);
      return { accessToken: data.data.accessToken };
    } catch (error: any) {
      localStorage.removeItem('accessToken');
      return rejectWithValue({ success: false, message: error.message });
    }
  }
);

// Async thunks for API calls
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: ApiError }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken); // ADD THIS LINE


      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: ApiError }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('accessToken', response.accessToken); // ADD THIS LINE


      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const logoutUser = createAsyncThunk<
  boolean,
  void,
  { rejectValue: ApiError }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('accessToken'); // ADD THIS LINE
      return true;
    } catch (error) {
      localStorage.removeItem('accessToken'); // ADD THIS LINE
      return rejectWithValue(error as ApiError);
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  { success: true; user: User },
  Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>,
  { rejectValue: ApiError }
>(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  successMessage: null,
  accessToken: localStorage.getItem('accessToken'), // ADD THIS LINE
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      state.isLoading = false;
      state.accessToken = null; // ADD THIS LINE
      localStorage.removeItem('accessToken'); // ADD THIS LINE
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder

    // ADD these new cases for refresh token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        localStorage.removeItem('accessToken');
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
         state.accessToken = action.payload.accessToken; // ADD THIS LINE
        state.successMessage = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
         state.accessToken = action.payload.accessToken; // ADD THIS LINE
        state.successMessage = 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.successMessage = 'Logged out successfully!';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Still clear auth state even if API call failed
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Profile update failed';
      });

      
  },
});

export const { clearError, clearSuccessMessage, setUser, clearAuthState, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
