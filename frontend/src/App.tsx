// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from './store';
import { refreshAccessToken, getCurrentUser } from './store/slices/authSlice';

// Layout
import Layout from './components/layout/Layout';

// Components
import ProtectedRoute from './components/ProtectedRoutes';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuctionTest from './pages/auction/AuctionTest';
import AuctionListing from './pages/auction/AuctionListing';
import CategoryIndex from './pages/category/CategoryIndex';
import CategoryPage from './pages/category/CategoryPage';
import AuctionDetail from './pages/auction/AuctionDetail';
import HowItWorks from './pages/HowItWorks';

// Dashboard Components (Existing)
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardNotifications from './pages/dashboard/DashboardNotifications';
import DashboardWatchlist from './pages/dashboard/DashboardWatchlist';
import DashboardActivity from './pages/dashboard/DashboardActivity';
import DashboardOrders from './pages/dashboard/DashboardOrders';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import DashboardMessages from './pages/dashboard/DashboardMessages';
import DashboardHelp from './pages/dashboard/DashboardHelp';

// NEW: Seller Dashboard Components
import SellerOverview from './pages/seller/SellerOverview';
import CreateAuction from './pages/seller/CreateAuction';
import MyAuctions from './pages/seller/MyAuctions';
import SellerAnalytics from './pages/seller/SellerAnalytics';
import SellerOrders from './pages/seller/SellerOrders';
import SellerAcademy from './pages/seller/SellerAcademy';

import SellerItemsPage from './pages/seller/SellerItemsPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  // Initial auth check with proper async handling
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken && !isAuthenticated) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          try {
            await dispatch(refreshAccessToken()).unwrap();
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
          }
        }
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  // Auto-refresh with proper async handling
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const refreshInterval = setInterval(async () => {
        try {
          await dispatch(refreshAccessToken()).unwrap();
        } catch (error) {
          console.log('Auto-refresh failed');
        }
      }, 14 * 60 * 1000); // 14 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, accessToken, dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes with main layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auctions" element={<AuctionListing />} />
          <Route path="auctions/:id" element={<AuctionDetail />} />
          <Route path="auction-test" element={<AuctionTest />} />
          <Route path="categories" element={<CategoryIndex />} />
          <Route path="categories/:categoryName" element={<CategoryPage />} />
          <Route path="how-it-works" element={<HowItWorks />} />
        </Route>


  
<Route path="/seller/:sellerId/items" element={<SellerItemsPage />} />

        {/* Protected dashboard routes - separate from main layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard nested routes (EXISTING - PRESERVED) */}
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="watchlist" element={<DashboardWatchlist />} />
          <Route path="activity" element={<DashboardActivity />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="messages" element={<DashboardMessages />} />
          <Route path="help" element={<DashboardHelp />} />
          
          {/* NEW: Seller Dashboard Routes */}
          <Route path="sell" element={<SellerOverview />} />
          <Route path="sell/create" element={<CreateAuction />} />
          <Route path="sell/auctions" element={<MyAuctions />} />
          <Route path="sell/analytics" element={<SellerAnalytics />} />
          <Route path="sell/orders" element={<SellerOrders />} />
          <Route path="sell/academy" element={<SellerAcademy />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
