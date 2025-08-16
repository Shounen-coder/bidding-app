import api from './api';
import type{ User, LoginCredentials, RegisterData, AuthResponse, ApiError } from '../store/slices/authSlice';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
      
      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        
        // Store token and user info
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          user,
          accessToken
        };
      }
      
      throw new Error('Registration failed');
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || []
      };
      throw apiError;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      
      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        
        // Store token and user info
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          user,
          accessToken
        };
      }
      
      throw new Error('Login failed');
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || []
      };
      throw apiError;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.response?.data?.message || 'Failed to get user info'
      };
      throw apiError;
    }
  },

  // Update user profile
  updateProfile: async (
    profileData: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>
  ): Promise<{ success: true; user: User }> => {
    try {
      const response = await api.put<ApiResponse<{ user: User }>>('/user/profile', profileData);
      
      if (response.data.success) {
        const { user } = response.data.data;
        
        // Update stored user info
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          user
        };
      }
      
      throw new Error('Profile update failed');
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
        errors: error.response?.data?.errors || []
      };
      throw apiError;
    }
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<ApiResponse<void>> => {
    try {
      const response = await api.put<ApiResponse<void>>('/user/change-password', passwordData);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
        errors: error.response?.data?.errors || []
      };
      throw apiError;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user info
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }
};
