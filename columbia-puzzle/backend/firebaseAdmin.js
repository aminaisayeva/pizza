// backend/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./columbia-quest-firebase-adminsdk-4u6oy-590b84e44c.json'); // Adjust to point to your downloaded JSON file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  // Export Firestore and the admin SDK
const db = admin.firestore();
module.exports = { db, admin };


