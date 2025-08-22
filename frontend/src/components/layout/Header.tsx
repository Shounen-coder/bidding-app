import React, { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { logoutUser } from '../../store/slices/authSlice';
import { type RootState, type AppDispatch } from '../../store';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

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
      {/* Desktop Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-[#294c5b] flex items-center justify-center mr-3">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold text-[#294c5b]">BIDDEX</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/auctions" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Browse
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Categories
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                How It Works
              </Link>
            </nav>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#294c5b] focus:ring-offset-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#294c5b] to-[#1e3a48] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[1]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`flex items-center px-4 py-2 text-sm ${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h0a2 2 0 012 2v0H8z" />
                              </svg>
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/profile"
                              className={`flex items-center px-4 py-2 text-sm ${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/watchlist"
                              className={`flex items-center px-4 py-2 text-sm ${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Watchlist
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/orders"
                              className={`flex items-center px-4 py-2 text-sm ${
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              Orders
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                                active ? 'bg-gray-50 text-red-700' : ''
                              }`}
                            >
                              <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sign out
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
                    className="text-gray-700 hover:text-[#294c5b] font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Preserving your existing mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile menu panel */}
          <div className="mobile-menu-container fixed right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[#294c5b] flex items-center justify-center mr-3">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold text-[#294c5b]">BIDDEX</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col h-full">
              {/* User Info Section (if authenticated) */}
              {isAuthenticated && user && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#294c5b] to-[#1e3a48] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[1]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-1">
                  {/* Main Navigation */}
                  <div className="mb-6">
                    <Link
                      to="/auctions"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-100 hover:text-[#294c5b] rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <div>
                        <div className="font-medium">Browse</div>
                        <div className="text-sm text-gray-500">Browse Auctions</div>
                      </div>
                    </Link>

                    <Link
                      to="/categories"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-100 hover:text-[#294c5b] rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                      </svg>
                      All Categories
                    </Link>

                    <Link
                      to="/how-it-works"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-100 hover:text-[#294c5b] rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      How It Works
                    </Link>
                  </div>

                  {/* Quick Categories */}
                  <div className="mb-6">
                    <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Popular Categories
                    </h3>
                    <div className="space-y-1">
                      {['Electronics', 'Fashion & Accessories', 'Art & Collectibles', 'Automotive'].map((category) => (
                        <Link
                          key={category}
                          to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#294c5b] rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* User Menu (if authenticated) */}
                  {isAuthenticated && (
                    <div className="mb-6 border-t border-gray-200 pt-4">
                      <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Account
                      </h3>
                      <div className="space-y-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#294c5b] rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#294c5b] rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mobile Auth Buttons (if not authenticated) */}
                  {!isAuthenticated && (
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-3 text-[#294c5b] border border-[#294c5b] rounded-lg hover:bg-[#294c5b] hover:text-white transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full text-center px-4 py-3 bg-[#294c5b] text-white rounded-lg hover:bg-[#1e3a48] transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
