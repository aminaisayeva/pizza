const express = require('express');
const router = express.Router();
const { db } = require('../firebaseAdmin');

// Create or update a user profile
router.post('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  try {
    const userRef = db.collection('Users').doc(userId);
    await userRef.set({ ...userData, createdAt: new Date() });
    res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user profile.' });
  }
});

module.exports = router;
