import { getPool } from './db';
import updates from '../data/updates.json';

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
  const pool = getPool();

  console.log('🗄️  Starting database migration...');

  // Create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS timeline_entries (
      id VARCHAR(50) PRIMARY KEY,
      date DATE NOT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      source VARCHAR(255),
      url TEXT,
      category VARCHAR(50) DEFAULT 'research',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table created/verified');

  // Create indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_timeline_entries_date ON timeline_entries(date DESC);
    CREATE INDEX IF NOT EXISTS idx_timeline_entries_category ON timeline_entries(category);
  `);
  console.log('✅ Indexes created/verified');

  // Migrate data from JSON
  const entries = updates as Update[];
  let migrated = 0;
  let skipped = 0;

  for (const entry of entries) {
    try {
      await pool.query(`
        INSERT INTO timeline_entries (id, date, title, description, source, url, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          source = EXCLUDED.source,
          url = EXCLUDED.url,
          category = EXCLUDED.category,
          updated_at = CURRENT_TIMESTAMP
      `, [
        entry.id,
        entry.date,
        entry.title,
        entry.description,
        entry.source,
        entry.url || null,
        entry.category,
      ]);
      migrated++;
    } catch (err) {
      console.error(`❌ Error inserting ${entry.id}:`, err);
      skipped++;
    }
  }

  console.log(`✅ Migration complete: ${migrated} entries migrated, ${skipped} skipped`);

  // Verify
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM timeline_entries');
  console.log(`📊 Total entries in database: ${rows[0].count}`);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
