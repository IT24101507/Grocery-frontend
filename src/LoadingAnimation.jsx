import React from "react";
import styled, { keyframes } from "styled-components";

const logoUrl = "https://i.postimg.cc/bwYXrS2d/logo.png";

const LoadingAnimation = () => {
  return (
    <StyledWrapper>
      <div className="logoContainer">
        {/* The floating logo animation */}
        <img src={logoUrl} alt="Loading..." className="logo" />

        {/* The new pulsing dots loader */}
        <div className="loader-container">
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
        </div>
      </div>
    </StyledWrapper>
  );
};

// Keyframe for the logo's floating and spinning motion
const floatAndSpin = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`;

// Keyframe for the container circle's color change
const changeColor = keyframes`
  0% { background-color: #FDFD96; }
  25% { background-color: #FFB347; }
  50% { background-color: #FF6961; }
  75% { background-color: #AEC6CF; }
  100% { background-color: #FDFD96; }
`;

// --- loader's keyframe, but with colors adapted to our theme ---
const loaderpulse = keyframes`
  0% {
    transform: scale(0.8);
    background-color: #AEC6CF; /* ADAPTED: Was light purple, now pastel blue */
    box-shadow: 0 0 0 0 rgba(174, 198, 207, 0.7); /* ADAPTED: Shadow matches pastel blue */
  }
  50% {
    transform: scale(1.2);
    background-color: #FF6961; /* ADAPTED: Was dark purple, now pastel red */
    box-shadow: 0 0 0 10px rgba(255, 105, 97, 0); /* ADAPTED: Shadow matches pastel red */
  }
  100% {
    transform: scale(0.8);
    background-color: #AEC6CF; /* ADAPTED: Was light purple, now pastel blue */
    box-shadow: 0 0 0 0 rgba(174, 198, 207, 0.7); /* ADAPTED: Shadow matches pastel blue */
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;

  .logoContainer {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    animation: ${changeColor} 8s ease-in-out infinite;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .logo {
    width: 50px;
    height: auto;
    animation: ${floatAndSpin} 5s ease-in-out infinite;
  }

  /* --- Styles for your pulsing dots loader --- */
  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader-dot {
    height: 7px;
    width: 7px; /* Made width and height equal for perfect circles */
    margin-right: 10px;
    border-radius: 50%; /* Changed to 50% for perfect circles */
    animation: ${loaderpulse} 1.5s infinite ease-in-out;
  }

  .loader-dot:last-child {
    margin-right: 0;
  }

  .loader-dot:nth-child(1) {
    animation-delay: -0.3s;
  }

  .loader-dot:nth-child(2) {
    animation-delay: -0.1s;
  }

  .loader-dot:nth-child(3) {
    animation-delay: 0.1s;
  }
`;

export default LoadingAnimation;
