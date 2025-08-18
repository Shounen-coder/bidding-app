// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/dashboard/Profile';
import AuctionTest from './pages/auction/AuctionTest';
import AuctionListing from './pages/auction/AuctionListing';
import CategoryIndex from './pages/category/CategoryIndex'; // New import
import CategoryPage from './pages/category/CategoryPage';
import AuctionDetail from './pages/auction/AuctionDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<AuctionTest />} />
          <Route path="/auctions" element={<AuctionListing />} />
          <Route path="/auctions/:id" element={<AuctionDetail />} />
          <Route path="/category" element={<CategoryIndex />} /> {/* New route */}
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
