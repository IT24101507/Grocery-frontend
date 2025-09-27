import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, User, ChevronDown } from 'lucide-react';
import './Header.css';
import { useAuth } from './useAuth'; 

const Header = () => {
    const [cartItems] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Hardcoded admin flag (later replace with auth check)
    const isAdmin = true;

    
    const { isLoggedIn, profilePictureUrl } = useAuth();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

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
                        <NavLink to="/" className="nav-link">Home</NavLink>
                        
                        {/* Products + Arrow dropdown */}
                        <div className="dropdown">
                            <span className="nav-link">Products</span>
                            <ChevronDown 
                                size={20} 
                                className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`} 
                                onClick={toggleDropdown}
                            />

                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    {isAdmin && (
                                        <Link to="/products/add" className="dropdown-item">Add Product</Link>
                                    )}
                                    <Link to="/view-products" className="dropdown-item">View Products</Link>
                                    <Link to="/offers" className="dropdown-item">Special Offers</Link>
                                </div>
                            )}
                        </div>

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

                        {/*  User Profile/Login Button merged */}
                        {isLoggedIn ? (
                            <Link to="/profile" className="icon-btn profile-pic-btn">
                                {profilePictureUrl ? (
                                    <img 
                                        src={profilePictureUrl} 
                                        alt="Profile" 
                                        className="profile-pic"
                                        onError={(e) => {
                                            console.log('Profile picture failed to load:', profilePictureUrl);
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <User size={20} style={{ display: profilePictureUrl ? 'none' : 'flex' }} />
                            </Link>
                        ) : (
                            <Link to="/login" className="icon-btn">
                                <User size={20} />
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="cart-btn">
                            <ShoppingCart size={18} />
                            <span className="cart-text">Cart</span>
                            {cartItems > 0 && (
                                <span className="cart-badge">{cartItems}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
