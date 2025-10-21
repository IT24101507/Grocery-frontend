import axios from 'axios';

// Base URL for your backend - use environment variable or default to localhost
const getBaseURL = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  // Default to AWS production backend for cases where env var is not set
  return 'https://ravindrastores-env.eba-ygavm4fr.eu-north-1.elasticbeanstalk.com/api';
};

// Base URL for your backend
export const BASE_URL = getBaseURL();

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Check for a 401 error and ensure it is NOT a failed login attempt.
    if (error.response?.status === 401 && !originalRequest.url.includes('/auth/login')) {
      console.log("Interceptor: Expired token on a protected route. Logging out and redirecting.");

      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      localStorage.removeItem('profilePictureUrl');
      window.dispatchEvent(new Event('localStorageUpdated'));
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API functions for different operations
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (token) => api.post('/auth/google', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const productAPI = {
  getAllProducts: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minDiscount) params.append('minDiscount', filters.minDiscount);
    if (filters.maxDiscount) params.append('maxDiscount', filters.maxDiscount);
    return api.get(`/products?${params.toString()}`);
  },
  getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getProductById: (productId) => api.get(`/products/${productId}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  getDiscountedProducts: () => api.get('/products/discounted'),
  addProduct: (formData) => api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateProduct: (productId, formData) => api.put(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  getOrders: () => api.get('/user/orders'),
};

export const cartAPI = {
  getCart: (userId = localStorage.getItem('userId')) => api.get(`/cart?userId=${userId}`),
  addToCart: (productId, quantity = 1, userId = localStorage.getItem('userId')) => api.post(`/cart/add?userId=${userId}`, { productId, quantity }),
  updateCartItem: (productId, quantity, userId = localStorage.getItem('userId')) => api.put(`/cart/update?userId=${userId}&productId=${productId}&quantity=${quantity}`),
  removeFromCart: (productId, userId = localStorage.getItem('userId')) => api.delete(`/cart/remove?userId=${userId}&productId=${productId}`),
  clearCart: (userId = localStorage.getItem('userId')) => api.delete(`/cart/clear?userId=${userId}`),
};

export const orderAPI = {
  getAllOrders: () => api.get('/orders'),
  placeOrder: (orderData) => api.post('/orders/place', orderData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status?status=${status}`),
  getOrdersWithTransferSlips: () => api.get('/orders/with-transfer-slips'),
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Helper function to get user info from localStorage
export const getUserInfo = () => {
  return {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('userRole'),
    profilePictureUrl: localStorage.getItem('profilePictureUrl'),
  };
};

// Helper function to logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('profilePictureUrl');
  window.dispatchEvent(new Event('localStorageUpdated'));
  window.location.href = '/login';
};

export default api;