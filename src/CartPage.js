import React, { useEffect } from 'react';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from './hooks'; // Import the useCart hook
import LoadingAnimation from './LoadingAnimation'; // Import LoadingAnimation

const CartPage = () => {
    const {
        cart,
        loading,
        error,
        fetchCart,
        updateCartItem,
        removeFromCart,
        clearCart,
    } = useCart(); // Use the hook
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchCart();
        }
    }, [navigate, fetchCart]);

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartItem(productId, newQuantity);
        }
    };

    if (loading) return <LoadingAnimation />;
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
                        onClick={() => clearCart()}
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
                        onRemoveItem={removeFromCart} // Pass the function directly
                    />
                ))}
            </main>
            <OrderSummary cart={cart} />
        </div>
    );
};

export default CartPage;
