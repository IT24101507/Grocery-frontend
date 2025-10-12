import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ onFilter }) => {
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minDiscount, setMinDiscount] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');

    const handleFilter = () => {
        onFilter({
            category,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
        });
    };

    return (
        <div className="pproduct-filter">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="beverages">Beverages</option>
                <option value="canned food">Canned Food</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="sea food">Sea Food</option>
                <option value="snacks">Snacks & Sweets</option>
            </select>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" />
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" />
            <input type="number" value={minDiscount} onChange={(e) => setMinDiscount(e.target.value)} placeholder="Min Discount" />
            <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="Max Discount" />
            <button onClick={handleFilter}>Filter</button>
        </div>
    );
};

export default ProductFilter;
