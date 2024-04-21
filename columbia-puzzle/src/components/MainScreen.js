import React from 'react';
import Whiteboard from './Whiteboard';
import Inventory from './Inventory';
import '../styles/MainScreen.css'; // Assuming you have specific styles for the MainScreen
import LogoutButton from './LogoutButton'; 

const MainScreen = () => {
  return (
    <div className="mainScreen">
      <div className="mainScreen__header">
        <LogoutButton /> {/* Place the LogoutButton in the header */}
      </div>
      <div className="mainScreen__whiteboard">
        <Whiteboard />
      </div>
      <div className="mainScreen__inventory">
        <Inventory />
      </div>
    </div>
  );
};

export default MainScreen;