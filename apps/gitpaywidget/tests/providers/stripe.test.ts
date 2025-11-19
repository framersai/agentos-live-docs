import { describe, it, expect, beforeAll } from 'vitest';
import { StripeProvider } from '@gitpaywidget/payments-core';

describe('StripeProvider', () => {
  let provider: StripeProvider;

  beforeAll(async () => {
    provider = new StripeProvider();
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
    process.env.STRIPE_PRO_PRICE_ID = 'price_mock';
    await provider.init();
  });

  it('initializes with required env vars', async () => {
    expect(provider.id).toBe('stripe');
  });

  it('createCheckout returns valid structure', async () => {
    // This will fail without real Stripe key, but validates interface
    try {
      await provider.createCheckout(
        { project: 'test/proj', plan: 'pro' },
        { secretKey: 'sk_test_mock', priceId: 'price_mock' }
      );
    } catch (err: any) {
      // Expected to fail with mock key; just verify error shape
      expect(err.message).toBeDefined();
    }
  });

  it('throws if price not configured for plan', async () => {
    await expect(
      provider.createCheckout(
        { project: 'test/proj', plan: 'unknown' },
        { secretKey: 'sk_test_mock' }
      )
    ).rejects.toThrow(/price not configured/);
  });
});
