import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Browse & Discover",
      description: "Explore thousands of unique auctions across various categories",
      details: "Our platform features a vast collection of items from electronics to collectibles, art to antiques. Use advanced filters to find exactly what you're looking for, or browse by categories to discover hidden gems.",
      icon: "🔍",
      color: "from-teal-500 to-cyan-600"
    },
    {
      id: 2,
      title: "Place Your Bids",
      description: "Compete with other bidders in real-time auctions",
      details: "Experience the thrill of live bidding with our real-time auction system. Set automatic bids, receive instant notifications, and watch as auctions unfold. Our secure bidding process ensures fair competition.",
      icon: "🏆",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      title: "Win & Pay Securely",
      description: "Complete your purchase through our secure escrow system",
      details: "When you win an auction, our secure escrow system protects both buyers and sellers. Your payment is held safely until you receive and approve your item, ensuring a risk-free transaction.",
      icon: "💳",
      color: "from-slate-500 to-slate-700"
    },
    {
      id: 4,
      title: "Receive Your Item",
      description: "Get your winning items delivered safely to your door",
      details: "Track your shipment from seller to your doorstep. Our platform facilitates communication between buyers and sellers, and our dispute resolution system ensures you're protected throughout the process.",
      icon: "📦",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const features = [
    {
      title: "Real-Time Bidding",
      description: "Experience live auction excitement with instant bid updates and notifications",
      icon: "⚡",
      gradient: "from-yellow-400 to-amber-500"
    },
    {
      title: "Secure Escrow",
      description: "Your payments are protected with our advanced escrow system until delivery",
      icon: "🛡️",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      title: "Global Reach",
      description: "Connect with buyers and sellers from around the world on our platform",
      icon: "🌍",
      gradient: "from-slate-400 to-slate-600"
    },
    {
      title: "Mobile First",
      description: "Bid anywhere, anytime with our responsive mobile-optimized experience",
      icon: "📱",
      gradient: "from-cyan-400 to-teal-500"
    },
    {
      title: "Expert Support",
      description: "Get help when you need it with our dedicated customer support team",
      icon: "🤝",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      title: "Verified Sellers",
      description: "Trade with confidence knowing all sellers go through our verification process",
      icon: "✅",
      gradient: "from-teal-400 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Hero Section - Updated with new gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center bg-teal-600/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-teal-400/30">
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></span>
              Live Auction Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              How <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Biddex</span> Works
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover the seamless auction experience that connects buyers and sellers worldwide. 
              From browsing to bidding, winning to receiving – we've made it simple and secure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auctions" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Bidding Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <button 
                onClick={() => document.getElementById('process-steps')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer inline-flex items-center px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-xl hover:border-white hover:text-white transition-all duration-300"
              >
                Learn More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements - Updated colors */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Process Steps Section */}
      <section id="process-steps" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple <span style={{ color: '#294c5b' }}>4-Step Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined auction process ensures a smooth experience from start to finish
            </p>
          </div>

          {/* Interactive Steps */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Steps Navigation */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    activeStep === index 
                      ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 shadow-xl' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-r ${
                      activeStep === index ? step.color : 'from-gray-300 to-gray-400'
                    } text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          activeStep === index ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          Step {step.id}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        activeStep === index ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`${
                        activeStep === index ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Step Details */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="mb-6">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl bg-gradient-to-r ${steps[activeStep].color} text-white shadow-lg mb-6`}>
                  {steps[activeStep].icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {steps[activeStep].title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {steps[activeStep].details}
                </p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <div className="flex items-center text-teal-700 font-semibold mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Pro Tip
                </div>
                <p className="text-teal-600">
                  {activeStep === 0 && "Use our advanced filters and watchlist feature to never miss auctions for items you love."}
                  {activeStep === 1 && "Set up automatic bidding to compete even when you're offline. Our system will bid up to your maximum amount."}
                  {activeStep === 2 && "Your funds are held securely in escrow until you confirm receipt of your item, ensuring complete protection."}
                  {activeStep === 3 && "Rate your experience and build your reputation as a trusted community member for future auctions."}
                </p>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"></div>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.id} className="text-center relative">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-r ${step.color} text-white shadow-lg mb-4 relative z-10`}>
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section - Updated gradient */}
      <section className="py-24 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Biddex</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of online auctions with our cutting-edge features and unmatched security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-teal-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
                
                {/* Hover Effect - Updated colors */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
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
              { number: "50K+", label: "Active Users", icon: "👥" },
              { number: "200K+", label: "Successful Auctions", icon: "🎯" },
              { number: "$10M+", label: "Total Transaction Value", icon: "💰" },
              { number: "99.8%", label: "Customer Satisfaction", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-teal-100 group-hover:border-teal-300 transition-all duration-300 transform group-hover:scale-105">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: '#294c5b' }}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked <span style={{ color: '#294c5b' }}>Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about getting started
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does the bidding process work?",
                answer: "Our real-time bidding system allows you to place bids instantly. You can set automatic bids, receive notifications when outbid, and track auctions in real-time until they end."
              },
              {
                question: "Is my payment secure?",
                answer: "Absolutely! We use advanced escrow technology to hold your payment securely until you receive and approve your item. Your financial information is encrypted and never shared with sellers."
              },
              {
                question: "What happens if I win an auction?",
                answer: "Congratulations! You'll receive an instant notification and detailed instructions. Your payment will be processed through our secure escrow system, and you'll be connected with the seller for shipping arrangements."
              },
              {
                question: "Can I cancel a bid?",
                answer: "Bids are binding commitments, but we understand mistakes happen. Contact our support team immediately if you need assistance. We have policies in place for genuine errors."
              },
              {
                question: "How do I know if a seller is trustworthy?",
                answer: "All sellers go through our verification process. You can view seller ratings, reviews, and transaction history. Our escrow system also protects you throughout the transaction."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <summary className="cursor-pointer p-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {faq.question}
                  </h3>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-600 transition-all duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Updated gradient */}
      <section className="py-24 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your <span className="text-teal-200">Auction Journey</span>?
          </h2>
          <p className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied users who have discovered amazing deals and sold their items successfully on Biddex.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Free Account
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            
            <Link 
              to="/auctions" 
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-teal-600 transition-all duration-300"
            >
              Browse Auctions
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-teal-100">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
