import React from 'react';
import ProductImage from './ProductImage';

const CheckoutOrderSummary = ({ cart, deliveryMethod, onPlaceOrder, formData, errors, isPlacingOrder }) => {
    if (!cart) return null;

    const deliveryFee = deliveryMethod === 'home' ? 200.00 : 0;
    const subtotal = cart.totalPrice || 0;
    const total = subtotal + deliveryFee;
    const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    const handlePlaceOrder = () => {
        const syntheticEvent = {
            preventDefault: () => {},
            target: {}
        };
        onPlaceOrder(syntheticEvent);
    };

    const hasErrors = Object.keys(errors || {}).length > 0;
    const isFormIncomplete = !formData?.customerName || !formData?.mobileNumber || 
                            (deliveryMethod === 'home' && (!formData?.street || !formData?.city));
    
    // --- UPDATE: Combine all disabled conditions, including the new loading state ---
    const isButtonDisabled = itemCount === 0 || hasErrors || isFormIncomplete || isPlacingOrder;

    return (
        <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            {cart.items.map(item => (
                <div className="cart-item" key={item.productId}>
                    <div className="item-image">
                      <ProductImage productId={item.productId} alt={item.name || 'Item'} className="checkout-item-image" />
                    </div>
                    <div className="item-info">
                        <div className="item-name">{item.name || 'Unknown Item'}</div>
                    </div>
                    <span className="item-quantity">×{item.quantity}</span>
                    <span className="item-price">Rs. {(item.lineTotal || 0).toFixed(2)}</span>
                </div>
            ))}

            <div className="summary-row">
                <span>Items ({itemCount})</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            
            {deliveryFee > 0 && (
                <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span id="delivery-fee">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
            )}
            
            <div className="summary-row total">
                <span>Total</span>
                <span id="total-amount">Rs. {total.toFixed(2)}</span>
            </div>
            
            <button 
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isButtonDisabled}
                style={{
                    opacity: isButtonDisabled ? 0.6 : 1,
                    cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
                }}
            >
                {/* --- UPDATE: Change button text based on loading state --- */}
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
            
            {hasErrors && !isPlacingOrder && (
                <p style={{color: 'red', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center'}}>
                    Please fix form errors before placing order
                </p>
            )}
        </div>
    );
};

export default CheckoutOrderSummary;