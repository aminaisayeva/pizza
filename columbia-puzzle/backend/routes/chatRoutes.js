// backend/routes/chatRoutes.js
const express = require('express');
const { db } = require('../firebaseAdmin');
const router = express.Router();

// Route to save chat messages
router.post('/chat/message', async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.collection(`Users/${userId}/ChatBotConversations`).add({
      text,
      timestamp: new Date(),
      messageType: 'sent', // Specify the message type
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Unable to save message' });
  }
});

module.exports = router;
