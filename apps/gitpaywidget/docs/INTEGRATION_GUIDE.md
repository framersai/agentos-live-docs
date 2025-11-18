# GitPayWidget Integration Guide

Step-by-step guide to accepting payments on your static site.

---

## Prerequisites

- Static site hosted on GitHub Pages, Netlify, Vercel, or similar
- GitHub account (for OAuth login)
- Stripe or Lemon Squeezy account

---

## Step 1: Sign Up for GitPayWidget

1. Visit **https://gitpaywidget.com**
2. Click **"Get Started"** → **"Continue with GitHub"**
3. Authorize the Supabase app to access your email

You'll be redirected to `/dashboard`.

---

## Step 2: Create a Project

1. Go to **https://gitpaywidget.com/projects**
2. Click **"Create new project"**
3. Enter:
   - **Name**: `My Landing Page`
   - **Slug**: `myusername/mysite` (format: `org/repo` or any unique identifier)
4. Click **"Create project"**

Your project slug will be used in the widget embed code.

---

## Step 3: Add Provider Keys

1. Go to **https://gitpaywidget.com/dashboard**
2. Select your project from the dropdown
3. Choose provider: **Stripe** or **Lemon Squeezy**
4. Paste your API keys as JSON:

### Stripe Example
```json
{
  "secretKey": "sk_test_...",
  "webhookSecret": "whsec_...",
  "priceId": "price_..."
}
```

### Lemon Squeezy Example
```json
{
  "apiKey": "...",
  "storeId": "12345",
  "variantId": "67890"
}
```

5. Click **"Save secret"**

**Security Note:** Keys are encrypted with AES-256-GCM before storage and never sent to the browser.

---

## Step 4: Customize Theme (Optional)

In the **"Widget Theme"** section:
- **Accent color**: `#8b5cf6` (or your brand color)
- **CTA label**: `Get started` (or `Subscribe`, `Buy now`, etc.)
- **Custom CSS**: Add overrides for `.gpw-plan-card`, `.gpw-plan-button`, etc.

Click **"Save theme"**.

---

## Step 5: Embed the Widget

### Option A: NPM/Build Step

```bash
npm install @gitpaywidget/widget @gitpaywidget/sdk
```

```typescript
import { renderGitPayWidget } from '@gitpaywidget/widget'

renderGitPayWidget({
  project: 'myusername/mysite',
  plans: [
    {
      id: 'free',
      label: 'Free',
      price: '$0',
      description: 'Try it out',
      features: ['5 documents', 'Basic support']
    },
    {
      id: 'pro',
      label: 'Pro',
      price: '$9.99/mo',
      description: 'Full power',
      features: ['Unlimited documents', 'Priority support', 'API access']
    }
  ],
  autoTheme: true,
  mount: document.getElementById('pricing')
})
```

### Option B: Static HTML (CDN)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Site</title>
</head>
<body>
  <div id="pricing"></div>

  <script type="module">
    import { renderGitPayWidget } from 'https://cdn.gitpaywidget.com/v0/widget.js'

    renderGitPayWidget({
      project: 'myusername/mysite',
      plans: [
        {
          id: 'free',
          label: 'Free',
          price: '$0',
          description: 'For individuals',
          features: ['Basic features']
        },
        {
          id: 'pro',
          label: 'Pro',
          price: '$9.99/mo',
          description: 'For teams',
          features: ['Advanced features', 'Support']
        }
      ],
      autoTheme: true,
      mount: document.getElementById('pricing')
    })
  </script>
</body>
</html>
```

---

## Step 6: Configure Webhooks

### Stripe

1. **Stripe Dashboard** → **Developers** → **Webhooks**
2. **Add endpoint**: `https://gitpaywidget.com/api/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy signing secret** → paste into GitPayWidget dashboard under Stripe keys as `webhookSecret`

### Lemon Squeezy

1. **Lemon Squeezy Settings** → **Webhooks**
2. **Add endpoint**: `https://gitpaywidget.com/api/webhook`
3. **Add custom header**: `X-GPW-Provider: lemonsqueezy`
4. **Copy signing secret** → paste into dashboard

---

## Step 7: Test Checkout

1. Visit your site with the widget embedded
2. Click **"Get started"** on a plan
3. You should be redirected to Stripe/Lemon hosted checkout
4. Complete test payment (use Stripe test card: `4242 4242 4242 4242`)
5. Check **GitPayWidget dashboard** → analytics should increment

---

## Common Issues

### Widget not rendering
- Check browser console for errors
- Verify project slug matches exactly
- Ensure `<script type="module">` is present

### Checkout returns 404
- Confirm provider keys are saved in dashboard
- Check `/api/projects/:slug/keys` returns your provider

### Webhook not firing
- Verify webhook URL is `https://gitpaywidget.com/api/webhook` (not `http://`)
- Check Stripe/Lemon dashboard for webhook delivery logs
- Ensure webhook secret matches what's in dashboard

---

## Next Steps

- **Monitor analytics**: Track MRR, conversion rate in dashboard
- **Customize theme**: Match your brand colors
- **Add more plans**: Tiered pricing, annual billing, etc.
- **Implement plan gates**: Check user subscription status in your app

---

## Support

Need help integrating? Contact **team@manic.agency**

---

**Built by** Manic Agency LLC

