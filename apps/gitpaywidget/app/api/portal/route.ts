import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { decryptSecret } from '@/lib/crypto';
import { checkRateLimit, getIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

/**
 * Stripe Customer Portal session creation
 * 
 * Creates a portal session that allows customers to:
 * - Update payment methods
 * - View invoices
 * - Cancel subscriptions
 * - Change plans
 */

export async function POST(req: NextRequest) {
  // Rate limit check
  const identifier = getIdentifier(req);
  const rateResult = checkRateLimit(identifier, RATE_LIMITS.authenticated);
  
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateResult.retryAfter },
      { status: 429, headers: rateLimitHeaders(rateResult) }
    );
  }

  try {
    const body = await req.json();
    const { projectSlug, customerId, returnUrl } = body;

    if (!projectSlug) {
      return NextResponse.json({ error: 'projectSlug is required' }, { status: 400 });
    }

    // Get project and Stripe credentials
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, provider_keys(provider, key)')
      .eq('slug', projectSlug)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Find Stripe credentials
    const stripeKey = (project.provider_keys as any[])?.find(
      (k: any) => k.provider === 'stripe'
    );

    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe not configured for this project' },
        { status: 400 }
      );
    }

    // Decrypt Stripe credentials
    const decrypted = decryptSecret(stripeKey.key);
    let credentials: { secretKey?: string };
    
    try {
      credentials = JSON.parse(decrypted);
    } catch {
      credentials = { secretKey: decrypted };
    }

    if (!credentials.secretKey) {
      return NextResponse.json(
        { error: 'Invalid Stripe credentials' },
        { status: 500 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(credentials.secretKey, {
      apiVersion: '2023-10-16',
    });

    // Create portal session
    // If no customerId provided, we need to look it up or create one
    let stripeCustomerId = customerId;

    if (!stripeCustomerId) {
      // For now, return error - in production, you'd look up by email or session
      return NextResponse.json(
        { error: 'customerId is required to access billing portal' },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
    });

    return NextResponse.json(
      { url: session.url },
      { headers: rateLimitHeaders(rateResult) }
    );
  } catch (err: any) {
    console.error('[portal] Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for portal info
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Customer portal endpoint. POST with projectSlug and customerId to create a session.',
    docs: 'https://gitpaywidget.com/docs/api#portal',
  });
}


