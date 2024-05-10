require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Route registration with error handling
try {
    app.use('/api', userRoutes);
    app.use('/api', inventoryRoutes);
    app.use('/api', chatRoutes);
} catch (err) {
    console.error('Error initializing routes:', err.message);
}

// Root route for testing
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server and log any errors
try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (err) {
    console.error('Server failed to start:', err);
}
