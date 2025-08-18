import React from 'react';
import './Footer.css'; // We'll create a dedicated CSS file for the footer

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
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">All Products</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact us</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Services</h4>
                        <ul className="footer-links">
                            <li><a href="#">My account</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Contact</h4>
                        <ul className="footer-contact">
                            <li>📍 SLIIT Malabe</li>
                            <li>📞 0762294533</li>
                            <li>✉️ contact @Ravindrastores@gmail.com</li>
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