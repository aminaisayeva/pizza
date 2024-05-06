const express = require('express');
const router = express.Router();
const { db } = require('../firebaseAdmin');

// Fetch inventory items for a user
router.get('/inventory/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const inventorySnapshot = await db.collection(`Users/${userId}/Inventory`).get();
    const items = inventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory items.' });
  }
});

// Add an inventory item to the user's collection
router.post('/inventory/:userId', async (req, res) => {
  const { userId } = req.params;
  const itemData = req.body;
  try {
    const inventoryRef = db.collection(`Users/${userId}/Inventory`);
    await inventoryRef.add({ ...itemData, unlocked: true, timestamp: new Date() });
    res.status(201).json({ message: 'Inventory item added successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding inventory item.' });
  }
});

module.exports = router;
