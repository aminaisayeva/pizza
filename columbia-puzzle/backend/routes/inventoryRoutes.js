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

// Install the 'multer' middleware for file uploads
const multer = require('multer');
const { storage, admin } = require('../firebaseAdmin');
const upload = multer({ storage: multer.memoryStorage() });

// Route to upload audio files to Firebase Storage
router.post('/audio/upload/:userId', upload.single('audioFile'), async (req, res) => {
  const { userId } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const bucket = admin.storage().bucket('columbia-quest.appspot.com');
  const blob = bucket.file(`users/${userId}/audio/${req.file.originalname}`);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  blobStream.on('error', (err) => res.status(500).json({ error: err.message }));
  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).json({ url: publicUrl });
  });

  blobStream.end(req.file.buffer);
});


module.exports = router;
