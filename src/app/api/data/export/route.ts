import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import updates from '@/data/updates.json';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' })
  : null;

function generateCSV(data: typeof updates): string {
  const headers = ['id', 'date', 'category', 'title', 'description', 'source', 'url'];
  const rows = data.map(item => [
    item.id,
    item.date,
    item.category,
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.description.replace(/"/g, '""')}"`,
    item.source,
    item.url || ''
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export async function GET(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  
  const sessionId = req.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'No session ID' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 });
    }

    const csv = generateCSV(updates);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="ai-timeline-dataset.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
  }
}
