import { useState, useEffect } from 'react';
import { productAPI, cartAPI } from './api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getProductsByCategory(categoryId);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.searchProducts(query);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search products');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscountedProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getDiscountedProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch discounted products');
      console.error('Error fetching discounted products:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchAllProducts,
    fetchProductsByCategory,
    searchProducts,
    fetchDiscountedProducts,
    setProducts, // For manual updates
  };
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartAPI.getCart();
      setCartItems(response.data.items || []);
      setCartCount(response.data.totalItems || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      setCartCount(prevCount => prevCount + quantity);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart data
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart item');
      console.error('Error updating cart item:', err);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      await fetchCart(); // Refresh cart data
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clearCart();
      setCartItems([]);
      setCartCount(0);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
      throw err;
    }
  };

  useEffect(() => {
    // Fetch cart when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  return {
    cartItems,
    cartCount,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
};