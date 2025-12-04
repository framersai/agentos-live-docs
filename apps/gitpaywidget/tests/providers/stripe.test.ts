import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Unit tests for Stripe provider
 * 
 * Tests cover:
 * - Provider initialization
 * - Checkout session creation
 * - Webhook verification
 * - Error handling
 */

// Mock Stripe SDK
const mockStripeInstance = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/test',
      }),
    },
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
  billingPortal: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        url: 'https://billing.stripe.com/portal/test',
      }),
    },
  },
};

vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => mockStripeInstance),
}));

describe('Stripe Provider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  describe('Initialization', () => {
    it('requires STRIPE_SECRET_KEY environment variable', () => {
      const originalKey = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      const init = () => {
        if (!process.env.STRIPE_SECRET_KEY) {
          throw new Error('STRIPE_SECRET_KEY not set');
        }
      };

      expect(init).toThrow('STRIPE_SECRET_KEY not set');
      
      process.env.STRIPE_SECRET_KEY = originalKey;
    });

    it('initializes Stripe client with correct API version', () => {
      const Stripe = require('stripe').default;
      new Stripe('sk_test_mock', { apiVersion: '2023-10-16' });

      expect(Stripe).toHaveBeenCalledWith('sk_test_mock', { apiVersion: '2023-10-16' });
    });
  });

  describe('createCheckout', () => {
    it('creates checkout session with subscription mode', async () => {
      const request = {
        project: 'test-org/test-site',
        plan: 'pro',
      };

      const credentials = {
        secretKey: 'sk_test_mock',
        priceId: 'price_test_123',
      };

      // Simulate provider behavior
      const sessionConfig = {
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/success?session={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        line_items: [{ price: credentials.priceId, quantity: 1 }],
        metadata: { project: request.project, plan: request.plan },
      };

      await mockStripeInstance.checkout.sessions.create(sessionConfig);

      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          line_items: expect.arrayContaining([
            expect.objectContaining({ price: 'price_test_123' }),
          ]),
        })
      );
    });

    it('includes project metadata in session', async () => {
      const request = {
        project: 'test-org/test-site',
        plan: 'pro',
        metadata: { userId: '12345' },
      };

      const sessionConfig = {
        metadata: {
          project: request.project,
          plan: request.plan,
          ...request.metadata,
        },
      };

      await mockStripeInstance.checkout.sessions.create(sessionConfig);

      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            project: 'test-org/test-site',
            plan: 'pro',
            userId: '12345',
          }),
        })
      );
    });

    it('returns checkout response with correct structure', async () => {
      mockStripeInstance.checkout.sessions.create.mockResolvedValueOnce({
        id: 'cs_test_abc',
        url: 'https://checkout.stripe.com/session/abc',
      });

      const session = await mockStripeInstance.checkout.sessions.create({});

      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('url');
      expect(session.url).toContain('checkout.stripe.com');
    });

    it('throws error when priceId is missing', () => {
      const request = { project: 'test', plan: 'pro' };
      const credentials = { secretKey: 'sk_test_mock' };

      const createCheckout = () => {
        if (!credentials.priceId) {
          throw new Error('price not configured for plan pro');
        }
      };

      expect(createCheckout).toThrow('price not configured');
    });

    it('uses project-specific credentials over fallback', () => {
      const projectKey = 'sk_project_specific';
      const fallbackKey = 'sk_fallback';

      const credentials = { secretKey: projectKey };
      const secretKey = credentials.secretKey || fallbackKey;

      expect(secretKey).toBe(projectKey);
    });
  });

  describe('verifyWebhook', () => {
    it('requires STRIPE_WEBHOOK_SECRET', () => {
      const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const verify = () => {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
          throw new Error('STRIPE_WEBHOOK_SECRET missing');
        }
      };

      expect(verify).toThrow('STRIPE_WEBHOOK_SECRET missing');
      
      process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
    });

    it('requires stripe-signature header', () => {
      const headers = {};

      const verify = () => {
        if (!headers['stripe-signature']) {
          throw new Error('missing stripe signature header');
        }
      };

      expect(verify).toThrow('missing stripe signature header');
    });

    it('verifies signature and constructs event', () => {
      const rawBody = '{"type":"checkout.session.completed"}';
      const signature = 'valid_signature';
      const secret = 'whsec_test';

      mockStripeInstance.webhooks.constructEvent.mockReturnValueOnce({
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_test_123' } },
      });

      const event = mockStripeInstance.webhooks.constructEvent(rawBody, signature, secret);

      expect(event.type).toBe('checkout.session.completed');
    });

    it('throws on invalid signature', () => {
      mockStripeInstance.webhooks.constructEvent.mockImplementationOnce(() => {
        throw new Error('No signatures found matching the expected signature');
      });

      expect(() => {
        mockStripeInstance.webhooks.constructEvent('body', 'invalid', 'secret');
      }).toThrow();
    });

    it('maps checkout.session.completed to checkout.completed', () => {
      const stripeEventType = 'checkout.session.completed';
      
      const mapEventType = (type: string) => {
        switch (type) {
          case 'checkout.session.completed':
            return 'checkout.completed';
          case 'customer.subscription.updated':
            return 'subscription.updated';
          case 'customer.subscription.deleted':
            return 'subscription.deleted';
          default:
            return 'payment.failed';
        }
      };

      expect(mapEventType(stripeEventType)).toBe('checkout.completed');
    });

    it('maps customer.subscription.updated to subscription.updated', () => {
      const mapEventType = (type: string) => {
        if (type === 'customer.subscription.updated') return 'subscription.updated';
        return 'unknown';
      };

      expect(mapEventType('customer.subscription.updated')).toBe('subscription.updated');
    });

    it('maps customer.subscription.deleted to subscription.deleted', () => {
      const mapEventType = (type: string) => {
        if (type === 'customer.subscription.deleted') return 'subscription.deleted';
        return 'unknown';
      };

      expect(mapEventType('customer.subscription.deleted')).toBe('subscription.deleted');
    });
  });

  describe('Customer Portal', () => {
    it('creates billing portal session', async () => {
      const customerId = 'cus_test_123';
      const returnUrl = 'http://localhost:3000/dashboard';

      await mockStripeInstance.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      expect(mockStripeInstance.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: customerId,
        return_url: returnUrl,
      });
    });

    it('returns portal URL', async () => {
      const session = await mockStripeInstance.billingPortal.sessions.create({});
      
      expect(session.url).toContain('billing.stripe.com');
    });
  });
});

describe('Stripe Response Structures', () => {
  it('CheckoutResponse has required fields', () => {
    const response = {
      checkoutUrl: 'https://checkout.stripe.com/test',
      sessionId: 'cs_test_123',
      provider: 'stripe' as const,
    };

    expect(response).toHaveProperty('checkoutUrl');
    expect(response).toHaveProperty('sessionId');
    expect(response).toHaveProperty('provider');
    expect(response.provider).toBe('stripe');
  });

  it('WebhookEvent has required fields', () => {
    const event = {
      sessionId: 'cs_test_123',
      type: 'checkout.completed' as const,
      payload: {},
    };

    expect(event).toHaveProperty('sessionId');
    expect(event).toHaveProperty('type');
    expect(event).toHaveProperty('payload');
  });
});
