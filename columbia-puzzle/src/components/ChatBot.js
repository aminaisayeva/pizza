// src/components/ChatBot.js
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { db } from '../services/firebaseConfig';
import '../styles/ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useUser(); // Use the user from the UserContext

  useEffect(() => {
    if (!user) return; // Exit if there is no logged-in user
    // Query the current user's chatbot conversations
    const q = query(collection(db, `Users/${user.uid}/ChatBotConversations`), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe; // Detach listener on unmount
  }, [user]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Don't send empty messages
    if (!user) {
      alert('You must be logged in to send messages.');
      return;
    }

    try {
      // Send message via the backend API
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
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map(({ id, data }) => (
          <p key={id}>{data.text}</p> // Display each message
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off" // Prevent browser's autocomplete if desired
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
