import React from 'react';
import type { SellerTier } from '../../types/sellerAnalytics';

interface TierRestrictedCardProps {
  title: string;
  children: React.ReactNode;
  requiredTier: SellerTier;
  currentTier: SellerTier;
  className?: string;
}

const TierRestrictedCard: React.FC<TierRestrictedCardProps> = ({
  title,
  children,
  requiredTier,
  currentTier,
  className = ''
}) => {
  const tierHierarchy = { basic: 0, verified: 1, trusted: 2 };
  const isLocked = tierHierarchy[currentTier] < tierHierarchy[requiredTier];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {isLocked && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Tier
          </span>
        )}
      </div>

      <div className="p-6 relative">
        {isLocked && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10 rounded-b-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 mb-2">Upgrade Required</p>
              <p className="text-sm text-gray-600 mb-4">
                This feature requires {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} tier
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
        
        <div className={isLocked ? 'opacity-30' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TierRestrictedCard;
