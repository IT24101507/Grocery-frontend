import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';


import MainLayout from './MainLayout';
import GroceryStore from './GroceryStore';
import Login from './Login';
import Register from './Register';
import Verify from './Verify';


const Products = () => <div>Products Page</div>;
const Contact = () => <div>Contact Page</div>;
const Cart = () => <div>Cart Page</div>;
const Profile = () => <div>Profile Page</div>; 

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "919339334239-kl7469709cpapu9dirknf3cml0rafliu.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<GroceryStore/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
