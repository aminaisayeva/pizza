const express = require('express');
const { db } = require('../firebaseAdmin');
const openai = require('../openaiConfig'); // Import OpenAI configuration
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

// Function to generate a response using OpenAI
// Function to generate a response using OpenAI
// Function to generate a response using OpenAI with improved prompt structure
async function generateOpenAIResponseWithHistory(prompt, userName, conversationHistory) {
  // Create a structured prompt by including important clues and past interactions
  const fullPrompt = `
    You are Hermes, a Greek god of riddles who helps the "traveler" navigate puzzles. Here are some scripted clues and interactions to keep in mind:
    1. Greetings: "${script.greeting}"
    2. Welcome Back: "${script.welcomeBack(userName)}"
    3. Close Hint: "${script.closeHint}"
    4. Audio Clue: "${script.audioClue}"

    The Audio message contains the first clue, which is an audio of morse code that when translated prompts the person to answer the question.

    Use a succinct and mysterious tone in your responses.

    Here’s the recent conversation with the traveler:
    ${conversationHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

    Traveler's new question: "${prompt}"
    Reply to the following question, keeping the hints and secrets intact.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: fullPrompt }],
  });

  return response.choices[0].message.content;
}



// New route to handle login logic
// New login logic to welcome back the user or introduce them as new
router.post('/chat/login', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Retrieve the user's name
    let userName = await getUserName(userId);
    const chatRef = db.collection(`Users/${userId}/ChatBotConversations`);

    // Determine if the user is returning or new
    let responseMessage = userName ? script.welcomeBack(userName) : script.greeting;

    // Add the primary message
    await chatRef.add({
      text: responseMessage,
      timestamp: new Date(),
      messageType: 'received',
    });

    // Only ask for the name if the user is new or reset
    if (!userName) {
      await chatRef.add({
        text: script.askName,
        timestamp: new Date(),
        messageType: 'received',
      });
    }

    // Respond with all the messages sent
    res.status(201).json({ success: true, messages: [responseMessage, ...(userName ? [] : [script.askName])] });
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
    // Retrieve the user's conversation history
    const chatRef = db.collection(`Users/${userId}/ChatBotConversations`);
    const chatHistorySnapshot = await chatRef.orderBy('timestamp').get();
    const conversationHistory = chatHistorySnapshot.docs.map((doc) => ({
      sender: doc.data().messageType === 'sent' ? 'Traveler' : 'Hermes',
      text: doc.data().text,
    }));

    // Add user message to Firestore
    await chatRef.add({
      text,
      timestamp: new Date(),
      messageType: 'sent', // Sent by the user
    });

    // Retrieve the user's name if available
    let userName = await getUserName(userId);
    const lowerText = text.toLowerCase();
    let responseMessage = script.fallback;

    // Handle reset logic
    if (lowerText.includes('reset')) {
      await resetUser(userId);
      responseMessage = `${script.reset} ${script.greeting}`;
      userName = null;
    } else if (!userName) {
      // Handle cases where the user's name is not set
      const words = text.trim().split(/\s+/);
      if (lowerText.includes('name is') || lowerText.startsWith("i'm ") || lowerText.startsWith("i am ")) {
        userName = words.slice(-1)[0]; // Use the last word as the name
      } else if (words.length === 1) {
        userName = text;
      }

      if (userName) {
        await setUserName(userId, userName);
        responseMessage = `${script.welcomeUser(userName)}`;
        await chatRef.add({
          text: responseMessage,
          timestamp: new Date(),
          messageType: 'received',
        });
        responseMessage = script.audioClue;
      } else {
        responseMessage = script.askName;
      }
    } else {
      // Handle keyword-based responses
      if (lowerText.includes('clue') || lowerText.includes('audio') || lowerText.includes('listen') || lowerText.includes('riddle')){
        responseMessage = script.audioClue;
      } else if (lowerText.includes('coms1004') || lowerText.includes('coms 1004')) {
        responseMessage = script.clueSolved(userName);
      } else if (lowerText.includes('end')) {
        responseMessage = script.end;
      } else if (lowerText.includes('morse code') || lowerText.includes('programming') || lowerText.includes('java')) {
        responseMessage = script.closeHint;
      } else {
        // Use OpenAI for non-predefined inputs while maintaining a mysterious tone
        responseMessage = await generateOpenAIResponseWithHistory(text, userName, conversationHistory);
      }
    }

    // Add bot response to Firestore
    await chatRef.add({
      text: responseMessage,
      timestamp: new Date(),
      messageType: 'received', // Received from the bot
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Unable to save message' });
  }
});

module.exports = router;
