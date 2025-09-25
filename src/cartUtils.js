// Get authentication info from localStorage
export const getAuthInfo = () => {
    // TEMPORARY FIX: The JWT token is actually stored in 'username' field due to backend response mapping
    const token = localStorage.getItem('username'); // This contains the actual JWT
    const actualUsername = localStorage.getItem('userRole'); // This contains the actual email/username
    return { token, username: actualUsername };
};

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
    const { token } = getAuthInfo();
    
    if (!token) {
        // Redirect to login or show login modal
        window.location.href = '/login';
        return { success: false, error: 'Authentication required' };
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/add?userId=1`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
            return { success: false, error: 'Authentication failed' };
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, error: errorData.message || 'Failed to add to cart' };
        }

        return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error: 'Network error occurred' };
    }
};

// Get cart count for display in header
export const getCartCount = async () => {
    const { token } = getAuthInfo();
    
    if (!token) {
        return 0;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart?userId=1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return 0;
        }

        const cart = await response.json();
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