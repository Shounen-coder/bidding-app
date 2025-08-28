import React, { useState, useEffect, useRef } from 'react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState<number | null>(null);
  const [activeOffice, setActiveOffice] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isFormFocused, setIsFormFocused] = useState(false);

  // Intersection observers for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-20px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const contactMethods = [
    {
      title: "Live Chat",
      description: "Get instant support from our team available 24/7 for immediate assistance with your auctions",
      icon: "💬",
      action: "Start Chat",
      color: "from-teal-500 to-cyan-500",
      available: true,
      response: "< 1 min"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our experts for complex issues or detailed guidance on using our platform",
      icon: "📞",
      action: "Call Now",
      color: "from-emerald-500 to-teal-500",
      available: true,
      response: "Immediate"
    },
    {
      title: "Email Support",
      description: "Send us detailed questions and receive comprehensive responses within 24 hours",
      icon: "📧",
      action: "Send Email",
      color: "from-cyan-500 to-blue-500",
      available: true,
      response: "< 24 hrs"
    },
    {
      title: "Video Call",
      description: "Schedule a personal consultation for enterprise solutions and advanced features",
      icon: "🎥",
      action: "Schedule",
      color: "from-purple-500 to-indigo-500",
      available: false,
      response: "By appointment"
    }
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Auction Plaza, Floor 15",
      state: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@biddex.com",
      timezone: "EST",
      hours: "9 AM - 6 PM",
      isMain: true
    },
    {
      city: "San Francisco",
      address: "456 Tech Avenue, Suite 200",
      state: "San Francisco, CA 94102",
      phone: "+1 (555) 987-6543",
      email: "sf@biddex.com",
      timezone: "PST",
      hours: "9 AM - 6 PM",
      isMain: false
    },
    {
      city: "London",
      address: "789 Financial District, Floor 12",
      state: "London, UK EC2V 8RF",
      phone: "+44 20 7123 4567",
      email: "london@biddex.com",
      timezone: "GMT",
      hours: "9 AM - 5 PM",
      isMain: false
    }
  ];

  const faqs = [
    {
      question: "How do I start bidding on auctions?",
      answer: "Simply create a free account, browse our auctions, and place your first bid. Our secure platform guides you through each step of the process."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use bank-level encryption and secure escrow services to protect all transactions. Your payment is only released when you receive your item."
    },
    {
      question: "What happens if I win an auction?",
      answer: "You'll receive instant notification and payment instructions. Our escrow system ensures secure transactions for both buyers and sellers."
    },
    {
      question: "Can I sell items on BIDDEX?",
      answer: "Absolutely! Create a seller account, verify your identity, and start listing your items. We provide tools and support to help you succeed."
    },
    {
      question: "How do shipping and returns work?",
      answer: "Sellers handle shipping, but we facilitate communication and provide dispute resolution. Returns depend on individual auction terms."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header - User's Primary Goal is Visible */}
      {/* <section className="pt-24 pb-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
              We're Here to <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Help</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Get support, ask questions, or connect with our team. Choose the fastest way to reach us.
            </p>
             */}
            {/* Quick Stats */}
            {/* <div className="flex justify-center space-x-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <span>&lt; 1 min response</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Global offices</span>
              </div>
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
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-30 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${8 + Math.random() * 6}s`
        }}
      />
    ))}
  </div>

  <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
      <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
        Contact Us
      </span>
    </h1>
    
    <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s' }}>
      <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
        We're here to help you succeed on BIDDEX. Choose the fastest way to reach us.
      </p>
    </div>

    {/* Quick Stats */}
    <div className="flex justify-center space-x-8 text-sm text-gray-300 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>24/7 Support</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-teal-400 rounded-full animate-twinkle"></div>
        <span>&lt; 1 min response</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span>Global offices</span>
      </div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-indicator"></div>
    </div>
  </div>
</section>


      {/* Primary Contact Methods - User's Main Focus */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={method.title}
                  className="animate-on-scroll opacity-0 transform translate-y-4 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredMethod(index)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <div className={`
                    bg-white rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer h-full
                    ${method.available 
                      ? 'border-gray-200 hover:border-teal-300 hover:shadow-lg transform hover:-translate-y-1' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }
                  `}>
                    <div className="text-center">
                      <div className={`
                        w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-4 transition-all duration-300
                        ${method.available 
                          ? `bg-gradient-to-r ${method.color} group-hover:scale-110` 
                          : 'bg-gray-200'
                        }
                      `}>
                        {method.icon}
                      </div>
                      
                      <h3 className={`
                        text-lg font-semibold mb-2 transition-colors duration-300
                        ${method.available 
                          ? 'text-gray-800 group-hover:text-teal-600' 
                          : 'text-gray-400'
                        }
                      `}>
                        {method.title}
                      </h3>
                      
                      <p className={`
                        text-sm mb-4 line-clamp-3
                        ${method.available ? 'text-gray-600' : 'text-gray-400'}
                      `}>
                        {method.description}
                      </p>

                      <div className="mb-4">
                        <span className={`
                          inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${method.available 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                          }
                        `}>
                          {method.response}
                        </span>
                      </div>

                      <button 
                        className={`
                          w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300
                          ${method.available 
                            ? `bg-gradient-to-r ${method.color} text-white hover:shadow-md transform hover:scale-105` 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }
                        `}
                        disabled={!method.available}
                      >
                        {method.available ? method.action : 'Coming Soon'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form - Secondary but Important */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0">
                Send us a Message
              </h2>
              <p className="text-gray-600 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
                Fill out the form below and we'll get back to you within 24 hours. For urgent matters, please use our live chat above.
              </p>
            </div>

            <div className={`
              bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-on-scroll opacity-0
              ${isFormFocused ? 'ring-2 ring-teal-400 ring-opacity-20' : ''}
            `} style={{ animationDelay: '0.2s' }}>
              
              {/* Form Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-xl font-semibold">Get in Touch</h3>
                    <p className="text-teal-100 text-sm">We typically respond within 2 hours</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Online</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Message Sent Successfully!</h4>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We'll get back to you soon with a detailed response.
                    </p>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-teal-700">
                        <strong>What's next?</strong> Check your email for a confirmation and expect our response within 24 hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => setIsFormFocused(true)}
                          onBlur={() => setIsFormFocused(false)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => setIsFormFocused(true)}
                          onBlur={() => setIsFormFocused(false)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          onFocus={() => setIsFormFocused(true)}
                          onBlur={() => setIsFormFocused(false)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="How can we help?"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority Level
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          onFocus={() => setIsFormFocused(true)}
                          onBlur={() => setIsFormFocused(false)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                        >
                          <option value="low">Low - General inquiry</option>
                          <option value="normal">Normal - Account support</option>
                          <option value="high">High - Auction issue</option>
                          <option value="urgent">Urgent - Payment problem</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setIsFormFocused(true)}
                        onBlur={() => setIsFormFocused(false)}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none bg-gray-50 focus:bg-white"
                        placeholder="Please describe your question or issue in detail. Include any relevant auction IDs, error messages, or specific steps that led to the problem..."
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Your information is secure and encrypted</span>
                      </div>

                      <button
                        type="submit"
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations with Parallax Cards */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Subtle parallax background */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-teal-100 to-cyan-100 transform -skew-y-1"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0">
              Visit Our Offices
            </h2>
            <p className="text-gray-600 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              Connect with us in person at our global locations
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <div
                  key={office.city}
                  className={`
                    group cursor-pointer transform transition-all duration-500 animate-on-scroll opacity-0
                    ${office.isMain ? 'lg:scale-105 lg:z-10' : ''}
                  `}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => setActiveOffice(index)}
                >
                  <div className={`
                    bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border transition-all duration-300 overflow-hidden relative h-full
                    ${activeOffice === index || office.isMain 
                      ? 'border-teal-200 ring-2 ring-teal-100' 
                      : 'border-gray-200 hover:border-teal-200'
                    }
                  `}>
                    {/* Headquarters Badge */}
                    {office.isMain && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                        Headquarters
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
                          {office.city}
                        </h3>
                        <div className={`
                          w-3 h-3 rounded-full transition-all duration-300
                          ${activeOffice === index || office.isMain ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'}
                        `}></div>
                      </div>
                      
                      <div className="space-y-3 text-gray-600 text-sm">
                        <div className="flex items-start space-x-3">
                          <svg className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="font-medium">{office.address}</p>
                            <p>{office.state}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <p>{office.phone}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p>{office.email}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs">{office.hours} ({office.timezone})</span>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compact FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0">
              Quick Answers
            </h2>
            <p className="text-gray-600 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              Find instant solutions to common questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll opacity-0"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-800">
                      {faq.question}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
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
  
  .animate-twinkle {
    animation: twinkle 3s infinite;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease forwards;
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
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease forwards;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
