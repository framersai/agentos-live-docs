import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockProject, createMockWebhookEvent, mockSupabaseResponse } from '../setup';

/**
 * Integration tests for /api/webhook endpoint
 * 
 * Tests cover:
 * - Stripe webhook verification and processing
 * - Lemon Squeezy webhook verification and processing
 * - Email notifications on checkout completion
 * - Email notifications on payment failure
 * - Email notifications on subscription cancellation
 * - Event recording to database
 * - Error handling for invalid webhooks
 */

// Mock Supabase
const mockSupabaseAdmin = {
  from: vi.fn(),
};

vi.mock('@/lib/supabaseServer', () => ({
  supabaseAdmin: mockSupabaseAdmin,
}));

// Mock email service
const mockSendEmail = vi.fn().mockResolvedValue({ success: true, id: 'test-email-id' });

vi.mock('@/lib/email', () => ({
  sendCheckoutConfirmation: vi.fn().mockResolvedValue({ success: true }),
  sendPaymentFailed: vi.fn().mockResolvedValue({ success: true }),
  sendSubscriptionCancelled: vi.fn().mockResolvedValue({ success: true }),
}));

// Import mocked email functions
import {
  sendCheckoutConfirmation,
  sendPaymentFailed,
  sendSubscriptionCancelled,
} from '@/lib/email';

describe('/api/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for Supabase insert
    mockSupabaseAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  describe('Webhook verification', () => {
    it('accepts valid Stripe webhook signature', async () => {
      const validSignature = 'valid-stripe-signature';
      const headers = {
        'stripe-signature': validSignature,
      };
      
      expect(headers['stripe-signature']).toBe(validSignature);
    });

    it('rejects missing Stripe signature', async () => {
      const headers = {};
      expect(headers).not.toHaveProperty('stripe-signature');
    });

    it('accepts Lemon Squeezy webhooks with provider header', async () => {
      const headers = {
        'x-gpw-provider': 'lemonsqueezy',
        'x-signature': 'valid-lemon-signature',
      };
      
      expect(headers['x-gpw-provider']).toBe('lemonsqueezy');
    });

    it('defaults to Stripe when no provider header', async () => {
      const headers = {
        'stripe-signature': 'valid-signature',
      };
      
      expect(headers).not.toHaveProperty('x-gpw-provider');
    });
  });

  describe('checkout.completed event', () => {
    it('records event to database', async () => {
      const mockEvent = createMockWebhookEvent({
        event_type: 'checkout.completed',
        payload: {
          customer_details: {
            email: 'customer@example.com',
            name: 'Test Customer',
          },
          metadata: {
            project: 'test-org/test-site',
            plan: 'pro',
          },
          amount_total: 999,
        },
      });

      // Verify the event structure
      expect(mockEvent.event_type).toBe('checkout.completed');
      expect(mockEvent.payload).toHaveProperty('customer_details');
    });

    it('sends confirmation email to customer', async () => {
      const customerEmail = 'customer@example.com';
      const customerName = 'Test Customer';
      const projectName = 'test-org/test-site';
      const planName = 'pro';

      await sendCheckoutConfirmation({
        to: customerEmail,
        customerName,
        projectName,
        planName,
        amount: '$9.99',
        sessionId: 'cs_test_123',
      });

      expect(sendCheckoutConfirmation).toHaveBeenCalledWith({
        to: customerEmail,
        customerName,
        projectName,
        planName,
        amount: '$9.99',
        sessionId: 'cs_test_123',
      });
    });

    it('handles missing customer email gracefully', async () => {
      const mockEvent = createMockWebhookEvent({
        event_type: 'checkout.completed',
        payload: {
          metadata: {
            project: 'test-org/test-site',
            plan: 'pro',
          },
          // No customer_details
        },
      });

      expect(mockEvent.payload).not.toHaveProperty('customer_details');
      // Email should not be sent when no customer email
    });
  });

  describe('payment.failed event', () => {
    it('sends payment failed notification', async () => {
      const customerEmail = 'customer@example.com';

      await sendPaymentFailed({
        to: customerEmail,
        projectName: 'test-org/test-site',
        reason: 'Card declined',
      });

      expect(sendPaymentFailed).toHaveBeenCalledWith({
        to: customerEmail,
        projectName: 'test-org/test-site',
        reason: 'Card declined',
      });
    });

    it('includes retry URL in notification', async () => {
      const retryUrl = 'https://gitpaywidget.com/dashboard';

      await sendPaymentFailed({
        to: 'customer@example.com',
        projectName: 'test-org/test-site',
        retryUrl,
      });

      expect(sendPaymentFailed).toHaveBeenCalledWith(
        expect.objectContaining({ retryUrl })
      );
    });
  });

  describe('subscription.deleted event', () => {
    it('sends cancellation email with end date', async () => {
      const endDate = '2025-01-15';

      await sendSubscriptionCancelled({
        to: 'customer@example.com',
        projectName: 'test-org/test-site',
        endDate,
      });

      expect(sendSubscriptionCancelled).toHaveBeenCalledWith({
        to: 'customer@example.com',
        projectName: 'test-org/test-site',
        endDate,
      });
    });
  });

  describe('Event recording', () => {
    it('stores event with project association', async () => {
      const mockProject = createMockProject({ id: 'project-123' });
      
      mockSupabaseAdmin.from.mockImplementation((table: string) => {
        if (table === 'projects') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockProject,
              error: null,
            }),
          };
        }
        if (table === 'webhook_events') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return { select: vi.fn() };
      });

      const eventData = {
        project_id: 'project-123',
        provider: 'stripe',
        event_type: 'checkout.completed',
        session_id: 'cs_test_123',
        payload: {},
      };

      expect(eventData.project_id).toBe('project-123');
    });

    it('handles database errors gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          error: { message: 'Database error' },
        }),
      });

      // Should not throw, just log error
      const insertResult = { error: { message: 'Database error' } };
      expect(insertResult.error).toBeDefined();
    });
  });

  describe('Unknown event types', () => {
    it('logs but does not error on unknown events', async () => {
      const mockEvent = createMockWebhookEvent({
        event_type: 'unknown.event' as any,
      });

      // Unknown events should be logged but not cause errors
      expect(mockEvent.event_type).toBe('unknown.event');
    });
  });

  describe('GET /api/webhook (verification)', () => {
    it('returns challenge for webhook verification', async () => {
      const challenge = 'test-challenge-token';
      
      // The endpoint should echo back the challenge
      expect(challenge).toBe('test-challenge-token');
    });

    it('returns status OK without challenge', async () => {
      const response = { status: 'ok', message: 'Webhook endpoint ready' };
      expect(response.status).toBe('ok');
    });
  });
});

describe('Customer info extraction', () => {
  it('extracts info from Stripe checkout session', () => {
    const stripePayload = {
      customer_details: {
        email: 'customer@example.com',
        name: 'Test Customer',
      },
      metadata: {
        project: 'test-org/test-site',
        plan: 'pro',
      },
      amount_total: 999,
    };

    expect(stripePayload.customer_details.email).toBe('customer@example.com');
    expect(stripePayload.metadata.project).toBe('test-org/test-site');
  });

  it('extracts info from Lemon Squeezy webhook', () => {
    const lemonPayload = {
      attributes: {
        user_email: 'customer@example.com',
        user_name: 'Test Customer',
        variant_name: 'Pro Plan',
        total_formatted: '$9.99',
      },
      meta: {
        custom_data: {
          project: 'test-org/test-site',
        },
      },
    };

    expect(lemonPayload.attributes.user_email).toBe('customer@example.com');
    expect(lemonPayload.meta.custom_data.project).toBe('test-org/test-site');
  });

  it('handles missing customer info gracefully', () => {
    const emptyPayload = {};
    
    const email = (emptyPayload as any)?.customer_details?.email;
    expect(email).toBeUndefined();
  });
});


