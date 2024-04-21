// src/components/Inventory.js
import React, { useState, useEffect } from 'react';
import '../styles/Inventory.css';
import ChatBotIcon from './ChatBotIcon';
import ChatBot from './ChatBot';
import { useUser } from '../context/UserContext';
import { fetchInventoryItems } from '../services/InventoryService';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return; // Don't fetch if there is no user

    const loadInventoryItems = async () => {
      const items = await fetchInventoryItems(user.uid);
      setInventoryItems(items);
    };

    loadInventoryItems();
  }, [user]);

  return (
    <div className="inventory">
      {/* Display inventory items here */}
      {inventoryItems.map(item => (
        <div key={item.id} className="inventory-item">{item.name /* or some identifier */}</div>
      ))}

      {/* Show the chatbot icon */}
      <ChatBotIcon onClick={() => setShowChatBot(!showChatBot)} />

      {/* Render the ChatBot if showChatBot is true */}
      {showChatBot && <ChatBot />}
    </div>
  );
};

export default Inventory;
