import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from './hooks';
import ProductImage from './ProductImage';

const ProductCard = ({ product, showDiscount = true }) => {
  const { addToCart, addingToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <div className="product-card">
      {showDiscount && product.discount > 0 && (
        <div className="discount-badge">
          -{product.discount}%
        </div>
      )}
      <div className="product-image">
        <ProductImage productId={product.id} alt={product.name} className="product-card-image" />
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">Rs. {product.price}</span>
            {showDiscount && product.originalPrice && (
              <span className="original-price">Rs. {product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            disabled={addingToCart || isAdded}
          >
            {addingToCart ? (
              'Adding...'
            ) : isAdded ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;