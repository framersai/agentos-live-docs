import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import { TRIAL_DAYS } from '@/config/pricing';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  // Authenticate: read the user's JWT from Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);

  // Validate the token by calling the backend
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

  // Parse request body
  const { planId } = (await req.json()) as { planId?: string };
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan || !plan.priceId) {
    return NextResponse.json({ error: 'Invalid plan or plan not configured' }, { status: 400 });
  }

  // Create or retrieve Stripe customer
  const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customer =
    existingCustomers.data[0] ??
    (await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    }));

  // Create Checkout Session
  const origin = req.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: 'subscription',
    line_items: [{ price: plan.priceId, quantity: 1 }],
    // Free trial: don't force payment method collection at checkout (no card required).
    payment_method_collection: TRIAL_DAYS > 0 ? 'if_required' : 'always',
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    metadata: { userId: user.id, planId: plan.id },
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      trial_settings: {
        end_behavior: {
          // If a user never adds a payment method during the trial, cancel automatically.
          missing_payment_method: 'cancel',
        },
      },
      metadata: { userId: user.id, planId: plan.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
