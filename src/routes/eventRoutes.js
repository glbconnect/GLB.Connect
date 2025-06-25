import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, registerUser, unregisterUser, getRegistrations } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all events
router.get('/', getAllEvents);
// Get event by ID
router.get('/:id', getEventById);
// Create event (auth required)
router.post('/', authenticateToken, createEvent);
// Update event (auth required)
router.put('/:id', authenticateToken, updateEvent);
// Delete event (auth required)
router.delete('/:id', authenticateToken, deleteEvent);
// Register for event (auth required)
router.post('/:id/register', authenticateToken, registerUser);
// Unregister from event (auth required)
router.post('/:id/unregister', authenticateToken, unregisterUser);
// Get registrations for an event
router.get('/:id/registrations', getRegistrations);

export default router; 