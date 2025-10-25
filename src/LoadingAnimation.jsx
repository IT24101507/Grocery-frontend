import React from "react";
import styled, { keyframes } from "styled-components";

// Using the same logo URL you provided
const logoUrl = "https://i.postimg.cc/bwYXrS2d/logo.png";

const LoadingAnimation = () => {
  return (
    <StyledWrapper>
      {/* The logo with a new, subtle pulse animation */}
      <img src={logoUrl} alt="Loading..." className="logo" />

      {/* A minimal three-dot loader */}
      <div className="loader-container">
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>
    </StyledWrapper>
  );
};

// A subtle pulse animation for the logo
const subtlePulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// A clean pulse animation for the loading dots
const dotPulse = keyframes`
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const StyledWrapper = styled.div`
  /* Center the content on the page */
  display: flex;
  flex-direction: column; /* Stack the logo above the dots */
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f8f9fa; /* A clean, light background color */
  gap: 25px; /* Adds space between the logo and the dots */

  .logo {
    width: 90px; /* Slightly smaller for a more refined look */
    height: auto;
    animation: ${subtlePulse} 2.5s ease-in-out infinite;
  }

  .loader-container {
    display: flex;
    justify-content: center;
  }

  .loader-dot {
    width: 10px; /* Smaller, more minimal dots */
    height: 10px;
    margin: 0 5px; /* Adjust spacing between dots */
    background-color: #888; /* A single, professional gray color */
    border-radius: 50%;
    animation: ${dotPulse} 1.4s infinite ease-in-out;
  }
  
  /* Stagger the animation start time for each dot to create a wave effect */
  .loader-dot:nth-child(1) {
    animation-delay: 0s;
  }
  
  .loader-dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .loader-dot:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

export default LoadingAnimation;
