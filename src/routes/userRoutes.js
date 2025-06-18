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

// Health check endpoint - MUST be first to avoid being caught by /:id route
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
router.get('/', getUsers);
router.get('/:id', getUser);

export default router; 