import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        gmail: '',
        phone: '', 
        address: ''
    });
    const [profilePicture, setProfilePicture] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Get user data from localStorage
        const fullName = localStorage.getItem('fullName') || '';
        const gmail = localStorage.getItem('gmail') || '';
        const telephone = localStorage.getItem('telephone') || '';
        const addressLine1 = localStorage.getItem('addressLine1') || '';
        const addressLine2 = localStorage.getItem('addressLine2') || '';
        const city = localStorage.getItem('city') || '';
        const postalCode = localStorage.getItem('postalCode') || '';
        const profileUrl = localStorage.getItem('profilePictureUrl') || '';

        // Format address
        const addressParts = [addressLine1, addressLine2, city, postalCode].filter(part => part && part.trim() !== '');
        const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';

        setUserInfo({
            fullName: fullName || 'Not provided',
            gmail: gmail || 'Not provided',
            phone: telephone || 'Not provided',
            address: formattedAddress
        });

        setProfilePicture(profileUrl);
    }, [navigate]);

    const getInitials = (name) => {
        if (!name || name === 'Not provided') return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getUsername = (email) => {
        if (!email || email === 'Not provided') return 'user';
        return email.split('@')[0];
    };

    const handleSignOut = () => {
        // Clear all user data from localStorage
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        localStorage.removeItem('gmail');
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        localStorage.removeItem('telephone');
        localStorage.removeItem('addressLine1');
        localStorage.removeItem('addressLine2');
        localStorage.removeItem('city');
        localStorage.removeItem('postalCode');
        localStorage.removeItem('profilePictureUrl');
        
        // Dispatch event to update other components
        window.dispatchEvent(new Event('localStorageUpdated'));
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div style={{
            minHeight: '80vh',
            backgroundColor: '#f8fafc',
            padding: '2rem 1rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                overflow: 'hidden'
            }}>
                {/* Profile Header */}
                <div style={{
                    padding: '2rem',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem'
                    }}>
                        {/* Profile Picture */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#6b7280'
                        }}>
                            {profilePicture ? (
                                <img 
                                    src={profilePicture} 
                                    alt="Profile" 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                getInitials(userInfo.fullName)
                            )}
                        </div>

                        {/* User Info */}
                        <div>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                margin: '0 0 0.5rem 0',
                                color: '#1f2937'
                            }}>
                                {userInfo.fullName}
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#10b981',
                                margin: '0 0 1.5rem 0',
                                fontWeight: '500'
                            }}>
                                @{getUsername(userInfo.gmail)}
                            </p>
                            
                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem'
                            }}>
                                <button style={{
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                                >
                                    Edit Personal Info
                                </button>
                                <button style={{
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
                                >
                                    View Orders
                                </button>
                                <button 
                                    onClick={handleSignOut}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '0.75rem 1.5rem',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div style={{
                    padding: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        color: '#1f2937',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '0.5rem'
                    }}>
                        Personal Information
                    </h2>

                    <div style={{
                        display: 'grid',
                        gap: '1.5rem'
                    }}>
                        {/* Full Name */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 0',
                            borderBottom: '1px solid #f3f4f6'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Full Name:
                            </span>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#1f2937',
                                fontWeight: '500'
                            }}>
                                {userInfo.fullName}
                            </span>
                        </div>

                        {/* Email */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 0',
                            borderBottom: '1px solid #f3f4f6'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Email:
                            </span>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#1f2937',
                                fontWeight: '500'
                            }}>
                                {userInfo.gmail}
                            </span>
                        </div>

                        {/* Phone */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 0',
                            borderBottom: '1px solid #f3f4f6'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Phone:
                            </span>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#1f2937',
                                fontWeight: '500'
                            }}>
                                {userInfo.phone}
                            </span>
                        </div>

                        {/* Address */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 0'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Address:
                            </span>
                            <span style={{
                                fontSize: '1.1rem',
                                color: '#1f2937',
                                fontWeight: '500',
                                textAlign: 'right',
                                maxWidth: '60%'
                            }}>
                                {userInfo.address}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;