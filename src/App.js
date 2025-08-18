<<<<<<< Updated upstream
import React from 'react';
// Import routing components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import GroceryStore from './GroceryStore'; // Assuming it's in src/
import Login from './Login';
import Register from './Register';

// Import your main stylesheet
import './GroceryStore.css';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the layout
import MainLayout from './MainLayout';

// Import your pages
import GroceryStore from './GroceryStore';
import Login from './Login';
import Register from './Register';
// Create a placeholder for Products and Contact if you haven't already
const Products = () => <div>Products Page</div>;
const Contact = () => <div>Contact Page</div>;
const Cart = () => <div>Cart Page</div>;
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" element={<GroceryStore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
=======
        {/* All routes inside here will have the header and footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<GroceryStore/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;