import React from 'react';
import ProductImage from './ProductImage';


// This component receives the item data and the handler functions from its parent
const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
    // Extract data from API response structure
    const itemName = item.name || 'Unknown Product';
    const itemPrice = item.lineTotal || 0;
    const itemQuantity = item.quantity || 1;
    const priceEach = item.priceEach || 0;
    
    return (
        <div className="cart-item">
            <div className="cart-item-image">
              <ProductImage productId={item.productId} alt={itemName} className="cart-item-image-el" />
            </div>
            
            <div className="cart-item-details">
                <h4>{itemName}</h4>
                <p>Quantity: {itemQuantity}</p>
            </div>

            <div className="quantity-controls">
                <button 
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.productId, Math.max(0, itemQuantity - 1))}
                    disabled={itemQuantity <= 1}
                    style={{
                        opacity: itemQuantity <= 1 ? 0.5 : 1,
                        cursor: itemQuantity <= 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    -
                </button>
                <span className="quantity-display">{itemQuantity}</span>
                <button 
                    className="quantity-btn"
                    onClick={() => {
                        if (itemQuantity >= item.stockQuantity - 1) {
                            alert(`Only ${item.stockQuantity - 1} items are available in stock. You cannot add more at this time.`);
                        } else {
                            onUpdateQuantity(item.productId, itemQuantity + 1);
                        }
                    }}
                    disabled={itemQuantity >= item.stockQuantity - 1}
                    title={itemQuantity >= item.stockQuantity - 1 ? 'Stock limit exceeded' : 'Increase quantity'} // Add tooltip
                >
                    +
                </button>
            </div>

            <span className="cart-item-price">Rs. {itemPrice.toFixed(2)}</span>

            <button 
                className="remove-item-btn" 
                onClick={() => onRemoveItem(item.productId)}
                title="Remove item from cart"
            >
                &times; 
            </button>
        </div>
    );
};

export default CartItem;
