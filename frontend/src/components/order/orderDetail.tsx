import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus, addShippingInfo, clearCurrentOrder } from '../../store/slices/orderSlice';
import { type RootState, type AppDispatch } from '../../store';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder: order, loading, error } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  
  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(parseInt(id)));
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus);
      setTrackingNumber(order.trackingNumber || '');
      setEstimatedDelivery(order.estimatedDelivery || '');
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;
    
    setIsUpdating(true);
    try {
      await dispatch(updateOrderStatus({ 
        orderId: order.id, 
        status: newStatus, 
        notes: statusNotes 
      })).unwrap();
      
      setShowStatusForm(false);
      setStatusNotes('');
      
      // Refresh order data
      dispatch(fetchOrderById(order.id));
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShippingUpdate = async () => {
    if (!order || !trackingNumber) return;
    
    setIsUpdating(true);
    try {
      await dispatch(addShippingInfo({
        orderId: order.id,
        trackingNumber,
        estimatedDelivery: estimatedDelivery || undefined
      })).unwrap();
      
      setShowShippingForm(false);
      
      // Refresh order data
      dispatch(fetchOrderById(order.id));
    } catch (error) {
      console.error('Failed to update shipping:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      payment_pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-200 text-green-900 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      disputed: 'bg-red-200 text-red-900 border-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canUpdateStatus = order && user && order.sellerId === user.id;
  const canUpdateShipping = canUpdateStatus && (order.orderStatus === 'paid' || order.orderStatus === 'shipped');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/dashboard/orders')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <button 
          onClick={() => navigate('/dashboard/orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
        </div>
      </div>

      {/* Order Overview */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{order.itemTitle}</h3>
              <p className="text-2xl font-bold text-green-600 mb-4">${order.finalPrice.toFixed(2)}</p>
              
              <div className="flex gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.shippingStatus)}`}>
                  {order.shippingStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {order.auction && (
                <Link
                  to={`/auctions/${order.auction.id}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Original Auction
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
            </div>

            <div>
              {order.productImages && order.productImages.length > 0 && (
                <img
                  src={order.productImages[0]}
                  alt={order.itemTitle}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Participants Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Buyer Information</h3>
          </div>
          <div className="p-6">
            <p className="font-medium text-gray-900">{order.buyer.firstName} {order.buyer.lastName}</p>
            <p className="text-sm text-gray-600">@{order.buyer.username}</p>
            <p className="text-sm text-gray-600">{order.buyer.email}</p>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-600">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
          </div>
          <div className="p-6">
            <p className="font-medium text-gray-900">{order.seller.firstName} {order.seller.lastName}</p>
            <p className="text-sm text-gray-600">@{order.seller.username}</p>
            <p className="text-sm text-gray-600">{order.seller.email}</p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
          {canUpdateShipping && (
            <button
              onClick={() => setShowShippingForm(!showShippingForm)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Update Shipping
            </button>
          )}
        </div>
        <div className="p-6">
          {order.trackingNumber ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <p className="font-mono text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                  {order.trackingNumber}
                </p>
              </div>
              
              {order.estimatedDelivery && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                  <p className="text-sm text-gray-900">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping information available</p>
          )}

          {showShippingForm && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tracking number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleShippingUpdate}
                    disabled={!trackingNumber || isUpdating}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Updating...' : 'Update Shipping Info'}
                  </button>
                  <button
                    onClick={() => setShowShippingForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Status Management */}
      {canUpdateStatus && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
            <button
              onClick={() => setShowStatusForm(!showStatusForm)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Update Status
            </button>
          </div>
          
          {showStatusForm && (
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="payment_pending">Payment Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any notes about this status change..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === order.orderStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                  <button
                    onClick={() => setShowStatusForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        </div>
        <div className="p-6">
          {order.history && order.history.length > 0 ? (
            <div className="space-y-4">
              {order.history.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {entry.createdByUsername || 'System'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Status changed from <strong>{entry.statusFrom || 'N/A'}</strong> to <strong>{entry.statusTo}</strong>
                      {entry.notes && (
                        <span className="block mt-1 italic">Note: {entry.notes}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No order history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
