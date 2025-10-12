import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth'; 
import LoadingAnimation from './LoadingAnimation'; 
import './OrderHistory.css';      

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Destructure both user and token from your authentication context
    const { user, token } = useAuth();

    useEffect(() => {
        // If the user or token is not available, don't attempt to fetch orders.
        if (!user || !token) {
            setLoading(false);
            setError('You must be logged in to view your order history.');
            return;
        }

        const fetchOrders = async () => {
            try {
                // Configure the request headers to include the JWT for authorization
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Make the authenticated GET request to your backend endpoint
                const response = await axios.get(`http://localhost:8082/api/orders/customer/${user.id}`, config);
                
                setOrders(response.data);
            } catch (err) {
                // Log the detailed error for debugging purposes
                console.error("Error fetching orders:", err.response ? err.response.data : err.message);
                setError('Failed to fetch your orders. Please try again later.');
            } finally {
        
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, token]); // The effect runs when user or token changes

    // --- Render Logic ---

    
    if (loading) {
        return <LoadingAnimation />;
    }

    // 2. Show an error message if the API call failed
    if (error) {
        return <div className="order-history-status error">{error}</div>;
    }

    // 3. Render the order history table
    return (
        <div className="order-history-container">
            <h2>Your Order History</h2>
            {orders.length === 0 ? (
                <p>You have not placed any orders yet.</p>
            ) : (
                <table className="order-history-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>Rs. {order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                                <td className={`order-status status-${order.status ? order.status.toLowerCase() : 'unknown'}`}>
                                    {order.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
