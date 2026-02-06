import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanByPriceId, PLANS } from '@/lib/stripe';
import { getEmailService } from '@/lib/email';
import { TRIAL_DAYS } from '@/config/pricing';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Tell Next.js not to parse the body (Stripe needs the raw body for signature verification)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe || !WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('[stripe webhook] Signature error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Handle relevant events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const customerId =
        typeof session.customer === 'string' ? session.customer : session.customer?.id;

      if (userId && planId) {
        await updateBackendSubscription(userId, {
          status: TRIAL_DAYS > 0 ? 'trialing' : 'active',
          planId,
          stripeCustomerId: customerId ?? null,
          stripeSubscriptionId:
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription?.id ?? null,
        });
      }

      // Send subscription activated email
      const customerEmail = session.customer_details?.email || session.customer_email;
      if (customerEmail && planId) {
        try {
          const emailService = getEmailService();
          const planName = PLANS.find((p) => p.id === planId)?.name ?? planId;
          await emailService.sendSubscriptionActivatedEmail(customerEmail, planName);
        } catch (emailErr) {
          console.error('[stripe webhook] Failed to send activation email:', emailErr);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) {
        const status = sub.status === 'active' || sub.status === 'trialing'
          ? sub.status
          : 'canceled';
        const priceId = sub.items?.data?.[0]?.price?.id;
        const plan = priceId ? getPlanByPriceId(priceId) : null;

        await updateBackendSubscription(userId, {
          status,
          planId: plan?.id ?? sub.metadata?.planId ?? null,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : null,
          stripeSubscriptionId: sub.id,
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) {
        await updateBackendSubscription(userId, {
          status: 'canceled',
          planId: null,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : null,
          stripeSubscriptionId: sub.id,
        });
      }

      // Send cancellation email
      const subCustomerId = typeof sub.customer === 'string' ? sub.customer : null;
      if (stripe && subCustomerId) {
        try {
          const customer = await stripe.customers.retrieve(subCustomerId);
          if (customer && !customer.deleted && customer.email) {
            const priceId = sub.items?.data?.[0]?.price?.id;
            const plan = priceId ? getPlanByPriceId(priceId) : null;
            const emailService = getEmailService();
            await emailService.sendSubscriptionCancelledEmail(
              customer.email,
              plan?.name ?? sub.metadata?.planId ?? 'your plan',
            );
          }
        } catch (emailErr) {
          console.error('[stripe webhook] Failed to send cancellation email:', emailErr);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Call the backend to update subscription status
async function updateBackendSubscription(
  userId: string,
  data: {
    status: string;
    planId: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  }
) {
  try {
    const internalSecret = process.env.INTERNAL_API_SECRET || '';
    if (!internalSecret) {
      console.warn('[stripe webhook] INTERNAL_API_SECRET not set — backend subscription updates are disabled.');
    }
    await fetch(`${API_BASE}/billing/subscription-update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': internalSecret,
      },
      body: JSON.stringify({ userId, ...data }),
    });
  } catch (err) {
    console.error('[stripe webhook] Failed to update backend subscription:', err);
  }
}
