'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Admin-only documentation and guides.
 * Accessible only to authenticated users at /admin/guides.
 */
export default function AdminGuidesPage() {
  const [activeGuide, setActiveGuide] = useState<string>('setup');

  const guides = {
    setup: {
      title: 'Initial Setup',
      content: `
# Initial Admin Setup

Welcome to GitPayWidget admin panel!

## First-Time Configuration

### 1. Verify Admin Account
Your admin account (**team@manic.agency**) was created automatically via the \`/api/init\` endpoint.

### 2. Create Your First Project
- Go to **/projects**
- Click "Create new project"
- Enter a slug like \`manicinc/landing\`
- Save

### 3. Add Provider Keys
- Navigate to **/dashboard**
- Select your project
- Paste Stripe or Lemon Squeezy credentials as JSON
- Click "Save secret"

Provider keys are encrypted with AES-256-GCM before storage.

### 4. Test Checkout Flow
- Visit **/widget-demo**
- Click a plan button
- Verify redirect to Stripe/Lemon checkout

## Managing Multiple Projects

Each project can have different:
- Provider keys (Stripe for one, Lemon for another)
- Theme settings (accent color, CTA label, custom CSS)
- Analytics tracking

Switch between projects via the dashboard dropdown.
      `,
    },
    providers: {
      title: 'Provider Configuration',
      content: `
# Provider Configuration Guide

## Stripe Setup

### Required Fields
\`\`\`json
{
  "secretKey": "sk_live_...",
  "webhookSecret": "whsec_...",
  "priceId": "price_..."
}
\`\`\`

### Where to Find These

1. **Secret Key**: Stripe Dashboard → Developers → API keys
2. **Webhook Secret**: Webhooks → Add endpoint → copy signing secret
3. **Price ID**: Products → Your product → Pricing → copy price ID

### Webhook URL
Point Stripe webhooks to:
\`https://gitpaywidget.com/api/webhook\`

---

## Lemon Squeezy Setup

### Required Fields
\`\`\`json
{
  "apiKey": "...",
  "storeId": "12345",
  "variantId": "67890",
  "productId": "12345"
}
\`\`\`

### Where to Find These

1. **API Key**: Settings → API → Create API key
2. **Store ID**: Settings → Stores → numeric ID in URL
3. **Product/Variant IDs**: Products → click product → Variants → copy IDs

### Webhook URL
\`https://gitpaywidget.com/api/webhook\`

Add custom header: \`X-GPW-Provider: lemonsqueezy\`
      `,
    },
    analytics: {
      title: 'Analytics & Metrics',
      content: `
# Analytics Dashboard

## Metrics Explained

### Monthly Recurring Revenue (MRR)
Sum of all active subscriptions, displayed in cents.

### Checkouts Today
Number of checkout sessions created in the last 24 hours.

### Conversion Rate
Percentage of visitors who complete checkout (stub data for now).

## Future Enhancements

- Real-time webhook integration
- Churn analysis
- Lifetime value (LTV)
- Cohort retention
- Revenue charts
      `,
    },
    security: {
      title: 'Security Best Practices',
      content: `
# Security Best Practices

## Key Management

### Encryption
All provider keys are encrypted with **AES-256-GCM** using \`KEY_ENCRYPTION_SECRET\`.

**Never** share \`KEY_ENCRYPTION_SECRET\`. Rotate it periodically:
1. Generate new secret: \`openssl rand -hex 32\`
2. Update \`.env\` on server
3. Re-save all provider keys in dashboard (triggers re-encryption)

### Secrets Rotation
- Rotate admin password quarterly
- Rotate provider API keys annually (or if leaked)
- Update webhook secrets whenever you regenerate them

## Access Control

### Supabase RLS
Row-level security policies ensure:
- Users can only see their own projects
- Only owners can update/delete projects
- Provider keys are never exposed in responses (only masked summaries)

### SSH Key-Only Auth
Password authentication is **disabled** on the Linode server.
Only your \`linode_root\` SSH key can access root account.

## Webhook Security

Stripe and Lemon Squeezy webhooks are verified via:
- **Stripe**: HMAC signature in \`Stripe-Signature\` header
- **Lemon Squeezy**: Webhook secret validation

Invalid signatures are rejected with 400 status.

## Production Checklist

- [ ] \`NODE_ENV=production\` set
- [ ] HTTPS enforced (Cloudflare + certbot)
- [ ] \`KEY_ENCRYPTION_SECRET\` is unique and secure
- [ ] Admin password changed from default
- [ ] Firewall configured (UFW: SSH, HTTP, HTTPS only)
- [ ] Docker containers run as non-root
- [ ] Supabase RLS policies enabled
- [ ] Rate limiting configured in Nginx
      `,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-8">
      <div>
        <h1 className="font-display text-4xl mb-2">Admin Guides</h1>
        <p className="text-ink-600 dark:text-ink-300">
          Internal documentation for managing GitPayWidget infrastructure.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-2">
          {Object.entries(guides).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => setActiveGuide(key)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                activeGuide === key
                  ? 'bg-gpw-primary text-white'
                  : 'hover:bg-ink-100 dark:hover:bg-ink-800'
              }`}
            >
              {guide.title}
            </button>
          ))}
        </nav>

        <article className="prose prose-lg prose-ink dark:prose-invert max-w-none">
          <ReactMarkdown>{guides[activeGuide as keyof typeof guides].content}</ReactMarkdown>
        </article>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-6">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>⚠️ Admin-only content.</strong> These guides contain sensitive infrastructure
          details. Do not share externally.
        </p>
      </div>
    </div>
  );
}
