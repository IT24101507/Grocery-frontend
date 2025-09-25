import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Message Popup Component
const MessagePopup = ({ isVisible, type, title, message, onClose }) => {
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
                minWidth: '350px',
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

function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ isVisible: false, type: '', title: '', message: '' });
  const [isVerifying, setIsVerifying] = useState(true);

  const showPopup = (type, title, message) => {
    setPopup({ isVisible: true, type, title, message });
    setIsVerifying(false);
  };

  const closePopup = () => {
    setPopup({ isVisible: false, type: '', title: '', message: '' });
    if (popup.type === 'success') {
      navigate('/login');
    }
  };

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
        .then(response => {
          if (response.ok) {
            showPopup('success', 'Verification Successful!', 'Your account has been verified successfully! You can now log in.');
          } else {
            showPopup('error', 'Verification Failed', 'Account verification failed. The link may be expired or invalid. Please try again or contact support.');
          }
        })
        .catch(error => {
          showPopup('error', 'Verification Error', 'An error occurred during verification. Please check your internet connection and try again.');
        });
    } else {
      showPopup('error', 'Invalid Link', 'The verification link is invalid or incomplete. Please check your email for the correct link.');
    }
  }, [searchParams]);

  return (
    <>
      <MessagePopup 
        isVisible={popup.isVisible}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
      />
      <div style={{
        maxWidth: '450px',
        margin: '5rem auto',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2>Account Verification</h2>
        {isVerifying ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2rem'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #10b981',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '10px'
            }}></div>
            <p>Verifying your account...</p>
          </div>
        ) : (
          <p>Please check the popup message for verification status.</p>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default Verify;