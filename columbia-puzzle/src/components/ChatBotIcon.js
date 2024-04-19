import React from 'react';
import '../styles/ChatBotIcon.css';

const ChatBotIcon = ({ onClick }) => {
  return (
    <div className="chatbot-icon" onClick={onClick}></div>
  );
};

export default ChatBotIcon;
