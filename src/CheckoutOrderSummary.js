import React from 'react';

const CheckoutOrderSummary = ({ cart, deliveryMethod, onPlaceOrder, formData, errors }) => {
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

    return (
        <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            {cart.items.map(item => (
                <div className="cart-item" key={item.productId}>
                    <img 
                        src={item.imageUrl || `https://via.placeholder.com/60?text=${(item.name || 'Item').charAt(0)}`} 
                        alt={item.name || 'Item'} 
                        className="item-image" 
                    />
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
                disabled={itemCount === 0 || hasErrors || isFormIncomplete}
                style={{
                    opacity: (itemCount === 0 || hasErrors || isFormIncomplete) ? 0.5 : 1,
                    cursor: (itemCount === 0 || hasErrors || isFormIncomplete) ? 'not-allowed' : 'pointer'
                }}
            >
                Place Order
            </button>
            
            {hasErrors && (
                <p style={{color: 'red', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center'}}>
                    Please fix form errors before placing order
                </p>
            )}
        </div>
    );
};

export default CheckoutOrderSummary;