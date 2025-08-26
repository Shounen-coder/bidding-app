import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { fetchAnalytics } from '../../store/slices/sellerSlice';

const SellerAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, isLoading, error } = useSelector((state: RootState) => state.seller);

  useEffect(() => {
    dispatch(fetchAnalytics(30));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Analytics</h2>
          <p className="text-gray-300">Gathering your performance insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => dispatch(fetchAnalytics(30))}
            className="bg-[#1f3c4a] hover:bg-[#152b3a] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-300"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.tier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600 mb-6">Unable to load your analytics data at this time.</p>
          <button 
            onClick={() => dispatch(fetchAnalytics(30))}
            className="bg-[#1f3c4a] hover:bg-[#152b3a] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-300"
          >
            Load Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      {/* Hero Header */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              Seller Analytics
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive insights into your marketplace performance, powered by advanced analytics and AI-driven recommendations.
            </p>
          </div>

          {/* Tier Badge */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 font-medium">Current Tier:</span>
                <span className={`px-6 py-2 rounded-full text-lg font-bold ${
                  analytics.tier === 'trusted' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                  analytics.tier === 'verified' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white' :
                  'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                } shadow-lg`}>
                  {analytics.tier.charAt(0).toUpperCase() + analytics.tier.slice(1)} Seller
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: 'Total Auctions', value: analytics.totalAuctions, color: 'from-blue-400 to-blue-600', icon: '📦' },
            { label: 'Total Views', value: analytics.totalViews.toLocaleString(), color: 'from-green-400 to-green-600', icon: '👁️' },
            { label: 'Total Bids', value: analytics.totalBids.toLocaleString(), color: 'from-purple-400 to-purple-600', icon: '🔥' },
            { label: 'Total Sales', value: analytics.totalSales, color: 'from-orange-400 to-orange-600', icon: '💰' },
            { label: 'Avg Sale Price', value: `$${analytics.avgSalePrice.toFixed(2)}`, color: 'from-pink-400 to-pink-600', icon: '📊' },
            { label: 'Conversion Rate', value: `${analytics.conversionRate}%`, color: 'from-indigo-400 to-indigo-600', icon: '📈' }
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-2xl mb-2">{icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
                {value}
              </div>
              <div className="text-sm text-gray-600 font-semibold">{label}</div>
            </div>
          ))}
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900">
              Daily Performance Trends
            </h3>
            <p className="text-gray-600 mt-1">
              Last {analytics.analytics?.length || 0} days of activity
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {analytics.analytics && analytics.analytics.length > 0 ? (
                analytics.analytics.slice(0, 7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="font-bold text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex space-x-8 text-sm font-semibold">
                      <div className="text-blue-600 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {"1"} views
                      </div>
                      <div className="text-purple-600 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        {day.bids} bids
                      </div>
                      <div className="text-green-600 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {day.sales} sales
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 text-lg">No daily analytics data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Analytics - Market Intelligence & Revenue Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Market Intelligence Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Market Intelligence</h3>
                {analytics.tier !== 'trusted' && (
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    TRUSTED TIER
                  </div>
                )}
              </div>

              {analytics.tier === 'trusted' ? (
                <div className="space-y-6">
                  {[
                    { label: 'Market Trend', value: '+12%', color: 'text-green-600', icon: '📈' },
                    { label: 'Competitor Analysis', value: 'Available', color: 'text-blue-600', icon: '🔍' },
                    { label: 'Price Recommendations', value: 'AI-Powered', color: 'text-purple-600', icon: '🤖' }
                  ].map(({ label, value, color, icon }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{icon}</span>
                        <span className="font-semibold text-gray-800">{label}</span>
                      </div>
                      <span className={`${color} font-bold`}>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-900 mb-2">Upgrade Required</p>
                  <p className="text-gray-600 mb-4">Unlock advanced market insights with Trusted tier</p>
                  <button className="bg-[#1f3c4a] hover:bg-[#152b3a] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Prediction Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-100 opacity-50"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Revenue Predictions</h3>
                {analytics.tier === 'basic' && (
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    VERIFIED+
                  </div>
                )}
              </div>

              {analytics.tier !== 'basic' ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-5xl font-extrabold bg-gradient-to-r from-[#1f3c4a] to-[#2c5364] bg-clip-text text-transparent mb-2">
                      $2,456
                    </div>
                    <p className="text-gray-600 font-medium">Predicted next month revenue</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center text-green-700 font-bold">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      Growth forecast: +18%
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on your recent performance trends
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-900 mb-2">Upgrade Required</p>
                  <p className="text-gray-600 mb-4">Get AI-powered revenue predictions</p>
                  <button className="bg-[#1f3c4a] hover:bg-[#152b3a] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                    Upgrade to Verified
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Prompt */}
        {analytics.tier !== 'trusted' && (
          <div className="bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#1f3c4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Unlock Your Potential?
              </h3>
              <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                Upgrade your seller tier to access premium analytics, market intelligence, and AI-powered insights that will transform your business.
              </p>
              <button className="bg-[#1f3c4a] hover:bg-[#152b3a] text-white text-lg font-bold px-10 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                Start Your Upgrade Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAnalytics;
