import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


import ProductListPage from './ProductListPage';
import About from './About';
import ContactUs from './ContactUs';
import Terms from './Terms';
import Privacy from './Privacy';
 

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "919339334239-5pkf5i0pjpvlvfupk6rga8k4mpp6g4l5.apps.googleusercontent.com";
  const { userRole } = useAuth();

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<GroceryStore/>} />
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
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
