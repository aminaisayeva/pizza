// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import backButtonImage from '../assets/back_button.png';
import '../styles/BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigate back to the welcome screen
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <img src={backButtonImage} alt="Back" />
    </button>
  );
};

export default BackButton;
