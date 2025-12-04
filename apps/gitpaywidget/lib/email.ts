/**
 * Email Service using Resend
 * 
 * Handles all transactional emails for GitPayWidget:
 * - Checkout confirmation
 * - Payment failed notifications
 * - Subscription updates
 * - Welcome emails
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'GitPayWidget <noreply@gitpaywidget.com>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'team@manic.agency';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Send an email via Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo || SUPPORT_EMAIL,
    });

    if (error) {
      console.error('[email] Failed to send:', error);
      return { success: false, error: error.message };
    }

    console.log('[email] Sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[email] Error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Email Templates
 */

export async function sendCheckoutConfirmation(options: {
  to: string;
  customerName?: string;
  projectName: string;
  planName: string;
  amount: string;
  sessionId: string;
}) {
  const { to, customerName, projectName, planName, amount, sessionId } = options;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Space Grotesk', system-ui, sans-serif; background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff1f2 100%);">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #9333ea, #ec4899); border-radius: 12px; line-height: 48px; color: white; font-weight: bold; font-size: 24px;">$</div>
              <h1 style="margin: 16px 0 0; font-size: 24px; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">GitPayWidget</h1>
            </div>
            
            <!-- Content -->
            <h2 style="margin: 0 0 16px; font-size: 28px; color: #1e1b4b; text-align: center;">
              🎉 Payment Confirmed!
            </h2>
            
            <p style="margin: 0 0 24px; color: #6b7280; text-align: center; font-size: 16px;">
              ${customerName ? `Hey ${customerName}, thanks` : 'Thanks'} for your purchase!
            </p>
            
            <div style="background: #f8f5ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Project</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e1b4b;">${projectName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Plan</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e1b4b;">${planName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Amount</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #9333ea;">${amount}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center;">
              <a href="https://gitpaywidget.com/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px;">
                View Dashboard →
              </a>
            </div>
            
            <p style="margin: 32px 0 0; padding-top: 24px; border-top: 1px solid #e9d5ff; color: #9ca3af; font-size: 12px; text-align: center;">
              Session ID: ${sessionId}<br>
              Questions? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color: #9333ea;">${SUPPORT_EMAIL}</a>
            </p>
          </div>
          
          <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
            Built with ❤️ by <a href="https://manic.agency" style="color: #9333ea; text-decoration: none;">Manic Agency</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `✅ Payment confirmed for ${projectName}`,
    html,
    text: `Payment Confirmed!\n\nProject: ${projectName}\nPlan: ${planName}\nAmount: ${amount}\n\nView your dashboard: https://gitpaywidget.com/dashboard\n\nSession ID: ${sessionId}`,
  });
}

export async function sendPaymentFailed(options: {
  to: string;
  customerName?: string;
  projectName: string;
  reason?: string;
  retryUrl?: string;
}) {
  const { to, customerName, projectName, reason, retryUrl } = options;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Space Grotesk', system-ui, sans-serif; background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff1f2 100%);">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #9333ea, #ec4899); border-radius: 12px; line-height: 48px; color: white; font-weight: bold; font-size: 24px;">$</div>
            </div>
            
            <h2 style="margin: 0 0 16px; font-size: 28px; color: #1e1b4b; text-align: center;">
              ⚠️ Payment Failed
            </h2>
            
            <p style="margin: 0 0 24px; color: #6b7280; text-align: center; font-size: 16px;">
              ${customerName ? `Hey ${customerName}, we` : 'We'} couldn't process your payment for <strong>${projectName}</strong>.
            </p>
            
            ${reason ? `
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>Reason:</strong> ${reason}
                </p>
              </div>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="${retryUrl || 'https://gitpaywidget.com/dashboard'}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px;">
                Update Payment Method →
              </a>
            </div>
            
            <p style="margin: 32px 0 0; padding-top: 24px; border-top: 1px solid #e9d5ff; color: #9ca3af; font-size: 12px; text-align: center;">
              Need help? Contact <a href="mailto:${SUPPORT_EMAIL}" style="color: #9333ea;">${SUPPORT_EMAIL}</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `⚠️ Payment failed for ${projectName}`,
    html,
    text: `Payment Failed\n\nWe couldn't process your payment for ${projectName}.\n${reason ? `Reason: ${reason}\n` : ''}\nPlease update your payment method: ${retryUrl || 'https://gitpaywidget.com/dashboard'}`,
  });
}

export async function sendSubscriptionCancelled(options: {
  to: string;
  customerName?: string;
  projectName: string;
  endDate: string;
}) {
  const { to, customerName, projectName, endDate } = options;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Space Grotesk', system-ui, sans-serif; background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff1f2 100%);">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #9333ea, #ec4899); border-radius: 12px; line-height: 48px; color: white; font-weight: bold; font-size: 24px;">$</div>
            </div>
            
            <h2 style="margin: 0 0 16px; font-size: 28px; color: #1e1b4b; text-align: center;">
              We're sad to see you go 😢
            </h2>
            
            <p style="margin: 0 0 24px; color: #6b7280; text-align: center; font-size: 16px;">
              ${customerName ? `Hey ${customerName}, your` : 'Your'} subscription for <strong>${projectName}</strong> has been cancelled.
            </p>
            
            <div style="background: #f8f5ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Access continues until</p>
              <p style="margin: 8px 0 0; font-size: 24px; font-weight: 600; color: #1e1b4b;">${endDate}</p>
            </div>
            
            <p style="margin: 0 0 24px; color: #6b7280; text-align: center; font-size: 14px;">
              Changed your mind? You can resubscribe anytime from your dashboard.
            </p>
            
            <div style="text-align: center;">
              <a href="https://gitpaywidget.com/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px;">
                Resubscribe →
              </a>
            </div>
            
            <p style="margin: 32px 0 0; padding-top: 24px; border-top: 1px solid #e9d5ff; color: #9ca3af; font-size: 12px; text-align: center;">
              Feedback? We'd love to hear why you left. Reply to this email!
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Your ${projectName} subscription has been cancelled`,
    html,
    text: `Subscription Cancelled\n\nYour subscription for ${projectName} has been cancelled.\nAccess continues until: ${endDate}\n\nResubscribe: https://gitpaywidget.com/dashboard`,
  });
}

export async function sendWelcomeEmail(options: {
  to: string;
  customerName?: string;
}) {
  const { to, customerName } = options;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Space Grotesk', system-ui, sans-serif; background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff1f2 100%);">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #9333ea, #ec4899); border-radius: 16px; line-height: 64px; color: white; font-weight: bold; font-size: 32px;">$</div>
              <h1 style="margin: 16px 0 0; font-size: 28px; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Welcome to GitPayWidget!</h1>
            </div>
            
            <p style="margin: 0 0 24px; color: #6b7280; text-align: center; font-size: 16px;">
              ${customerName ? `Hey ${customerName}! 🎉` : 'Hey there! 🎉'}<br>
              You're now ready to accept payments on any static site.
            </p>
            
            <h3 style="margin: 0 0 16px; color: #1e1b4b; font-size: 18px;">Quick Start:</h3>
            
            <div style="margin-bottom: 24px;">
              <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                <span style="display: inline-block; width: 28px; height: 28px; background: #f3e8ff; border-radius: 50%; text-align: center; line-height: 28px; color: #9333ea; font-weight: 600; margin-right: 12px; flex-shrink: 0;">1</span>
                <div>
                  <strong style="color: #1e1b4b;">Create a project</strong>
                  <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Set up your site in the dashboard</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                <span style="display: inline-block; width: 28px; height: 28px; background: #f3e8ff; border-radius: 50%; text-align: center; line-height: 28px; color: #9333ea; font-weight: 600; margin-right: 12px; flex-shrink: 0;">2</span>
                <div>
                  <strong style="color: #1e1b4b;">Add your Stripe keys</strong>
                  <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Connect your payment provider</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="display: inline-block; width: 28px; height: 28px; background: #f3e8ff; border-radius: 50%; text-align: center; line-height: 28px; color: #9333ea; font-weight: 600; margin-right: 12px; flex-shrink: 0;">3</span>
                <div>
                  <strong style="color: #1e1b4b;">Embed the widget</strong>
                  <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">One script tag, that's it!</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="https://gitpaywidget.com/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px;">
                Go to Dashboard →
              </a>
            </div>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e9d5ff;">
              <p style="margin: 0 0 12px; color: #1e1b4b; font-weight: 600; font-size: 14px;">Helpful links:</p>
              <p style="margin: 0; font-size: 14px;">
                <a href="https://gitpaywidget.com/docs/quickstart" style="color: #9333ea; text-decoration: none;">Quick Start Guide</a> • 
                <a href="https://gitpaywidget.com/docs/api" style="color: #9333ea; text-decoration: none;">API Reference</a> • 
                <a href="https://gitpaywidget.com/widget-demo" style="color: #9333ea; text-decoration: none;">Widget Demo</a>
              </p>
            </div>
          </div>
          
          <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
            Built with ❤️ by <a href="https://manic.agency" style="color: #9333ea; text-decoration: none;">Manic Agency</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: '🎉 Welcome to GitPayWidget!',
    html,
    text: `Welcome to GitPayWidget!\n\nYou're now ready to accept payments on any static site.\n\nQuick Start:\n1. Create a project in the dashboard\n2. Add your Stripe keys\n3. Embed the widget\n\nGo to Dashboard: https://gitpaywidget.com/dashboard`,
  });
}


