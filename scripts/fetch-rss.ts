import Parser from 'rss-parser';
import RSS_FEEDS from '../src/lib/rss-feeds';
import { getDb, query, closeDb } from '../src/lib/db';

interface FeedItem {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
}

interface FeedEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
}

const parser = new Parser();

function generateId(url: string, title: string): string {
  const str = `${url}-${title}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const hash = Buffer.from(str).toString('base64').slice(0, 20);
  return `rss-${hash}`;
}

function sanitizeText(text: string | undefined): string {
  if (!text) return '';
  // Remove HTML tags
  return text.replace(/<[^>]*>/g, '').trim().slice(0, 1000);
}

async function fetchFeed(feed: typeof RSS_FEEDS[0]): Promise<FeedEntry[]> {
  try {
    const feedData = await parser.parseURL(feed.url);
    
    return feedData.items.slice(0, 10).map((item: FeedItem) => ({
      id: generateId(feed.url, item.title || ''),
      date: item.isoDate ? item.isoDate.split('T')[0] : (item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      title: sanitizeText(item.title) || 'Untitled',
      description: sanitizeText(item.contentSnippet || item.content) || '',
      source: feed.name,
      url: item.link || '',
      category: feed.category
    }));
  } catch (error) {
    console.error(`❌ Failed to fetch ${feed.name}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

async function fetchAllFeeds() {
  console.log('🚀 Starting RSS feed ingestion...\n');
  
  const { type, pool, db } = getDb();
  console.log(`📊 Using database type: ${type}\n`);
  
  let totalNew = 0;
  let totalErrors = 0;
  
  for (const feed of RSS_FEEDS) {
    process.stdout.write(`📥 Fetching ${feed.name}... `);
    
    const entries = await fetchFeed(feed);
    let newCount = 0;
    
    for (const entry of entries) {
      try {
        if (type === 'postgres') {
          await pool!.query(
            `INSERT INTO updates (id, date, title, description, source, url, category)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING`,
            [entry.id, entry.date, entry.title, entry.description, entry.source, entry.url, entry.category]
          );
        } else {
          db!.prepare(
            `INSERT OR IGNORE INTO updates (id, date, title, description, source, url, category)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).run(entry.id, entry.date, entry.title, entry.description, entry.source, entry.url, entry.category);
        }
        newCount++;
      } catch (error) {
        // Ignore duplicate errors
      }
    }
    
    if (newCount > 0) {
      console.log(`✅ ${newCount} entries`);
      totalNew += newCount;
    } else {
      console.log(`⚪ No new entries`);
    }
  }
  
  console.log(`\n📊 Summary: ${totalNew} new entries, ${totalErrors} errors`);
  
  // Show source breakdown
  console.log('\n📈 Entries by source:');
  const { pool: countPool, db: countDb } = getDb();
  let countResult;
  
  if (type === 'postgres') {
    countResult = await countPool!.query('SELECT source, COUNT(*) as count FROM updates GROUP BY source ORDER BY count DESC LIMIT 15');
    countResult.rows.forEach((row: { source: string; count: string }) => {
      console.log(`  ${row.source}: ${row.count}`);
    });
  } else {
    countResult = countDb!.prepare('SELECT source, COUNT(*) as count FROM updates GROUP BY source ORDER BY count DESC LIMIT 15').all() as { source: string; count: number }[];
    countResult.forEach((row) => {
      console.log(`  ${row.source}: ${row.count}`);
    });
  }
  
  await closeDb();
}

fetchAllFeeds().catch(console.error);
