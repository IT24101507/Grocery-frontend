import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI, reviewAPI } from './api';
import LoadingAnimation from './LoadingAnimation';
import './GroceryAdminDashboard.css';

const getCorrectImagePath = (path) => {
    if (!path) {
        return '';
    }
    return path;
};

const AddProduct = ({ onAdd, onCancel }) => {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [stockUnit, setStockUnit] = useState("");
    const [customStockUnit, setCustomStockUnit] = useState("");
    const [displayQuantity, setDisplayQuantity] = useState("");
    const [displayUnit, setDisplayUnit] = useState("");
    const [customDisplayUnit, setCustomDisplayUnit] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const unitOptions = ["KG", "G", "ML", "L", "PACKET", "BOTTLE", "CAN", "OTHER"];

    const handleClear = (field) => {
        switch (field) {
            case "productName": setProductName(""); break;
            case "category": setCategory(""); break;
            case "price": setPrice(""); break;
            case "stockQuantity": setStockQuantity(""); break;
            case "stockUnit": setStockUnit(""); setCustomStockUnit(""); break;
            case "displayQuantity": setDisplayQuantity(""); break;
            case "displayUnit": setDisplayUnit(""); setCustomDisplayUnit(""); break;
            case "description": setDescription(""); break;
            case "discount": setDiscount(""); break;
            case "imageFile": setImageFile(null); setImagePreview(null); break;
            default: break;
        }
    };

    const handleClearAll = () => {
        setProductName(""); setCategory(""); setPrice(""); setStockQuantity("");
        setStockUnit(""); setCustomStockUnit(""); setDisplayQuantity("");
        setDisplayUnit(""); setCustomDisplayUnit(""); setDescription("");
        setDiscount(""); setImageFile(null); setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const safeNumber = (val) => (val === "" || val === null || isNaN(val)) ? 0 : Number(val);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("category", category);
        formData.append("originalPrice", safeNumber(price));
        formData.append("stockQuantity", safeNumber(stockQuantity));
        formData.append("displayQuantity", safeNumber(displayQuantity));
        formData.append("description", description);
        formData.append("discount", safeNumber(discount));

        if (stockUnit === "OTHER") {
            formData.append("stockUnit", "OTHER");
            formData.append("customStockUnit", customStockUnit);
        } else {
            formData.append("stockUnit", stockUnit);
        }

        if (displayUnit === "OTHER") {
            formData.append("displayUnit", "OTHER");
            formData.append("customDisplayUnit", customDisplayUnit);
        } else {
            formData.append("displayUnit", displayUnit);
        }

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
                <div className="form-column">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text" placeholder="Enter product name" value={productName} onChange={(e) => setProductName(e.target.value)} className="white-input" required />
                        <button type="button" className="clear-btn" onClick={() => handleClear("productName")}>Clear</button>
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="white-input" required>
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
                        <button type="button" className="clear-btn" onClick={() => handleClear("category")}>Clear</button>
                    </div>
                    <div className="form-group">
                        <label>Price (Rs.) *</label>
                        <input type="number" placeholder="Enter price" value={price} min="0" onChange={(e) => setPrice(e.target.value)} className="white-input" required />
                        <button type="button" className="clear-btn" onClick={() => handleClear("price")}>Clear</button>
                    </div>
                    <div className="form-group stock-group">
                        <label>Stock Quantity</label>
                        <input type="number" placeholder="Enter stock quantity" value={stockQuantity} min="0" onChange={(e) => setStockQuantity(e.target.value)} className="white-input" />
                        <select value={stockUnit} onChange={(e) => setStockUnit(e.target.value)} className="white-input">
                            <option value="">-- Select Unit --</option>
                            {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                        {stockUnit === "OTHER" && <input type="text" placeholder="Enter custom unit" value={customStockUnit} onChange={(e) => setCustomStockUnit(e.target.value)} className="white-input" />}
                        <button type="button" className="clear-btn" onClick={() => { handleClear("stockQuantity"); handleClear("stockUnit"); }}>Clear</button>
                    </div>
                    <div className="form-group display-group">
                        <label>Display Quantity (For customers)</label>
                        <input type="number" placeholder="Enter display quantity" value={displayQuantity} min="0" onChange={(e) => setDisplayQuantity(e.target.value)} className="white-input" />
                        <select value={displayUnit} onChange={(e) => setDisplayUnit(e.target.value)} className="white-input">
                            <option value="">-- Select Unit --</option>
                            {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                        {displayUnit === "OTHER" && <input type="text" placeholder="Enter custom unit" value={customDisplayUnit} onChange={(e) => setCustomDisplayUnit(e.target.value)} className="white-input" />}
                        <button type="button" className="clear-btn" onClick={() => { handleClear("displayQuantity"); handleClear("displayUnit"); }}>Clear</button>
                    </div>
                </div>
                <div className="form-column right">
                    <div className="form-group">
                        <label>Description</label>
                        <textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} className="white-input"></textarea>
                        <button type="button" className="clear-btn" onClick={() => handleClear("description")}>Clear</button>
                    </div>
                    <div className="form-group">
                        <label>Discount (%)</label>
                        <input type="number" placeholder="0" value={discount} min="0" onChange={(e) => setDiscount(e.target.value)} className="white-input" />
                        <button type="button" className="clear-btn" onClick={() => handleClear("discount")}>Clear</button>
                    </div>
                    <div className="form-group image-upload aligned-left">
                        <label className="image-label">Upload Image</label>
                        <div className="upload-box">
                            <input id="product-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                            <label htmlFor="product-image" className="upload-label">
                                {imagePreview ? <img src={imagePreview} alt="Preview" className="image-preview" /> : <span className="upload-icon">📷</span>}
                            </label>
                        </div>
                        <button type="button" className="clear-btn" onClick={() => handleClear("imageFile")}>Clear</button>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Product</button>
                    <button type="button" className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
                    <button type="button" className="bbtn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const GroceryAdminDashboard = () => {
    const unitOptions = ["KG", "G", "ML", "L", "PACKET", "BOTTLE", "CAN", "OTHER"];
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [adminName, setAdminName] = useState('Admin');
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [showSlipModal, setShowSlipModal] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [paymentSlipSearch, setPaymentSlipSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // New State for Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewSearch, setReviewSearch] = useState('');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [replyText, setReplyText] = useState("");

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [paymentSlips, setPaymentSlips] = useState([]);

    useEffect(() => {
        const userNickname = localStorage.getItem('username');
        if (userNickname) {
            setAdminName(userNickname);
        }
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchOrders(), fetchPaymentSlips(), fetchReviews()]);
            setLoading(false);
        };
        fetchData();

        const handleOrderPlaced = () => {
            fetchOrders();
            fetchPaymentSlips();
        };

        window.addEventListener('order-placed', handleOrderPlaced);
        return () => {
            window.removeEventListener('order-placed', handleOrderPlaced);
        };
    }, []);

    const fetchPaymentSlips = async () => {
        try {
            const response = await orderAPI.getOrdersWithTransferSlips();
            setPaymentSlips(response.data);
        } catch (error) {
            console.error('Failed to fetch payment slips:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await productAPI.getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewAPI.getAllReviews();
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const handleDeleteReview = async (reviewId, customerId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await reviewAPI.deleteReview(reviewId, customerId);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Server error. Check backend logs.");
        }
    };

    const openReplyModal = (review) => {
        setCurrentReview(review);
        setReplyText(review.adminReply || "");
        setShowReplyModal(true);
    };

    const handleSubmitReply = async () => {
        if (!currentReview || !currentReview.id) {
            alert("Invalid review selected");
            return;
        }
        try {
            await reviewAPI.replyToReview(currentReview.id, { reply: replyText });
            setReviews(reviews.map(r => r.id === currentReview.id ? { ...r, adminReply: replyText } : r));
            setShowReplyModal(false);
            setCurrentReview(null);
            setReplyText("");
        } catch (error) {
            console.error("Failed to reply to review:", error);
            alert("Server error. Check backend logs.");
        }
    };

    const handleEditProduct = async () => {
        if (editingProduct) {
            try {
                const formData = new FormData();
                formData.append("name", editingProduct.name);
                formData.append("category", editingProduct.category);
                formData.append("originalPrice", editingProduct.originalPrice);
                formData.append("discount", editingProduct.discount);
                formData.append("stockQuantity", editingProduct.stockQuantity);
                formData.append("displayQuantity", editingProduct.displayQuantity);
                formData.append("description", editingProduct.description);

                if (editingProduct.stockUnit === "OTHER") {
                    formData.append("stockUnit", "OTHER");
                    formData.append("customStockUnit", editingProduct.customStockUnit);
                } else {
                    formData.append("stockUnit", editingProduct.stockUnit);
                }

                if (editingProduct.displayUnit === "OTHER") {
                    formData.append("displayUnit", "OTHER");
                    formData.append("customDisplayUnit", editingProduct.customDisplayUnit);
                } else {
                    formData.append("displayUnit", editingProduct.displayUnit);
                }

                await productAPI.updateProduct(editingProduct.id, formData);
                setShowEditProduct(false);
                setEditingProduct(null);
                fetchProducts();
            } catch (error) {
                console.error('Failed to edit product:', error);
            }
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await orderAPI.updateOrderStatus(orderId, status);
            fetchOrders();
            fetchPaymentSlips();
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const updateSlipStatus = (status) => {
        if (selectedSlip) {
            handleStatusChange(selectedSlip.id, status);
            setShowSlipModal(false);
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
        setEditingProduct({ ...product, customStockUnit: '', customDisplayUnit: '' });
        setShowEditProduct(true);
    };

    const viewPaymentSlip = (slip) => {
        setSelectedSlip(slip);
        setShowSlipModal(true);
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <svg
                                className="logo-icon"
                                fill="#ffffff"
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="-25.6 -25.6 307.20 307.20"
                                enableBackground="new 0 0 256 253"
                                xmlSpace="preserve"
                                stroke="#ffffff"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M143.913,143.858l-18.104,25.013l-11.577-12.578c-1.286-1.429-1.239-3.573,0.143-4.955c1.429-1.286,3.573-1.239,4.955,0.143 l5.86,6.337l13.054-18.009c1.143-1.525,3.287-1.953,4.907-0.81C144.675,140.094,145.056,142.333,143.913,143.858z M171.451,161.486 c2.382,2.287,1.286,6.289-1.858,7.051l-10.958,2.811l3.097,10.863c0.858,3.144-2.096,6.051-5.193,5.193l-10.672-3.049l15.246,30.349 l-12.721-3.621l-3.526,11.768L128,189.214l-16.866,33.636l-3.526-11.768l-12.721,3.621l15.246-30.349l-10.672,3.049 c-3.144,0.858-6.051-2.096-5.193-5.193l3.097-10.863l-10.958-2.811c-3.144-0.762-4.24-4.764-1.858-7.051l8.004-7.861l-8.052-7.861 c-2.382-2.287-1.286-6.289,1.858-7.051l10.958-2.811l-3.097-10.863c-0.858-3.144,2.096-6.051,5.193-5.193l10.863,3.097l2.811-10.958 c0.762-3.144,4.86-4.193,7.051-1.858l7.861,8.099l7.861-8.099c2.239-2.382,6.289-1.239,7.051,1.858l2.811,10.958l10.863-3.097 c3.144-0.858,6.051,2.096,5.193,5.193l-3.097,10.863l10.958,2.811c3.144,0.762,4.24,4.764,1.858,7.051l-8.052,7.861L171.451,161.486 z M155.3,153.624c0-14.579-11.863-26.347-26.347-26.347c-14.579,0-26.347,11.816-26.347,26.394s11.768,26.347,26.347,26.347 S155.3,168.203,155.3,153.624z M2,69c0,13.678,9.625,25.302,22,29.576V233H2v18h252v-18H232V98.554 c12.89-3.945,21.699-15.396,22-29.554v-8H2V69z M65.29,68.346c0,6.477,6.755,31.47,31.727,31.47 c21.689,0,31.202-19.615,31.202-31.47c0,11.052,7.41,31.447,31.464,31.447c21.733,0,31.363-20.999,31.363-31.447 c0,14.425,9.726,26.416,22.954,30.154V233H42V98.594C55.402,94.966,65.29,82.895,65.29,68.346z M222.832,22H223V2H34v20L2,54h252 L222.832,22z"></path>
                                </g>
                            </svg>
                        </div>
                        <div>
                            <h1 className="header-title">Welcome, {adminName}!</h1>
                        </div>
                    </div>
                    <div className="header-right">
                        <p className="date-value">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <div className="avatar-circle">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <button onClick={() => import('./api').then(api => api.logout())} className="bbtn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <nav className="dashboard-nav">
                <div className="nav-content">
                    <button onClick={() => setActiveTab('overview')} className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}>Overview</button>
                    <button onClick={() => setActiveTab('products')} className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}>Products</button>
                    <button onClick={() => setActiveTab('orders')} className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}>Orders</button>
                    <button onClick={() => setActiveTab('payments')} className={`nav-tab ${activeTab === 'payments' ? 'active' : ''}`}>Payment Slips</button>
                    <button onClick={() => setActiveTab('reviews')} className={`nav-tab ${activeTab === 'reviews' ? 'active' : ''}`}>Reviews</button>
                </div>
            </nav>

            <main className="main-content">
                {showAddProduct ? (
                    <AddProduct onAdd={() => { setShowAddProduct(false); fetchProducts(); }} onCancel={() => setShowAddProduct(false)} />
                ) : (
                    <>
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
                        <p className="stat-value">Rs {orders.filter(order => order.status === 'CONFIRMED').reduce((acc, order) => acc + order.totalPrice, 0).toFixed(2)}</p>
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
                        <p className="stat-value">{products.filter(p => p.stockQuantity < 20).length}</p>
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
                    {products.filter(p => p.stockQuantity < 20).map(product => (
                      <div key={product.id} className="alert-item">
                        <div>
                          <p className="alert-product-name">{product.name}</p>
                          <p className="alert-category">{product.category}</p>
                        </div>
                        <span className={`badge ${product.stockQuantity === 0 ? 'red' : 'yellow'}`}>
                          {product.stockQuantity} units
                        </span>
                      </div>
                    ))}
                  </div>
                            </div>
                            </div>
                        )}
                        {activeTab === 'products' && (
                            <div className="content-card">
                                     <div className="card-header">
                  <div className="header-actions">
                    <h2 className="ssection-title">Product Management</h2>
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
                      <svg className="ssearch-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input type="text" placeholder="Search products..." className="search-input" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
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
                          {products.filter(product => product.name.toLowerCase().includes(productSearch.toLowerCase())).map(product => (
                            <tr key={product.id}>
                              <td className="font-medium">{product.name}</td>
                              <td>{product.category}</td>
                              <td>Rs {(product.salePrice || 0).toFixed(2)}</td>
                              <td>{product.stockQuantity}</td>
                              <td>
                                <span className={`status-badge ${product.stockQuantity >= 20 ? 'green' : product.stockQuantity > 0 ? 'yellow' : 'red'}`}>
                                  {product.stockQuantity >= 20 ? 'In Stock' : product.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
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
                        {activeTab === 'orders' && (
                            <div className="content-card">
                                        <div className="card-header">
                  <h2 className="sssection-title">Order History</h2>
                  <div className="search-bar-container">
                    <div className="search-bar">
                      <svg className="ssearch-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input type="text" placeholder="Search orders..." className="search-input" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} />
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
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Mobile Number</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(order => `#ORD-${order.id}`.toLowerCase().includes(orderSearch.toLowerCase())).map(order => (
                        <tr key={order.id}>
                          <td className="font-medium">#ORD-{order.id}</td>
                          <td>{order.customerName}</td>
                          <td>{order.mobileNumber}</td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td className="order-items">
                            {order.items && order.items.length > 0 ? (
                              <ul>
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    {item.productName || item.product?.name} 
                                    <span className="item-quantity"> ({item.quantity})</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="no-items">No items</span>
                            )}
                          </td>
                          <td className="font-medium">Rs {(order.totalPrice || 0).toFixed(2)}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`status-badge ${order.status === 'DELIVERED' ? 'green' : order.status === 'CONFIRMED' ? 'blue' : 'yellow'}`}>
                              <option value="NEW">NEW</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                            </div>
                        )}
                        {activeTab === 'payments' && (
                            <div className="content-card">
                                             <div className="card-header">
                  <h2 className="ssection-title">Payment Slips</h2>
                  <div className="search-bar-container">
                    <div className="search-bar">
                      <svg className="ssearch-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <input type="text" placeholder="Search payment slips..." className="search-input" value={paymentSlipSearch} onChange={(e) => setPaymentSlipSearch(e.target.value)} />
                    </div>
                    <button className="bbtn-secondary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Filter
                    </button>
                  </div>
                </div>

                <div className="payment-slips-grid">
                  {paymentSlips.filter(slip => `#ORD-${slip.id}`.toLowerCase().includes(paymentSlipSearch.toLowerCase())).map(slip => (
                    <div key={slip.id} className="payment-slip-card">
                      <div className="slip-image-container">
                        <img 
                          src={getCorrectImagePath(slip.transferSlipPath)} 
                          alt="Payment Slip" 
                          className="slip-image"
                          onClick={() => viewPaymentSlip(slip)}
                        />
                        <span className={`status-badge-absolute ${slip.status === 'CONFIRMED' ? 'green' : slip.status === 'CANCELLED' ? 'red' : 'yellow'}`}>
                          {slip.status}
                        </span>
                      </div>
                      <div className="slip-details">
                        <div className="slip-header">
                          <h3 className="slip-order-id">#ORD-{slip.id}</h3>
                          <p className="slip-amount">Rs {(slip.totalPrice || 0).toFixed(2)}</p>
                        </div>
                        <p className="slip-customer">{slip.customerName} ({slip.mobileNumber})</p>
                        <p className="slip-date">{new Date(slip.orderDate).toLocaleDateString()}</p>
                        <button onClick={() => viewPaymentSlip(slip)} className="bbtn-primary full-width">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="content-card">
                                <div className="card-header">
                                    <h2 className="ssection-title">Customer Reviews</h2>
                                    <div className="search-bar-container">
                                        <div className="search-bar">
                                            <svg className="ssearch-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
                                            </svg>
                                            <input type="text" placeholder="Search reviews by comment..." className="search-input" value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Customer</th>
                                                <th>Rating</th>
                                                <th style={{ width: '40%' }}>Comment</th>
                                                <th>Admin Reply</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviews.filter(r => r.comment.toLowerCase().includes(reviewSearch.toLowerCase())).map(review => (
                                                <tr key={review.id}>
                                                    <td>{review.customerName}</td>
                                                    <td>{'⭐'.repeat(review.rating)}</td>
                                                    <td>{review.comment}</td>
                                                    <td>{review.adminReply || <span className="no-reply">No reply yet</span>}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button onClick={() => openReplyModal(review)} className="icon-btn reply">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                                            </button>
                                                            <button onClick={() => handleDeleteReview(review.id, review.customerId)} className="icon-btn delete">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
                    </>
                )}
            </main>

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
                  value={editingProduct.originalPrice}
                  onChange={(e) => setEditingProduct({...editingProduct, originalPrice: parseFloat(e.target.value)})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  value={editingProduct.stockQuantity}
                  onChange={(e) => setEditingProduct({...editingProduct, stockQuantity: parseInt(e.target.value)})}
                  className="form-input"
                />
              </div>
<div className="form-group">
    <label className="form-label">Stock Unit</label>
    <select
        value={editingProduct.stockUnit}
        onChange={(e) => setEditingProduct({...editingProduct, stockUnit: e.target.value})}
        className="form-input"
    >
        {unitOptions.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
        ))}
    </select>
    {editingProduct.stockUnit === 'OTHER' && (
        <input
            type="text"
            placeholder="Enter custom unit"
            value={editingProduct.customStockUnit}
            onChange={(e) => setEditingProduct({...editingProduct, customStockUnit: e.target.value})}
            className="form-input"
        />
    )}
</div>
<div className="form-group">
    <label className="form-label">Display Unit</label>
    <select
        value={editingProduct.displayUnit}
        onChange={(e) => setEditingProduct({...editingProduct, displayUnit: e.target.value})}
        className="form-input"
    >
        {unitOptions.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
        ))}
    </select>
    {editingProduct.displayUnit === 'OTHER' && (
        <input
            type="text"
            placeholder="Enter custom unit"
            value={editingProduct.customDisplayUnit}
            onChange={(e) => setEditingProduct({...editingProduct, customDisplayUnit: e.target.value})}
            className="form-input"
        />
    )}
</div>
<div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  value={editingProduct.discount}
                  onChange={(e) => setEditingProduct({...editingProduct, discount: parseInt(e.target.value)})}
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
                <img src={getCorrectImagePath(selectedSlip.transferSlipPath)} alt="Payment Slip" />
              </div>

              <div className="slip-detail-grid">
                <div className="detail-item">
                  <p className="detail-label">Order ID</p>
                  <p className="detail-value">#ORD-{selectedSlip.id}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Amount</p>
                  <p className="detail-value amount">Rs {(selectedSlip.totalPrice || 0).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Customer</p>
                  <p className="detail-value">{selectedSlip.customerName} ({selectedSlip.mobileNumber})</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Upload Date</p>
                  <p className="detail-value">{new Date(selectedSlip.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="detail-item full-width">
                  <p className="detail-label">Status</p>
                  <span className={`status-badge ${selectedSlip.status === 'CONFIRMED' ? 'green' : selectedSlip.status === 'CANCELLED' ? 'red' : 'yellow'}`}>
                    {selectedSlip.status}
                  </span>
                </div>
              </div>

              {selectedSlip.status === 'NEW' && (
                <div className="modal-actions">
                  <button onClick={() => updateSlipStatus('CANCELLED')} className="btn-danger full-width-half">
                    Reject Payment
                  </button>
                  <button onClick={() => updateSlipStatus('CONFIRMED')} className="bbtn-primary full-width-half">
                    Approve Payment
                  </button>
                </div>
              )}
            </div>
          </div>
                </div>
            )}
            {showReplyModal && currentReview && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Reply to {currentReview.customerName}'s Review</h3>
                            <button onClick={() => setShowReplyModal(false)} className="close-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="review-comment-modal">"{currentReview.comment}"</p>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply here..."
                                className="form-input"
                                rows="4"
                            />
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowReplyModal(false)} className="bbtn-secondary full-width-half">Cancel</button>
                            <button onClick={handleSubmitReply} className="bbtn-primary full-width-half">Submit Reply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroceryAdminDashboard;
