import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './api';

const ProductImage = ({ productId, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // A variable to track if the component is still mounted
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('token');

        
        // Create a config object for the request
        const config = {
          responseType: 'blob',
          headers: {}, // Start with empty headers
        };

        // Only add the Authorization header if a token actually exists
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        

        const response = await axios.get(`${BASE_URL}/products/${productId}/image`, config);

        // Check if the component is still mounted before setting state
        if (isMounted) {
          const url = URL.createObjectURL(response.data);
          setImageUrl(url);
        }

      } catch (error) {
        console.error(`Failed to fetch image for product ID ${productId}:`, error);
      }
    };

    if (productId) {
      fetchImage();
    }

    // Cleanup function to run when the component is unmounted
    return () => {
      isMounted = false; // Mark as unmounted
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Prevent memory leaks
      }
    };
  }, [productId]); // The dependency array should only contain productId

  if (!imageUrl) {
    return <div className={className}>Loading image...</div>;
  }

  return <img src={imageUrl} alt={alt} className={className} />;
};

export default ProductImage;
