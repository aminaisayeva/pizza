import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import '../styles/ChatBot.css';
import { useUser } from '../context/UserContext'; // Import useUser hook

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useUser(); // Use the user from the UserContext

  useEffect(() => {
    if (!user) return; // Exit if there is no logged-in user
    // Query the current user's chatbot conversations
    const q = query(collection(db, `Users/${user.uid}/ChatBotConversations`), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe; // Detach listener on unmount
  }, [user]); // Depend on user

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Don't send empty messages
    if (!user) {
      alert("You must be logged in to send messages.");
      return;
    }
    // Add a new message to the current user's ChatBotConversations subcollection
    await addDoc(collection(db, `Users/${user.uid}/ChatBotConversations`), {
      text: input,
      timestamp: new Date(),
      messageType: 'sent', // You can specify if this is a 'sent' or 'received' message
    });
    setInput(''); // Clear the input after sending
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
