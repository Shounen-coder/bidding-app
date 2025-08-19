import React from 'react';

interface SellerProfileProps {
  seller: {
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  // Future: Add ratings, join date, total auctions, etc.
}

const SellerProfile: React.FC<SellerProfileProps> = ({ seller }) => {
  // Mock data for demo - replace with real data when available
  const mockSellerStats = {
    rating: 4.8,
    totalSales: 47,
    memberSince: '2022',
    responseTime: '< 1 hour'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {seller.firstName.charAt(0)}{seller.lastName.charAt(0)}
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {seller.firstName} {seller.lastName}
        </h3>
        <p className="text-gray-600">@{seller.username}</p>
      </div>

      {/* Seller Rating */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < Math.floor(mockSellerStats.rating) ? 'fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600 font-medium">
            {mockSellerStats.rating} ({mockSellerStats.totalSales} reviews)
          </span>
        </div>
      </div>

      {/* Seller Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Total Sales</span>
          <span className="font-semibold text-gray-900">{mockSellerStats.totalSales}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Member Since</span>
          <span className="font-semibold text-gray-900">{mockSellerStats.memberSince}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Response Time</span>
          <span className="font-semibold text-green-600">{mockSellerStats.responseTime}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-green-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified Identity
        </div>
        
        <div className="flex items-center text-blue-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Payments
        </div>
        
        <div className="flex items-center text-purple-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Fast Shipping
        </div>
      </div>

      {/* Contact Actions */}
      <div className="space-y-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
          Contact Seller
        </button>
        
        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
          View Other Items
        </button>
      </div>
    </div>
  );
};

export default SellerProfile;
