import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from './api';
import OrderHistory from './OrderHistory';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        gmail: '',
        telephone: '', 
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: ''
    });
    const [profilePicture, setProfilePicture] = useState('');
    const [showOrderHistory, setShowOrderHistory] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
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

        const userData = {
            fullName: fullName || 'Not provided',
            gmail: gmail || 'Not provided',
            telephone: telephone || 'Not provided',
            addressLine1: addressLine1 || 'Not provided',
            addressLine2: addressLine2 || '',
            city: city || 'Not provided',
            postalCode: postalCode || 'Not provided',
        };

        setUserInfo(userData);
        setEditFormData(userData);
        setProfilePicture(profileUrl);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditClick = () => {
        setIsEditMode(true);
        setUpdateMessage('');
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditFormData(userInfo); // Reset form data
        setUpdateMessage('');
    };

    const handleSave = async () => {
        setLoading(true);
        setUpdateMessage('');
        
        try {
            // Prepare update data (only send changed fields)
            const updateData = {
                fullName: editFormData.fullName !== 'Not provided' ? editFormData.fullName : '',
                telephone: editFormData.telephone !== 'Not provided' ? editFormData.telephone : '',
                addressLine1: editFormData.addressLine1 !== 'Not provided' ? editFormData.addressLine1 : '',
                addressLine2: editFormData.addressLine2 || '',
                city: editFormData.city !== 'Not provided' ? editFormData.city : '',
                postalCode: editFormData.postalCode !== 'Not provided' ? editFormData.postalCode : ''
            };

            // Call backend API to update profile
            const response = await userAPI.updateProfile(updateData);
            
            // Update localStorage with new data
            localStorage.setItem('fullName', response.data.fullName || '');
            localStorage.setItem('telephone', response.data.telephone || '');
            localStorage.setItem('addressLine1', response.data.addressLine1 || '');
            localStorage.setItem('addressLine2', response.data.addressLine2 || '');
            localStorage.setItem('city', response.data.city || '');
            localStorage.setItem('postalCode', response.data.postalCode || '');
            
            // Update state with response data
            const updatedUserInfo = {
                fullName: response.data.fullName || 'Not provided',
                gmail: response.data.gmail || 'Not provided',
                telephone: response.data.telephone || 'Not provided',
                addressLine1: response.data.addressLine1 || 'Not provided',
                addressLine2: response.data.addressLine2 || '',
                city: response.data.city || 'Not provided',
                postalCode: response.data.postalCode || 'Not provided',
            };
            
            setUserInfo(updatedUserInfo);
            setIsEditMode(false);
            setUpdateMessage('Profile updated successfully!');
            
            // Dispatch event to update other components
            window.dispatchEvent(new Event('localStorageUpdated'));
            
        } catch (error) {
            console.error('Profile update error:', error);
            setUpdateMessage('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                                <button 
                                    onClick={handleEditClick}
                                    style={{
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
                                <button 
                                    onClick={() => setShowOrderHistory(!showOrderHistory)}
                                    style={{
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
                                    {showOrderHistory ? 'Hide Orders' : 'View Orders'}
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

                {showOrderHistory && <OrderHistory />}

                {/* Personal Information Section */}
                <div style={{
                    padding: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            borderBottom: '2px solid #e5e7eb',
                            paddingBottom: '0.5rem',
                            margin: 0
                        }}>
                            Personal Information
                        </h2>
                        
                        {isEditMode && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                    onClick={handleCancelEdit}
                                    style={{
                                        backgroundColor: '#6b7280',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: loading ? '#9ca3af' : '#10b981',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {updateMessage && (
                        <div style={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            backgroundColor: updateMessage.includes('successfully') ? '#d1fae5' : '#fee2e2',
                            color: updateMessage.includes('successfully') ? '#065f46' : '#991b1b',
                            textAlign: 'center'
                        }}>
                            {updateMessage}
                        </div>
                    )}

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
                                fontWeight: '500',
                                minWidth: '120px'
                            }}>
                                Full Name:
                            </span>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editFormData.fullName === 'Not provided' ? '' : editFormData.fullName}
                                    onChange={handleInputChange}
                                    style={{
                                        fontSize: '1.1rem',
                                        color: '#1f2937',
                                        fontWeight: '500',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        padding: '0.5rem',
                                        width: '60%',
                                        background: '#f9fafb'
                                    }}
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <span style={{
                                    fontSize: '1.1rem',
                                    color: '#1f2937',
                                    fontWeight: '500'
                                }}>
                                    {userInfo.fullName}
                                </span>
                            )}
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
                                fontWeight: '500',
                                minWidth: '120px'
                            }}>
                                Email:
                            </span>
                            {isEditMode ? (
                                <span style={{
                                    fontSize: '1.1rem',
                                    color: '#6b7280',
                                    fontWeight: '500',
                                    fontStyle: 'italic'
                                }}>
                                    {userInfo.gmail} (Cannot be changed)
                                </span>
                            ) : (
                                <span style={{
                                    fontSize: '1.1rem',
                                    color: '#1f2937',
                                    fontWeight: '500'
                                }}>
                                    {userInfo.gmail}
                                </span>
                            )}
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
                                fontWeight: '500',
                                minWidth: '120px'
                            }}>
                                Phone:
                            </span>
                            {isEditMode ? (
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={editFormData.telephone === 'Not provided' ? '' : editFormData.telephone}
                                    onChange={handleInputChange}
                                    style={{
                                        fontSize: '1.1rem',
                                        color: '#1f2937',
                                        fontWeight: '500',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        padding: '0.5rem',
                                        width: '60%',
                                        background: '#f9fafb'
                                    }}
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <span style={{
                                    fontSize: '1.1rem',
                                    color: '#1f2937',
                                    fontWeight: '500'
                                }}>
                                    {userInfo.telephone}
                                </span>
                            )}
                        </div>

                        {/* Address - Combined view when not editing, separate fields when editing */}
                        {!isEditMode ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0'
                            }}>
                                <span style={{
                                    fontSize: '1.1rem',
                                    color: '#6b7280',
                                    fontWeight: '500',
                                    minWidth: '120px'
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
                                    {(() => {
                                        const addressParts = [
                                            userInfo.addressLine1 !== 'Not provided' ? userInfo.addressLine1 : '',
                                            userInfo.addressLine2 || '',
                                            userInfo.city !== 'Not provided' ? userInfo.city : '',
                                            userInfo.postalCode !== 'Not provided' ? userInfo.postalCode : ''
                                        ].filter(part => part.trim() !== '');
                                        
                                        return addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';
                                    })()}
                                </span>
                            </div>
                        ) : (
                            <>
                                {/* Address Line 1 - Edit Mode */}
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
                                        fontWeight: '500',
                                        minWidth: '120px'
                                    }}>
                                        Address Line 1:
                                    </span>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={editFormData.addressLine1 === 'Not provided' ? '' : editFormData.addressLine1}
                                        onChange={handleInputChange}
                                        style={{
                                            fontSize: '1.1rem',
                                            color: '#1f2937',
                                            fontWeight: '500',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            padding: '0.5rem',
                                            width: '60%',
                                            background: '#f9fafb'
                                        }}
                                        placeholder="Enter address line 1"
                                    />
                                </div>

                                {/* Address Line 2 - Edit Mode */}
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
                                        fontWeight: '500',
                                        minWidth: '120px'
                                    }}>
                                        Address Line 2:
                                    </span>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={editFormData.addressLine2 || ''}
                                        onChange={handleInputChange}
                                        style={{
                                            fontSize: '1.1rem',
                                            color: '#1f2937',
                                            fontWeight: '500',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            padding: '0.5rem',
                                            width: '60%',
                                            background: '#f9fafb'
                                        }}
                                        placeholder="Enter address line 2 (optional)"
                                    />
                                </div>

                                {/* City - Edit Mode */}
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
                                        fontWeight: '500',
                                        minWidth: '120px'
                                    }}>
                                        City:
                                    </span>
                                    <input
                                        type="text"
                                        name="city"
                                        value={editFormData.city === 'Not provided' ? '' : editFormData.city}
                                        onChange={handleInputChange}
                                        style={{
                                            fontSize: '1.1rem',
                                            color: '#1f2937',
                                            fontWeight: '500',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            padding: '0.5rem',
                                            width: '60%',
                                            background: '#f9fafb'
                                        }}
                                        placeholder="Enter your city"
                                    />
                                </div>

                                {/* Postal Code - Edit Mode */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem 0'
                                }}>
                                    <span style={{
                                        fontSize: '1.1rem',
                                        color: '#6b7280',
                                        fontWeight: '500',
                                        minWidth: '120px'
                                    }}>
                                        Postal Code:
                                    </span>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={editFormData.postalCode === 'Not provided' ? '' : editFormData.postalCode}
                                        onChange={handleInputChange}
                                        style={{
                                            fontSize: '1.1rem',
                                            color: '#1f2937',
                                            fontWeight: '500',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            padding: '0.5rem',
                                            width: '60%',
                                            background: '#f9fafb'
                                        }}
                                        placeholder="Enter postal code"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;