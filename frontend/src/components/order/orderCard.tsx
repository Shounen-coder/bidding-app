import React from 'react';
import { type Order } from '../../types/order';
import { Link } from 'react-router-dom';

interface Props {
  order: Order;
  viewType?: 'buyer' | 'seller';
}

const OrderCard: React.FC<Props> = ({ order, viewType = 'buyer' }) => {
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

  const getShippingColor = (status: string) => {
    const colors = {
      not_shipped: 'bg-gray-100 text-gray-800 border-gray-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      in_transit: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      delivered: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {order.itemTitle}
            </h3>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-green-600">
              ${order.finalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getShippingColor(order.shippingStatus)}`}>
            {order.shippingStatus.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="space-y-2 mb-4">
          {viewType === 'buyer' ? (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Seller:</span>
              <span className="ml-2">{order.seller.username}</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Buyer:</span>
              <span className="ml-2">{order.buyer.username}</span>
            </div>
          )}
          
          {order.trackingNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Tracking:</span>
              <span className="ml-2 font-mono text-xs">{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/dashboard/orders/${order.id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View Details
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {viewType === 'buyer' && order.orderStatus === 'payment_pending' && (
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Pay Now
            </button>
          )}
          
          {viewType === 'buyer' && order.auction && (
            <Link
              to={`/auctions/${order.auction.id}`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              View Auction
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
