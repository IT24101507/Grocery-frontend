

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CategorySlider.css';

const CategorySlider = ({ categories }) => {
  
  const scrollContainerRef = useRef(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const delta = Math.round(clientWidth * 0.8);
      if (scrollLeft >= scrollWidth - clientWidth - 1) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
      }
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const delta = Math.round(clientWidth * 0.8);
      if (scrollLeft === 0) {
        scrollContainerRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: -delta, behavior: 'smooth' });
      }
    }
  };

  return (
<div className="category-slider">
  <h2 className="slider-title">Categories</h2>

  <div className="slider-body">
    <button type="button" aria-label="Scroll left" className="slider-btn left" onClick={(e) => { e.stopPropagation(); handleScrollLeft(); }}>
      <ChevronLeft size={24} />
    </button>

    <div className="categories-container" ref={scrollContainerRef}>
      {categories.map((category) => (
        <Link
          to={`/products?category=${category.name}`}
          key={category.id}
          className="category-item category-link"
        >
          <div className={`category-icon ${category.color}`}>
            <span>{category.icon}</span>
          </div>
          <p className="category-name">{category.name}</p>
        </Link>
      ))}
    </div>

    <button type="button" aria-label="Scroll right" className="slider-btn right" onClick={(e) => { e.stopPropagation(); handleScrollRight(); }}>
      <ChevronRight size={24} />
    </button>
  </div>
</div>
  );
};

export default CategorySlider;