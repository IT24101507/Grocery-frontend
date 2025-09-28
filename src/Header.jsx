import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';
import './Header.css'; 
import { useAuth } from './useAuth';

const Header = () => {
    const { isLoggedIn } = useAuth();
    const [cartItems] = useState(0);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [hasToken, setHasToken] = useState(false);

    const checkAuthAndProfile = () => {
        const token = localStorage.getItem('token');
        const storedProfilePicture = localStorage.getItem('profilePictureUrl');
        const username = localStorage.getItem('username');
        
        console.log('Header Debug:');
        console.log('- Token exists:', !!token);
        console.log('- Username:', username);
        console.log('- ProfilePictureUrl from localStorage:', storedProfilePicture);
        console.log('- All localStorage keys:', Object.keys(localStorage));
        
        setHasToken(!!token);
        
        // Show profile picture if we have one stored, regardless of API connection
        if (storedProfilePicture && 
            storedProfilePicture !== 'null' && 
            storedProfilePicture !== 'undefined' && 
            storedProfilePicture !== null && 
            storedProfilePicture !== undefined) {
            console.log('- Setting profile picture URL:', storedProfilePicture);
            setProfilePictureUrl(storedProfilePicture);
        } else {
            console.log('- No valid profile picture found, clearing URL. Found value:', storedProfilePicture);
            setProfilePictureUrl(null);
        }
    };

    useEffect(() => {
        checkAuthAndProfile();
        // Listen for storage changes
        window.addEventListener('storage', checkAuthAndProfile);
        window.addEventListener('localStorageUpdated', checkAuthAndProfile);
        
        return () => {
            window.removeEventListener('storage', checkAuthAndProfile);
            window.removeEventListener('localStorageUpdated', checkAuthAndProfile);
        };
    }, []);

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
                        {hasToken ? (
                            <Link to="/profile" className="icon-btn profile-pic-btn">
                                {profilePictureUrl ? (
                                    <img 
                                        src={profilePictureUrl} 
                                        alt="Profile" 
                                        className="profile-picture"
                                        referrerPolicy="no-referrer"
                                        onLoad={() => console.log('Profile picture loaded successfully:', profilePictureUrl)}
                                        onError={(e) => {
                                            console.log('Profile picture failed to load:', profilePictureUrl);
                                            setProfilePictureUrl(null);
                                        }}
                                    />
                                ) : (
                                    <User size={20} className="profile-icon" />
                                )}
                                {/* Debug info */}
                                {console.log('Rendering profile section - hasToken:', hasToken, 'profilePictureUrl:', profilePictureUrl)}
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