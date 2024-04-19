import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import '../styles/ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe; // Detach listener on unmount
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    await addDoc(collection(db, "messages"), {
      text: input,
      timestamp: new Date(),
    });
    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map(({ id, data }) => (
          <p key={id}>{data.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
