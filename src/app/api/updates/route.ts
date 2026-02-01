import { NextResponse } from 'next/server';
import { getUpdates } from '@/lib/db';

export async function GET() {
  try {
    const updates = await getUpdates();
    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}
