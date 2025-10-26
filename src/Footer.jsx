import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <div className="footer-logo-icon">
                                <img src="/images/vegetable.png" alt="Grocery store logo" />
                            </div>
                            <span className="footer-logo-text">Ravindra Stores</span>
                        </div>
                        <p className="footer-description">
                            We provide fresh, high-quality groceries at the best prices for a delightful experience.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Shop</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/contact">Contact us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Services</h4>
                        <ul className="footer-links">
                            <li><Link to="/profile">My account</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Contact</h4>
                        <ul className="footer-contact">
                            <li>SLIIT Malabe</li>
                            <li>0762294533</li>
                            <li>ravindrastoreslk@gmail.com</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2025 Grocery Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;