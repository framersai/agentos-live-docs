import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  // Authenticate
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);

  let user: { id: string; email: string };
  try {
    const res = await fetch(`${API_BASE}/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    const body = await res.json();
    user = { id: body.user?.id ?? body.id, email: body.user?.email ?? body.email };
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }

  // Find the Stripe customer
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customer = customers.data[0];
  if (!customer) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
  }

  // Create portal session
  const origin = req.nextUrl.origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${origin}/wunderland`,
  });

  return NextResponse.json({ url: session.url });
}
