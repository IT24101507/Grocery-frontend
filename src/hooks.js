import { useState, useEffect, useCallback } from 'react';
import { productAPI, cartAPI } from './api';

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

    // 1. Save the current cart state. We need this to revert if the API call fails.
    const originalCart = { ...cart };

    // 2. Create the new, updated items array on the client side.
    const updatedItems = cart.items.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    
    // A helper function to recalculate the total
    const calculateTotal = (items = []) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    // 3. Update the UI *immediately* with this new state. This feels instant to the user.
    setCart({ ...cart, items: updatedItems, total: calculateTotal(updatedItems) });

    // 4. In the background, make the real API call.
    try {
        await cartAPI.updateCartItem(productId, newQuantity);
        // If the call succeeds, we do nothing. The UI is already correct.
    } catch (err) {
        // 5. If the call fails, revert the UI back to the original state and show an error.
        setError(err.response?.data?.message || 'Failed to update cart item');
        setCart(originalCart); // This is the crucial rollback step.
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