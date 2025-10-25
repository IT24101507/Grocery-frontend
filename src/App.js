import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import MainLayout from './MainLayout';
import GroceryStore from './GroceryStore';
import Login from './Login';
import Register from './Register';
import Verify from './Verify';
import ResetPassword from './ResetPassword';
import Profile from './Profile';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import AdminDashboard from './GroceryAdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './useAuth';
import RateUsPopup from './RateUsPopup';
import ProductListPage from './ProductListPage';
import About from './About';
import ContactUs from './ContactUs';
import Terms from './Terms';
import Privacy from './Privacy';

// The AppWrapper now manages the Router and Auth Provider context.
function AppWrapper() {
  // Kept your original production Google Client ID
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "919339334239-5pkf5i0pjpvlvfupk6rga8k4mpp6g4l5.apps.googleusercontent.com";
  const { userRole, isLoggedIn } = useAuth(); // isLoggedIn is now retrieved for the new feature

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        {/* Pass userRole and isLoggedIn as props to the App component */}
        <App userRole={userRole} isLoggedIn={isLoggedIn} />
      </Router>
    </GoogleOAuthProvider>
  );
}

// The App component now contains the routing and feature logic.
const App = ({ userRole, isLoggedIn }) => {
  const [showRateUsPopup, setShowRateUsPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // New Feature: Scrolls to the top of the page on any route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // New Feature: Shows the "Rate Us" popup to logged-in users once per session.
  useEffect(() => {
    if (isLoggedIn) {
      const hasBeenAskedToRate = sessionStorage.getItem('hasBeenAskedToRate');
      if (!hasBeenAskedToRate) {
        setShowRateUsPopup(true);
      }
    }
  }, [isLoggedIn]);

  const handleCloseRateUsPopup = () => {
    setShowRateUsPopup(false);
    sessionStorage.setItem('hasBeenAskedToRate', 'true');
  };

  const handleRateUs = () => {
    handleCloseRateUsPopup();
    // Navigates the user to their profile, directly to the "myReviews" tab.
    navigate('/profile', { state: { initialTab: 'myReviews' } });
  };

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          {/* All original production routes have been preserved */}
          <Route path="/" element={<GroceryStore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute isAllowed={userRole === 'ROLE_ADMIN'}><AdminDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>

      {/* Conditionally renders the new RateUsPopup outside the main router */}
      {showRateUsPopup && (
        <RateUsPopup
          onClose={handleCloseRateUsPopup}
          onRateUs={handleRateUs}
        />
      )}
    </>
  );
};

// The default export is now the AppWrapper component.
export default AppWrapper;
