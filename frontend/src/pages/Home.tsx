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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Hero Section - Enhanced with modern styling */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-teal-600/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-teal-400/30">
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></span>
              Premium Auction Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">BIDDEX</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Your premier destination for online auctions. Bid on unique items, 
              discover treasures, and win amazing deals from trusted sellers worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/auctions')}
                className="cursor-pointer inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Auctions
              </button>
              <button 
                onClick={() => navigate('/how-it-works')}
                className="cursor-pointer inline-flex items-center px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-xl hover:border-white hover:text-white transition-all duration-300 text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                How It Works
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Features Section - Enhanced with modern cards */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span style={{ color: '#294c5b' }}>BIDDEX</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of online auctions with our cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center bg-white rounded-3xl p-8 border-2 border-teal-100 hover:border-teal-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors">
                Smart Bidding
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                Advanced bidding system with real-time updates, automatic bidding, and intelligent priority logic
              </p>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="group text-center bg-white rounded-3xl p-8 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                Secure Transactions
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                Bank-level security with encrypted payments, escrow protection, and comprehensive buyer safeguards
              </p>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <div className="group text-center bg-white rounded-3xl p-8 border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors">
                Real-Time Updates
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                Live notifications, instant updates, and real-time auction tracking for all your bidding activities
              </p>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Enhanced styling wrapper */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Explore <span style={{ color: '#294c5b' }}>Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing auctions across all your favorite categories
            </p>
          </div>
          
          {/* Categories Section - Now uses the clean CategoryGrid */}
          <CategoryGrid onCategorySelect={handleCategorySelect} />
        </div>
      </div>

      {/* Statistics Section - New addition */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by <span style={{ color: '#294c5b' }}>Thousands</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our growing community of successful buyers and sellers
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Users", icon: "👥", gradient: "from-teal-400 to-cyan-500" },
              { number: "200K+", label: "Successful Auctions", icon: "🎯", gradient: "from-emerald-400 to-teal-500" },
              { number: "$10M+", label: "Transaction Value", icon: "💰", gradient: "from-cyan-400 to-blue-500" },
              { number: "99.8%", label: "Satisfaction Rate", icon: "⭐", gradient: "from-amber-400 to-orange-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-teal-100 group-hover:border-teal-300 transition-all duration-300 transform group-hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2" style={{ color: '#294c5b' }}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Enhanced with modern gradient and styling */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your <span className="text-teal-200">Auction Journey</span>?
          </h2>
          <p className="text-xl text-teal-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied buyers and sellers on BIDDEX. Create your free account today and start bidding on amazing items from around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button 
              onClick={() => navigate('/register')}
              className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Create Free Account
            </button>
            
            <button 
              onClick={() => navigate('/auctions')}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-teal-600 transition-all duration-300 text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Browsing Now
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-teal-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No Setup Fees
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Secure Payments
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              24/7 Support
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Money Back Guarantee
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Home;
