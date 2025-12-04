import {
  StripeProvider,
  LemonSqueezyProvider,
  type ProviderWebhookEvent,
} from '@gitpaywidget/payments-core';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import {
  sendCheckoutConfirmation,
  sendPaymentFailed,
  sendSubscriptionCancelled,
} from '@/lib/email';
import { checkRateLimit, getIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

/**
 * Webhook receiver for provider events (Stripe / Lemon Squeezy).
 * Records events to the database, sends notifications, and triggers downstream actions.
 */
const stripe = new StripeProvider();
const lemon = new LemonSqueezyProvider();
let ready = false;

async function init() {
  if (!ready) {
    await Promise.all([
      stripe.init().catch((e) => console.warn('[webhook] Stripe init failed:', e.message)),
      lemon.init().catch((e) => console.warn('[webhook] Lemon init failed:', e.message)),
    ]);
    ready = true;
  }
}

/**
 * Log event to console for debugging.
 */
function logEvent(event: ProviderWebhookEvent, provider: string) {
  const timestamp = new Date().toISOString();
  console.log(`[webhook] ${timestamp} | ${provider} | ${event.type} | session: ${event.sessionId}`);
  
  // Log additional details in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('[webhook] payload:', JSON.stringify(event.payload, null, 2));
  }
}

/**
 * Store the event in the database for analytics and auditing.
 */
async function recordEvent(event: ProviderWebhookEvent, provider: string): Promise<string | null> {
  try {
    // Get project from session metadata if available
    const metadata = (event.payload as any)?.metadata;
    const projectSlug = metadata?.project;
    
    let projectId: string | null = null;
    
    if (projectSlug) {
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('slug', projectSlug)
        .maybeSingle();
      
      projectId = project?.id ?? null;
    }

    // Insert event record
    const { error } = await supabaseAdmin.from('webhook_events').insert({
      project_id: projectId,
      provider,
      event_type: event.type,
      session_id: event.sessionId,
      payload: event.payload,
      processed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[webhook] Failed to record event:', error.message);
    } else {
      console.log('[webhook] Event recorded successfully');
    }
    
    return projectId;
  } catch (err: any) {
    console.error('[webhook] Error recording event:', err.message);
    return null;
  }
}

/**
 * Extract customer info from webhook payload
 */
function extractCustomerInfo(payload: any): {
  email?: string;
  name?: string;
  projectName?: string;
  planName?: string;
  amount?: string;
} {
  // Stripe checkout session
  if (payload?.customer_details) {
    return {
      email: payload.customer_details.email,
      name: payload.customer_details.name,
      projectName: payload.metadata?.project || 'Your Project',
      planName: payload.metadata?.plan || 'Subscription',
      amount: payload.amount_total 
        ? `$${(payload.amount_total / 100).toFixed(2)}`
        : undefined,
    };
  }
  
  // Stripe subscription
  if (payload?.customer_email) {
    return {
      email: payload.customer_email,
      projectName: payload.metadata?.project || 'Your Project',
      planName: payload.metadata?.plan || 'Subscription',
    };
  }
  
  // Lemon Squeezy
  if (payload?.attributes) {
    return {
      email: payload.attributes.user_email,
      name: payload.attributes.user_name,
      projectName: payload.meta?.custom_data?.project || 'Your Project',
      planName: payload.attributes.variant_name || 'Subscription',
      amount: payload.attributes.total_formatted,
    };
  }
  
  return {};
}

/**
 * Handle different event types and trigger appropriate actions.
 */
async function handleEvent(event: ProviderWebhookEvent, provider: string) {
  logEvent(event, provider);
  
  // Record to database
  const projectId = await recordEvent(event, provider);
  
  // Extract customer info for emails
  const customerInfo = extractCustomerInfo(event.payload);

  // Handle specific event types
  switch (event.type) {
    case 'checkout.completed':
      console.log('[webhook] Checkout completed! Session:', event.sessionId);
      
      // Send confirmation email
      if (customerInfo.email) {
        try {
          await sendCheckoutConfirmation({
            to: customerInfo.email,
            customerName: customerInfo.name,
            projectName: customerInfo.projectName || 'Your Project',
            planName: customerInfo.planName || 'Subscription',
            amount: customerInfo.amount || 'Paid',
            sessionId: event.sessionId,
          });
          console.log('[webhook] Confirmation email sent to:', customerInfo.email);
        } catch (emailErr: any) {
          console.error('[webhook] Failed to send confirmation email:', emailErr.message);
        }
      }
      
      // Update checkout count in analytics (for dashboard)
      if (projectId) {
        await updateAnalytics(projectId, 'checkout_completed');
      }
      break;

    case 'subscription.updated':
      console.log('[webhook] Subscription updated:', event.sessionId);
      
      // Update subscription status
      if (projectId) {
        await updateAnalytics(projectId, 'subscription_updated');
      }
      break;

    case 'subscription.deleted':
      console.log('[webhook] Subscription cancelled:', event.sessionId);
      
      // Send cancellation email
      if (customerInfo.email) {
        try {
          const endDate = (event.payload as any)?.current_period_end
            ? new Date((event.payload as any).current_period_end * 1000).toLocaleDateString()
            : 'Soon';
          
          await sendSubscriptionCancelled({
            to: customerInfo.email,
            customerName: customerInfo.name,
            projectName: customerInfo.projectName || 'Your Project',
            endDate,
          });
          console.log('[webhook] Cancellation email sent to:', customerInfo.email);
        } catch (emailErr: any) {
          console.error('[webhook] Failed to send cancellation email:', emailErr.message);
        }
      }
      
      if (projectId) {
        await updateAnalytics(projectId, 'subscription_cancelled');
      }
      break;

    case 'payment.failed':
      console.log('[webhook] Payment failed:', event.sessionId);
      
      // Send payment failed notification
      if (customerInfo.email) {
        try {
          const reason = (event.payload as any)?.last_payment_error?.message;
          
          await sendPaymentFailed({
            to: customerInfo.email,
            customerName: customerInfo.name,
            projectName: customerInfo.projectName || 'Your Project',
            reason,
            retryUrl: `${process.env.FRONTEND_URL}/dashboard`,
          });
          console.log('[webhook] Payment failed email sent to:', customerInfo.email);
        } catch (emailErr: any) {
          console.error('[webhook] Failed to send payment failed email:', emailErr.message);
        }
      }
      
      if (projectId) {
        await updateAnalytics(projectId, 'payment_failed');
      }
      break;

    default:
      console.log('[webhook] Unhandled event type:', event.type);
  }
}

/**
 * Update project analytics counters
 */
async function updateAnalytics(projectId: string, eventType: string) {
  try {
    // Increment event counters in a summary table
    // For now, we rely on webhook_events table for analytics queries
    console.log(`[webhook] Analytics updated for project ${projectId}: ${eventType}`);
  } catch (err: any) {
    console.error('[webhook] Failed to update analytics:', err.message);
  }
}

export async function POST(req: NextRequest) {
  await init();

  const provider = req.headers.get('x-gpw-provider') || 'stripe';
  const raw = await req.text();

  console.log(`[webhook] Received ${provider} webhook`);

  let event: ProviderWebhookEvent;

  try {
    if (provider === 'stripe') {
      event = await stripe.verifyWebhook(Object.fromEntries(req.headers), raw);
    } else if (provider === 'lemonsqueezy') {
      event = await lemon.verifyWebhook(Object.fromEntries(req.headers), raw);
    } else {
      return NextResponse.json({ error: 'unknown provider' }, { status: 400 });
    }

    await handleEvent(event, provider);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[webhook] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Also support GET for webhook verification (some providers require this)
export async function GET(req: NextRequest) {
  const challenge = req.nextUrl.searchParams.get('challenge');
  
  if (challenge) {
    return new NextResponse(challenge, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ status: 'ok', message: 'Webhook endpoint ready' });
}
