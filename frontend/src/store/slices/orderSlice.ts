import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';
import { type Order, type OrderStats, type OrderFilters } from '../../types/order';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  stats: OrderStats | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  stats: null,
  loading: false,
  error: null,
  filters: {
    role: undefined,
    status: 'all',
    limit: 20,
    offset: 0
  }
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters: OrderFilters) => {
    return await orderService.getUserOrders(filters);
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: number) => {
    return await orderService.getOrderById(orderId);
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status, notes }: { orderId: number; status: string; notes?: string }) => {
    await orderService.updateOrderStatus(orderId, status, notes);
    return { orderId, status };
  }
);

export const addShippingInfo = createAsyncThunk(
  'orders/addShippingInfo',
  async ({ 
    orderId, 
    trackingNumber, 
    estimatedDelivery 
  }: { 
    orderId: number; 
    trackingNumber: string; 
    estimatedDelivery?: string; 
  }) => {
    return await orderService.addShippingInfo(orderId, trackingNumber, estimatedDelivery);
  }
);

export const fetchSellerStats = createAsyncThunk(
  'orders/fetchSellerStats',
  async () => {
    return await orderService.getSellerOrderStats();
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order details';
      })
      
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        
        // Update orders list
        const orderIndex = state.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].orderStatus = status as any;
        }
        
        // Update current order
        if (state.currentOrder && state.currentOrder.id === orderId) {
          state.currentOrder.orderStatus = status as any;
        }
      })
      
      // Add shipping info
      .addCase(addShippingInfo.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        
        // Update orders list
        const orderIndex = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
        
        // Update current order
        if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
      })
      
      // Fetch seller stats
      .addCase(fetchSellerStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

export const { setFilters, clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
