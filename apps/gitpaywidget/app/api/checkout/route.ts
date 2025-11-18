import {
  StripeProvider,
  LemonSqueezyProvider,
  type CheckoutRequest,
  type ProviderCredentials,
} from '@gitpaywidget/payments-core';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { decryptSecret } from '@/lib/crypto';

/**
 * Hosted checkout endpoint: determines provider (Stripe/Lemon Squeezy),
 * loads encrypted credentials for the requested project, and returns a redirect URL.
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
  await ensureReady();
  const body = (await req.json()) as CheckoutRequest;
  try {
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('id, provider_keys(provider, key)')
      .eq('slug', body.project)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });
    const providerId = body.plan === 'pro' ? 'stripe' : 'lemonsqueezy';
    const providerKey = project.provider_keys?.find(key => key.provider === providerId);
    if (!providerKey) {
      return NextResponse.json({ error: `missing ${providerId} credentials` }, { status: 400 });
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
    return NextResponse.json(checkout);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
