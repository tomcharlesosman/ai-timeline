const fs = require('fs');
const path = require('path');

const updates = require('../src/data/updates.json');

const baseUrl = 'https://ai-timeline-mu.vercel.app';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Timeline</title>
    <link>${baseUrl}</link>
    <description>Daily updates from the AI world. Models, labs, and breakthroughs.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${updates.slice(0, 50).map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${baseUrl}/#${item.id}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
      <category>${item.category}</category>
      <source url="${item.url}">${item.source}</source>
    </item>
    `.trim()).join('\n    ')}
  </channel>
</rss>`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'feed.xml'), rss);
console.log('Generated feed.xml');
