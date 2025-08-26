// src/pages/dashboard/DashboardLayout.tsx
import React, { useState, Fragment, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Transition, Menu } from '@headlessui/react';
import type { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import TierBadge from '../../components/seller/TierBadge';
import { fetchSellerProfile } from '../../store/slices/sellerSlice';

// PRESERVED: Your existing navigation items
const navigationItems = [
  { name: 'Overview', path: '', icon: '🏠', description: 'Dashboard overview' },
  { name: 'Profile', path: 'profile', icon: '👤', description: 'Personal information' },
  { name: 'Notifications', path: 'notifications', icon: '🔔', description: 'Alerts & updates' },
  { name: 'Watchlist', path: 'watchlist', icon: '⭐', description: 'Saved auctions' },
  { name: 'Bidding Activity', path: 'activity', icon: '📊', description: 'Bid history' },
  { name: 'Orders', path: 'orders', icon: '📦', description: 'Won auctions' },
  { name: 'Settings', path: 'settings', icon: '⚙️', description: 'Account settings' },
  { name: 'Messages', path: 'messages', icon: '💬', description: 'Communications' },
  { name: 'Help', path: 'help', icon: '❓', description: 'Support & FAQs' },
];

// NEW: Seller navigation items
const sellerNavigationItems = [
  { name: 'Overview', path: 'sell', icon: '📊', description: 'Seller dashboard' },
  { name: 'Create Auction', path: 'sell/create', icon: '➕', description: 'List new item' },
  { name: 'My Auctions', path: 'sell/auctions', icon: '🏷️', description: 'Manage listings' },
  { name: 'Analytics', path: 'sell/analytics', icon: '📈', description: 'Performance data', badge: 'Pro' },
  { name: 'Orders', path: 'sell/orders', icon: '📦', description: 'Sales management' },
  { name: 'Seller Academy', path: 'sell/academy', icon: '🎓', description: 'Learning center' },
];

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'buyer' | 'seller'>('buyer');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { profile: sellerProfile } = useSelector((state: RootState) => state.seller || { 
    profile: { tier: 'basic', stats: { completedAuctions: 0 } } 
  });

  
  
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ADD THIS USEEFFECT - Load seller profile
  useEffect(() => {
    if (user && !sellerProfile) {
      dispatch(fetchSellerProfile());
    }
  }, [user, sellerProfile, dispatch]);

  // Determine sidebar mode based on current route
  useEffect(() => {
    const isSellerRoute = location.pathname.startsWith('/dashboard/sell');
    const newMode = isSellerRoute ? 'seller' : 'buyer';
    
    if (newMode !== sidebarMode) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSidebarMode(newMode);
        setIsTransitioning(false);
      }, 150);
    }
  }, [location.pathname, sidebarMode]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  const handleBackToBuyer = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSidebarMode('buyer');
      navigate('/dashboard');
      setIsTransitioning(false);
    }, 200);
  };

  const currentNavigationItems = sidebarMode === 'seller' ? sellerNavigationItems : navigationItems;
  const sidebarTitle = sidebarMode === 'seller' ? 'Seller Dashboard' : 'Dashboard';
  const headerTitle = sidebarMode === 'seller' ? 'Seller Hub' : 'Dashboard';

  // --- Tier progress logic: drop this in your component function, before return
const getTierProgressInfo = () => {
  const tier = sellerProfile?.tier || 'basic';
  const completed = sellerProfile?.stats?.completedAuctions || 0;
  if (tier === 'basic') return { nextTier: 'Verified', needed: 5, completed };
  if (tier === 'verified') return { nextTier: 'Trusted', needed: 20, completed };
  return { nextTier: 'Max Tier Reached', needed: 20, completed };
};
const progress = getTierProgressInfo();


  return (
    <>
      {/* Mobile Sidebar - PRESERVED with enhancements */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className={`flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364] px-6 pb-4 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <div className="text-white text-xl font-bold">
                      <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">B</span>
                      <span className="text-white">IDDEX</span>
                    </div>
                    <button
                      type="button"
                      className="-m-2.5 p-2.5 text-gray-300 hover:text-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* NEW: Back to Site Link - Mobile (PRESERVED) */}
                  <Link
                    to="/"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-[#294c5b] transition-colors duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg">🌐</span>
                    <div>
                      <div>Back to Site</div>
                      <div className="text-xs text-gray-400">Return to main website</div>
                    </div>
                  </Link>

                  {/* NEW: Mode toggle and back button for mobile */}
                  {sidebarMode === 'seller' && (
                    <button
                      onClick={() => {
                        handleBackToBuyer();
                        setSidebarOpen(false);
                      }}
                      className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-[#294c5b] transition-colors duration-200"
                    >
                      <span className="text-lg">←</span>
                      <div>
                        <div>Back to Buyer</div>
                        <div className="text-xs text-gray-400">Return to buyer dashboard</div>
                      </div>
                    </button>
                  )}

                  {/* NEW: User Info Section for Seller Mode - Mobile */}
                  {sidebarMode === 'seller' && (
                    <div className="border-b border-gray-600 pb-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                          {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-gray-300 text-xs">Seller</p>
                            <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
                          </div>
                        </div>
                      </div>

                      {/* NEW: Mobile Tier Progress */}
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                          <span>
                            
                            Progress to {progress.nextTier} {progress.completed}/{progress.needed}
                            </span>

                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, ((sellerProfile?.stats?.completedAuctions || 0) / (sellerProfile?.tier === 'basic' ? 5 : 20)) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Items */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {currentNavigationItems.map((item) => {
                            const isActive = location.pathname === `/dashboard/${item.path}` || (item.path === '' && location.pathname === '/dashboard');
                            
                            return (
                              <li key={item.name}>
                                <NavLink
                                  to={`/dashboard/${item.path}`}
                                  className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                    isActive
                                      ? 'bg-[#294c5b] text-white'
                                      : 'text-gray-300 hover:text-white hover:bg-[#294c5b]'
                                  } transition-colors duration-200`}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <span className="text-lg">{item.icon}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span>{item.name}</span>
                                      {(item as any).badge && sidebarMode === 'seller' && sellerProfile?.tier === 'basic' && (
                                        <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                                          {(item as any).badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-400">{item.description}</div>
                                  </div>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  </nav>

                  {/* NEW: Seller mode toggle for mobile */}
                  {sidebarMode === 'buyer' && (
                    <div className="border-t border-gray-600 pt-4">
                      <NavLink
                        to="/dashboard/sell"
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gradient-to-r from-teal-600 to-cyan-600 transition-all duration-200"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="text-lg">💰</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>Start Selling</span>
                            <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
                          </div>
                          <div className="text-xs text-gray-400">Switch to seller mode</div>
                        </div>
                      </NavLink>
                    </div>
                  )}

                  {/* Logout Button - Mobile */}
                  <div className="border-t border-gray-600 pt-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                      className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-red-400 hover:text-white hover:bg-red-600 w-full transition-colors duration-200"
                    >
                      <span className="text-lg">🚪</span>
                      <div>Logout</div>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar - PRESERVED with enhancements */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364] px-6 pb-4 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {/* Desktop Header */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="text-white text-2xl font-bold">
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">B</span>
              <span className="text-white">IDDEX</span>
            </div>
          </div>

          {/* NEW: Back to Site Link - Desktop (PRESERVED) */}
          <Link
            to="/"
            className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold text-gray-300 hover:bg-gradient-to-r hover:from-[#294c5b] hover:to-[#1e3a48] hover:text-white transition-all duration-200"
          >
            <span className="text-lg">🌐</span>
            <div>
              <div>Back to Site</div>
              <div className="text-xs text-gray-400">Return to main website</div>
            </div>
          </Link>

          {/* NEW: Seller mode back button */}
          {sidebarMode === 'seller' && (
            <button
              onClick={handleBackToBuyer}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold text-gray-300 hover:bg-gradient-to-r hover:from-[#294c5b] hover:to-[#1e3a48] hover:text-white transition-all duration-200"
            >
              <span className="text-lg">←</span>
              <div>
                <div>Back to Buyer</div>
                <div className="text-xs text-gray-400">Return to buyer dashboard</div>
              </div>
            </button>
          )}

          {/* NEW: User Info Section for Seller Mode - Desktop */}
          {sidebarMode === 'seller' && (
            <div className="border-b border-gray-600 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-gray-300 text-sm">Seller</p>
                    <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
                  </div>
                </div>
              </div>

              {/* NEW: Desktop Tier Progress - THIS IS WHAT WAS MISSING! */}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span>
                    Progress to {progress.nextTier}
                    <br />
                    {progress.completed}/{progress.needed}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((sellerProfile?.stats?.completedAuctions || 0) / (sellerProfile?.tier === 'basic' ? 5 : 20)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Navigation Items */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {currentNavigationItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={`/dashboard/${item.path}`}
                        className={({ isActive }) => {
                          const activeClasses = isActive || (item.path === '' && location.pathname === '/dashboard')
                            ? 'bg-gradient-to-r from-[#294c5b] to-[#1e3a48] text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gradient-to-r hover:from-[#294c5b] hover:to-[#1e3a48] hover:text-white';

                          return `group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 ${activeClasses}`;
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <span className="text-lg">{item.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span>{item.name}</span>
                                {(item as any).badge && sidebarMode === 'seller' && sellerProfile?.tier === 'basic' && (
                                  <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                                    {(item as any).badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">{item.description}</div>
                            </div>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>

          {/* NEW: Seller mode toggle for desktop */}
          {sidebarMode === 'buyer' && (
            <div className="border-t border-gray-600 pt-4">
              <NavLink
                to="/dashboard/sell"
                className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold text-gray-300 hover:bg-gradient-to-r hover:from-teal-600 hover:to-cyan-600 hover:text-white transition-all duration-200"
              >
                <span className="text-lg">💰</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>Start Selling</span>
                    <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
                  </div>
                  <div className="text-xs text-gray-400">Switch to seller mode</div>
                </div>
              </NavLink>
            </div>
          )}

          {/* Logout Button - Desktop */}
          <div className="border-t border-gray-600 pt-4">
            <button
              onClick={handleLogout}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold text-red-400 hover:text-white hover:bg-red-600 w-full transition-all duration-200"
            >
              <span className="text-lg">🚪</span>
              <div>Logout</div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - PRESERVED */}
      <div className="lg:pl-72">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-sm text-gray-600">
                {sidebarMode === 'seller' ? 'Manage your listings and sales' : 'Manage your auction activities and account'}
              </p>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {/* Profile dropdown - PRESERVED */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#294c5b] to-[#1e3a48] flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
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
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard/profile"
                          className={`block px-3 py-1 text-sm leading-6 text-gray-900 ${
                            active ? 'bg-gray-50' : ''
                          }`}
                        >
                          Your profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 ${
                            active ? 'bg-gray-50' : ''
                          }`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
