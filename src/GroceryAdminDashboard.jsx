import React, { useState, useEffect } from 'react';
import { productAPI } from './api';
import './GroceryAdminDashboard.css';

const AddProduct = ({ onAdd, onCancel }) => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockUnit, setStockUnit] = useState("");
  const [displayQuantity, setDisplayQuantity] = useState("");
  const [displayUnit, setDisplayUnit] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const unitOptions = ["KG", "G", "ML", "L", "PACKET", "BOTTLE", "CAN", "OTHER"];

  // Clear one field
  const handleClear = (field) => {
    switch (field) {
      case "productName":
        setProductName("");
        break;
      case "category":
        setCategory("");
        break;
      case "price":
        setPrice("");
        break;
      case "stockQuantity":
        setStockQuantity("");
        break;
      case "stockUnit":
        setStockUnit("");
        break;
      case "displayQuantity":
        setDisplayQuantity("");
        break;
      case "displayUnit":
        setDisplayUnit("");
        break;
      case "description":
        setDescription("");
        break;
      case "discount":
        setDiscount("");
        break;
      case "imageFile":
        setImageFile(null);
        setImagePreview(null);
        break;
      default:
        break;
    }
  };

  // Clear all fields
  const handleClearAll = () => {
    setProductName("");
    setCategory("");
    setPrice("");
    setStockQuantity("");
    setStockUnit("");
    setDisplayQuantity("");
    setDisplayUnit("");
    setDescription("");
    setDiscount("");
    setImageFile(null);
    setImagePreview(null);
  };

  // Image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Convert safely → empty → 0
  const safeNumber = (val) => {
    if (val === "" || val === null || isNaN(val)) return 0;
    return Number(val);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("price", safeNumber(price));
    formData.append("stockQuantity", safeNumber(stockQuantity));
    formData.append("stockUnit", stockUnit);
    formData.append("displayQuantity", safeNumber(displayQuantity));
    formData.append("displayUnit", displayUnit);
    formData.append("description", description);
    formData.append("discount", safeNumber(discount));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      await productAPI.addProduct(formData);
      alert("Product added successfully!");
      handleClearAll();
      onAdd();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Server error. Check backend logs.");
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="form-title">
        <span className="form-title-icon">+</span> Add New Product
      </h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        {/* Left column */}
        <div className="form-column">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="white-input"
              required
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("productName")}
            >
              Clear
            </button>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="white-input"
              required
            >
              <option value="">-- Select Category --</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="beverages">Beverages</option>
              <option value="canned food">Canned Food</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="sea food">Sea Food</option>
              <option value="snacks">Snacks & Sweets</option>
            </select>
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("category")}
            >
              Clear
            </button>
          </div>

          <div className="form-group">
            <label>Price (Rs.) *</label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              min="0"
              onChange={(e) => setPrice(e.target.value)}
              className="white-input"
              required
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("price")}
            >
              Clear
            </button>
          </div>

          <div className="form-group stock-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              value={stockQuantity}
              min="0"
              onChange={(e) => setStockQuantity(e.target.value)}
              className="white-input"
            />
            <select
              value={stockUnit}
              onChange={(e) => setStockUnit(e.target.value)}
              className="white-input"
            >
              <option value="">-- Select Unit --</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                handleClear("stockQuantity");
                handleClear("stockUnit");
              }}
            >
              Clear
            </button>
          </div>

          <div className="form-group display-group">
            <label>Display Quantity (For customers)</label>
            <input
              type="number"
              placeholder="Enter display quantity"
              value={displayQuantity}
              min="0"
              onChange={(e) => setDisplayQuantity(e.target.value)}
              className="white-input"
            />
            <select
              value={displayUnit}
              onChange={(e) => setDisplayUnit(e.target.value)}
              className="white-input"
            >
              <option value="">-- Select Unit --</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                handleClear("displayQuantity");
                handleClear("displayUnit");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="form-column right">
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="white-input"
            ></textarea>
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("description")}
            >
              Clear
            </button>
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              placeholder="0"
              value={discount}
              min="0"
              onChange={(e) => setDiscount(e.target.value)}
              className="white-input"
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("discount")}
            >
              Clear
            </button>
          </div>

          <div className="form-group image-upload aligned-left">
            <label className="image-label">Upload Image</label>
            <div className="upload-box">
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="product-image" className="upload-label">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <span className="upload-icon">📷</span>
                )}
              </label>
            </div>
            <button
              type="button"
              className="clear-btn"
              onClick={() => handleClear("imageFile")}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Product
          </button>
          <button
            type="button"
            className="clear-all-btn"
            onClick={handleClearAll}
          >
            Clear All
          </button>
          <button
            type="button"
            className="bbtn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const GroceryAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  useEffect(() => {
    const userNickname = localStorage.getItem('username');
    if (userNickname) {
      setAdminName(userNickname);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const [products, setProducts] = useState([]);

  const [orders] = useState([
    { id: '#ORD-1001', customer: 'John Doe', date: '2025-10-02', total: 45.99, status: 'Delivered' },
    { id: '#ORD-1002', customer: 'Jane Smith', date: '2025-10-02', total: 32.50, status: 'Processing' },
    { id: '#ORD-1003', customer: 'Bob Johnson', date: '2025-10-01', total: 78.20, status: 'Shipped' },
    { id: '#ORD-1004', customer: 'Alice Brown', date: '2025-10-01', total: 55.40, status: 'Delivered' },
    { id: '#ORD-1005', customer: 'Charlie Wilson', date: '2025-09-30', total: 91.15, status: 'Delivered' },
  ]);

  const [paymentSlips] = useState([
    { id: 1, orderId: '#ORD-1002', customer: 'Jane Smith', uploadDate: '2025-10-02 10:30 AM', amount: 32.50, status: 'Pending', imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Payment+Slip' },
    { id: 2, orderId: '#ORD-1003', customer: 'Bob Johnson', uploadDate: '2025-10-01 03:15 PM', amount: 78.20, status: 'Approved', imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Payment+Slip' },
    { id: 3, orderId: '#ORD-1006', customer: 'Emma Davis', uploadDate: '2025-10-02 11:45 AM', amount: 125.80, status: 'Pending', imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Payment+Slip' },
    { id: 4, orderId: '#ORD-1007', customer: 'Michael Brown', uploadDate: '2025-10-01 09:20 AM', amount: 67.30, status: 'Rejected', imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Payment+Slip' },
  ]);

  const handleEditProduct = async () => {
    if (editingProduct) {
      try {
        await productAPI.updateProduct(editingProduct.id, editingProduct);
        setShowEditProduct(false);
        setEditingProduct(null);
        fetchProducts();
      } catch (error) {
        console.error('Failed to edit product:', error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({...product});
    setShowEditProduct(true);
  };

  const viewPaymentSlip = (slip) => {
    setSelectedSlip(slip);
    setShowSlipModal(true);
  };

  const updateSlipStatus = (status) => {
    console.log(`Updated slip ${selectedSlip.id} to ${status}`);
    setShowSlipModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <svg className="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <h1 className="header-title">Welcome, {adminName}!</h1>
              <p className="header-subtitle">
                <span className="status-dot"></span>
                Here's what's happening in your store today.
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="date-container">
              <p className="date-label">Today</p>
              <p className="date-value">Oct 02, 2025</p>
            </div>
            <div className="avatar-circle">
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
          >
            Payment Slips
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {showAddProduct ? (
          <AddProduct 
            onAdd={() => {
              setShowAddProduct(false);
              fetchProducts();
            }}
            onCancel={() => setShowAddProduct(false)}
          />
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-content">
                      <div>
                        <p className="stat-label">Total Products</p>
                        <p className="stat-value">{products.length}</p>
                      </div>
                      <div className="stat-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-content">
                      <div>
                        <p className="stat-label">Total Orders</p>
                        <p className="stat-value">{orders.length}</p>
                      </div>
                      <div className="stat-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-content">
                      <div>
                        <p className="stat-label">Revenue</p>
                        <p className="stat-value">$303.24</p>
                      </div>
                      <div className="stat-icon green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                          <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-content">
                      <div>
                        <p className="stat-label">Low Stock Items</p>
                        <p className="stat-value">{products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length}</p>
                      </div>
                      <div className="stat-icon red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert-section">
                  <h2 className="sssection-title">Stock Alerts</h2>
                  <div className="alert-list">
                    {products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').map(product => (
                      <div key={product.id} className="alert-item">
                        <div>
                          <p className="alert-product-name">{product.name}</p>
                          <p className="alert-category">{product.category}</p>
                        </div>
                        <span className={`badge ${product.status === 'Out of Stock' ? 'red' : 'yellow'}`}>
                          {product.stock} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="content-card">
                <div className="card-header">
                  <div className="header-actions">
                    <h2 className="sssection-title">Product Management</h2>
                    <button onClick={() => setShowAddProduct(true)} className="bbtn-primary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Product
                    </button>
                  </div>
                  <div className="search-bar-container">
                    <div className="search-bar">
                      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input type="text" placeholder="Search products..." className="search-input" />
                    </div>
                    <button className="bbtn-secondary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Filter
                    </button>
                  </div>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="font-medium">{product.name}</td>
                          <td>{product.category}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>{product.stock}</td>
                          <td>
                            <span className={`status-badge ${product.status === 'In Stock' ? 'green' : product.status === 'Low Stock' ? 'yellow' : 'red'}`}>
                              {product.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => openEditModal(product)} className="icon-btn edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="icon-btn delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="content-card">
                <div className="card-header">
                  <h2 className="sssection-title">Order History</h2>
                  <div className="search-bar-container">
                    <div className="search-bar">
                      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input type="text" placeholder="Search orders..." className="search-input" />
                    </div>
                    <button className="btn-secondary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Filter
                    </button>
                  </div>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="font-medium">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.date}</td>
                          <td className="font-medium">${order.total.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${order.status === 'Delivered' ? 'green' : order.status === 'Shipped' ? 'blue' : 'yellow'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment Slips Tab */}
            {activeTab === 'payments' && (
              <div className="content-card">
                <div className="card-header">
                  <h2 className="sssection-title">Payment Slips</h2>
                  <div className="search-bar-container">
                    <div className="search-bar">
                      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input type="text" placeholder="Search payment slips..." className="search-input" />
                    </div>
                    <button className="btn-secondary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Filter
                    </button>
                  </div>
                </div>

                <div className="payment-slips-grid">
                  {paymentSlips.map(slip => (
                    <div key={slip.id} className="payment-slip-card">
                      <div className="slip-image-container">
                        <img 
                          src={slip.imageUrl} 
                          alt="Payment Slip" 
                          className="slip-image"
                          onClick={() => viewPaymentSlip(slip)}
                        />
                        <span className={`status-badge-absolute ${slip.status === 'Approved' ? 'green' : slip.status === 'Rejected' ? 'red' : 'yellow'}`}>
                          {slip.status}
                        </span>
                      </div>
                      <div className="slip-details">
                        <div className="slip-header">
                          <h3 className="slip-order-id">{slip.orderId}</h3>
                          <p className="slip-amount">${slip.amount.toFixed(2)}</p>
                        </div>
                        <p className="slip-customer">{slip.customer}</p>
                        <p className="slip-date">{slip.uploadDate}</p>
                        <button onClick={() => viewPaymentSlip(slip)} className="bbtn-primary full-width">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Product Modal */}
      {showEditProduct && editingProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Edit Product</h3>
              <button onClick={() => setShowEditProduct(false)} className="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditProduct(false)} className="bbtn-secondary full-width-half">
                Cancel
              </button>
              <button onClick={handleEditProduct} className="bbtn-primary full-width-half">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Slip Detail Modal */}
      {showSlipModal && selectedSlip && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3 className="modal-title">Payment Slip Details</h3>
              <button onClick={() => setShowSlipModal(false)} className="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="slip-image-full">
                <img src={selectedSlip.imageUrl} alt="Payment Slip" />
              </div>

              <div className="slip-detail-grid">
                <div className="detail-item">
                  <p className="detail-label">Order ID</p>
                  <p className="detail-value">{selectedSlip.orderId}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Amount</p>
                  <p className="detail-value amount">${selectedSlip.amount.toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Customer</p>
                  <p className="detail-value">{selectedSlip.customer}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Upload Date</p>
                  <p className="detail-value">{selectedSlip.uploadDate}</p>
                </div>
                <div className="detail-item full-width">
                  <p className="detail-label">Status</p>
                  <span className={`status-badge ${selectedSlip.status === 'Approved' ? 'green' : selectedSlip.status === 'Rejected' ? 'red' : 'yellow'}`}>
                    {selectedSlip.status}
                  </span>
                </div>
              </div>

              {selectedSlip.status === 'Pending' && (
                <div className="modal-actions">
                  <button onClick={() => updateSlipStatus('Rejected')} className="btn-danger full-width-half">
                    Reject Payment
                  </button>
                  <button onClick={() => updateSlipStatus('Approved')} className="bbtn-primary full-width-half">
                    Approve Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryAdminDashboard;