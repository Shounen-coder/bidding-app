import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const [isStepsInView, setIsStepsInView] = useState(false);
  const processRef = useRef<HTMLDivElement>(null);

  // Auto-cycle through steps with pause on hover
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isStepsInView) return; // Only animate when in view
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isStepsInView]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleElements(prev => new Set([...prev, index]));
            
            if (entry.target.classList.contains('steps-section')) {
              setIsStepsInView(true);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '-30px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Subtle parallax effect for backgrounds
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelectorAll('.parallax-bg');
      
      parallax.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1);
        (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Browse & Discover",
      description: "Explore thousands of unique auctions across various categories",
      details: "Our platform features a vast collection of items from electronics to collectibles, art to antiques. Use advanced filters to find exactly what you're looking for, or browse by categories to discover hidden gems.",
      icon: "🔍",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      number: "01"
    },
    {
      id: 2,
      title: "Place Your Bids",
      description: "Compete with other bidders in real-time auctions",
      details: "Experience the thrill of live bidding with our real-time auction system. Set automatic bids, receive instant notifications, and watch as auctions unfold. Our secure bidding process ensures fair competition.",
      icon: "🏆",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      number: "02"
    },
    {
      id: 3,
      title: "Win & Pay Securely",
      description: "Complete your purchase through our secure escrow system",
      details: "When you win an auction, our secure escrow system protects both buyers and sellers. Your payment is held safely until you receive and approve your item, ensuring a risk-free transaction.",
      icon: "💳",
      color: "from-slate-500 to-slate-700",
      bgColor: "bg-slate-50",
      number: "03"
    },
    {
      id: 4,
      title: "Receive Your Item",
      description: "Get your winning items delivered safely to your door",
      details: "Track your shipment from seller to your doorstep. Our platform facilitates communication between buyers and sellers, and our dispute resolution system ensures you're protected throughout the process.",
      icon: "📦",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      number: "04"
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

  const proTips = [
    "Use our advanced filters and watchlist feature to never miss auctions for items you love.",
    "Set up automatic bidding to compete even when you're offline. Our system will bid up to your maximum amount.",
    "Your funds are held securely in escrow until you confirm receipt of your item, ensuring complete protection.",
    "Rate your experience and build your reputation as a trusted community member for future auctions."
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      
      {/* Compact Header - Direct to Content */}
      {/* <section className="pt-24 pb-12 bg-white relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 opacity-5 bg-gradient-to-br from-teal-100 to-cyan-100"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
              How <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">BIDDEX</span> Works
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Master our simple 4-step process and start winning auctions today
            </p>
             */}
            {/* Quick Action Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link 
                to="/auctions" 
                className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 group"
              >
                <span className="mr-2">Start Browsing</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                to="/register" 
                className="inline-flex items-center px-6 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section> */}
      {/* Enhanced Header with Home Page Hero Effects */}
<section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
  {/* Animated Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] hero-gradient" />
  
  {/* Floating Particles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-30 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${10 + Math.random() * 10}s`
        }}
      />
    ))}
  </div>

  <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
      How <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">BIDDEX</span> Works
    </h1>
    
    <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s' }}>
      <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
        Master our simple 4-step process and start winning auctions today
      </p>
    </div>
    
    {/* Quick Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
      <Link 
        to="/auctions" 
        className="inline-flex items-center px-8 py-4 bg-[#1f3c4a] hover:bg-teal-600 text-white rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl button-glow group"
      >
        <span className="mr-2">Start Browsing</span>
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
      
      <Link 
        to="/register" 
        className="inline-flex items-center px-8 py-4 border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
      >
        Create Free Account
      </Link>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-indicator"></div>
    </div>
  </div>
</section>

      {/* Interactive Process Steps - Primary Focus */}
      <section ref={processRef} className="py-16 bg-white steps-section animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Simple Process
            </h2>
            <p className="text-lg text-gray-600">
              From discovery to delivery in just 4 easy steps
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-2 rounded-2xl inline-flex">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform relative overflow-hidden
                    ${activeStep === index 
                      ? 'bg-white shadow-lg scale-105 text-teal-600' 
                      : 'text-gray-600 hover:text-teal-600 hover:bg-white/50'
                    }
                  `}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span className="font-medium hidden sm:block">{step.number}</span>
                  
                  {/* Active indicator */}
                  {activeStep === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-50 -z-10"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Step Content */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Step Details */}
              <div className="space-y-6">
                <div className={`
                  inline-flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-500
                  bg-gradient-to-r ${steps[activeStep].color} text-white
                `}>
                  <span className="text-2xl">{steps[activeStep].icon}</span>
                  <span className="font-semibold">Step {activeStep + 1}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 transition-all duration-500">
                  {steps[activeStep].title}
                </h3>
                
                <p className="text-xl text-gray-600 transition-all duration-500">
                  {steps[activeStep].description}
                </p>
                
                <p className="text-gray-700 leading-relaxed transition-all duration-500">
                  {steps[activeStep].details}
                </p>

                {/* Pro Tip */}
                <div className={`
                  ${steps[activeStep].bgColor} border-l-4 border-teal-400 p-6 rounded-r-lg transition-all duration-500
                `}>
                  <h4 className="font-semibold text-teal-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Pro Tip:
                  </h4>
                  <p className="text-teal-700">
                    {proTips[activeStep]}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Link 
                    to="/auctions"
                    className={`
                      inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 group
                      bg-gradient-to-r ${steps[activeStep].color} text-white hover:shadow-lg
                    `}
                  >
                    <span className="mr-2">Try This Step</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Interactive Visualization */}
              <div className="relative">
                <div className={`
                  relative bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105
                  ${steps[activeStep].bgColor}
                `}>
                  <div className={`h-3 bg-gradient-to-r ${steps[activeStep].color}`}></div>
                  
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div className={`
                        w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl text-white transform transition-all duration-500 animate-bounce-slow
                        bg-gradient-to-r ${steps[activeStep].color}
                      `}>
                        {steps[activeStep].icon}
                      </div>
                    </div>
                    
                    {/* Progress Visualization */}
                    <div className="space-y-4 mb-8">
                      {steps.map((_, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                            ${index <= activeStep 
                              ? 'bg-teal-500 text-white' 
                              : 'bg-gray-200 text-gray-500'
                            }
                          `}>
                            {index < activeStep ? '✓' : index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <div className={`
                              h-2 rounded-full transition-all duration-500
                              ${index < activeStep 
                                ? 'bg-teal-500' 
                                : index === activeStep 
                                  ? 'bg-gradient-to-r from-teal-500 to-gray-200' 
                                  : 'bg-gray-200'
                              }
                            `}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live Demo Simulation */}
                    <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                      <div className="text-center text-sm text-gray-500 mb-2">Live Demo</div>
                      <div className={`
                        h-24 rounded-lg flex items-center justify-center text-2xl transition-all duration-500
                        ${steps[activeStep].bgColor}
                      `}>
                        {steps[activeStep].icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-teal-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 opacity-5 bg-gradient-to-r from-teal-100 to-cyan-100 transform rotate-1"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0">
              Why Choose BIDDEX?
            </h2>
            <p className="text-lg text-gray-600 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              Advanced features that make bidding safer, faster, and more rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                data-index={index}
                className={`
                  group transform transition-all duration-500 animate-on-scroll opacity-0
                  ${visibleElements.has(index) ? 'hover:-translate-y-2' : ''}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden relative h-full">
                  {/* Background Gradient on Hover */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500
                    bg-gradient-to-br ${feature.gradient.replace('from-', 'from-').replace('to-', 'to-')}
                  `}></div>
                  
                  <div className="relative z-10">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300
                      bg-gradient-to-r ${feature.gradient}
                    `}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 animate-on-scroll opacity-0">
              Ready to Start Your Bidding Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              Join thousands of successful bidders who trust BIDDEX for their online auction needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started Free
              </Link>
              <Link 
                to="/auctions"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Browse Auctions
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8 mt-12 text-gray-500 text-sm animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style >{`

.hero-gradient {
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
  }
  
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-flow 3s ease infinite;
  }
  
  @keyframes gradient-flow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .animate-float {
    animation: float linear infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(100vh) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(360deg); }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 1s ease forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-scroll-indicator {
    animation: scroll-indicator 2s infinite;
  }
  
  @keyframes scroll-indicator {
    0%, 100% { transform: translateY(0); opacity: 0; }
    50% { transform: translateY(10px); opacity: 1; }
  }
  
  .button-glow {
    box-shadow: 0 0 20px rgba(45, 212, 191, 0.3);
  }
  
  .button-glow:hover {
    box-shadow: 0 0 30px rgba(45, 212, 191, 0.5);
  }

        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-on-scroll {
          animation: slideUp 0.8s ease forwards;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .parallax-bg {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;
