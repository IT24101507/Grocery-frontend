

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySlider = ({ categories }) => {
  
  const scrollContainerRef = useRef(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 1) {
        // If at the end, scroll to the beginning
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollLeft === 0) {
        // If at the beginning, scroll to the end
        scrollContainerRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="category-slider">
      <div className="slider-header">
        <h2 className="slider-title">Categories</h2>
        <div className="slider-controls">
          <button className="slider-btn" onClick={handleScrollLeft}>
            <ChevronLeft size={20} />
          </button>
          <button className="slider-btn" onClick={handleScrollRight}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>


      <div className="categories-container" ref={scrollContainerRef}>
        {categories.map((category) => (
          <Link to={`/products?category=${category.name}`} key={category.id} className="category-item category-link">
            <div className={`category-icon ${category.color}`}>
              <span>{category.icon}</span>
            </div>
            <p className="category-name">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;