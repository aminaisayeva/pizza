// backend/openaiConfig.js
const OpenAI = require('openai');

// Load the API key securely via environment variables
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API Key in environment variables.');
}

// Initialize the OpenAI client with the new syntax
const openai = new OpenAI({
  apiKey
});

// Export the OpenAI client for use in other files
module.exports = openai;
