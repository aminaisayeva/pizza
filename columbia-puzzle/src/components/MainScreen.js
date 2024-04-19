import React from 'react';
import Whiteboard from './Whiteboard';
import Inventory from './Inventory';
import ChatBot from './ChatBot';
import '../MainScreen.css'; // Assuming you have specific styles for the MainScreen

const MainScreen = () => {
  return (
    <div className="mainScreen">
      <div className="mainScreen__whiteboard">
        <Whiteboard />
      </div>
      <div className="mainScreen__inventory">
        <Inventory />
      </div>
      <div className="mainScreen__chatBot">
        <ChatBot />
      </div>
    </div>
  );
};

export default MainScreen;
