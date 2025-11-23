import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// For Render.com, use persistent disk if available, otherwise use temp directory
let defaultDbPath: string;
if (process.env.RENDER_DISK_PATH) {
  // Use persistent disk path on Render
  defaultDbPath = path.join(process.env.RENDER_DISK_PATH, 'uefn_generator.db');
} else if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgres')) {
  // Use DATABASE_URL if it's a file path (not PostgreSQL)
  defaultDbPath = process.env.DATABASE_URL;
} else {
  // Default to local data directory
  defaultDbPath = './data/uefn_generator.db';
}

const dbPath = defaultDbPath;
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDatabase() {
  const db = getDatabase();

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      session_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Scripts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS scripts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      script_type TEXT NOT NULL,
      code TEXT NOT NULL,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Assets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      asset_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_format TEXT NOT NULL,
      poly_count INTEGER,
      material_slots INTEGER,
      style TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
    CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at);
    CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
    CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at);
  `);

  console.log('✅ Database initialized');
}
