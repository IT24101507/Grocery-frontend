import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI, BASE_URL } from './api';


const MessagePopup = ({ isVisible, type, title, message, username, onClose }) => {
    if (!isVisible) return null;

    const getPopupStyle = () => {
        switch (type) {
            case 'success':
                return { borderColor: '#10b981', iconBg: '#10b981', titleColor: '#10b981', icon: '✓' };
            case 'error':
                return { borderColor: '#ef4444', iconBg: '#ef4444', titleColor: '#ef4444', icon: '✗' };
            case 'warning':
                return { borderColor: '#f59e0b', iconBg: '#f59e0b', titleColor: '#f59e0b', icon: '!' };
            default:
                return { borderColor: '#6b7280', iconBg: '#6b7280', titleColor: '#6b7280', icon: 'i' };
        }
    };

    const style = getPopupStyle();

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center', minWidth: '300px', maxWidth: '450px', border: `3px solid ${style.borderColor}` }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: style.iconBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '30px', color: 'white' }}>{style.icon}</div>
                <h3 style={{ color: style.titleColor, marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
                {username && (<p style={{ color: style.titleColor, marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '600' }}>Welcome {username}!</p>)}
                {message && (<p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>{message}</p>)}
                <button onClick={onClose} style={{ backgroundColor: style.iconBg, color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.3s' }}>OK</button>
            </div>
        </div>
    );
};


const Login = () => {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [popup, setPopup] = useState({ isVisible: false, type: '', title: '', message: '' });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.popup) {
            const { type, title, message } = location.state.popup;
            showPopup(type, title, message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const showPopup = (type, title, message, username = '') => {
        setPopup({ isVisible: true, type, title, message, username });
    };

    const closePopup = () => {
        const currentPopupType = popup.type;
        setPopup({ isVisible: false, type: '', title: '', message: '', username: '' });
        
        if (currentPopupType === 'success') {
            const destination = location.state?.from || '/';
            navigate(destination);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.login({ gmail, password });
            const userData = response.data;

            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('username', userData.userNickname);
            localStorage.setItem('gmail', userData.gmail);
            localStorage.setItem('token', userData.jwt);
            localStorage.setItem('fullName', userData.fullName);
            localStorage.setItem('addressLine1', userData.addressLine1);
            localStorage.setItem('addressLine2', userData.addressLine2);
            localStorage.setItem('city', userData.city);
            localStorage.setItem('postalCode', userData.postalCode);
            localStorage.setItem('telephone', userData.telephone);
            
            const profileUrl = userData.picture || null;
            if (profileUrl && profileUrl !== 'undefined' && profileUrl !== 'null') {
                localStorage.setItem('profilePictureUrl', profileUrl);
            } else {
                localStorage.removeItem('profilePictureUrl');
            }
            
            window.dispatchEvent(new Event('localStorageUpdated'));
            showPopup('success', 'Login Successful!', '', userData.userNickname);

        } catch (error) {
            const status = error.response?.status;
            const errorMessage = error.response?.data;

            if (status === 401) {
                showPopup('error', 'Invalid Credentials', 'Please check your email and password and try again.');
            } else if (status === 403) {
                if (typeof errorMessage === 'string' && errorMessage.includes('verify')) {
                    showPopup('warning', 'Email Verification Required', errorMessage);
                } else {
                    showPopup('error', 'Account Issue', errorMessage || 'Your account has an issue. Please contact support.');
                }
            } else if (status >= 500) {
                showPopup('error', 'Server Error', 'The server is currently unavailable. Please try again later.');
            } else if (error.request) {
                showPopup('error', 'Connection Error', 'Could not connect to the server.');
            } else {
                showPopup('error', 'Login Failed', 'An unexpected error occurred.');
            }
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch(`${BASE_URL}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token })
                });

                if (response.ok) {
                    const userData = await response.json();
                    localStorage.setItem('userRole', userData.role);
                    localStorage.setItem('username', userData.userNickname);
                    localStorage.setItem('gmail', userData.gmail);
                    localStorage.setItem('token', userData.jwt);
                    localStorage.setItem('fullName', userData.fullName);
                    localStorage.setItem('addressLine1', userData.addressLine1);
                    localStorage.setItem('addressLine2', userData.addressLine2);
                    localStorage.setItem('city', userData.city);
                    localStorage.setItem('postalCode', userData.postalCode);
                    localStorage.setItem('telephone', userData.telephone);
                    
                    const profileUrl = userData.picture || null;
                    if (profileUrl && profileUrl !== 'undefined' && profileUrl !== 'null') {
                        localStorage.setItem('profilePictureUrl', profileUrl);
                    } else {
                        localStorage.removeItem('profilePictureUrl');
                    }
                    
                    window.dispatchEvent(new Event('localStorageUpdated'));
                    showPopup('success', 'Google Login Successful!', '', userData.userNickname);
                } else {
                    const errorText = await response.text();
                    if (response.status === 404 || errorText.includes('not registered')) {
                        showPopup('warning', 'Registration Required', 'Sorry, you have to register first before using Google login.');
                    } else {
                        showPopup('error', 'Google Login Failed', 'Unable to sign in with Google. Please try again.');
                    }
                }
            } catch (error) {
                showPopup('error', 'Google Login Error', 'An error occurred during Google login.');
            }
        },
        onError: () => {
            showPopup('error', 'Google Login Failed', 'Google authentication was cancelled or failed.');
        },
    });

    return (
        <>
            <MessagePopup isVisible={popup.isVisible} type={popup.type} title={popup.title} message={popup.message} username={popup.username} onClose={closePopup} />
            <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input type="email" className="search-input" style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }} placeholder="your.email@example.com" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Password</label>
                        <input type="password" className="search-input" style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none' }}>Login</button>
                    <button type="button" onClick={() => handleGoogleLogin()} className="btn-secondary" style={{ width: '100%', border: 'none', marginTop: '1rem' }}>Sign in with Google</button>
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#10b981' }}>Register here</Link>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Login;