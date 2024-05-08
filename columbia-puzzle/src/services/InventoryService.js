// src/services/InventoryService.js
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export const addInventoryItem = async (userId, itemData) => {
    if (!userId) throw new Error("No user ID provided");
  
    const inventoryRef = collection(db, `Users/${userId}/Inventory`);
    const docRef = await addDoc(inventoryRef, {
      ...itemData,
      unlocked: true, // or set based on itemData properties
      timestamp: new Date()
    });
  
    return docRef.id; // Returns the document ID of the new inventory item
  };


export const fetchInventoryItems = async (userId) => {
  if (!userId) return [];

  // Reference the user's Inventory subcollection
  const inventoryRef = collection(db, `Users/${userId}/Inventory`);
  // Query for all items, or add 'where' for specific conditions
  const q = query(inventoryRef, where("unlocked", "==", true));
  const querySnapshot = await getDocs(q);
  // Map through documents and return the data
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const uploadAudioFile = async (userId, audioFile) => {
  const formData = new FormData();
  formData.append('audioFile', audioFile);

  const response = await fetch(`http://localhost:5001/api/audio/upload/${userId}`, {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const data = await response.json();
    return data.url; // Return the public URL for the audio file
  }

  throw new Error('Error uploading audio file');
};

