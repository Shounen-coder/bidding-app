export interface Order {
  id: number;
  auctionId: number;
  buyerId: number;
  sellerId: number;
  itemTitle: string;
  finalPrice: number;
  orderStatus: OrderStatus;
  shippingStatus: ShippingStatus;
  trackingNumber?: string;
  shippingAddress: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  seller: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  auction: {
    id: number;
    endTime: string;
  };
  productImages: string[];
  history: OrderHistoryEntry[];
}

export type OrderStatus = 
  | 'payment_pending'
  | 'paid' 
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type ShippingStatus = 
  | 'not_shipped'
  | 'shipped'
  | 'in_transit'
  | 'delivered';

export interface OrderHistoryEntry {
  id: number;
  orderId: number;
  statusFrom: string | null;
  statusTo: string;
  notes: string | null;
  createdByUsername: string | null;
  createdAt: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingPayment: number;
  readyToShip: number;
  shipped: number;
  completed: number;
  totalRevenue: number;
}

export interface OrderFilters {
  role?: 'buyer' | 'seller';
  status?: string;
  limit?: number;
  offset?: number;
}
