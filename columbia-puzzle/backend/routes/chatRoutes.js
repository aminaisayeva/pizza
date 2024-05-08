// backend/routes/chatRoutes.js
const express = require('express');
const { db } = require('../firebaseAdmin');
const router = express.Router();

// Predefined chatbot script responses
const script = {
  greeting: "Greetings, traveler. I'm Hermes, your riddle master. The journey you are about to embark upon is not one to take alone. Gather your peers and share your wisdom, for the odyssey of knowledge is best ventured together. What's your name, wanderer?",
  askName: "What's your name?",
  welcomeUser: (name) => `Hi ${name}, nice to meet you! Make sure to think outside the box.`,
  welcomeBack: (name) => `Welcome back, ${name}! Ready for more riddles?`,
  audioClue: "Here's your first clue, give it a listen and tell me what you think: https://firebasestorage.googleapis.com/v0/b/columbia-quest.appspot.com/o/chatbot%2Faudio%2Fmorsecode_21c90nu1l7v9r827obgv63e419.wav?alt=media&token=e010c5aa-5ba7-4a85-ab7b-8763a41b8702",
  closeHint: "You're close! Keep thinking along those lines.",
  clueSolved: (name) => `Well done, ${name}! You've unlocked the next clue!`,
  end: "Good luck, and let me know if you need more help!",
  reset: "You've been reset. It's like meeting you for the first time again!",
  fallback: "Sorry, can you try again?"
};

// Function to retrieve the user's name from Firestore
async function getUserName(userId) {
  const userDoc = await db.collection('Users').doc(userId).get();
  return userDoc.exists ? userDoc.data().name : null;
}

// Function to set or update the user's name in Firestore
async function setUserName(userId, name) {
  await db.collection('Users').doc(userId).set({ name });
}

// Function to reset the user's data in Firestore
async function resetUser(userId) {
  await db.collection('Users').doc(userId).delete();
}

// New route to handle login logic
router.post('/chat/login', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Retrieve the user's name, if it exists
    const userName = await getUserName(userId);

    // Determine if it's a "Welcome back" or a new user scenario
    let responseMessage;
    if (userName) {
      responseMessage = script.welcomeBack(userName);
    } else {
      responseMessage = script.greeting;
    }

    // Add bot response to Firestore
    const chatRef = db.collection(`Users/${userId}/ChatBotConversations`);
    await chatRef.add({
      text: responseMessage,
      timestamp: new Date(),
      messageType: 'received' // Received from the bot
    });

    res.status(201).json({ success: true, message: responseMessage });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Unable to complete login' });
  }
});

// Existing route to handle chat messages
router.post('/chat/message', async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Retrieve the user's name, if it exists
    let userName = await getUserName(userId);

    // Add user message to Firestore
    const chatRef = db.collection(`Users/${userId}/ChatBotConversations`);
    await chatRef.add({
      text,
      timestamp: new Date(),
      messageType: 'sent', // Sent by the user
    });

    // Normalize the user's input
    const lowerText = text.toLowerCase();
    let responseMessage = script.fallback;

    // Determine the chatbot's response
    if (lowerText.includes('reset')) {
      await resetUser(userId);
      responseMessage = `${script.reset} ${script.greeting}`;
      userName = null; // Force the user to provide their name again
    } else if (!userName) {
      // If no name is set, assume a single-word input after asking for a name is the user's name
      const words = text.trim().split(/\s+/);
      if (lowerText.includes('name is') || lowerText.startsWith("i'm ") || lowerText.startsWith("i am ")) {
        userName = words.slice(-1)[0]; // Use the last word as the name
      } else if (words.length === 1) {
        userName = text;
      }

      if (userName) {
        await setUserName(userId, userName);

        // Send the welcome message first
        responseMessage = `${script.welcomeUser(userName)}`;
        await chatRef.add({
          text: responseMessage,
          timestamp: new Date(),
          messageType: 'received'
        });

        // Then send the audio clue
        responseMessage = script.audioClue;
      } else {
        responseMessage = script.askName;
      }
    } else {
      // Determine subsequent actions based on the user's input
      if (lowerText.includes('class') || lowerText.includes('programming') || lowerText.includes('intro') ||
        lowerText.includes('introduction') || lowerText.includes('java') || lowerText.includes('morse code') ||
        lowerText.includes('code') || lowerText.includes('morse')) {
        responseMessage = script.closeHint;
      } else if (lowerText.includes('coms1004') || lowerText.includes('coms 1004') || lowerText.includes('coms1004') || lowerText.includes('coms 1004')) {
        responseMessage = script.clueSolved(userName);
      } else if (lowerText.includes('end')) {
        responseMessage = script.end;
      } else {
        responseMessage = script.fallback;
      }
    }

    // Add bot response to Firestore
    await chatRef.add({
      text: responseMessage,
      timestamp: new Date(),
      messageType: 'received' // Received from the bot
    });

    res.status(201).json({ success: true });
  }
  catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Unable to save message' });
  }
});

module.exports = router;
