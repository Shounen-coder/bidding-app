import React, { useState, Fragment } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Transition, Menu } from '@headlessui/react';
import type { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

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

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 md:hidden">
        <div className="fixed inset-0 bg-gray-600/75" aria-hidden="true" />
        
        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              {/* Mobile Header */}
              <div className="flex h-16 shrink-0 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#294c5b] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h2 className="ml-3 text-xl font-bold text-[#294c5b]">Biddex</h2>
              </div>
              
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {/* ADD: Back to Site Link - Mobile */}
                      <li className="mb-4">
                        <Link
                          to="/"
                          className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-700 hover:text-white hover:bg-[#294c5b] border-b border-gray-200 pb-3"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="text-lg">🏠</span>
                          <div>
                            <div>Back to Site</div>
                            <div className="text-xs opacity-75">Return to main website</div>
                          </div>
                        </Link>
                      </li>

                      {/* Existing Navigation Items */}
                      {navigationItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={`/dashboard/${item.path}`}
                            className={({ isActive }) =>
                              `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                isActive
                                  ? 'bg-[#294c5b] text-white'
                                  : 'text-gray-700 hover:text-white hover:bg-[#294c5b]'
                              }`
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs opacity-75">{item.description}</div>
                            </div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  
                  {/* Logout Button */}
                  <li className="mt-auto">
                    <button
                      onClick={handleLogout}
                      className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-red-600 hover:bg-red-50"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
          {/* Desktop Header */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#294c5b] to-[#1e3a48] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h2 className="ml-3 text-2xl font-bold text-[#294c5b]">Biddex</h2>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {/* ADD: Back to Site Link - Desktop */}
                  <li className="mb-6">
                    <Link
                      to="/"
                      className="group flex gap-x-3 rounded-xl p-4 text-sm leading-6 font-semibold transition-all duration-200 text-gray-700 hover:bg-gradient-to-r hover:from-[#294c5b] hover:to-[#1e3a48] hover:text-white border-b border-gray-200 pb-4"
                    >
                      <span className="text-xl">🏠</span>
                      <div className="flex-1">
                        <div className="font-medium">Back to Site</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-200">Return to main website</div>
                      </div>
                    </Link>
                  </li>

                  {/* Existing Navigation Items */}
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={`/dashboard/${item.path}`}
                        className={({ isActive }) => {
                          const activeClasses = isActive
                            ? 'bg-gradient-to-r from-[#294c5b] to-[#1e3a48] text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#294c5b] hover:to-[#1e3a48] hover:text-white';
                          
                          return `group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 ${activeClasses}`;
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <span className="text-xl">{item.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className={`text-xs ${isActive ? 'text-gray-200' : 'text-gray-500'} group-hover:text-gray-200`}>
                                {item.description}
                              </div>
                            </div>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Logout Button */}
              <li className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="group -mx-2 flex w-full gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="h-6 w-px bg-gray-900/10 md:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div>
                <h1 className="text-2xl font-bold text-[#294c5b]">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-600 text-sm">Manage your auction activities and account</p>
              </div>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#294c5b] to-[#1e3a48] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <svg className="ml-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </span>
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
                          className={`block px-3 py-1 text-sm leading-6 text-gray-900 ${active ? 'bg-gray-50' : ''}`}
                        >
                          Your profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900 ${active ? 'bg-gray-50' : ''}`}
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
    </div>
  );
};

export default DashboardLayout;
