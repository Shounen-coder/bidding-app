import React from 'react';
import { Link } from 'react-router-dom';


interface SellerProfileProps {
  seller: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
    tier: string;
    rating?: number;
    totalAuctions?: number;
    createdAt?: string;
  };
  memberSince?: string;
  totalSales?: number;
  responseTime?: string;
  reviewsCount?: number;
}


const SellerProfile: React.FC<SellerProfileProps> = ({
  seller,
  memberSince,
  totalSales,
  // responseTime = '',
  reviewsCount = 0
}) => {
  // Calculate member since from createdAt or use provided value
  const getMemberSince = () => {
    if (memberSince) return memberSince;
    if (seller.createdAt) {
      const year = new Date(seller.createdAt).getFullYear();
      return year.toString();
    }
    return '2025';
  };


  // Render star rating
  const renderStars = (rating: number = 0) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.floor(rating) ? 
          'text-yellow-400' : 'text-slate-300'}`}
      >
        {i < Math.floor(rating) ? '★' : '☆'}
      </span>
    ));
  };


  // Get tier badge styling
  const getTierStyles = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'trusted':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 shadow-md';
      case 'verified':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 shadow-md';
      case 'basic':
      default:
        return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-200 shadow-md';
    }
  };


  const finalTotalSales = totalSales || seller.totalAuctions || 0;
  const finalMemberSince = getMemberSince();


  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white">
            {seller.firstName.charAt(0)}{seller.lastName.charAt(0)}
          </div>
          
          {/* Seller Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                {seller.firstName} {seller.lastName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierStyles(seller.tier)}`}>
                {seller.tier?.charAt(0).toUpperCase() + seller.tier?.slice(1) || 'Basic'}
              </span>
            </div>
            
            <p className="text-teal-600 font-semibold text-sm mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              @{seller.username}
            </p>
            
            {/* Rating Section */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(seller.rating || 0)}
              </div>
              <span className="text-sm text-slate-600 font-medium">
                {reviewsCount > 0 
                  ? `${(seller.rating || 0).toFixed(1)} (${reviewsCount} reviews)`
                  : 'No reviews yet'
                }
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Stats Section */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-2xl font-bold text-[#1f3c4a]">{finalTotalSales}</div>
            <div className="text-sm text-slate-600 font-semibold">Total Sales</div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-2xl font-bold text-teal-700">{finalMemberSince}</div>
            <div className="text-sm text-slate-600 font-semibold">Member Since</div>
          </div>
          {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="text-2xl font-bold text-blue-700">{responseTime}</div>
            <div className="text-sm text-slate-600 font-semibold">Response Time</div>
          </div> */}
        </div>


        {/* Trust Badges */}
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Trust & Security</h4>
          <div className="space-y-2">
            {seller.tier !== 'basic' && (
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-3 bg-emerald-100 rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Identity
              </div>
            )}
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-3 bg-emerald-100 rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Secure Payments
            </div>
            {seller.tier === 'trusted' && (
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-3 bg-emerald-100 rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Trusted Seller
              </div>
            )}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button onClick={() => {}} className="flex-1 bg-[#1f3c4a] hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            Contact Seller
          </button>
          <Link
            to={`/seller/${seller.id}/items`}
            className="flex-1 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 py-3 px-4 rounded-xl font-bold transition-all duration-200 text-center shadow-md hover:shadow-lg border border-slate-200"
          >
            View Other Items
          </Link>
        </div>
      </div>
    </div>
  );
};


export default SellerProfile;
