import { useState, useEffect, useCallback } from 'react';
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
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchCart = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartAPI.getCart(userId);
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for fetchCart

  const addToCart = useCallback(async (productId, quantity = 1, userId) => {
    setAddingToCart(true);
    try {
      const response = await cartAPI.addToCart(productId, quantity, userId);
      await fetchCart(userId); // Refresh cart
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setAddingToCart(false);
    }
  }, [fetchCart]);

  const updateCartItem = useCallback(async (productId, quantity, userId) => {
    try {
      const response = await cartAPI.updateCartItem(productId, quantity, userId);
      await fetchCart(userId); // Refresh cart
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart item');
      console.error('Error updating cart item:', err);
      throw err;
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (productId, userId) => {
    try {
      const response = await cartAPI.removeFromCart(productId, userId);
      await fetchCart(userId); // Refresh cart
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      console.error('Error removing from cart:', err);
      throw err;
    }
  }, [fetchCart]);

  const clearCart = useCallback(async (userId) => {
    try {
      const response = await cartAPI.clearCart(userId);
      setCart(null); // Clear local cart state
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
      throw err;
    }
  }, [fetchCart]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      fetchCart(userId);
    }
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addingToCart,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
};