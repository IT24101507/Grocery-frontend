import React, { useState, useEffect } from 'react';
import { userAPI } from './api';
import ProductImage from './ProductImage';

const OrderItem = ({ order }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ margin: 0 }}>Order ID: {order.id}</h4>
          <p style={{ margin: 0, color: '#666' }}>{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Total: Rs. {order.totalAmount.toFixed(2)}</p>
          <p style={{ margin: 0, color: '#666' }}>Status: {order.status}</p>
        </div>
      </div>
      <div>
        {order.items.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: '60px', height: '60px', marginRight: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
              <ProductImage productId={item.productId} alt={item.productName} />
            </div>
            <div>
              <p style={{ margin: 0 }}>{item.productName}</p>
              <p style={{ margin: 0, color: '#666' }}>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userAPI.getOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Your Orders</h3>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map(order => <OrderItem key={order.id} order={order} />)
      )}
    </div>
  );
};

export default OrderHistory;