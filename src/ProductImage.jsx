import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './api';

const ProductImage = ({ productId, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/products/${productId}/image`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to fetch image:', error);
      }
    };

    if (productId) {
      fetchImage();
    }

    // Cleanup the object URL on component unmount
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [productId]);

  if (!imageUrl) {
    return <div>Loading image...</div>;
  }

  return <img src={imageUrl} alt={alt} className={className} />;
};

export default ProductImage;