import React from 'react';
import type { SellerTier } from '../../types/sellerAnalytics';

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    views: number;
    bids: number;
    sales: number;
    unique_viewers: number;
  }>;
  tier: SellerTier;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, tier }) => {
  const isRestricted = tier !== 'trusted';
  const displayData = isRestricted ? data.slice(-7) : data;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">
          Performance Trends ({displayData.length} days)
        </h3>
        {isRestricted && (
          <p className="text-sm text-blue-600 mt-1">
            Upgrade to Trusted tier for full 30-day analytics
          </p>
        )}
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {displayData.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex space-x-6 text-sm">
                <div className="text-blue-600">
                  <span className="font-semibold">{day.views}</span>
                  <span className="text-gray-500 ml-1">views</span>
                </div>
                <div className="text-purple-600">
                  <span className="font-semibold">{day.bids}</span>
                  <span className="text-gray-500 ml-1">bids</span>
                </div>
                <div className="text-green-600">
                  <span className="font-semibold">{day.sales}</span>
                  <span className="text-gray-500 ml-1">sales</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isRestricted && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg text-center">
            <p className="text-blue-800 font-semibold">
              🚀 Upgrade to unlock advanced charts, market insights & predictive analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
