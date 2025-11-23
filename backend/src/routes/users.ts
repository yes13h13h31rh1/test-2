import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { getUserBySession } from '../models/User';

export const userRoutes = Router();

// Get current user
userRoutes.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const user = getUserBySession(req.sessionId!);
    res.json(user || { id: req.userId });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
});

// Create session (optional explicit endpoint)
userRoutes.post('/session', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    res.json({ session_id: req.sessionId, user_id: req.userId });
  } catch (error: any) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: error.message || 'Failed to create session' });
  }
});
