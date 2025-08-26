import React from 'react';
import type { SellerTier } from '../../types/sellerAnalytics';

interface UpgradePromptProps {
  currentTier: SellerTier;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ currentTier }) => {
  const tierBenefits = {
    basic: {
      nextTier: 'verified' as const,
      benefits: ['Buy-now option', 'Higher auction limits', '6 photos per listing', 'Priority support']
    },
    verified: {
      nextTier: 'trusted' as const,
      benefits: ['Reserve prices', 'Advanced analytics', 'Market insights', 'Faster payouts']
    },
    trusted: {
      nextTier: null,
      benefits: ['You have all features unlocked!']
    }
  };

  const tierInfo = tierBenefits[currentTier];

  if (currentTier === 'trusted') {
    return (
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg p-6 text-center border border-green-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Trusted Seller</h3>
        <p className="text-green-700">You have access to all premium features!</p>
      </div>
    );
  }

  // ✅ FIXED: Safe access with null check
  const nextTier = tierInfo?.nextTier;
  const nextTierName = nextTier ? nextTier.charAt(0).toUpperCase() + nextTier.slice(1) : '';

  return (
    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        
        {/* ✅ FIXED: Safe conditional rendering */}
        {nextTier ? (
          <h3 className="text-xl font-bold text-blue-800 mb-2">
            Upgrade to {nextTierName} Tier
          </h3>
        ) : (
          <h3 className="text-xl font-bold text-blue-800 mb-2">
            Maximum Tier Achieved
          </h3>
        )}
        
        <p className="text-blue-700 mb-4">
          Unlock powerful features and grow your selling business
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {tierInfo.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center text-blue-800">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        {nextTier && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Start Your Upgrade Journey
          </button>
        )}
      </div>
    </div>
  );
};

export default UpgradePrompt;
