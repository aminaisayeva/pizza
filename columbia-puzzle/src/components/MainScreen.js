
import Whiteboard from './Whiteboard';
import React, { useState } from 'react';
import Inventory from './Inventory';
import '../styles/MainScreen.css'; // Assuming you have specific styles for the MainScreen
import LogoutButton from './LogoutButton'; 
import backgroundImage from '../assets/background.png'; // Ensure the path is correct

const MainScreen = () => {
  const mainScreenStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Adjust the height as needed
    width: '100vw' // Adjust the width as needed
  };

  const [isPanelVisible, setPanelVisible] = useState(false);

  const togglePanel = () => {
    setPanelVisible(!isPanelVisible); // Toggle the visibility of the panel
  };

  return (
    <div className="mainScreen" style={mainScreenStyle}>
      <div className="mainScreen__header">
        <LogoutButton /> {/* Place the LogoutButton in the header */}
      </div>
      <div className="mainScreen__whiteboard">
        <Whiteboard />
      </div>
      <div className="mainScreen__inventory">
        <Inventory />
      </div>
      <div className="clickable-area" onClick={togglePanel}>
        {/* Render content or just the clickable area */}
      </div>

      {/* Panel that slides up */}
      <div className={`slide-panel ${isPanelVisible ? 'visible' : ''}`}>
        {/* Content of the panel */}
      </div>
    </div>
  );
};

export default MainScreen;



