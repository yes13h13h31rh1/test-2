import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database';

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  asset_type: string;
  file_path: string;
  file_format: string;
  poly_count?: number;
  material_slots?: number;
  style?: string;
  tags?: string;
  created_at: string;
}

export function createAsset(data: Omit<Asset, 'id' | 'created_at'>): Asset {
  const db = getDatabase();
  const id = uuidv4();

  const stmt = db.prepare(`
    INSERT INTO assets (id, user_id, name, description, asset_type, file_path, file_format, poly_count, material_slots, style, tags, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  stmt.run(
    id,
    data.user_id,
    data.name,
    data.description || null,
    data.asset_type,
    data.file_path,
    data.file_format,
    data.poly_count || null,
    data.material_slots || null,
    data.style || null,
    data.tags || null
  );

  return getAssetById(id)!;
}

export function getAssetById(id: string): Asset | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM assets WHERE id = ?');
  const asset = stmt.get(id) as Asset | undefined;
  return asset || null;
}

export function getUserAssets(userId: string, limit = 50, offset = 0): Asset[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM assets 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `);
  return stmt.all(userId, limit, offset) as Asset[];
}
