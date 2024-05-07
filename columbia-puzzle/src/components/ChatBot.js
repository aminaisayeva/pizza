import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { db } from '../services/firebaseConfig';
import '../styles/ChatBot.css';

// Determine the label for each message based on the sender
const getLabel = (type) => {
  return type === 'sent' ? 'ME: ' : 'Hermes: ';
};

const ChatBot = ({ visible, toggleVisibility }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `Users/${user.uid}/ChatBotConversations`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
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
        setInput('');
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
      <div className="phone-frame" onClick={toggleVisibility} />

      <div className="chat-content">
        <div className="chatbot-messages">
          {messages.map(({ id, data }) => (
            <div key={id} className="chat-message">
              <p>{getLabel(data.messageType)}{data.text}</p>
            </div>
          ))}
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
