// src/services/FirestoreService.js
import { db } from './firebaseConfig';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

export const createUserProfileDocument = async (userId, userData) => {
  if (!userId) return;
  
  const userRef = doc(db, "Users", userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date() // Add a created timestamp
  });
};

export const saveWhiteboardSession = async (userId, sessionData) => {
  if (!userId) return;

  const sessionRef = collection(db, `Users/${userId}/Whiteboard`);
  await addDoc(sessionRef, {
    ...sessionData,
    timestamp: new Date() // Add a timestamp to each whiteboard session
  });
};

export const saveInventoryItem = async (userId, itemData) => {
  if (!userId) return;

  const inventoryRef = collection(db, `Users/${userId}/Inventory`);
  await addDoc(inventoryRef, {
    ...itemData,
    unlocked: true, // Assume new items are unlocked by default
    timestamp: new Date() // Add a timestamp to each inventory item
  });
};

export const saveChatMessage = async (userId, messageData) => {
  if (!userId) return;

  const chatRef = collection(db, `Users/${userId}/ChatBotConversations`);
  await addDoc(chatRef, {
    ...messageData,
    timestamp: new Date() // Add a timestamp to each chat message
  });
};
