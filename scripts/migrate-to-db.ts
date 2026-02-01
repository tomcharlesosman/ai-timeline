import fs from 'fs';
import path from 'path';
import { getDb, closeDb } from '../src/lib/db';

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: string;
}

async function migrate() {
  console.log('🚀 Starting PostgreSQL migration...');
  
  const { type, pool, db } = getDb();
  console.log(`📊 Using database type: ${type}`);
  
  // Read the JSON data
  const updatesPath = path.join(process.cwd(), 'src', 'data', 'updates.json');
  const updatesData = JSON.parse(fs.readFileSync(updatesPath, 'utf-8')) as Update[];
  console.log(`📄 Found ${updatesData.length} updates to migrate`);
  
  if (type === 'postgres') {
    // PostgreSQL setup
    await pool!.query(`
      CREATE TABLE IF NOT EXISTS updates (
        id VARCHAR(50) PRIMARY KEY,
        date DATE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        source VARCHAR(200) NOT NULL,
        url TEXT,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await pool!.query(`CREATE INDEX IF NOT EXISTS idx_updates_date ON updates(date)`);
    await pool!.query(`CREATE INDEX IF NOT EXISTS idx_updates_category ON updates(category)`);
    await pool!.query(`CREATE INDEX IF NOT EXISTS idx_updates_source ON updates(source)`);
    
    // Clear existing data
    await pool!.query('TRUNCATE TABLE updates');
    
    for (const update of updatesData) {
      await pool!.query(
        `INSERT INTO updates (id, date, title, description, source, url, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [update.id, update.date, update.title, update.description, update.source, update.url || null, update.category]
      );
    }
  } else {
    // SQLite setup
    db!.prepare(`
      CREATE TABLE IF NOT EXISTS updates (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        source TEXT NOT NULL,
        url TEXT,
        category TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    
    // Create indexes
    db!.prepare(`CREATE INDEX IF NOT EXISTS idx_updates_date ON updates(date)`).run();
    db!.prepare(`CREATE INDEX IF NOT EXISTS idx_updates_category ON updates(category)`).run();
    db!.prepare(`CREATE INDEX IF NOT EXISTS idx_updates_source ON updates(source)`).run();
    
    // Clear existing data
    db!.prepare('DELETE FROM updates').run();
    
    const insertStmt = db!.prepare(
      `INSERT OR IGNORE INTO updates (id, date, title, description, source, url, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    
    for (const update of updatesData) {
      insertStmt.run(
        update.id,
        update.date,
        update.title,
        update.description,
        update.source,
        update.url || null,
        update.category
      );
    }
  }
  
  console.log('✅ Migration complete!');
  
  // Verify
  const { pool: verifyPool, db: verifyDb } = getDb();
  let count: number;
  
  if (type === 'postgres') {
    const result = await verifyPool!.query('SELECT COUNT(*) as count FROM updates');
    count = result.rows[0]?.count;
  } else {
    const result = verifyDb!.prepare('SELECT COUNT(*) as count FROM updates').get() as { count: number };
    count = result.count;
  }
  
  console.log(`📊 Database now contains ${count} updates`);
  
  await closeDb();
}

migrate().catch(console.error);
