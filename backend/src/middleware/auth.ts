import { Request, Response, NextFunction } from 'express';
import { getOrCreateUserBySession } from '../models/User';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Get session ID from cookie or generate new one
  let sessionId = req.cookies.session_id;

  if (!sessionId) {
    sessionId = require('uuid').v4();
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: 'lax'
    });
  }

  // Get or create user by session
  const user = getOrCreateUserBySession(sessionId);
  req.userId = user.id;
  req.sessionId = sessionId;

  next();
}
