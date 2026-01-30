import { NextResponse } from 'next/server';
import updates from '@/data/updates.json';

export async function GET() {
  const baseUrl = 'https://ai-timeline.vercel.app';
  
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Timeline</title>
    <link>${baseUrl}</link>
    <description>Daily updates from the AI world. Models, labs, and breakthroughs.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${updates.slice(0, 50).map((item: any) => `
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

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
