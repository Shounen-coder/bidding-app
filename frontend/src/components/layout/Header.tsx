// src/components/layout/Header.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { logoutUser } from '../../store/slices/authSlice';
import { type RootState, type AppDispatch } from '../../store';
import TierBadge from '../seller/TierBadge'; // NEW: Import TierBadge


const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  // NEW: Get seller state
  const { profile: sellerProfile } = useSelector((state: RootState) => state.seller || { 
    profile: { tier: 'basic' } 
  });

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
      {/* Desktop Header - PRESERVED */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">B</span>
                <span className="text-gray-900">IDDEX</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/auctions"
                className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/categories"
                className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How It Works
              </Link>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md p-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span>{user?.firstName}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* Dashboard Link */}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? 'bg-gray-50 text-gray-900' : ''
                            }`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>

                      {/* Profile Link */}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/profile"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? 'bg-gray-50 text-gray-900' : ''
                            }`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      {/* Watchlist Link */}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/watchlist"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? 'bg-gray-50 text-gray-900' : ''
                            }`}
                          >
                            Watchlist
                          </Link>
                        )}
                      </Menu.Item>

                      {/* NEW: Seller Link with Tier Badge */}
                      <div className="border-t border-gray-100">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/sell"
                              className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 ${
                                active ? 'bg-gray-50 text-gray-900' : ''
                              }`}
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Sell
                              </span>
                              <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
                            </Link>
                          )}
                        </Menu.Item>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${
                                active ? 'bg-red-50' : ''
                              }`}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-teal-500 hover:to-cyan-500 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900 p-2"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay - PRESERVED with enhancements */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile menu panel */}
            <div className="mobile-menu-container fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">B</span>
                  <span className="text-gray-900">IDDEX</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info Section (if authenticated) */}
              {isAuthenticated && user && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[1]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile navigation */}
              <div className="p-4">
                {/* Main Navigation */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
                  
                  <Link
                    to="/auctions"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Browse</div>
                      <div className="text-xs text-gray-500">Browse Auctions</div>
                    </div>
                  </Link>

                  <Link
                    to="/categories"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <div className="font-medium">All Categories</div>
                    </div>
                  </Link>

                  <Link
                    to="/how-it-works"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">How It Works</div>
                    </div>
                  </Link>
                </div>

                {/* Quick Categories - PRESERVED */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Categories</h3>
                  {['Electronics', 'Fashion & Accessories', 'Art & Collectibles', 'Automotive'].map((category) => (
                    <Link
                      key={category}
                      to={`/categories/${category.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                      className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>

                {/* User Menu (if authenticated) */}
                {isAuthenticated && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <div className="font-medium">Dashboard</div>
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="font-medium">My Profile</div>
                    </Link>

                    {/* NEW: Mobile Seller Link with Tier Badge */}
                    <Link
                      to="/dashboard/sell"
                      className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-4"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <div className="font-medium">Sell</div>
                      </div>
                      <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <div className="font-medium">Logout</div>
                    </button>
                  </div>
                )}

                {/* Mobile Auth Buttons (if not authenticated) - PRESERVED */}
                {!isAuthenticated && (
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-3 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg hover:from-teal-500 hover:to-cyan-500 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
