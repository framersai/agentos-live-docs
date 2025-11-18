import {
  StripeProvider,
  LemonSqueezyProvider,
  type ProviderWebhookEvent,
} from '@gitpaywidget/payments-core';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook receiver for provider events (Stripe / Lemon Squeezy).
 * Downstream systems reconcile sessions based on `sessionId`.
 */
const stripe = new StripeProvider();
const lemon = new LemonSqueezyProvider();
let ready = false;
async function init() {
  if (!ready) {
    await Promise.all([stripe.init(), lemon.init().catch(() => undefined)]);
    ready = true;
  }
}

async function handleEvent(evt: ProviderWebhookEvent) {
  console.log('[webhook] event', evt.type, evt.sessionId);
  // TODO: update DB, email hooks, etc.
}

export async function POST(req: NextRequest) {
  await init();
  const provider = req.headers.get('x-gpw-provider') || 'stripe';
  const raw = await req.text();
  let event: ProviderWebhookEvent;
  try {
    if (provider === 'stripe') {
      event = await stripe.verifyWebhook(Object.fromEntries(req.headers), raw);
    } else {
      event = await lemon.verifyWebhook(Object.fromEntries(req.headers), raw);
    }
    await handleEvent(event);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
