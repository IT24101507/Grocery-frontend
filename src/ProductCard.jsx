import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from './hooks';
import ProductImage from './ProductImage';

const ProductCard = ({ product, showDiscount = true, onCardClick }) => {
  const { addToCart, addingToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (product.stockQuantity <= 1) {
      alert('This product is out of stock and cannot be added to the cart.');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <div className="product-card" onClick={() => onCardClick(product)}>
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
        <p className="product-quantity">{product.displayQuantity} {product.displayUnit === 'OTHER' ? product.customDisplayUnit : product.displayUnit}</p>
        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">Rs. {product.salePrice}</span>
            {showDiscount && product.price && (
              <span className="original-price" style={{textDecoration: 'line-through'}}>Rs. {product.price}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            disabled={addingToCart || isAdded || product.stockQuantity <= 1} // Disable if out of stock
            title={product.stockQuantity <= 1 ? 'Stock limit exceeded' : 'Add to cart'} 
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
