import { getDb, closeDb } from '../src/lib/db';
import LAB_MONITORS from '../src/lib/lab-monitors';

interface LabEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
}

function generateId(url: string, title: string): string {
  const str = `${url}-${title}`.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 60);
  const hash = Buffer.from(str).toString('base64').slice(0, 16);
  return `lab-${hash}`;
}

function sanitizeText(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 800);
}

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AI-Timeline-Monitor/1.0'
      },
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function extractOpenAIPosts(): Promise<LabEntry[]> {
  const entries: LabEntry[] = [];
  
  try {
    const response = await fetchWithTimeout('https://openai.com/api/content/blog');
    if (response.ok) {
      const data = await response.json();
      // If API exists, parse it
      if (Array.isArray(data)) {
        for (const post of data.slice(0, 5)) {
          entries.push({
            id: generateId(post.url || '', post.title || ''),
            date: post.date || new Date().toISOString().split('T')[0],
            title: sanitizeText(post.title) || 'OpenAI Announcement',
            description: sanitizeText(post.excerpt || post.description),
            source: 'OpenAI Blog',
            url: post.url || 'https://openai.com/blog',
            category: 'lab'
          });
        }
      }
    }
  } catch (error) {
    // API not available, skip
  }
  
  // Fallback: check main page for featured posts
  try {
    const response = await fetchWithTimeout('https://openai.com/news');
    if (response.ok) {
      const html = await response.text();
      
      // Simple extraction for OpenAI news page
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (titleMatch) {
        entries.push({
          id: generateId('https://openai.com/news', titleMatch[1]),
          date: new Date().toISOString().split('T')[0],
          title: sanitizeText(titleMatch[1]),
          description: 'OpenAI news update',
          source: 'OpenAI News',
          url: 'https://openai.com/news',
          category: 'lab'
        });
      }
    }
  } catch (error) {
    console.error(`❌ Failed to fetch OpenAI news: ${error instanceof Error ? error.message : error}`);
  }
  
  return entries;
}

async function extractAnthropicPosts(): Promise<LabEntry[]> {
  const entries: LabEntry[] = [];
  
  try {
    const response = await fetchWithTimeout('https://www.anthropic.com/api/content/blog');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        for (const post of data.slice(0, 5)) {
          entries.push({
            id: generateId(post.url || '', post.title || ''),
            date: post.date || new Date().toISOString().split('T')[0],
            title: sanitizeText(post.title) || 'Anthropic Research',
            description: sanitizeText(post.excerpt || post.description),
            source: 'Anthropic Blog',
            url: post.url || 'https://www.anthropic.com/blog',
            category: 'lab'
          });
        }
      }
    }
  } catch (error) {
    // API not available
  }
  
  return entries;
}

async function extractDeepMindPosts(): Promise<LabEntry[]> {
  const entries: LabEntry[] = [];
  
  try {
    const response = await fetchWithTimeout('https://deepmind.google/blog');
    if (response.ok) {
      const html = await response.text();
      
      // Look for blog post titles
      const titleMatches = html.match(/<h3[^>]*>([^<]+)<\/h3>/gi);
      if (titleMatches) {
        for (const match of titleMatches.slice(0, 5)) {
          const title = sanitizeText(match.replace(/<[^>]*>/g, ''));
          if (title.length > 10) {
            entries.push({
              id: generateId('https://deepmind.google/blog', title),
              date: new Date().toISOString().split('T')[0],
              title,
              description: 'Google DeepMind research update',
              source: 'Google DeepMind Blog',
              url: 'https://deepmind.google/blog',
              category: 'lab'
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Failed to fetch DeepMind blog: ${error instanceof Error ? error.message : error}`);
  }
  
  return entries;
}

async function monitorLabs() {
  console.log('🚀 Starting AI Lab monitoring...\n');
  
  const { type, pool, db } = getDb();
  console.log(`📊 Using database type: ${type}\n`);
  
  let totalNew = 0;
  
  // Monitor OpenAI
  process.stdout.write('📡 Checking OpenAI... ');
  const openaiPosts = await extractOpenAIPosts();
  let openaiCount = 0;
  for (const post of openaiPosts) {
    try {
      if (type === 'postgres') {
        await pool!.query(
          `INSERT INTO updates (id, date, title, description, source, url, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [post.id, post.date, post.title, post.description, post.source, post.url, post.category]
        );
      } else {
        db!.prepare(
          `INSERT OR IGNORE INTO updates (id, date, title, description, source, url, category)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(post.id, post.date, post.title, post.description, post.source, post.url, post.category);
      }
      openaiCount++;
    } catch (error) {
      // Ignore duplicates
    }
  }
  console.log(openaiCount > 0 ? `✅ ${openaiCount} posts` : '⚪ No new posts');
  totalNew += openaiCount;
  
  // Monitor Anthropic
  process.stdout.write('📡 Checking Anthropic... ');
  const anthropicPosts = await extractAnthropicPosts();
  let anthropicCount = 0;
  for (const post of anthropicPosts) {
    try {
      if (type === 'postgres') {
        await pool!.query(
          `INSERT INTO updates (id, date, title, description, source, url, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [post.id, post.date, post.title, post.description, post.source, post.url, post.category]
        );
      } else {
        db!.prepare(
          `INSERT OR IGNORE INTO updates (id, date, title, description, source, url, category)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(post.id, post.date, post.title, post.description, post.source, post.url, post.category);
      }
      anthropicCount++;
    } catch (error) {
      // Ignore duplicates
    }
  }
  console.log(anthropicCount > 0 ? `✅ ${anthropicCount} posts` : '⚪ No new posts');
  totalNew += anthropicCount;
  
  // Monitor Google DeepMind
  process.stdout.write('📡 Checking Google DeepMind... ');
  const deepmindPosts = await extractDeepMindPosts();
  let deepmindCount = 0;
  for (const post of deepmindPosts) {
    try {
      if (type === 'postgres') {
        await pool!.query(
          `INSERT INTO updates (id, date, title, description, source, url, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [post.id, post.date, post.title, post.description, post.source, post.url, post.category]
        );
      } else {
        db!.prepare(
          `INSERT OR IGNORE INTO updates (id, date, title, description, source, url, category)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(post.id, post.date, post.title, post.description, post.source, post.url, post.category);
      }
      deepmindCount++;
    } catch (error) {
      // Ignore duplicates
    }
  }
  console.log(deepmindCount > 0 ? `✅ ${deepmindCount} posts` : '⚪ No new posts');
  totalNew += deepmindCount;
  
  console.log(`\n📊 Lab Monitoring Summary: ${totalNew} new entries`);
  
  await closeDb();
}

monitorLabs().catch(console.error);
