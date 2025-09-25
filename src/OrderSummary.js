import React from 'react';

// This component just needs the cart data to display totals
const OrderSummary = ({ cart }) => {
    // Handle potential missing data
    const total = cart.totalPrice || 0;
    const itemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    const handleCheckout = () => {
        // Checkout logic here
        alert('Checkout functionality to be implemented');
    };

    return (
        <aside className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
                <span>Items ({itemCount})</span>
                <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
            </div>
            <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={itemCount === 0}
                style={{
                    opacity: itemCount === 0 ? 0.5 : 1,
                    cursor: itemCount === 0 ? 'not-allowed' : 'pointer'
                }}
            >
                Proceed to Checkout
            </button>
        </aside>
    );
};

export default OrderSummary;