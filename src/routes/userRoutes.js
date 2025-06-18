import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUser, 
  getUsers, 
  getCurrentUser 
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'QNA Threads API is running',
    timestamp: new Date().toISOString()
  });
});

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.get('/:id', getUser);
router.get('/', getUsers);

export default router; 