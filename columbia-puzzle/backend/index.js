// backend/index.js
require('dotenv').config()
const express = require('express');
const cors = require('cors'); // Import the cors package
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const chatRoutes = require('./routes/chatRoutes'); // New import

// const openai = require('../openaiConfig');


const app = express();
const PORT = process.env.PORT || 5001;

// backend/index.js
app.use(cors());

// Enable CORS and allow requests from the front-end origin
// app.use(cors({ origin: 'http://localhost:3001' })); // Adjust to the appropriate origin
app.use(express.json());

// Use the user, inventory, and chat routes
app.use('/api', userRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', chatRoutes); // New chat routes

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
