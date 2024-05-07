// src/components/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      
      <button className="welcome-button login-button" onClick={() => navigate('/login')}></button>
      <button className="welcome-button signup-button" onClick={() => navigate('/signup')}></button>
    </div>
  );
};

export default Welcome;
