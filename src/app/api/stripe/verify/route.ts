import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' })
  : null;

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
    
    if (session.payment_status === 'paid') {
      return NextResponse.json({ valid: true, email: session.customer_email });
    }
    
    return NextResponse.json({ valid: false });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
}
