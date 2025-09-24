import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Message Popup Component
const MessagePopup = ({ isVisible, type, title, message, username, onClose }) => {
    if (!isVisible) return null;

    const getPopupStyle = () => {
        switch (type) {
            case 'success':
                return {
                    borderColor: '#10b981',
                    iconBg: '#10b981',
                    titleColor: '#10b981',
                    icon: '✓'
                };
            case 'error':
                return {
                    borderColor: '#ef4444',
                    iconBg: '#ef4444',
                    titleColor: '#ef4444',
                    icon: '✗'
                };
            case 'warning':
                return {
                    borderColor: '#f59e0b',
                    iconBg: '#f59e0b',
                    titleColor: '#f59e0b',
                    icon: '!'
                };
            default:
                return {
                    borderColor: '#6b7280',
                    iconBg: '#6b7280',
                    titleColor: '#6b7280',
                    icon: 'i'
                };
        }
    };

    const style = getPopupStyle();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                textAlign: 'center',
                minWidth: '300px',
                maxWidth: '450px',
                border: `3px solid ${style.borderColor}`
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: style.iconBg,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '30px',
                    color: 'white'
                }}>{style.icon}</div>
                <h3 style={{
                    color: style.titleColor,
                    marginBottom: '1rem',
                    fontSize: '1.5rem'
                }}>{title}</h3>
                {username && (
                    <p style={{
                        color: '#374151',
                        marginBottom: '1rem',
                        fontSize: '1.1rem'
                    }}>Welcome <strong>{username}</strong>!</p>
                )}
                <p style={{
                    color: '#6b7280',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                }}>{message}</p>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: style.iconBg,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >{type === 'success' ? 'Continue to Login' : 'OK'}</button>
            </div>
        </div>
    );
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [popup, setPopup] = useState({ isVisible: false, type: '', title: '', message: '', username: '' });
    const navigate = useNavigate();

    const showPopup = (type, title, message, username = '') => {
        setPopup({ isVisible: true, type, title, message, username });
    };

    const closePopup = () => {
        setPopup({ isVisible: false, type: '', title: '', message: '', username: '' });
        if (popup.type === 'success') {
            navigate('/login');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        const newUser = { username, gmail, password, telephone, address, role: 'USER' };

        try {
            const response = await axios.post('http://localhost:8082/api/auth/register', newUser);
            
            // Show success popup instead of alert
            showPopup('success', 'Registration Successful!', 'You have been registered successfully. Please check your email for verification.', username);

        } catch (err) {
            if (err.response && err.response.status === 409) {
                showPopup('error', 'Registration Failed', 'This email address is already registered. Please use a different email or try logging in.');
            } else {
                showPopup('error', 'Registration Error', 'An error occurred during registration. Please try again.');
            }
        }
    };



    return (
        <>
            <MessagePopup 
                isVisible={popup.isVisible}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                username={popup.username}
                onClose={closePopup}
            />
            <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Username</label>
                    <input
                        type="text"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="your.email@example.com"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Telephone</label>
                    <input
                        type="tel"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Enter your telephone number"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Address</label>
                    <input
                        type="text"
                        className="search-input"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }}
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>
                    Register
                </button>
                 <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#10b981' }}>Login here</Link>
                </p>
            </form>
            </div>
        </>
    );
}

export default Register;