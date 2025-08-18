import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';
import './Header.css'; // We'll create a dedicated CSS file for the header

const Header = () => {
    // We can manage cart items globally later (e.g., with Context API)
    // For now, this is just for display.
    const [cartItems] = useState(0); 

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <img src="/images/vegetable.png" alt="Grocery store logo" />
                        </div>
                        <span className="logo-text">Ravindra</span>
                        <span className="ltext-green">Stores</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="nav">
                        {/* Use NavLink for active styling */}
                        <NavLink to="/" className="nav-link">Home</NavLink>
                        <NavLink to="/products" className="nav-link">Products</NavLink>
                        <NavLink to="/contact" className="nav-link">Contact</NavLink>
                    </nav>

                    {/* Right side */}
                    <div className="header-right">
                        {/* Search */}
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="search-input"
                            />
                        </div>

                        {/* User Profile */}
                        <Link to="/login" className="icon-btn">
                            <User size={20} />
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="cart-btn">
                            <ShoppingCart size={18} />
                            <span className="cart-text">Cart</span>
                            {cartItems > 0 && (
                                <span className="cart-badge">
                                    {cartItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;