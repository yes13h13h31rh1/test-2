import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database';

export interface Script {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  script_type: string;
  code: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export function createScript(data: Omit<Script, 'id' | 'created_at' | 'updated_at'>): Script {
  const db = getDatabase();
  const id = uuidv4();

  const stmt = db.prepare(`
    INSERT INTO scripts (id, user_id, name, description, script_type, code, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  stmt.run(
    id,
    data.user_id,
    data.name,
    data.description || null,
    data.script_type,
    data.code,
    data.tags || null
  );

  return getScriptById(id)!;
}

export function getScriptById(id: string): Script | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM scripts WHERE id = ?');
  const script = stmt.get(id) as Script | undefined;
  return script || null;
}

export function getUserScripts(userId: string, limit = 50, offset = 0): Script[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM scripts 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `);
  return stmt.all(userId, limit, offset) as Script[];
}

export function deleteScript(id: string, userId: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM scripts WHERE id = ? AND user_id = ?');
  const result = stmt.run(id, userId);
  return result.changes > 0;
}
