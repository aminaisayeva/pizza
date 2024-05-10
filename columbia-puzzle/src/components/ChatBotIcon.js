import React from 'react';
import '../styles/ChatBotIcon.css';
import chatBotIcon from '../assets/chat_bot_icon.png';


const ChatBotIcon = ({ onClick }) => {
  return (
    <img className="chatbot-icon" src={chatBotIcon} alt="ChatBot Icon" onClick={onClick} />
  );
};


export default ChatBotIcon;
