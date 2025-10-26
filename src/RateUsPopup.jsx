import React from 'react';
import './RateUsPopup.css';

const RateUsPopup = ({ onClose, onRateUs }) => {
  return (
    <div className="rate-us-overlay">
      <div className="rate-us-popup">
        <h2>Enjoying Ravindra Stores?</h2>
        <p>Would you like to rate your experience and help us improve?</p>
        <div className="rate-us-actions">
          <button onClick={onRateUs} className="btn-primary">Rate Us Now</button>
          <button onClick={onClose} className="btn-secondary">No Thanks</button>
        </div>
      </div>
    </div>
  );
};

export default RateUsPopup;