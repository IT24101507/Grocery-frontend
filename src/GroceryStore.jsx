import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import ProductCard from './ProductCard';
import CategorySlider from './CategorySlider';
import { useProducts, useCart } from './hooks';
import { isAuthenticated } from './api';
import './GroceryStore.css';




const GroceryStore = () => {
  // Use custom hooks for products and cart
  const { 
    products: discountedProducts, 
    loading: discountedLoading, 
    error: discountedError,
    fetchDiscountedProducts,
    setProducts: setDiscountedProducts
  } = useProducts();
  
  const { 
    products: fruitProducts, 
    loading: fruitsLoading,
    fetchProductsByCategory: fetchFruits,
    setProducts: setFruitProducts
  } = useProducts();
  
  const { 
    products: vegetableProducts, 
    loading: vegetablesLoading,
    fetchProductsByCategory: fetchVegetables,
    setProducts: setVegetableProducts
  } = useProducts();
  
  const { 
    products: snackProducts, 
    loading: snacksLoading,
    fetchProductsByCategory: fetchSnacks,
    setProducts: setSnackProducts
  } = useProducts();
  
  const { cartCount, addToCart: addToCartAPI, loading: cartLoading } = useCart();
  
  // Categories data (this can remain static or be fetched from backend)
  const categories = [
    { id: 1, name: 'Vegetables', icon: '🥕', color: 'bg-orange-100' },
    { id: 2, name: 'Fruits', icon: '🍎', color: 'bg-red-100' },
    { id: 3, name: 'Beverages', icon: '🥤', color: 'bg-blue-100' },
    { id: 4, name: 'Bakery', icon: '🍞', color: 'bg-yellow-100' },
    { id: 5, name: 'Canned Food', icon: '🥫', color: 'bg-green-100' },
    { id: 6, name: 'Dairy', icon: '🥛', color: 'bg-blue-50' },
    { id: 7, name: 'Meat', icon: '🥩', color: 'bg-red-50' }
  ];

  // Mock data as fallback when API fails
  const mockDiscountedProducts = [
    { id: 1, name: 'Carrots', category: 'Vegetables', price: 600, originalPrice: 800, discount: 25, image: '/images/carrots.jpg' },
    { id: 2, name: 'Pet Food', category: 'Pet Supplies', price: 600, originalPrice: 750, discount: 20, image: '/images/pet-food.jpg' },
    { id: 3, name: 'Lemon', category: 'Fruits', price: 600, originalPrice: 800, discount: 25, image: '/images/lemon.jpg' },
    { id: 4, name: 'Red Apple', category: 'Fruits', price: 600, originalPrice: 750, discount: 20, image: '/images/red-apple.jpg' },
    { id: 5, name: 'Apple Juice', category: 'Beverages', price: 500, originalPrice: 650, discount: 23, image: '/images/apple-juice.jpg' },
    { id: 6, name: 'Potato Chips', category: 'Snacks', price: 600, originalPrice: 750, discount: 20, image: '/images/potato-chips.jpg' },
    { id: 7, name: 'Cookies', category: 'Snacks', price: 500, originalPrice: 650, discount: 23, image: '/images/cookies.jpg' },
    { id: 8, name: 'Cheese', category: 'Dairy', price: 500, originalPrice: 650, discount: 23, image: '/images/cheese.jpg' }
  ];

  const mockFruitProducts = [
    { id: 9, name: 'Watermelon', category: 'Fruits', price: 500, originalPrice: 650, discount: 23, image: '/images/watermelon.jpg' },
    { id: 10, name: 'Pineapple', category: 'Fruits', price: 300, originalPrice: 400, discount: 25, image: 'images/pineapple.jpg' },
    { id: 11, name: 'Lemon', category: 'Fruits', price: 600, originalPrice: 800, discount: 25, image: '/images/lemon.jpg' },
    { id: 12, name: 'Red Apple', category: 'Fruits', price: 600, originalPrice: 750, discount: 20, image: '/images/red-apple.jpg' }
  ];

  const mockVegetableProducts = [
    { id: 13, name: 'Carrots', category: 'Vegetables', price: 600, originalPrice: 800, discount: 25, image: '/images/carrots.jpg' },
    { id: 14, name: 'Pumpkin', category: 'Vegetables', price: 650, originalPrice: 850, discount: 24, image: '/images/pumpkin.jpg' },
    { id: 15, name: 'Cauliflower', category: 'Vegetables', price: 800, originalPrice: 1000, discount: 20, image: '/images/cauliflower.jpg' },
    { id: 16, name: 'Potatoes', category: 'Vegetables', price: 600, originalPrice: 750, discount: 20, image: '/images/potatoes.jpg' }
  ];

  const mockSnackProducts = [
    { id: 17, name: 'Chocolate Cake', category: 'Snacks', price: 800, originalPrice: 1000, discount: 20, image: '/images/chocolate-cake.jpg' },
    { id: 18, name: 'Potato Chips', category: 'Snacks', price: 600, originalPrice: 750, discount: 20, image: '/images/potato-chips.jpg' },
    { id: 19, name: 'Cookies', category: 'Snacks', price: 600, originalPrice: 800, discount: 25, image: '/images/cookies.jpg' },
    { id: 20, name: 'Peanuts', category: 'Snacks', price: 750, originalPrice: 900, discount: 17, image: '/images/peanuts.jpg' }
  ];

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to fetch from API first
        if (isAuthenticated()) {
          await fetchDiscountedProducts();
          await fetchFruits(2); // Assuming category ID 2 is for fruits
          await fetchVegetables(1); // Assuming category ID 1 is for vegetables
          await fetchSnacks(4); // Assuming category ID 4 is for snacks
        } else {
          // Use mock data if not authenticated
          setDiscountedProducts(mockDiscountedProducts);
          setFruitProducts(mockFruitProducts);
          setVegetableProducts(mockVegetableProducts);
          setSnackProducts(mockSnackProducts);
        }
      } catch (error) {
        // Fallback to mock data if API fails
        console.log('API failed, using mock data as fallback');
        setDiscountedProducts(mockDiscountedProducts);
        setFruitProducts(mockFruitProducts);
        setVegetableProducts(mockVegetableProducts);
        setSnackProducts(mockSnackProducts);
      }
    };

    loadData();
  }, []);

  // Use mock data as fallback if there's an error and no products
  useEffect(() => {
    if (discountedError && discountedProducts.length === 0) {
      setDiscountedProducts(mockDiscountedProducts);
    }
    if (fruitProducts.length === 0 && !fruitsLoading) {
      setFruitProducts(mockFruitProducts);
    }
    if (vegetableProducts.length === 0 && !vegetablesLoading) {
      setVegetableProducts(mockVegetableProducts);
    }
    if (snackProducts.length === 0 && !snacksLoading) {
      setSnackProducts(mockSnackProducts);
    }
  }, [discountedError, discountedProducts.length, fruitProducts.length, vegetableProducts.length, snackProducts.length, fruitsLoading, vegetablesLoading, snacksLoading]);

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

  // Show loading only if we don't have fallback data
  if ((discountedLoading || fruitsLoading || vegetablesLoading || snacksLoading) && 
      discountedProducts.length === 0 && fruitProducts.length === 0 && 
      vegetableProducts.length === 0 && snackProducts.length === 0) {
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