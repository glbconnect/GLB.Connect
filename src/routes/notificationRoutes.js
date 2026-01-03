import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.put('/:notificationId/read', verifyToken, markAsRead);

export default router;
