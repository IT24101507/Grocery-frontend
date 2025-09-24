import React, { useState } from 'react';

// You can keep specific icons if they are only used on this page
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// Import child components used on this page
import ProductCard from './ProductCard'; // Adjust path as needed
import CategorySlider from './CategorySlider'; // Adjust path as needed

// Import the page-specific CSS
import './GroceryStore.css';

// --- IMPORTANT CHANGES ---
// 1. Removed the <header> and <footer> JSX. They now live in MainLayout.jsx.
// 2. Removed `useNavigate` and `handleProfileClick`. Navigation is handled by <Link> tags in the shared Header.jsx.
// 3. Removed imports for icons (ShoppingCart, Search, User) that were moved to Header.jsx.

const GroceryStore = () => {
  const [cartItems, setCartItems] = useState(0);

  // Mock data - replace with your Spring backend API calls
  const categories = [
    { id: 1, name: 'Vegetables', icon: '🥕', color: 'bg-orange-100' },
    { id: 2, name: 'Fruits', icon: '🍎', color: 'bg-red-100' },
    { id: 3, name: 'Beverages', icon: '🥤', color: 'bg-blue-100' },
    { id: 4, name: 'Bakery', icon: '🍞', color: 'bg-yellow-100' },
    { id: 5, name: 'Canned Food', icon: '🥫', color: 'bg-green-100' },
    { id: 6, name: 'Dairy', icon: '🥛', color: 'bg-blue-50' },
    { id: 7, name: 'Meat', icon: '🥩', color: 'bg-red-50' }
  ];

  const discountedProducts = [
    { id: 1, name: 'Carrots', category: 'Vegetables', price: 600, originalPrice: 800, discount: 25, image: '/images/carrots.jpg' },
    { id: 2, name: 'Pet Food', category: 'Pet Supplies', price: 600, originalPrice: 750, discount: 20, image: '/images/pet-food.jpg' },
    { id: 3, name: 'Lemon', category: 'Fruits', price: 600, originalPrice: 800, discount: 25, image: '/images/lemon.jpg' },
    { id: 4, name: 'Red Apple', category: 'Fruits', price: 600, originalPrice: 750, discount: 20, image: '/images/red-apple.jpg' },
    { id: 5, name: 'Apple Juice', category: 'Beverages', price: 500, originalPrice: 650, discount: 23, image: '/images/apple-juice.jpg' },
    { id: 6, name: 'Potato Chips', category: 'Snacks', price: 600, originalPrice: 750, discount: 20, image: '/images/potato-chips.jpg' },
    { id: 7, name: 'Cookies', category: 'Snacks', price: 500, originalPrice: 650, discount: 23, image: '/images/cookies.jpg' },
    { id: 8, name: 'Cheese', category: 'Dairy', price: 500, originalPrice: 650, discount: 23, image: '/images/cheese.jpg' }
  ];

  const fruitProducts = [
    { id: 9, name: 'Watermelon', category: 'Fruits', price: 500, originalPrice: 650, discount: 23, image: '/images/watermelon.jpg' },
    { id: 10, name: 'Pineapple', category: 'Fruits', price: 300, originalPrice: 400, discount: 25, image: 'images/pineapple.jpg' },
    { id: 11, name: 'Lemon', category: 'Fruits', price: 600, originalPrice: 800, discount: 25, image: '/images/lemon.jpg' },
    { id: 12, name: 'Red Apple', category: 'Fruits', price: 600, originalPrice: 750, discount: 20, image: '/images/red-apple.jpg' }
  ];

  const vegetableProducts = [
    { id: 13, name: 'Carrots', category: 'Vegetables', price: 600, originalPrice: 800, discount: 25, image: '/images/carrots.jpg' },
    { id: 14, name: 'Pumpkin', category: 'Vegetables', price: 650, originalPrice: 850, discount: 24, image: '/images/pumpkin.jpg' },
    { id: 15, name: 'Cauliflower', category: 'Vegetables', price: 800, originalPrice: 1000, discount: 20, image: '/images/cauliflower.jpg' },
    { id: 16, name: 'Potatoes', category: 'Vegetables', price: 600, originalPrice: 750, discount: 20, image: '/images/potatoes.jpg' }
  ];

  const snackProducts = [
    { id: 17, name: 'Chocolate Cake', category: 'Snacks', price: 800, originalPrice: 1000, discount: 20, image: '/images/chocolate-cake.jpg' },
    { id: 18, name: 'Potato Chips', category: 'Snacks', price: 600, originalPrice: 750, discount: 20, image: '/images/potato-chips.jpg' },
    { id: 19, name: 'Cookies', category: 'Snacks', price: 600, originalPrice: 800, discount: 25, image: '/images/cookies.jpg' },
    { id: 20, name: 'Peanuts', category: 'Snacks', price: 750, originalPrice: 900, discount: 17, image: '/images/peanuts.jpg' }
  ];

  const addToCart = (product) => {
    setCartItems(prev => prev + 1);
    // TODO: Integrate with your Spring backend
    console.log('Added to cart:', product);
  };

  return (
    // We use a React Fragment <>...</> here because the main div container is no longer needed.
    // The Header and Footer are now handled by MainLayout.jsx
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
                <button className="btn-primary">Shop Now</button>
                <button className="btn-secondary">View all products</button>
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
            <button className="see-all-btn">See All</button>
          </div>
          <div className="products-grid">
            {discountedProducts.map((product) => (
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
              <button className="see-all-btn">See All</button>
            </div>
            <div className="products-grid">
              {fruitProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Vegetables */}
          <div className="category-section">
            <div className="section-header">
              <h3 className="category-title">Vegetables</h3>
              <button className="see-all-btn">See All</button>
            </div>
            <div className="products-grid">
              {vegetableProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Snacks */}
          <div className="category-section">
            <div className="section-header">
              <h3 className="category-title">Snacks</h3>
              <button className="see-all-btn">See All</button>
            </div>
            <div className="products-grid">
              {snackProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroceryStore;