// src/components/Inventory.js
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../styles/Inventory.css';
import ChatBot from './ChatBot';
import { useUser } from '../context/UserContext';
import { fetchInventoryItems } from '../services/InventoryService';

const ITEM_TYPE = 'ChatBotIcon';


const DraggableChatBotIcon = ({ slotIndex, moveItemToSlot, toggleChatVisibility }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { slotIndex },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.slotIndex !== item.slotIndex) {
        moveItemToSlot(item.slotIndex, dropResult.slotIndex);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const iconStyle = isDragging ? { opacity: 0.5 } : {};

  return (
    <div
      ref={dragRef}
      className="chatbot-icon"
      style={iconStyle}
      onClick={() => {
        // Prevent triggering toggle when dragging
        if (!isDragging) toggleChatVisibility();
      }}
    />
  );
};


const InventorySlot = ({ slotIndex, currentItem, moveItemToSlot, toggleChatVisibility }) => {
  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: () => ({ slotIndex }),
    canDrop: () => currentItem === null, // Only allow drop in empty slots
  });

  return (
    <div ref={dropRef} className="inventory-slot">
      {currentItem && (
        <DraggableChatBotIcon
          slotIndex={slotIndex}
          moveItemToSlot={moveItemToSlot}
          toggleChatVisibility={toggleChatVisibility}
        />
      )}
    </div>
  );
};

const Inventory = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [inventory, setInventory] = useState(Array(6).fill(null));
  const { user } = useUser();

  useEffect(() => {
    if (!user) return; // Don't fetch if there is no user

    const loadInventoryItems = async () => {
      const items = await fetchInventoryItems(user.uid);
      setInventory((prevInventory) => {
        const newInventory = [...prevInventory];
        // Assuming the chatbot is always in the first slot
        newInventory[0] = 'ChatBotIcon';
        return newInventory;
      });
    };

    loadInventoryItems();
  }, [user]);

  const moveItemToSlot = (fromIndex, toIndex) => {
    setInventory((prev) => {
      const newInventory = [...prev];
      newInventory[toIndex] = newInventory[fromIndex];
      newInventory[fromIndex] = null;
      return newInventory;
    });
  };

  const toggleChatVisibility = () => {
    setShowChatBot((prev) => !prev);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="inventory">
        {inventory.map((item, index) => (
          <InventorySlot
            key={index}
            slotIndex={index}
            currentItem={item}
            moveItemToSlot={moveItemToSlot}
            toggleChatVisibility={toggleChatVisibility}
          />
        ))}

        {/* Pass visibility state and toggle function to ChatBot */}
        <ChatBot visible={showChatBot} toggleVisibility={toggleChatVisibility} />
      </div>
    </DndProvider>
  );
};

export default Inventory;