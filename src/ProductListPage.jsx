import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetailsModal'; 
import ProductFilter from './ProductFilter'; 
import { useProducts } from './hooks';
import LoadingAnimation from './LoadingAnimation'; 
import './GroceryStore.css';

const ProductListPage = () => {
  const { products, loading, error, fetchAllProducts, searchProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [title, setTitle] = useState('All Products');
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    const category = params.get('category');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    const minDiscount = params.get('minDiscount');
    const maxDiscount = params.get('maxDiscount');

    if (searchQuery) {
      searchProducts(searchQuery);
    } else {
      fetchAllProducts({ category, minPrice, maxPrice, minDiscount, maxDiscount });
    }

    let newTitle = 'All Products';
    if (category) {
      newTitle = category;
    } else if (searchQuery) {
      newTitle = `Search results for "${searchQuery}"`;
    }
    setTitle(newTitle);
  }, [location.search]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleFilter = (filters) => {
    const params = new URLSearchParams(location.search);
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.set(key, filters[key]);
      } else {
        params.delete(key);
      }
    });
    navigate(`/products?${params.toString()}`);
  };

  if (loading) {
    return <LoadingAnimation />;
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
      <div className="page-header">
        <button onClick={() => setShowFilter(!showFilter)} className="filter-toggle-btn">{showFilter ? 'Hide' : 'Show'} Filters</button>
      </div>
      {showFilter && <ProductFilter onFilter={handleFilter} />}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onCardClick={handleCardClick} // Pass the click handler
          />
        ))}
      </div>
      <ProductDetailsModal 
        product={selectedProduct} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default ProductListPage;