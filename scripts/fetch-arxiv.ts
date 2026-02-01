import Parser from 'rss-parser';
import { getDb, closeDb } from '../src/lib/db';
import ARXIV_CONFIG from '../src/lib/arxiv-config';

interface ArxivEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
}

const parser = new Parser();

function extractArxivId(entryId: string): string {
  // Extract arXiv ID from entry:id or URL
  const match = entryId.match(/(\d{4}\.\d{4,5})/);
  return match ? match[1] : '';
}

function sanitizeText(text: string | undefined): string {
  if (!text) return '';
  // Remove HTML tags and arXiv TeX artifacts
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\$/g, '')
    .replace(/\\[a-zA-Z]+/g, '')
    .trim()
    .slice(0, 1500);
}

async function fetchArxivPapers() {
  console.log('🚀 Starting arXiv CS.AI daily scrape...\n');
  
  const { type, pool, db } = getDb();
  console.log(`📊 Using database type: ${type}\n`);
  
  let totalNew = 0;
  
  for (const config of ARXIV_CONFIG.queries) {
    process.stdout.write(`📄 Fetching ${config.label} (${config.name})... `);
    
    try {
      const url = `${ARXIV_CONFIG.baseUrl}?search_query=${config.query}&sortBy=${ARXIV_CONFIG.sortBy}&sortOrder=${ARXIV_CONFIG.sortOrder}&max_results=${ARXIV_CONFIG.maxResults}`;
      const feed = await parser.parseURL(url);
      
      let newCount = 0;
      
      for (const item of feed.items) {
        const arxivId = extractArxivId(item.id || '');
        if (!arxivId) continue;
        
        const id = `arxiv-${arxivId}`;
        const date = item.isoDate ? item.isoDate.split('T')[0] : new Date().toISOString().split('T')[0];
        const title = sanitizeText(item.title) || 'Untitled';
        const description = sanitizeText(item.contentSnippet || item.content);
        
        // Extract authors from title or description
        const authors = item.creator || 'Unknown';
        
        // Skip if too old (more than 7 days)
        const entryDate = new Date(date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (entryDate < weekAgo) continue;
        
        try {
          if (type === 'postgres') {
            await pool!.query(
              `INSERT INTO updates (id, date, title, description, source, url, category)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (id) DO NOTHING`,
              [id, date, title, description, `arXiv ${config.label}`, item.link || `https://arxiv.org/abs/${arxivId}`, 'research']
            );
          } else {
            db!.prepare(
              `INSERT OR IGNORE INTO updates (id, date, title, description, source, url, category)
               VALUES (?, ?, ?, ?, ?, ?, ?)`
            ).run(id, date, title, description, `arXiv ${config.label}`, item.link || `https://arxiv.org/abs/${arxivId}`, 'research');
          }
          newCount++;
        } catch (error) {
          // Ignore duplicate errors
        }
      }
      
      if (newCount > 0) {
        console.log(`✅ ${newCount} papers`);
        totalNew += newCount;
      } else {
        console.log(`⚪ No new papers`);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log(`\n📊 arXiv Summary: ${totalNew} new papers added\n`);
  
  // Show breakdown
  const { pool: countPool, db: countDb } = getDb();
  
  if (type === 'postgres') {
    const result = await countPool!.query("SELECT source, COUNT(*) as count FROM updates WHERE source LIKE 'arXiv%' GROUP BY source");
    result.rows.forEach((row: { source: string; count: string }) => {
      console.log(`  ${row.source}: ${row.count}`);
    });
  } else {
    const result = countDb!.prepare("SELECT source, COUNT(*) as count FROM updates WHERE source LIKE 'arXiv%' GROUP BY source").all() as { source: string; count: number }[];
    result.forEach((row) => {
      console.log(`  ${row.source}: ${row.count}`);
    });
  }
  
  await closeDb();
}

fetchArxivPapers().catch(console.error);
