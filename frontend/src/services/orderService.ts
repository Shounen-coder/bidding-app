import api from './api';
import { type Order, type OrderStats, type OrderFilters } from '../types/order';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const orderService = {
  // Get user's orders
  getUserOrders: async (filters: OrderFilters = {}): Promise<Order[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.role) params.append('role', filters.role);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await api.get<ApiResponse<{ orders: Order[] }>>(`/orders?${params}`);
      return response.data.data.orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${orderId}`);
      return response.data.data.order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Update order status (seller)
  updateOrderStatus: async (orderId: number, status: string, notes?: string): Promise<void> => {
    try {
      await api.put(`/orders/${orderId}/status`, { status, notes });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Add shipping information (seller)
  addShippingInfo: async (
    orderId: number, 
    trackingNumber: string, 
    estimatedDelivery?: string
  ): Promise<Order> => {
    try {
      const response = await api.put<ApiResponse<{ order: Order }>>(
        `/orders/${orderId}/shipping`, 
        { trackingNumber, estimatedDelivery }
      );
      return response.data.data.order;
    } catch (error) {
      console.error('Error adding shipping info:', error);
      throw error;
    }
  },

  // Get seller order statistics
  getSellerOrderStats: async (): Promise<OrderStats> => {
    try {
      const response = await api.get<ApiResponse<{ stats: OrderStats }>>('/orders/stats/seller');
      return response.data.data.stats;
    } catch (error) {
      console.error('Error fetching seller order stats:', error);
      throw error;
    }
  },

  // Create order from auction (automated)
  createOrderFromAuction: async (auctionId: number): Promise<Order> => {
    try {
      const response = await api.post<ApiResponse<{ order: Order }>>(
        '/orders/create-from-auction', 
        { auctionId }
      );
      return response.data.data.order;
    } catch (error) {
      console.error('Error creating order from auction:', error);
      throw error;
    }
  }
};
