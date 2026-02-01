import { Pool } from 'pg';
import Database from 'better-sqlite3';

// Use PostgreSQL in production, SQLite for local development
const isPostgres = process.env.DATABASE_URL && process.env.NODE_ENV === 'production';

let pool: Pool | null = null;
let db: Database.Database | null = null;

export function getDb() {
  if (isPostgres) {
    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      });
    }
    return { type: 'postgres', pool };
  } else {
    if (!db) {
      db = new Database('timeline.db');
    }
    return { type: 'sqlite', db };
  }
}

export async function query(text: string, params?: any[]) {
  const { type, pool: pgPool, db: sqliteDb } = getDb();
  
  if (type === 'postgres') {
    return pgPool!.query(text, params);
  } else {
    const stmt = sqliteDb!.prepare(text);
    const isSelect = text.trim().toUpperCase().startsWith('SELECT');
    const isCount = text.toUpperCase().includes('COUNT(*)');
    
    if (isSelect || isCount) {
      return stmt.all(params);
    } else {
      return stmt.run(params);
    }
  }
}

export async function getUpdates() {
  const { type, pool: pgPool, db: sqliteDb } = getDb();
  
  if (type === 'postgres') {
    const result = await pgPool!.query('SELECT * FROM updates ORDER BY date DESC, created_at DESC');
    return result.rows;
  } else {
    return sqliteDb!.prepare('SELECT * FROM updates ORDER BY date DESC, created_at DESC').all();
  }
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  if (db) {
    db.close();
    db = null;
  }
}
