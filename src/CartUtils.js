import { cartAPI } from './api';

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
    try {
        await cartAPI.addToCart(productId, quantity);
        return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    }
};

// Get cart count for display in header
export const getCartCount = async () => {
    try {
        const response = await cartAPI.getCart();
        const cart = response.data;
        return cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    } catch (error) {
        console.error('Error fetching cart count:', error);
        return 0;
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};