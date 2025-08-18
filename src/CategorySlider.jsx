<<<<<<< Updated upstream
// src/CategorySlider.jsx

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySlider = ({ categories }) => {
  // 1. Create a ref for the scrolling container
  const scrollContainerRef = useRef(null);

  // 2. Create the function to scroll right
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      // Adjust the scroll amount (300) to fit your design
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // 3. Create the function to scroll left
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      // Adjust the scroll amount (-300) to fit your design
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-slider">
      <div className="slider-header">
        <h2 className="slider-title">Categories</h2>
        <div className="slider-controls">
          {/* 4. Add onClick handlers to the buttons */}
          <button className="slider-btn" onClick={handleScrollLeft}>
            <ChevronLeft size={20} />
          </button>
          <button className="slider-btn" onClick={handleScrollRight}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 5. Attach the ref to the div you want to scroll */}
      <div className="categories-container" ref={scrollContainerRef}>
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            {/* The category.color is now used as a CSS class */}
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

=======
// src/CategorySlider.jsx

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySlider = ({ categories }) => {
  // 1. Create a ref for the scrolling container
  const scrollContainerRef = useRef(null);

  // 2. Create the function to scroll right
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      // Adjust the scroll amount (300) to fit your design
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // 3. Create the function to scroll left
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      // Adjust the scroll amount (-300) to fit your design
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-slider">
      <div className="slider-header">
        <h2 className="slider-title">Categories</h2>
        <div className="slider-controls">
          {/* 4. Add onClick handlers to the buttons */}
          <button className="slider-btn" onClick={handleScrollLeft}>
            <ChevronLeft size={20} />
          </button>
          <button className="slider-btn" onClick={handleScrollRight}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 5. Attach the ref to the div you want to scroll */}
      <div className="categories-container" ref={scrollContainerRef}>
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            {/* The category.color is now used as a CSS class */}
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

>>>>>>> Stashed changes
export default CategorySlider;