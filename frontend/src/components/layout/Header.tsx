// src/components/layout/Header.tsx

import React, { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { logoutUser } from '../../store/slices/authSlice';
import { type RootState, type AppDispatch } from '../../store';
import TierBadge from '../seller/TierBadge';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Get seller state
  const { profile: sellerProfile } = useSelector((state: RootState) => state.seller || {
    profile: { tier: 'basic' }
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Enhanced Desktop Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-51 transition-all duration-500
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
        }
      `}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Enhanced Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group transform transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className={`
                text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent
                ${!isScrolled && location.pathname === '/' ? 'text-white' : ''}
              `}>
                BIDDEX
              </span>
            </Link>

            {/* Enhanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                // { name: 'Home', path: '/' },
                { name: 'Explore', path: '/categories' },
                { name: 'Auctions', path: '/auctions' },
                { name: 'How it Works', path: '/how-it-works' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    relative text-sm font-medium transition-all duration-300 group
                    ${location.pathname === item.path
                      ? 'text-teal-600'
                      : isScrolled || location.pathname !== '/'
                        ? 'text-gray-700 hover:text-teal-600'
                        : 'text-white hover:text-teal-400'
                    }
                  `}
                >
                  {item.name}
                  <span className={`
                    absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transform origin-left transition-transform duration-300
                    ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                  `}></span>
                </Link>
              ))}
            </nav>

            {/* Enhanced Search Bar */}
            {/* <div className="hidden md:flex items-center space-x-4">
              <div className={`
                relative transition-all duration-300
                ${searchFocused ? 'transform scale-105' : ''}
              `}>
                <input
                  type="text"
                  placeholder="Search auctions..."
                  className={`
                    w-64 pl-10 pr-4 py-2 rounded-lg transition-all duration-300
                    ${isScrolled || location.pathname !== '/'
                      ? 'bg-white border border-gray-200 text-gray-700 placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:border-teal-400'
                    }
                    focus:outline-none focus:ring-2 focus:ring-teal-400/20
                  `}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <svg className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300
                  ${isScrolled || location.pathname !== '/' ? 'text-gray-400' : 'text-white/70'}
                `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div> */}

            {/* Enhanced Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <button className={`
                    relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group
                    ${isScrolled || location.pathname !== '/'
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'
                      : 'text-white hover:bg-white/10 hover:text-teal-400'
                    }
                  `}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17h5l-5 5v-5z" />
                    </svg>
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </button>

                  {/* Enhanced User Menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className={`
                      flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-105 group
                      ${isScrolled || location.pathname !== '/'
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                      }
                    `}>
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-sm font-semibold">
                          {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                        </span>
                      </div>
                      <TierBadge tier={sellerProfile?.tier || 'basic'} />
                      <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {user?.firstName || 'User'}
                              </p>
                              <p className="text-xs text-gray-600">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {[
                            { name: 'Dashboard', path: '/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                            { name: 'Watchlist', path: '/dashboard/watchlist', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                            { name: 'Orders', path: '/dashboard/orders', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                            { name: 'Profile Settings', path: '/dashboard/settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                            { name: 'Sell', path: '/dashboard/sell', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }

                          ].map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.path}
                                  className={`
                                    flex items-center px-4 py-3 text-sm transition-all duration-200
                                    ${active ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-400' : 'text-gray-700 hover:bg-gray-50'}
                                  `}
                                >
                                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                  </svg>
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}

                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`
                                    w-full flex items-center px-4 py-3 text-sm transition-all duration-200
                                    ${active ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}
                                  `}
                                >
                                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                  </svg>
                                  Sign Out
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`
                      px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105
                      ${isScrolled || location.pathname !== '/'
                        ? 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                        : 'text-white hover:text-teal-400 hover:bg-white/10'
                      }
                    `}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Join Now
                  </Link>
                </div>
              )}

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`
                  lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 group
                  ${isScrolled || location.pathname !== '/'
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`
                    block w-6 h-0.5 bg-current transform transition-all duration-300 origin-center
                    ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}
                  `}></span>
                  <span className={`
                    block w-6 h-0.5 bg-current mt-1 transition-all duration-300
                    ${isMobileMenuOpen ? 'opacity-0' : ''}
                  `}></span>
                  <span className={`
                    block w-6 h-0.5 bg-current mt-1 transform transition-all duration-300 origin-center
                    ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}
                  `}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Overlay */}
      <Transition
        show={isMobileMenuOpen}
        as={Fragment}
        enter="transition-opacity ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      </Transition>

      {/* Enhanced Mobile Menu */}
      <Transition
        show={isMobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in duration-200 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="mobile-menu-container fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  BIDDEX
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Auctions', path: '/auctions' },
                { name: 'Categories', path: '/categories' },
                { name: 'How it Works', path: '/how-it-works' },
                { name: 'Contact', path: '/contact' }
              ].map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    block px-4 py-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 transform hover:translate-x-1
                    ${location.pathname === item.path ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-400' : ''}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user?.firstName || 'User'}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { name: 'Dashboard', path: '/dashboard' },
                      { name: 'My Bids', path: '/my-bids' },
                      { name: 'Profile Settings', path: '/profile' },
                      { name: 'Seller Dashboard', path: '/seller/dashboard' }
                    ].map((item, index) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-teal-700 rounded-lg transition-all duration-200"
                        style={{ animationDelay: `${(index + 5) * 50}ms` }}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default Header;
