import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get user info from localStorage
    const getUserInfo = () => {
        // TEMPORARY FIX: The JWT token is actually stored in 'username' field due to backend response mapping
        const token = localStorage.getItem('username'); // This contains the actual JWT
        const actualUsername = localStorage.getItem('userRole'); // This contains the actual email/username
        const userRole = localStorage.getItem('token'); // This contains the actual role
        
        console.log('Debug - Retrieved values:');
        console.log('Token (from username field):', token);
        console.log('Actual username (from userRole field):', actualUsername);
        console.log('User role (from token field):', userRole);
        
        return { token, username: actualUsername };
    };

    // Function to fetch the cart data from the backend
    const fetchCart = () => {
        const { token, username } = getUserInfo();
        
        console.log('Token from localStorage:', token ? `Token exists: ${token.substring(0, 20)}...` : 'No token found');
        console.log('Token full value:', token);
        console.log('Token type:', typeof token);
        console.log('Token length:', token ? token.length : 0);
        console.log('Username from localStorage:', username);
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8080/api/cart?userId=1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    return Promise.reject("Authentication failed");
                }
                return response.ok ? response.json() : Promise.reject("Failed to fetch cart");
            })
            .then(data => setCart(data))
            .catch(err => setError(err.toString()))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Function to handle quantity updates
    const handleUpdateQuantity = (productId, newQuantity) => {
        const { token } = getUserInfo();
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (newQuantity <= 0) {
            handleRemoveItem(productId);
            return;
        }

        fetch(`http://localhost:8080/api/cart/update?userId=1&productId=${productId}&quantity=${newQuantity}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        })
        .then(response => {
            if (response.status === 401) {
                localStorage.clear();
                navigate('/login');
                return Promise.reject("Authentication failed");
            }
            if (!response.ok) {
                return Promise.reject('Failed to update item quantity');
            }
            fetchCart(); 
        })
        .catch(error => {
            console.error('Error updating quantity:', error);
            alert(`Could not update cart: ${error}`);
        });
    };
    
    // Function to handle item removal
    const handleRemoveItem = (productId) => {
        const { token } = getUserInfo();
        
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8080/api/cart/remove?userId=1&productId=${productId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        })
        .then(response => {
            if (response.status === 401) {
                localStorage.clear();
                navigate('/login');
                return Promise.reject("Authentication failed");
            }
            if (!response.ok) {
                return Promise.reject('Failed to remove item');
            }
            fetchCart(); 
        })
        .catch(error => {
            console.error('Error removing item:', error);
            alert(`Could not remove item: ${error}`);
        });
    };

    // Function to clear entire cart
    const handleClearCart = () => {
        const { token } = getUserInfo();
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            fetch(`http://localhost:8080/api/cart/clear?userId=1`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            .then(response => {
                if (response.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    return Promise.reject("Authentication failed");
                }
                if (!response.ok) {
                    return Promise.reject('Failed to clear cart');
                }
                fetchCart(); 
            })
            .catch(error => {
                console.error('Error clearing cart:', error);
                alert(`Could not clear cart: ${error}`);
            });
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: '2rem'}}>Loading your cart...</div>;
    if (error) return <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>Error: {error}</div>;
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page" style={{textAlign: 'center', padding: '2rem'}}>
                <h2>Your Shopping Cart is Empty</h2>
                <p>Start shopping to add items to your cart!</p>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <main className="cart-items-container">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                    <h2>Shopping Cart</h2>
                    <button 
                        onClick={handleClearCart}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Clear Cart
                    </button>
                </div>
                {cart.items.map(item => (
                    <CartItem 
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                    />
                ))}
            </main>
            <OrderSummary cart={cart} />
        </div>
    );
};

export default CartPage;