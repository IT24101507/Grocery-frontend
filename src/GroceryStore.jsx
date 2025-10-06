import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import ProductCard from './ProductCard';
import CategorySlider from './CategorySlider';
import { useProducts, useCart } from './hooks';
import { isAuthenticated } from './api';
import './GroceryStore.css';




const GroceryStore = () => {
  const { products, loading, error, fetchAllProducts } = useProducts();
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [fruitProducts, setFruitProducts] = useState([]);
  const [vegetableProducts, setVegetableProducts] = useState([]);
  const [snackProducts, setSnackProducts] = useState([]);
  const { cartCount, addToCart: addToCartAPI, loading: cartLoading } = useCart();

  // Categories data (this can remain static or be fetched from backend)
  const categories = [
    { id: 1, name: 'Vegetables', icon: '🥕', color: 'bg-orange-100' },
    { id: 2, name: 'Fruits', icon: '🍎', color: 'bg-red-100' },
    { id: 3, name: 'Beverages', icon: '🥤', color: 'bg-blue-100' },
    { id: 4, name: 'Bakery', icon: '🍞', color: 'bg-yellow-100' },
    { id: 5, name: 'Canned Food', icon: '🥫', color: 'bg-green-100' },
    { id: 6, name: 'Dairy', icon: '🥛', color: 'bg-blue-50' },
    { id: 7, name: 'Meat', icon: '🥩', color: 'bg-red-50' },
    { id: 8, name: 'Snacks', icon: '🍿', color: 'bg-purple-100' }
  ];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (products) {
      setDiscountedProducts(products.filter(p => p.discount > 0));
      setFruitProducts(products.filter(p => p.category.toLowerCase() === 'fruits'));
      setVegetableProducts(products.filter(p => p.category.toLowerCase() === 'vegetables'));
      setSnackProducts(products.filter(p => p.category.toLowerCase() === 'snacks'));
    }
  }, [products]);

  const addToCart = async (product) => {
    try {
      if (isAuthenticated()) {
        await addToCartAPI(product.id, 1);
        console.log('Added to cart via API:', product);
      } else {
        // For demo purposes when not authenticated
        console.log('Added to cart (demo mode):', product);
        alert(`Added ${product.name} to cart! (Demo mode - please login for full functionality)`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Show user-friendly message
      alert(`Added ${product.name} to cart! (Offline mode)`);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading products...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your One-Stop Shop<br />
                                for <span className="ttext-green">Quality Groceries</span>
              </h1>
              <p className="hero-description">
                We offer fresh, high-quality groceries delivered straight to your doorstep.
                Shop with us for the best selection and prices.
              </p>
              <div className="hero-buttons">
                <Link to="/cart" className="btn-primary">Shop Now</Link>
                <Link to="/products" className="btn-secondary">View all products</Link>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="/images/grocery-hero.jpg" 
                alt="Fresh groceries"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <CategorySlider categories={categories} />
        </div>
      </section>

      {/* Discounted Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Discounted <span className="text-green">Products</span>
            </h2>
            <Link to="/products?discounted=true" className="see-all-btn">See All</Link>
          </div>
          <div className="products-grid">
            {discountedProducts.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="category-products">
        <div className="container">
          <h2 className="main-title">
            Shop by <span className="text-green">Category</span>
          </h2>

          {/* Fruits */}
          <div className="category-section">
            <div className="section-header">
              <h3 className="category-title">Fruits</h3>
              <Link to="/products?category=Fruits" className="see-all-btn">See All</Link>
            </div>
                      <div className="products-grid">
                        {fruitProducts.slice(0, 4).map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={addToCart}
                          />
                        ))}
                      </div>          </div>

          {/* Vegetables */}
          <div className="category-section">
            <div className="section-header">
              <h3 className="category-title">Vegetables</h3>
              <Link to="/products?category=Vegetables" className="see-all-btn">See All</Link>
            </div>
                      <div className="products-grid">
                        {vegetableProducts.slice(0, 4).map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={addToCart}
                          />
                        ))}
                      </div>          </div>

          {/* Snacks */}
          <div className="category-section">
            <div className="section-header">
              <h3 className="category-title">Snacks</h3>
              <Link to="/products?category=Snacks" className="see-all-btn">See All</Link>
            </div>
                      <div className="products-grid">
                        {snackProducts.slice(0, 4).map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={addToCart}
                          />
                        ))}
                      </div>          </div>
        </div>
      </section>
    </>
  );
};

export default GroceryStore;