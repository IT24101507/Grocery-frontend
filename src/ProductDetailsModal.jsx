import React from 'react';
import ProductImage from './ProductImage';
import { useCart } from './hooks'; 
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
  
  const { addToCart, addingToCart } = useCart(); 

  if (!product) return null;

  
  const handleAddToCart = async () => {
    if (addingToCart) return; // Prevent clicks while already adding

    try {
      await addToCart(product.id, 1);
      onClose(); // Close modal only after adding to cart successfully
    } catch (error) {
      console.error("Failed to add item from modal:", error);
      // Optionally, show an error message to the user here
      alert("Could not add item to cart. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="modal-image">
            <ProductImage productId={product.id} alt={product.name} />
          </div>
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <div className="price-details">
              <span className="original-price">Rs. {product.originalPrice}</span>
              <span className="ddiscount">-{product.discount}%</span>
              <span className="sale-price">Rs. {product.salePrice}</span>
            </div>
            <div className="stock-details">
              <p>Stock Level: {product.stockQuantity - 1}</p>
            </div>
            <button 
              className="add-to-cart-btn-modal" 
              onClick={handleAddToCart}
              disabled={addingToCart || product.stockQuantity <= 1}
            >
              {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;