import express from 'express';
import {
  getActivePolls,
  createPoll,
  voteOnPoll,
  getUpcomingSessions,
  createSession,
  enrollInSession,
  getMySessions,
  getMentorSessions
} from '../controllers/mentorshipController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Poll routes
router.get('/polls', getActivePolls);
router.post('/polls', createPoll);
router.post('/polls/:pollId/vote', voteOnPoll);

// Session routes
router.get('/sessions', getUpcomingSessions);
router.post('/sessions', createSession);
router.post('/sessions/:sessionId/enroll', enrollInSession);
router.get('/sessions/my', getMySessions);
router.get('/sessions/mentor', getMentorSessions);

export default router;

