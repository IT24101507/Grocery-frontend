<<<<<<< Updated upstream
import React from 'react';
import { ShoppingCart } from 'lucide-react';


const ProductCard = ({ product, onAddToCart, showDiscount = true }) => {
  return (
    <div className="product-card">
      {showDiscount && (
        <div className="discount-badge">
          -{product.discount}%
        </div>
      )}
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
        />
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
            onClick={() => onAddToCart(product)}
            className="add-to-cart-btn"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

=======
import React from 'react';
import { ShoppingCart } from 'lucide-react';


const ProductCard = ({ product, onAddToCart, showDiscount = true }) => {
  return (
    <div className="product-card">
      {showDiscount && (
        <div className="discount-badge">
          -{product.discount}%
        </div>
      )}
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
        />
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
            onClick={() => onAddToCart(product)}
            className="add-to-cart-btn"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

>>>>>>> Stashed changes
export default ProductCard;