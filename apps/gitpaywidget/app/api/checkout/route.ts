import {
  StripeProvider,
  LemonSqueezyProvider,
  type CheckoutRequest,
  type ProviderCredentials,
} from '@gitpaywidget/payments-core';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { decryptSecret } from '@/lib/crypto';
import { checkRateLimit, getIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

/**
 * Hosted checkout endpoint: determines provider (Stripe/Lemon Squeezy),
 * loads encrypted credentials for the requested project, and returns a redirect URL.
 * 
 * Rate limited to 10 req/min to prevent abuse.
 */
const stripe = new StripeProvider();
const lemon = new LemonSqueezyProvider();
let ready = false;

async function ensureReady() {
  if (!ready) {
    await Promise.all([stripe.init(), lemon.init().catch(() => undefined)]);
    ready = true;
  }
}

export async function POST(req: NextRequest) {
  // Rate limit check
  const identifier = getIdentifier(req);
  const rateResult = checkRateLimit(identifier, RATE_LIMITS.checkout);
  
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', retryAfter: rateResult.retryAfter },
      { status: 429, headers: rateLimitHeaders(rateResult) }
    );
  }

  await ensureReady();
  
  let body: CheckoutRequest;
  try {
    body = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }

  // Validate required fields
  if (!body.project) {
    return NextResponse.json(
      { error: 'project is required' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }
  if (!body.plan) {
    return NextResponse.json(
      { error: 'plan is required' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }

  try {
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('id, provider_keys(provider, key, is_test_mode)')
      .eq('slug', body.project)
      .maybeSingle();
      
    if (error) {
      console.error('[checkout] Database error:', error.message);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500, headers: rateLimitHeaders(rateResult) }
      );
    }
    
    if (!project) {
      return NextResponse.json(
        { error: 'project not found' },
        { status: 404, headers: rateLimitHeaders(rateResult) }
      );
    }

    // Determine provider - prefer Stripe, fall back to Lemon Squeezy
    const stripeKey = (project.provider_keys as any[])?.find(
      key => key.provider === 'stripe'
    );
    const lemonKey = (project.provider_keys as any[])?.find(
      key => key.provider === 'lemonsqueezy'
    );

    let providerId: 'stripe' | 'lemonsqueezy';
    let providerKey: any;

    if (stripeKey) {
      providerId = 'stripe';
      providerKey = stripeKey;
    } else if (lemonKey) {
      providerId = 'lemonsqueezy';
      providerKey = lemonKey;
    } else {
      return NextResponse.json(
        { error: 'No payment provider configured. Please add Stripe or Lemon Squeezy credentials.' },
        { status: 400, headers: rateLimitHeaders(rateResult) }
      );
    }

    const decrypted = decryptSecret(providerKey.key as string);
    let credentials: ProviderCredentials;
    try {
      credentials = JSON.parse(decrypted) as ProviderCredentials;
    } catch {
      credentials = { secretKey: decrypted };
    }

    const provider = providerId === 'stripe' ? stripe : lemon;
    const checkout = await provider.createCheckout(body, credentials);

    // Log checkout attempt for analytics
    console.log(`[checkout] Created ${providerId} session for ${body.project}:${body.plan}`);

    return NextResponse.json(checkout, { headers: rateLimitHeaders(rateResult) });
  } catch (err: any) {
    console.error('[checkout] Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500, headers: rateLimitHeaders(rateResult) }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Checkout endpoint. POST with project and plan to create a checkout session.',
    docs: 'https://gitpaywidget.com/docs/api#checkout',
  });
}
