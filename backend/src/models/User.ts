import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database';

export interface User {
  id: string;
  username?: string;
  session_id: string;
  created_at: string;
}

export function createSession(sessionId?: string): User {
  const db = getDatabase();
  const id = uuidv4();
  const session = sessionId || uuidv4();

  const stmt = db.prepare(`
    INSERT INTO users (id, session_id, created_at)
    VALUES (?, ?, datetime('now'))
  `);

  stmt.run(id, session);

  return {
    id,
    session_id: session,
    created_at: new Date().toISOString()
  };
}

export function getUserBySession(sessionId: string): User | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE session_id = ?');
  const user = stmt.get(sessionId) as User | undefined;
  return user || null;
}

export function getOrCreateUserBySession(sessionId: string): User {
  const existing = getUserBySession(sessionId);
  if (existing) {
    return existing;
  }
  return createSession(sessionId);
}
