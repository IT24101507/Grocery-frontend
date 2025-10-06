import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from './hooks';
import './GroceryStore.css';

const ProductListPage = () => {
  const { products, loading, error, fetchAllProducts, searchProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [title, setTitle] = useState('All Products');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('category');
    const discounted = params.get('discounted');
    const searchQuery = params.get('search');

    if (searchQuery) {
      searchProducts(searchQuery);
    } else {
      fetchAllProducts();
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('category');
    const discounted = params.get('discounted');
    const searchQuery = params.get('search');

    let newTitle = 'All Products';
    let filtered = products;

    if (categoryName) {
      newTitle = categoryName;
      filtered = products.filter(
        (p) => p.category.toLowerCase() === categoryName.toLowerCase()
      );
    } else if (discounted) {
      newTitle = 'Discounted Products';
      filtered = products.filter((p) => p.discount > 0);
    } else if (searchQuery) {
      newTitle = `Search results for "${searchQuery}"`;
    }

    setTitle(newTitle);
    setFilteredProducts(filtered);
  }, [location.search, products]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2 className="main-title">
        <span className="text-green">{title}</span>
      </h2>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => {}} // Not implemented for this page
          />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;