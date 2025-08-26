import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchOrders, fetchSellerStats } from '../../store/slices/orderSlice';
import { Link } from 'react-router-dom';

const SellerOrders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, stats, loading, error } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'all' | 'payment_pending' | 'paid' | 'shipped' | 'completed'>('all');

  // Get current user's seller tier (you might need to fetch this from seller profile)
  const currentTier = 'basic'; // This should come from seller profile
  const paymentHoldDays = {
    basic: 5,
    verified: 3,
    trusted: 1
  };

  useEffect(() => {
    // Fetch seller orders and stats
    dispatch(fetchOrders({ role: 'seller' }));
    dispatch(fetchSellerStats());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      payment_pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-200 text-green-900',
      cancelled: 'bg-red-100 text-red-800',
      disputed: 'bg-red-200 text-red-900'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // ✅ FIXED: Add null checks for orders
  const safeOrders = orders || [];
  
  const filteredOrders = safeOrders.filter(order => {
    if (activeTab === 'all') return true;
    return order.orderStatus === activeTab;
  });

  // ✅ FIXED: Add null checks and default values for stats
  const safeStats = {
    totalOrders: stats?.totalOrders || 0,
    totalRevenue: stats?.totalRevenue || 0,
    pendingPayment: stats?.pendingPayment || 0,
    readyToShip: stats?.readyToShip || 0,
    shipped: stats?.shipped || 0,
    completed: stats?.completed || 0
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Orders</h1>
        <p className="text-gray-600">Manage your sales and track payments</p>
        <p className="text-sm text-blue-600 mt-1">
          As a {currentTier} seller, your payments are held for {paymentHoldDays[currentTier]} day{paymentHoldDays[currentTier] > 1 ? 's' : ''} after buyer confirmation.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading orders</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ✅ FIXED: Stats Cards with null checks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{safeStats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">${safeStats.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">${(safeStats.totalRevenue * 0.85).toFixed(2)}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">${(safeStats.totalRevenue * 0.15).toFixed(2)}</div>
          <div className="text-sm text-gray-600">On Hold</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'all', name: 'All Orders', count: safeOrders.length },
              { id: 'payment_pending', name: 'Payment Pending', count: safeOrders.filter(o => o.orderStatus === 'payment_pending').length },
              { id: 'paid', name: 'Paid', count: safeOrders.filter(o => o.orderStatus === 'paid').length },
              { id: 'shipped', name: 'Shipped', count: safeOrders.filter(o => o.orderStatus === 'shipped').length },
              { id: 'completed', name: 'Completed', count: safeOrders.filter(o => o.orderStatus === 'completed').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {filteredOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <div className="text-sm text-gray-500">{order.itemTitle || 'Unknown Item'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.buyer?.username || 'Unknown Buyer'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${(order.finalPrice || 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">You get: ${((order.finalPrice || 0) * 0.85).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {(order.orderStatus || 'unknown').replace('_', ' ').toUpperCase()}
                      </span>
                      {order.orderStatus === 'paid' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Your payment will be released on {formatDate(order.updatedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.shippingStatus || 'not_shipped')}`}>
                        {(order.shippingStatus || 'not_shipped').replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/dashboard/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' ? "You haven't received any orders yet." : `No orders with ${activeTab} status.` }
              </p>
              <Link
                to="/dashboard/sell/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Auction
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
