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
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isSubmittingForgotPassword, setIsSubmittingForgotPassword] = useState(false);
    const [popup, setPopup] = useState({ isVisible: false, type: '', title: '', message: '' });
    
    
    const [isLoading, setIsLoading] = useState(false);
    
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
            const userRole = localStorage.getItem('userRole');
            if (userRole === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else {
                const destination = location.state?.from || '/';
                navigate(destination);
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        console.log('=== FORGOT PASSWORD REQUEST ===' );
        console.log('Email:', forgotPasswordEmail);
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotPasswordEmail)) {
            showPopup('error', 'Invalid Email', 'Please enter a valid email address.');
            return;
        }
        
        setIsSubmittingForgotPassword(true);
        
        try {
            console.log('Sending forgot password request...');
            const response = await authAPI.forgotPassword(forgotPasswordEmail);
            console.log('Forgot password response:', response);
            
            showPopup('success', 'Reset Link Sent', response.data);
            setShowForgotPassword(false);
            setForgotPasswordEmail('');
        } catch (error) {
            console.error('Forgot password error:', error);
            console.error('Error response:', error.response);
            
            const errorMessage = error.response?.data || 'Failed to send reset link. Please try again.';
            showPopup('error', 'Error', errorMessage);
        } finally {
            setIsSubmittingForgotPassword(false);
        }
    };

   const handleLogin = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);
        try {
            const response = await authAPI.login({ gmail, password });
            const userData = response.data;

            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('username', userData.userNickname);
            localStorage.setItem('gmail', userData.gmail);
            localStorage.setItem('token', userData.jwt);
            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('fullName', userData.fullName);
            localStorage.setItem('addressLine1', userData.addressLine1);
            localStorage.setItem('addressLine2', userData.addressLine2);
            localStorage.setItem('city', userData.city);
            localStorage.setItem('postalCode', userData.postalCode);
            localStorage.setItem('telephone', userData.telephone);
            const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
            localStorage.setItem('tokenExpiration', expirationTime);
            
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
        } finally {
            
            setIsLoading(false);
        }
    };

   const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
        
            setIsLoading(true);
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
                    localStorage.setItem('userId', userData.userId);
                    localStorage.setItem('fullName', userData.fullName);
                    localStorage.setItem('addressLine1', userData.addressLine1);
                    localStorage.setItem('addressLine2', userData.addressLine2);
                    localStorage.setItem('city', userData.city);
                    localStorage.setItem('postalCode', userData.postalCode);
                    localStorage.setItem('telephone', userData.telephone);
                    const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
                    localStorage.setItem('tokenExpiration', expirationTime);
                    
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
            } finally {
                
                setIsLoading(false);
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
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <button 
                                type="button" 
                                onClick={() => setShowForgotPassword(true)}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#10b981', 
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ 
                            width: '100%', 
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>

                    {/* === UPDATED GOOGLE BUTTON === */}
                    <button
                        type="button"
                        onClick={() => handleGoogleLogin()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            padding: '0.75rem',
                            marginTop: '1rem',
                            backgroundColor: '#ffffff',
                            color: '#374151', // Dark grey for better readability
                            border: '1px solid #dadce0', // Google's standard border color
                            borderRadius: '8px', // Matches your form's style
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', // Subtle shadow for depth
                            transition: 'background-color 0.3s, border-color 0.3s',
                        }}
                        disabled={isLoading}
                    >
                        {/* Google Icon SVG */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            style={{ width: '20px', height: '20px', marginRight: '12px' }}
                        >
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        {isLoading ? 'Please Wait...' : 'Sign in with Google'}
                    </button>
                    {/* === END OF UPDATED BUTTON === */}

                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#10b981', textDecoration: 'none' }}>Register here</Link>
                    </p>
                </form>
            </div>
            
            {/* Forgot Password Modal */}
            {showForgotPassword && (
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
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#6b7280', textAlign: 'center' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleForgotPassword}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    className="search-input" 
                                    style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', background: '#f3f4f6' }} 
                                    placeholder="your.email@example.com" 
                                    value={forgotPasswordEmail} 
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordEmail('');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    style={{ flex: 1, border: 'none' }}
                                    disabled={isSubmittingForgotPassword || !forgotPasswordEmail.trim()}
                                >
                                    {isSubmittingForgotPassword ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;
