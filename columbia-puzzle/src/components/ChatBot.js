// src/components/ChatBot.js
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { db } from '../services/firebaseConfig';
import '../styles/ChatBot.css';

const ChatBot = ({ visible, toggleVisibility }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useUser(); // Use the user from the UserContext
  const messagesEndRef = useRef(null); // Reference to the bottom of the message list

  useEffect(() => {
    if (!user) return; // Exit if there is no logged-in user
    const q = query(collection(db, `Users/${user.uid}/ChatBotConversations`), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe; // Detach listener on unmount
  }, [user]);

  useEffect(() => {
    // Automatically scroll to the bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Don't send empty messages
    if (!user) {
      alert('You must be logged in to send messages.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, text: input }),
      });

      const data = await response.json();
      if (response.ok) {
        setInput(''); // Clear input after sending
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message.');
    }
  };

  return (
    <div className={`chatbot-container ${visible ? 'visible' : ''}`}>
      <div className="phone-frame" onClick={toggleVisibility}>
        {/* Static Phone Image */}
      </div>
      <div className="chat-content">
        <div className="chatbot-messages">
          {messages.map(({ id, data }) => (
            <p key={id}>{data.text}</p> // Display each message
          ))}
          {/* Invisible div used as the "bottom anchor" for automatic scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={sendMessage} className="chatbot-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
