import React, { useState, useEffect, useCallback } from 'react';
import { Star, Edit2, Trash2, Package, Calendar, MessageSquare, CheckCircle, User, Search } from 'lucide-react';
import { useReviews } from './hooks';
import { orderAPI, isAuthenticated, getUserInfo, reviewAPI, productAPI, userAPI } from './api';
import LoadingAnimation from './LoadingAnimation';
import './ReviewPage.css';

const ReviewPage = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'allReviews');
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    productId: '',
    rating: 5,
    comment: ''
  });
  const [editingReview, setEditingReview] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [allReviewsLoading, setAllReviewsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [productNames, setProductNames] = useState({});
  const [customerNames, setCustomerNames] = useState({});

  const { reviews, loading, error, fetchReviewsByCustomer, submitReview, updateReview, deleteReview } = useReviews();
  const userInfo = getUserInfo();
  const userId = localStorage.getItem('userId');

  const [userReviews, setUserReviews] = useState([]);

  const fetchAllPublicReviews = useCallback(async () => {
  setAllReviewsLoading(true);
  try {
    const response = await reviewAPI.getAllReviews();  // ✅ Use the API
    setAllReviews(response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    setAllReviews([]);
    return [];
  } finally {
    setAllReviewsLoading(false);
  }
}, []);

  const fetchDeliveredOrders = useCallback(async () => {
    setOrderLoading(true);
    try {
      const response = await orderAPI.getAllOrders();
      const delivered = response.data.filter(order => 
        order.status === 'DELIVERED' && order.customerId === parseInt(userId)
      );
      setDeliveredOrders(delivered);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrderLoading(false);
    }
  }, [userId]);

  const fetchProductAndCustomerNames = useCallback(async (reviewsToProcess) => {
    const uniqueProductIds = [...new Set(reviewsToProcess.map(review => review.productId))];
    const uniqueCustomerIds = [...new Set(reviewsToProcess.map(review => review.customerId))];

    const newProductNames = { ...productNames };
    const newCustomerNames = { ...customerNames };

    // Fetch product names
    for (const productId of uniqueProductIds) {
      if (!newProductNames[productId]) {
        try {
          const response = await productAPI.getProductById(productId);
          newProductNames[productId] = response.data.name; // Assuming product object has a 'name' field
        } catch (err) {
          console.error(`Error fetching product ${productId}:`, err);
          newProductNames[productId] = `Product #${productId}`;
        }
      }
    }

    // Fetch customer names
    for (const customerId of uniqueCustomerIds) {
      if (!newCustomerNames[customerId]) {
        try {
          const response = await userAPI.getUserById(customerId); // Assuming userAPI has getUserById
          newCustomerNames[customerId] = response.data.fullName; // Assuming user object has a 'fullName' field
        } catch (err) {
          console.error(`Error fetching customer ${customerId}:`, err);
          newCustomerNames[customerId] = `Customer #${customerId}`;
        }
      }
    }
    setProductNames(newProductNames);
    setCustomerNames(newCustomerNames);
  }, [productNames, customerNames]);

  useEffect(() => {
    const loadReviews = async () => {
      // Fetch all reviews
      const publicReviews = await fetchAllPublicReviews();

      let allReviewsToProcess = [...publicReviews];

      // Fetch user reviews if logged in
      if (isAuthenticated() && userId) {
        const customerReviews = await fetchReviewsByCustomer(userId);
        setUserReviews(customerReviews);
        fetchDeliveredOrders();
        allReviewsToProcess = [...allReviewsToProcess, ...customerReviews];
      }
      fetchProductAndCustomerNames(allReviewsToProcess); // Fetch names for all reviews
    };
    loadReviews();
  }, [userId, fetchReviewsByCustomer, fetchAllPublicReviews, fetchDeliveredOrders]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder || !reviewForm.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const reviewData = {
        orderId: selectedOrder.id.toString(),
        productId: selectedOrder.items[0].productId.toString(),
        customerId: userId,
        rating: reviewForm.rating.toString(),
        comment: reviewForm.comment
      };

      await submitReview(reviewData);
      alert('Review submitted successfully!');
      setReviewForm({rating: 5, comment: '' });
      setSelectedOrder(null);
      fetchReviewsByCustomer(userId);
      fetchAllPublicReviews(); // Refresh all reviews
      setActiveTab('myReviews');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    
    if (!editingReview || !reviewForm.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const reviewData = {
        customerId: userId,
        rating: reviewForm.rating.toString(),
        comment: reviewForm.comment
      };

      await updateReview(editingReview.id, reviewData);
      alert('Review updated successfully!');
      setEditingReview(null);
      setReviewForm({ productId: '', rating: 5, comment: '' });
      fetchReviewsByCustomer(userId);
      fetchAllPublicReviews(); // Refresh all reviews
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId, userId);
      alert('Review deleted successfully!');
      fetchReviewsByCustomer(userId);
      fetchAllPublicReviews(); // Refresh all reviews
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  const startEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      productId: review.productId.toString(),
      rating: review.rating,
      comment: review.comment
    });
    setActiveTab('writeReview');
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setReviewForm({ productId: '', rating: 5, comment: '' });
    setSelectedOrder(null);
  };

  // Filter all reviews
  const filteredAllReviews = allReviews.filter(review => {
    const matchesSearch = 
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productId.toString().includes(searchQuery);
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  // Calculate stats for all reviews
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 4, 1].map(rating => ({
    rating,
    count: allReviews.filter(r => r.rating === rating).length
  }));

  if (loading && reviews.length === 0 && allReviewsLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="review-page">
      <div className="container">
        {/* Header */}
        <div className="review-header">
          <div className="review-header-content">
            <div className="review-header-icon">
              <Star size={32} />
            </div>
            <div>
              <h1 className="review-title">Product Reviews</h1>
              <p className="review-subtitle">
                {isAuthenticated() ? 'Share your experience and see what others are saying' : 'See what our customers are saying about our products'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="review-tabs">
          <button
            onClick={() => setActiveTab('allReviews')}
            className={`review-tab ${activeTab === 'allReviews' ? 'active' : ''}`}
          >
            <Star size={18} />
            <span>All Reviews</span>
            <span className="review-badge">{allReviews.length}</span>
          </button>
          {isAuthenticated() && (
            <>
              <button
                onClick={() => setActiveTab('writeReview')}
                className={`review-tab ${activeTab === 'writeReview' ? 'active' : ''}`}
              >
                <MessageSquare size={18} />
                <span>Write Review</span>
              </button>
              <button
                onClick={() => setActiveTab('myReviews')}
                className={`review-tab ${activeTab === 'myReviews' ? 'active' : ''}`}
              >
                <User size={18} />
                <span>My Reviews</span>
                {reviews.length > 0 && (
                  <span className="review-badge">{reviews.length}</span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="review-content">
          {/* All Reviews Tab */}
          {activeTab === 'allReviews' && (
            <>
              {/* Stats Section */}
              <div className="reviews-stats">
                <div className="stats-card">
                  <div className="stat-number">{allReviews.length}</div>
                  <div className="stat-label">Total Reviews</div>
                </div>
                <div className="stats-card highlight">
                  <div className="stat-rating">
                    <Star size={32} fill="#fbbf24" color="#fbbf24" />
                    <span className="stat-number">{averageRating}</span>
                  </div>
                  <div className="stat-label">Average Rating</div>
                </div>
                <div className="stats-card">
                  <div className="rating-bars">
                    {ratingDistribution.map(({ rating, count }) => (
                      <div key={rating} className="rating-bar-item">
                        <span className="rating-label">{rating}★</span>
                        <div className="rating-bar-bg">
                          <div 
                            className="rating-bar-fill" 
                            style={{ width: `${allReviews.length > 0 ? (count / allReviews.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="rating-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="reviews-filters">
                <div className="search-filter">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search reviews by product or comment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <div className="rating-filter">
                  <label>Filter by rating:</label>
                  <select 
                    value={filterRating} 
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              {/* All Reviews List */}
              <div className="all-reviews-grid">
                {filteredAllReviews.length === 0 ? (
                  <div className="no-reviews">
                    <Star size={64} />
                    <h3>No reviews found</h3>
                    <p>Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  filteredAllReviews.map(review => (
                    <div key={review.id} className="public-review-card">
                      <div className="review-card-header">
                        <div className="review-meta">
                          <div className="product-badge">
                            <Package size={14} />
                            <span>{productNames[review.productId] || `Product #${review.productId}`}</span>
                          </div>
                          <div className="customer-badge">
                            <User size={14} />
                            <span>{customerNames[review.customerId] || `Customer #${review.customerId}`}</span>
                          </div>
                        </div>
                        <div className="review-date">
                          <Calendar size={14} />
                          <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="review-rating-display">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={20}
                            fill={star <= review.rating ? '#fbbf24' : 'none'}
                            color={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                          />
                        ))}
                        <span className="rating-number">{review.rating}.0</span>
                      </div>
                      
                      <div className="review-comment">
                        {/*Admin reply */}
                        <p>{review.comment}</p>
                        {review.adminReply && (
                          <div className="admin-reply">
                            <strong>Admin Reply:</strong>
                            <p>{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Write Review Tab */}
          {activeTab === 'writeReview' && (
            <div className="review-form-container">
              {!isAuthenticated() ? (
                <div className="auth-required">
                  <MessageSquare size={64} />
                  <h2>Login Required</h2>
                  <p>Please login to write reviews</p>
                  <a href="/login" className="btn-primary">Go to Login</a>
                </div>
              ) : (
                <>
                  <h2 className="form-title">
                    {editingReview ? 'Edit Your Review' : 'Write a New Review'}
                  </h2>

                  {editingReview ? (
                    // Edit Mode
                    <form onSubmit={handleUpdateReview} className="review-form">
                      <div className="edit-notice">
                        <p>
                          <strong>Editing review for Product #{editingReview.productId}</strong>
                        </p>
                        <p className="edit-date">
                          Originally posted: {new Date(editingReview.reviewDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Your Rating</label>
                        <div className="rating-input">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({...reviewForm, rating: star})}
                              className="star-btn"
                            >
                              <Star
                                size={40}
                                fill={star <= reviewForm.rating ? '#fbbf24' : 'none'}
                                color={star <= reviewForm.rating ? '#fbbf24' : '#d1d5db'}
                              />
                            </button>
                          ))}
                          <span className="rating-value">{reviewForm.rating} / 5</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Your Review</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                          className="review-textarea"
                          rows="6"
                          placeholder="Share your thoughts about this product..."
                          required
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          Update Review
                        </button>
                        <button type="button" onClick={cancelEdit} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // New Review Mode
                    <form onSubmit={handleSubmitReview} className="review-form">
                      <div className="form-group">
                        <label className="form-label">Select Delivered Order</label>
                        {orderLoading ? (
                          <div className="loading-orders">Loading orders...</div>
                        ) : deliveredOrders.length === 0 ? (
                          <div className="no-orders">
                            <Package size={48} />
                            <p>No delivered orders found</p>
                            <span className="no-orders-text">
                              You can only review products from delivered orders
                            </span>
                          </div>
                        ) : (
                          <div className="order-selection">
                            {deliveredOrders.map(order => (
                              <button
                                key={order.id}
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                              >
                                <div className="order-card-content">
                                  <div>
                                    <p className="order-id">Order #{order.id}</p>
                                    <p className="order-details">
                                      {order.items?.length || 0} items • Rs.{order.totalPrice.toFixed(2)}
                                    </p>
                                    <p className="order-date">
                                      <Calendar size={14} />
                                      {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <CheckCircle
                                    size={24}
                                    color={selectedOrder?.id === order.id ? '#10b981' : '#d1d5db'}
                                  />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                          <div className="form-group">
                            <label className="form-label">Your Rating</label>
                            <div className="rating-input">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm({...reviewForm, rating: star})}
                                  className="star-btn"
                                >
                                  <Star
                                    size={40}
                                    fill={star <= reviewForm.rating ? '#fbbf24' : 'none'}
                                    color={star <= reviewForm.rating ? '#fbbf24' : '#d1d5db'}
                                  />
                                </button>
                              ))}
                              <span className="rating-value">{reviewForm.rating} / 5</span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Your Review</label>
                            <textarea
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                              className="review-textarea"
                              rows="6"
                              placeholder="Share your thoughts about Ravindra Store..."
                              required
                            />
                          </div>

                          <button type="submit" className="btn-primary btn-full">
                            Submit Review
                          </button>
                    </form>
                  )}
                </>
              )}
            </div>
          )}

          {/* My Reviews Tab */}
          {activeTab === 'myReviews' && (
            <div className="reviews-list">
              {!isAuthenticated() ? (
                <div className="auth-required">
                  <User size={64} />
                  <h2>Login Required</h2>
                  <p>Please login to view your reviews</p>
                  <a href="/login" className="btn-primary">Go to Login</a>
                </div>
              ) : reviews.length === 0 ? (
                <div className="no-reviews">
                  <Star size={64} />
                  <h3>No reviews yet</h3>
                  <p>Start reviewing products you've purchased!</p>
                  <button
                    onClick={() => setActiveTab('writeReview')}
                    className="btn-primary"
                  >
                    Write Your First Review
                  </button>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-header">
                      <div>
                        <div className="review-badges">
                          <span className="product-badge">{productNames[review.productId] || `Product #${review.productId}`}</span>
                          <span className="order-badge">Order #{review.orderId}</span>
                        </div>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={20}
                              fill={star <= review.rating ? '#fbbf24' : 'none'}
                              color={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                            />
                          ))}
                          <span className="rating-text">{review.rating} / 5</span>
                        </div>
                        <p className="review-date">
                          <Calendar size={14} />
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="review-actions">
                        <button
                          onClick={() => startEditReview(review)}
                          className="action-btn edit-btn"
                          title="Edit review"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="action-btn delete-btn"
                          title="Delete review"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="review-comment">
                      <p>{review.comment}</p>
                      {/*Admin reply */}
                      {review.adminReply && (
                      <div className="admin-reply">
                        <strong>Admin Reply:</strong>
                        <p>{review.adminReply}</p>
                      </div>
                    )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;