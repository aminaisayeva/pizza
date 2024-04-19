// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database'; // Optional

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFP6irqXvm1nFevfVD3XJq79GYZov2cis",
  authDomain: "columbia-quest.firebaseapp.com",
  projectId: "columbia-quest",
  storageBucket: "columbia-quest.appspot.com",
  messagingSenderId: "679712263019",
  appId: "1:679712263019:web:f8612d7f3e80dc78c15a2e",
  measurementId: "G-5WQJXDRE4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDB = getDatabase(app); // Optional