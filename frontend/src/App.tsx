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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
