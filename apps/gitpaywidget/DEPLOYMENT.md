# GitPayWidget Deployment Guide

## Prerequisites

- Linode VPS (or similar) with Ubuntu 22.04+ and Docker installed
- Domain `gitpaywidget.com` pointing to your server's public IP
- Supabase project (free tier works) with tables from `supabase/schema.sql`
- Stripe account + API keys (test mode OK for staging)
- Lemon Squeezy account + API key (optional)

---

## Production setup

### 1. Clone & configure

```bash
git clone https://github.com/manicinc/gitpaywidget.git
cd gitpaywidget
pnpm install
cp apps/gitpaywidget/env.example apps/gitpaywidget/.env
```

Fill `.env` with real secrets:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
LEMONSQUEEZY_API_KEY=...
KEY_ENCRYPTION_SECRET=<generate 32-byte random hex>
```

### 2. Build widget bundle

```bash
pnpm --filter @gitpaywidget/widget build
```

Outputs to `packages/gitpaywidget-widget/dist/` → upload `widget.js` + `widget.css` to your CDN or `/public`.

### 3. Docker production stack

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This starts:

- Next.js app on internal port 3000
- Nginx reverse proxy on port 80 (you'll add SSL next)

### 4. SSL via Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gitpaywidget.com
```

Certbot auto-updates `deployment/nginx.conf` to listen on 443 + redirect http→https.

### 5. Seed Admin User

After first deployment, hit the init endpoint to create the admin account:

```bash
curl https://gitpaywidget.com/api/init
```

This creates `team@manic.agency` with password `manicmania4949` (from `.env`).

### 6. Verify

Visit `https://gitpaywidget.com` → you should see the landing page.

Login at `/login` with:

- Email: `team@manic.agency`
- Password: `manicmania4949` (or whatever you set in `ADMIN_PASSWORD`)

You'll be redirected to `/dashboard` where you can manage projects.

---

## Webhook configuration

### Stripe

1. Dashboard → Webhooks → Add endpoint: `https://gitpaywidget.com/api/webhook`
2. Select events: `checkout.session.completed`, `customer.subscription.*`
3. Copy signing secret → `.env` as `STRIPE_WEBHOOK_SECRET`

### Lemon Squeezy

1. Settings → Webhooks → `https://gitpaywidget.com/api/webhook`
2. Set header `X-GPW-Provider: lemonsqueezy`
3. Copy secret → `.env` as `LEMONSQUEEZY_WEBHOOK_SECRET`

Restart Docker after updating env:

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## Monitoring & logs

```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

Use a service like **Sentry** or **LogDNA** for error tracking in production.

---

## CDN hosting (optional)

Upload `packages/gitpaywidget-widget/dist/widget.js` to Cloudflare Pages, Vercel Edge, or S3+CloudFront:

```html
<script src="https://cdn.gitpaywidget.com/v0/widget.js" type="module"></script>
```

Update `packages/gitpaywidget-sdk/src/index.ts` endpoint if self-hosting the API elsewhere.

---

## Security checklist

- [ ] Rotate `KEY_ENCRYPTION_SECRET` periodically
- [ ] Enable Supabase RLS policies (`supabase/schema.sql` has stubs)
- [ ] Use separate Stripe/Lemon accounts for staging vs production
- [ ] Set `NODE_ENV=production` in Docker env
- [ ] Rate-limit `/api/checkout` and `/api/webhook` via nginx or Cloudflare

---

**Questions?** → team@manic.agency
