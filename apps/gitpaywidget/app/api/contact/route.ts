import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { checkRateLimit, getIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

interface ContactFormData {
  name: string;
  email: string;
  reason: string;
  message: string;
}

const reasonLabels: Record<string, string> = {
  general: 'General inquiry',
  support: 'Technical support',
  sales: 'Sales & pricing',
  partnership: 'Partnership opportunity',
  feedback: 'Product feedback',
  bug: 'Bug report',
};

export async function POST(req: NextRequest) {
  // Rate limit: 5 submissions per minute
  const identifier = getIdentifier(req);
  const rateResult = checkRateLimit(identifier, { limit: 5, windowMs: 60 * 1000 });
  
  if (!rateResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', retryAfter: rateResult.retryAfter },
      { status: 429, headers: rateLimitHeaders(rateResult) }
    );
  }

  let body: ContactFormData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }

  // Validate required fields
  if (!body.name || body.name.trim().length < 2) {
    return NextResponse.json(
      { error: 'Name is required (minimum 2 characters)' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }

  if (!body.email || !body.email.includes('@')) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }

  if (!body.message || body.message.trim().length < 10) {
    return NextResponse.json(
      { error: 'Message is required (minimum 10 characters)' },
      { status: 400, headers: rateLimitHeaders(rateResult) }
    );
  }

  const reasonLabel = reasonLabels[body.reason] || body.reason;

  // Send email to team
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: system-ui, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">From:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${body.email}" style="color: #8b5cf6;">${body.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Reason:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${reasonLabel}</td>
          </tr>
        </table>
        
        <h3 style="margin-top: 30px;">Message:</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
${body.message}
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Sent from GitPayWidget contact form at ${new Date().toISOString()}
        </p>
      </body>
    </html>
  `;

  try {
    const result = await sendEmail({
      to: 'team@manic.agency',
      subject: `[GitPayWidget] ${reasonLabel} from ${body.name}`,
      html,
      text: `New contact form submission:\n\nFrom: ${body.name}\nEmail: ${body.email}\nReason: ${reasonLabel}\n\nMessage:\n${body.message}`,
      replyTo: body.email,
    });

    if (!result.success) {
      console.error('[contact] Failed to send email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or email us directly.' },
        { status: 500, headers: rateLimitHeaders(rateResult) }
      );
    }

    console.log('[contact] Email sent successfully:', result.id);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { headers: rateLimitHeaders(rateResult) }
    );
  } catch (err: any) {
    console.error('[contact] Error:', err.message);
    return NextResponse.json(
      { error: 'An error occurred. Please try again or email team@manic.agency directly.' },
      { status: 500, headers: rateLimitHeaders(rateResult) }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Contact form endpoint. POST with name, email, reason, and message.',
  });
}

