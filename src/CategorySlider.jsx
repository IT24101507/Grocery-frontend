

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySlider = ({ categories }) => {
  
  const scrollContainerRef = useRef(null);

  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
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
          <div key={category.id} className="category-item">
            <div className={`category-icon ${category.color}`}>
              <span>{category.icon}</span>
            </div>
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;