import express from 'express';
import { createAnonymousMessage, getAnonymousMessages } from '../models/AnonymousMessage.js';
import { authenticateToken } from '../middleware/auth.js';
import { getIO } from '../sockets/chatSocket.js';

const router = express.Router();

// Get all anonymous messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await getAnonymousMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error getting anonymous messages:', error);
    res.status(500).json({ message: 'Error getting anonymous messages' });
  }
});

// Create a new anonymous message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const message = await createAnonymousMessage(req.body);
    // Emit the new message to all connected clients
    const io = getIO();
    io.to('anonymous-chat').emit('anonymous-message', message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating anonymous message:', error);
    res.status(500).json({ message: 'Error creating anonymous message' });
  }
});

export default router;