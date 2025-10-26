import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import BankTransferDetails from './BankTransferDetails';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import { useCart } from './hooks';
import { orderAPI } from './api';
import LoadingAnimation from './LoadingAnimation'; // Ensure this is imported

const CheckoutPage = () => {
    const { cart, loading, error, fetchCart } = useCart();
    const [formData, setFormData] = useState({
        customerName: '',
        mobileNumber: '',
        paymentMethod: 'bank-transfer',
        deliveryMethod: 'home',
        street: '',
        city: '',
        postalCode: ''
    });
    const [transferSlip, setTransferSlip] = useState(null);
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate();

    // --- NEW: State to handle the order submission loading state ---
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchCart();
        }
    }, [navigate, fetchCart]);

    useEffect(() => {
        if (formData.deliveryMethod === 'home') {
            const addressLine1 = localStorage.getItem('addressLine1') || '';
            const addressLine2 = localStorage.getItem('addressLine2') || '';
            const storedCity = localStorage.getItem('city') || '';
            const storedPostalCode = localStorage.getItem('postalCode') || '';

            const street = [addressLine1, addressLine2].filter(Boolean).join(', ');

            setFormData(prev => ({
                ...prev,
                street: street,
                city: storedCity,
                postalCode: storedPostalCode
            }));
        }
    }, [formData.deliveryMethod]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePaymentChange = (e) => {
        const { value } = e.target;
        const newFormData = { ...formData, paymentMethod: value };
        if (value === 'pay-at-store') {
            newFormData.deliveryMethod = 'pickup';
        }
        setFormData(newFormData);
    };

    const handleDeliveryChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, deliveryMethod: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName) newErrors.customerName = "Full Name is required.";
        if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile Number is required.";
        if (formData.deliveryMethod === 'home' && (!formData.street || !formData.city)) {
            newErrors.address = "Street Address and City are required for home delivery.";
        }
        if (formData.paymentMethod === 'bank-transfer' && !transferSlip) {
            newErrors.transferSlip = "Please upload your transfer slip.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please fix the errors before submitting.");
            return;
        }

        // --- UPDATE: Set loading to true before the API call ---
        setIsPlacingOrder(true);

        const orderDetails = {
            userId: localStorage.getItem('userId'), 
            customerName: formData.customerName,
            mobileNumber: formData.mobileNumber,
            paymentMethod: formData.paymentMethod,
            deliveryMethod: formData.deliveryMethod,
            deliveryAddress: formData.deliveryMethod === 'home' ? {
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode
            } : {}
        };
        
        const submissionData = new FormData();
        submissionData.append('orderData', JSON.stringify(orderDetails));
        if (transferSlip) {
            submissionData.append('transferSlip', transferSlip);
        }

        try {
            const response = await orderAPI.placeOrder(submissionData);
            const orderId = response.data.orderId || Math.floor(Math.random() * 10000);
            setOrderId(orderId);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to place order:', error);
            alert(`Error: ${error.response?.data?.error || 'Could not place order.'}`);
        } finally {
            // --- UPDATE: Set loading to false after the call finishes ---
            setIsPlacingOrder(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        fetchCart(); 
        navigate('/');
    };

    if (loading) return <LoadingAnimation />;
    if (error) return <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>Error: {error}</div>;
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '2rem'}}>
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart before checkout!</p>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginTop: '1rem'
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <main className="main">
            <div className="checkout-form">
                <h1 className="checkout-title">Checkout</h1>
                
                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Customer Information */}
                    <div className="form-section">
                        <h2 className="ssection-title">Customer Information</h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="customerName">Full Name *</label>
                            <input 
                                type="text" 
                                id="customerName" 
                                className="form-input" 
                                placeholder="Enter your full name"
                                value={formData.customerName} 
                                onChange={handleInputChange} 
                                required 
                            />
                            {errors.customerName && <p style={{color: 'red', fontSize: '0.9rem', marginTop: '0.5rem'}}>{errors.customerName}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="mobileNumber">Mobile Number *</label>
                            <input 
                                type="tel" 
                                id="mobileNumber" 
                                className="form-input" 
                                placeholder="Enter your mobile number"
                                value={formData.mobileNumber} 
                                onChange={handleInputChange} 
                                required 
                            />
                            {errors.mobileNumber && <p style={{color: 'red', fontSize: '0.9rem', marginTop: '0.5rem'}}>{errors.mobileNumber}</p>}
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div className="form-section">
                        <h2 className="ssection-title">Payment Method</h2>
                        <div className="radio-group">
                            <label className={`radio-option ${formData.paymentMethod === 'bank-transfer' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="bank-transfer" 
                                    checked={formData.paymentMethod === 'bank-transfer'}
                                    onChange={handlePaymentChange} 
                                />
                                <div className="option-content">
                                    <div className="option-title">Bank Transfer</div>
                                    <div className="option-description">Pay directly from your bank account</div>
                                </div>
                            </label>
                            <label className={`radio-option ${formData.paymentMethod === 'pay-at-store' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="pay-at-store"
                                    checked={formData.paymentMethod === 'pay-at-store'}
                                    onChange={handlePaymentChange} 
                                />
                                <div className="option-content">
                                    <div className="option-title">Pay at Store</div>
                                    <div className="option-description">Pay when you pick up or receive your order</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Bank Transfer Details */}
                    {formData.paymentMethod === 'bank-transfer' && (
                        <BankTransferDetails onFileChange={setTransferSlip} />
                    )}
                    {errors.transferSlip && <p style={{color: 'red', fontSize: '0.9rem', marginTop: '0.5rem'}}>{errors.transferSlip}</p>}

                    {/* Delivery Options */}
                    <div className="form-section">
                        <h2 className="ssection-title">Delivery Options</h2>
                        <div className="radio-group">
                            <label className={`radio-option ${formData.deliveryMethod === 'home' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="delivery" 
                                    value="home" 
                                    checked={formData.deliveryMethod === 'home'}
                                    onChange={handleDeliveryChange} 
                                    disabled={formData.paymentMethod === 'pay-at-store'}
                                />
                                <div className="option-content">
                                    <div className="option-title">Deliver to Home</div>
                                    <div className="option-description">Get your groceries delivered to your doorstep</div>
                                </div>
                            </label>
                            <label className={`radio-option ${formData.deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="delivery" 
                                    value="pickup"
                                    checked={formData.deliveryMethod === 'pickup'}
                                    onChange={handleDeliveryChange} 
                                />
                                <div className="option-content">
                                    <div className="option-title">Store Pickup</div>
                                    <div className="option-description">Pick up your order from our store</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {formData.deliveryMethod === 'home' && (
                        <div className="form-section">
                            <h2 className="ssection-title">Delivery Address</h2>
                            <div className="form-group">
                                <label className="form-label" htmlFor="street">Street Address *</label>
                                <input 
                                    type="text" 
                                    id="street" 
                                    className="form-input" 
                                    placeholder="Enter your street address"
                                    value={formData.street} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label className="form-label" htmlFor="city">City *</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        className="form-input" 
                                        placeholder="City"
                                        value={formData.city} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label className="form-label" htmlFor="postalCode">Postal Code</label>
                                    <input 
                                        type="text" 
                                        id="postalCode" 
                                        className="form-input" 
                                        placeholder="Postal Code"
                                        value={formData.postalCode} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                            {errors.address && <p style={{color: 'red', fontSize: '0.9rem', marginTop: '0.5rem'}}>{errors.address}</p>}
                        </div>
                    )}
                </form>
            </div>
            
            <CheckoutOrderSummary 
                cart={cart} 
                deliveryMethod={formData.deliveryMethod}
                onPlaceOrder={handleSubmit}
                formData={formData}
                errors={errors}
                isPlacingOrder={isPlacingOrder}
            />

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <div className="success-modal-content">
                            <div className="success-icon">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" fill="#4ade80"></circle>
                                    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"></path>
                                </svg>
                            </div>
                            <h2 className="success-title">Order Placed Successfully!</h2>
                            <p className="success-message">
                                Thank you for your order. Your order ID is <strong>#{orderId}</strong>.
                                We'll process your order shortly and send you a confirmation.
                            </p>
                            <div className="success-actions">
                                <button 
                                    onClick={closeSuccessModal}
                                    className="success-btn"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
};

export default CheckoutPage;