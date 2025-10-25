import { useState, useEffect, useCallback } from 'react';
// The new reviewAPI has been imported.
import { productAPI, cartAPI, reviewAPI } from './api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProducts = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getAllProducts(filters);
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

  const updateCartItem = async (productId, newQuantity) => {
    // Guard against running if the cart isn't loaded yet
    if (!cart) return;

    // 1. Save the current cart state for rollback on failure.
    const originalCart = { ...cart };

    // 2. Create the new, updated items array on the client side.
    const updatedItems = cart.items.map(item => {
      if (item.productId !== productId) return item;

      const unitPrice = (item.priceEach != null && item.priceEach !== '') ? item.priceEach : (item.price || 0);
      const newLineTotal = Number((unitPrice * newQuantity).toFixed(2));

      return { ...item, quantity: newQuantity, lineTotal: newLineTotal, priceEach: unitPrice };
    });

    // Helper to recalculate the total price
    const calculateTotalPrice = (items = []) => {
      return items.reduce((acc, it) => acc + (Number(it.lineTotal || (it.priceEach || it.price || 0) * it.quantity) || 0), 0);
    };

    // 3. Update UI immediately for an instant feel.
    const newTotalPrice = Number(calculateTotalPrice(updatedItems).toFixed(2));
    setCart({ ...cart, items: updatedItems, totalPrice: newTotalPrice });

    // 4. Make the background API call.
    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      // Success: UI is already correct.
    } catch (err) {
      // 5. Failure: Revert UI to the original state and show an error.
      setError(err.response?.data?.message || 'Failed to update cart item');
      setCart(originalCart); // Crucial rollback step.
      console.error('Error updating cart item:', err);
    }
  };

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

// New Feature: useReviews hook for managing product reviews.
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviewsByCustomer = useCallback(async (customerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewAPI.getReviewsByCustomer(customerId);
      setReviews(response.data);
      return response.data; // Return the fetched data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
      return []; // Return an empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewAPI.getAllReviews();
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all reviews');
      console.error('Error fetching all reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsByProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewAPI.getReviewsByProduct(productId);
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product reviews');
      console.error('Error fetching product reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = async (reviewData) => {
    try {
      const response = await reviewAPI.submitReview(reviewData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
      console.error('Error submitting review:', err);
      throw err;
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, reviewData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
      console.error('Error updating review:', err);
      throw err;
    }
  };

  const deleteReview = async (reviewId, customerId) => {
    try {
      const response = await reviewAPI.deleteReview(reviewId, customerId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
      console.error('Error deleting review:', err);
      throw err;
    }
  };

  return {
    reviews,
    loading,
    error,
    fetchReviewsByCustomer,
    fetchReviewsByProduct,
    fetchAllReviews,
    submitReview,
    updateReview,
    deleteReview,
    setReviews,
  };
};
