import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchOrders } from '../../store/slices/profileSlice';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: number;
  orderId: string;
  auctionId: number;
  auctionTitle: string;
  auctionImage: string;
  category: string;
  finalBid: number;
  shippingCost: number;
  totalAmount: number;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'disputed';
  orderDate: string;
  paidDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  seller: {
    id: number;
    name: string;
    rating: number;
  };
  paymentMethod?: string;
  shippingAddress?: string;
}

interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  pendingPayments: number;
  activeShipments: number;
  completedOrders: number;
  averageOrderValue: number;
}

const DashboardOrders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders: reduxOrders, isLoading, error } = useSelector((state: RootState) => state.profile);
  
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'amount_high' | 'amount_low'>('recent');

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Transform backend orders data for UI, with fallback to empty array
  const orders: OrderItem[] = reduxOrders && reduxOrders.length > 0 
    ? reduxOrders.map((item: any) => ({
        id: item.id,
        orderId: item.order_id || `ORD-${item.id}`,
        auctionId: item.auction_id,
        auctionTitle: item.title || 'Unknown Item',
        auctionImage: item.images?.[0] || '/images/placeholder.jpg',
        category: item.category || 'General',
        finalBid: item.total_amount || 0,
        shippingCost: item.shipping_cost || 0,
        totalAmount: item.total_amount || 0,
        status: item.status || 'pending_payment',
        orderDate: item.created_at,
        paidDate: item.paid_at,
        shippedDate: item.shipped_at,
        deliveredDate: item.delivered_at,
        estimatedDelivery: item.estimated_delivery,
        trackingNumber: item.tracking_number,
        seller: {
          id: item.seller_id || 0,
          name: item.seller_name || 'Unknown Seller',
          rating: item.seller_rating || 0
        },
        paymentMethod: item.payment_method,
        shippingAddress: item.shipping_address
      }))
    : [];

  // Calculate stats from orders data
  const stats: OrderStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingPayments: orders.filter(o => o.status === 'pending_payment').length,
    activeShipments: orders.filter(o => ['paid', 'processing', 'shipped'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
  };

  const tabs = [
    { id: 'all', name: 'All Orders', count: orders.length },
    { id: 'pending', name: 'Pending Payment', count: orders.filter(o => o.status === 'pending_payment').length },
    { id: 'active', name: 'Active', count: orders.filter(o => ['paid', 'processing', 'shipped'].includes(o.status)).length },
    { id: 'completed', name: 'Completed', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', name: 'Cancelled', count: orders.filter(o => ['cancelled', 'disputed'].includes(o.status)).length },
  ];

  const filteredOrders = orders.filter(order => {
    switch (activeTab) {
      case 'pending':
        return order.status === 'pending_payment';
      case 'active':
        return ['paid', 'processing', 'shipped'].includes(order.status);
      case 'completed':
        return order.status === 'delivered';
      case 'cancelled':
        return ['cancelled', 'disputed'].includes(order.status);
      default:
        return true;
    }
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      pending_payment: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Payment Required',
        icon: '💳'
      },
      paid: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Payment Confirmed',
        icon: '✅'
      },
      processing: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Processing',
        icon: '⏳'
      },
      shipped: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Shipped',
        icon: '🚚'
      },
      delivered: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Delivered',
        icon: '📦'
      },
      cancelled: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Cancelled',
        icon: '❌'
      },
      disputed: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: 'Disputed',
        icon: '⚠️'
      }
    };
    return configs[status as keyof typeof configs] || configs.processing;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePayment = (orderId: string) => {
    console.log('Redirecting to payment for order:', orderId);
    // TODO: Integrate with payment gateway
  };

  const handleTrackPackage = (trackingNumber: string) => {
    window.open(`https://tracking-service.com/track/${trackingNumber}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track your won auctions and purchase history</p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#294c5b] focus:border-transparent mt-4 sm:mt-0"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Highest Amount</option>
          <option value="amount_low">Lowest Amount</option>
        </select>
      </div>

      {/* Show error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading orders</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.pendingPayments}</div>
          <div className="text-sm text-gray-600">Pending Payment</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{stats.activeShipments}</div>
          <div className="text-sm text-gray-600">In Transit</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</div>
          <div className="text-sm text-gray-600">Avg Order</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Orders Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-[#294c5b] text-[#294c5b]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-[#294c5b] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#294c5b]"></div>
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : (
          /* Orders List */
          <div className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Order Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={order.auctionImage}
                          alt={order.auctionTitle}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {order.auctionTitle}
                            </h3>
                            <p className="text-sm text-gray-500">{order.category}</p>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Order #{order.orderId}</p>
                              <p>Ordered: {formatDate(order.orderDate)}</p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <span className="mr-1">{statusConfig.icon}</span>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Price Details */}
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Final Bid:</span>
                            <div className="font-semibold">{formatCurrency(order.finalBid)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Shipping:</span>
                            <div className="font-semibold">{formatCurrency(order.shippingCost)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <div className="font-semibold text-lg">{formatCurrency(order.totalAmount)}</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {order.status === 'pending_payment' && (
                            <button
                              onClick={() => handlePayment(order.orderId)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                            >
                              Pay Now
                            </button>
                          )}
                          {order.trackingNumber && (
                            <button
                              onClick={() => handleTrackPackage(order.trackingNumber!)}
                              className="px-4 py-2 bg-[#294c5b] text-white rounded-lg hover:bg-[#1e3a48] transition-colors font-medium text-sm"
                            >
                              Track Package
                            </button>
                          )}
                          <Link
                            to={`/auctions/${order.auctionId}`}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                          >
                            View Auction
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'all'
                    ? "You haven't won any auctions yet. Start bidding to see your orders here!"
                    : `No ${activeTab} orders found.`
                  }
                </p>
                <Link
                  to="/auctions"
                  className="inline-flex items-center px-6 py-3 bg-[#294c5b] text-white font-medium rounded-lg hover:bg-[#1e3a48] transition-colors"
                >
                  Browse Auctions
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;
