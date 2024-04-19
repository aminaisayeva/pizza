import React, { useState } from 'react';
import '../styles/Inventory.css';
import ChatBotIcon from './ChatBotIcon';
import ChatBot from './ChatBot';

const Inventory = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <div className="inventory">
      {Array.from({ length: 10 }, (_, i) => (
        i === 9 ? <ChatBotIcon key={i} onClick={() => setShowChatBot(!showChatBot)} /> : <div key={i} className="inventory-slot"></div>
      ))}
      {showChatBot && <ChatBot />}
    </div>
  );
};

export default Inventory;
