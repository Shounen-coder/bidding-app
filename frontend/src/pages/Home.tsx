import React from 'react';
import CategoryGrid from '../components/category/CategoryGrid';
import { type Category } from '../types';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Updated handler - now only receives category (no subcategory on homepage)
  const handleCategorySelect = (category: Category) => {
    console.log('Selected category:', category);
    // Since we're using direct Link navigation in CategoryGrid,
    // this is mainly for debugging/analytics
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]
 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">BIDDEX</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your premier destination for online auctions. Bid on unique items, 
              discover treasures, and win amazing deals from trusted sellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/auctions')}
                className="bg-white text-[#2c5364] hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                🔍 Browse Auctions
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#2c5364] font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
                📚 How It Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Bidding</h3>
              <p className="text-gray-600">
                Advanced bidding system with real-time updates and priority logic
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Bank-level security with encrypted payments and buyer protection
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">
                Live notifications and instant updates on all your auction activities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Now uses the clean CategoryGrid */}
      <CategoryGrid onCategorySelect={handleCategorySelect} />

      {/* CTA Section */}
      <div className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied buyers and sellers on BIDDEX
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-[#2c5364] hover:bg-[#2c536499] cursor-pointer text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
