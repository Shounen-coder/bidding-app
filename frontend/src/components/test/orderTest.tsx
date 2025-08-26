import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';
import { type RootState, type AppDispatch } from '../../store';
import { orderService } from '../../services/orderService';

const OrderTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const [testResult, setTestResult] = useState<string>('');

  // Test fetching orders
  const handleFetchOrders = () => {
    console.log('🔄 Fetching orders...');
    dispatch(fetchOrders({ role: 'buyer' }));
  };

  // Test creating order from auction
  const handleCreateOrder = async () => {
    try {
      console.log('🔄 Creating order from auction...');
      setTestResult('Creating order...');
      
      const order = await orderService.createOrderFromAuction(21); // Use your test auction ID
      
      console.log('✅ Order created:', order);
      setTestResult(`✅ Order created successfully! Order ID: ${order.id}`);
      
      // Refresh orders list
      dispatch(fetchOrders({}));
    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      setTestResult(`❌ Order creation failed: ${error.message}`);
    }
  };

  // Test seller view
  const handleFetchSellerOrders = () => {
    console.log('🔄 Fetching seller orders...');
    dispatch(fetchOrders({ role: 'seller' }));
  };

  useEffect(() => {
    // Auto-fetch orders on component mount
    handleFetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Order Management Test</h2>
      
      {/* Test Controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Test Controls</h3>
        <div className="space-x-4">
          <button
            onClick={handleFetchOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Buyer Orders
          </button>
          <button
            onClick={handleFetchSellerOrders}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Fetch Seller Orders
          </button>
          <button
            onClick={handleCreateOrder}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Create Test Order
          </button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Orders Display */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Orders ({orders.length})
        </h3>
        
        {orders.length === 0 && !loading ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No orders found. Try creating a test order!</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{order.itemTitle}</h4>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">${order.finalPrice}</p>
                  <p className="text-sm text-gray-500">Final Price</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Order Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.orderStatus === 'payment_pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.orderStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.orderStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Shipping Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.shippingStatus === 'not_shipped' ? 'bg-gray-100 text-gray-800' :
                    order.shippingStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.shippingStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Buyer</p>
                  <p className="text-sm text-gray-600">{order.buyer.username}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Seller</p>
                  <p className="text-sm text-gray-600">{order.seller.username}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                <p className="text-sm text-gray-600">{order.shippingAddress}</p>
              </div>
              
              {order.trackingNumber && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                  <p className="text-sm text-gray-600 font-mono">{order.trackingNumber}</p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderTest;
