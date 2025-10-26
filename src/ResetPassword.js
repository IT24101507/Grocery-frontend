import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from './api';

// Message Popup Component
const MessagePopup = ({ isVisible, type, title, message, onClose }) => {
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
                <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>{message}</p>
                <button onClick={onClose} style={{ backgroundColor: style.iconBg, color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                    {type === 'success' ? 'Go to Login' : 'OK'}
                </button>
            </div>
        </div>
    );
};

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSymbol: false
    });
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [popup, setPopup] = useState({ isVisible: false, type: '', title: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        console.log('=== RESET PASSWORD DEBUG ===');
        console.log('Token from URL params:', token);
        console.log('Token length:', token ? token.length : 'null');
        console.log('Full search params:', searchParams.toString());
        
        if (!token) {
            showPopup('error', 'Invalid Request', 'No reset token provided. Please request a new password reset.');
        } else {
            console.log('Token is present, ready for password reset');
        }
    }, [token, searchParams]);

    // Password validation function
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        const isValid = hasMinLength && hasUppercase && hasLowercase && hasSymbol;
        
        setPasswordValidation({
            isValid,
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasSymbol
        });
        
        return isValid;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const showPopup = (type, title, message) => {
        setPopup({ isVisible: true, type, title, message });
    };

    const closePopup = () => {
        setPopup({ isVisible: false, type: '', title: '', message: '' });
        if (popup.type === 'success') {
            navigate('/login');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!token) {
            showPopup('error', 'Invalid Request', 'No reset token provided.');
            return;
        }

        if (!passwordValidation.isValid) {
            showPopup('error', 'Invalid Password', 'Please ensure your password meets all the security requirements.');
            return;
        }

        if (password !== confirmPassword) {
            showPopup('error', 'Password Mismatch', 'Passwords do not match. Please try again.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await authAPI.resetPassword(token, password);
            const message = typeof response.data === 'string' ? response.data : 'Password has been reset successfully.';
            showPopup('success', 'Password Reset Successful', message);
        } catch (error) {
            const errorMessage = error.response?.data || 'Failed to reset password. Please try again.';
            showPopup('error', 'Reset Failed', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <MessagePopup 
                isVisible={popup.isVisible}
                type={popup.type}
                title={popup.title}
                message={popup.message}
                onClose={closePopup}
            />
            <div style={{ maxWidth: '450px', margin: '5rem auto', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '12px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Reset Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>
                    Enter your new password below.
                </p>
                
                <form onSubmit={handleResetPassword}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>New Password</label>
                        <input
                            type="password"
                            className="search-input"
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                marginTop: '0.25rem', 
                                background: '#f3f4f6',
                                border: password ? (passwordValidation.isValid ? '2px solid #10b981' : '2px solid #ef4444') : '1px solid #d1d5db'
                            }}
                            placeholder="Enter new password"
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={() => setShowPasswordRequirements(true)}
                            onBlur={() => setShowPasswordRequirements(false)}
                            required
                        />
                        {(showPasswordRequirements || password) && (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <p style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: '600', 
                                    marginBottom: '0.5rem',
                                    color: '#374151'
                                }}>Password Requirements:</p>
                                <div style={{ fontSize: '0.75rem' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '0.25rem',
                                        color: passwordValidation.hasMinLength ? '#10b981' : '#ef4444'
                                    }}>
                                        <span style={{ marginRight: '0.5rem' }}>
                                            {passwordValidation.hasMinLength ? '✓' : '✗'}
                                        </span>
                                        At least 6 characters
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '0.25rem',
                                        color: passwordValidation.hasUppercase ? '#10b981' : '#ef4444'
                                    }}>
                                        <span style={{ marginRight: '0.5rem' }}>
                                            {passwordValidation.hasUppercase ? '✓' : '✗'}
                                        </span>
                                        At least one uppercase letter (A-Z)
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '0.25rem',
                                        color: passwordValidation.hasLowercase ? '#10b981' : '#ef4444'
                                    }}>
                                        <span style={{ marginRight: '0.5rem' }}>
                                            {passwordValidation.hasLowercase ? '✓' : '✗'}
                                        </span>
                                        At least one lowercase letter (a-z)
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        color: passwordValidation.hasSymbol ? '#10b981' : '#ef4444'
                                    }}>
                                        <span style={{ marginRight: '0.5rem' }}>
                                            {passwordValidation.hasSymbol ? '✓' : '✗'}
                                        </span>
                                        At least one symbol (!@#$%^&*)
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            className="search-input"
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                marginTop: '0.25rem', 
                                background: '#f3f4f6',
                                border: confirmPassword ? (password === confirmPassword ? '2px solid #10b981' : '2px solid #ef4444') : '1px solid #d1d5db'
                            }}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                Passwords do not match
                            </p>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ width: '100%', border: 'none' }}
                        disabled={!passwordValidation.isValid || password !== confirmPassword || isSubmitting}
                    >
                        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                    
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Remember your password? <Link to="/login" style={{ color: '#10b981' }}>Back to Login</Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default ResetPassword;