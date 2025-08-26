import React from 'react';
import type { SellerAnalytics } from '../../types/sellerAnalytics';

interface PerformanceMetricsProps {
  data: SellerAnalytics;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const metrics = [
    { label: 'Total Auctions', key: 'totalAuctions', color: 'text-blue-600' },
    { label: 'Total Views', key: 'totalViews', color: 'text-green-600' },
    { label: 'Total Bids', key: 'totalBids', color: 'text-purple-600' },
    { label: 'Total Sales', key: 'totalSales', color: 'text-orange-600' },
    { label: 'Avg Sale Price', key: 'avgSalePrice', color: 'text-pink-600', isPrice: true },
    { label: 'Conversion Rate', key: 'conversionRate', color: 'text-indigo-600', isPercent: true }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map(({ label, key, color, isPrice, isPercent }) => {
        const value = data[key as keyof SellerAnalytics] as number;
        let displayValue: string;
        
        if (isPrice) {
          displayValue = `$${value.toLocaleString()}`;
        } else if (isPercent) {
          displayValue = `${value}%`;
        } else {
          displayValue = value.toLocaleString();
        }

        return (
          <div key={key} className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
            <div className={`text-2xl font-bold ${color} mb-1`}>
              {displayValue}
            </div>
            <div className="text-sm text-gray-600 font-medium">{label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;
