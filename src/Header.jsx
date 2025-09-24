import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';
import './Header.css'; // We'll create a dedicated CSS file for the header
import { useAuth } from './useAuth';

const Header = () => {
    const { isLoggedIn, profilePictureUrl } = useAuth();
    const [cartItems] = React.useState(0);

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

                        {/* Conditional User Profile/Login Button */}
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
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;