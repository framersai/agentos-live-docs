# GitPayWidget – Plug-and-play payments for static sites

> **Status:** Public Beta (v0.2.0)
>
> Built with ❤️ by [Manic Agency](https://manic.agency) – an experimental design & development collective.
>
> Contact: team@manic.agency

---

## What is it?

**GitPayWidget** lets any static site – GitHub Pages, Netlify, Vercel, Cloudflare Pages – embed a single `<script>` tag and start accepting payments via Stripe, Lemon Squeezy, and (soon) crypto providers. No servers, PCI scope, or OAuth dance on your side.

```html
<!-- one-line integration -->
<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="your-project-slug"
></script>
```

The widget → calls **api.gitpaywidget.com** → orchestrates the checkout → returns success events to your site.

---

## Pricing

| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0 + 1% platform fee | Unlimited projects, basic analytics, community support |
| **Pro** | $250 one-time | 0% fees forever, full analytics, custom branding, priority support |

---

## Quick Start

1. Sign up at [gitpaywidget.com/login](https://gitpaywidget.com/login)
2. Create a project and add your Stripe/Lemon Squeezy keys
3. Embed the widget on your static site
4. Start accepting payments!

See [Quick Start Guide](https://gitpaywidget.com/docs/quickstart) for detailed instructions.

---

## Environment Variables

Create a `.env` file in `apps/gitpaywidget/` with the following variables:

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `SUPABASE_URL` | Your Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) → Project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) | Supabase Dashboard → Settings → API → `service_role` key |
| `SUPABASE_ANON_KEY` | Anonymous/public key | Supabase Dashboard → Settings → API → `anon` key |
| `KEY_ENCRYPTION_SECRET` | 32+ char secret for encrypting API keys | Generate with: `openssl rand -hex 32` |

### Payment Provider Keys (At least one required)

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `STRIPE_SECRET_KEY` | Stripe API secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard → Developers → Webhooks → Signing secret |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API key | [Lemon Squeezy](https://app.lemonsqueezy.com/settings/api) → API Keys |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy webhook secret | Lemon Squeezy → Settings → Webhooks |

### Email (Required for notifications)

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `RESEND_API_KEY` | Resend API key for transactional emails | [Resend Dashboard](https://resend.com/api-keys) → Create API Key |
| `FROM_EMAIL` | Sender email address | e.g., `GitPayWidget <noreply@gitpaywidget.com>` |
| `SUPPORT_EMAIL` | Reply-to email for support | e.g., `team@manic.agency` |

### Analytics (Optional)

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | [Google Analytics](https://analytics.google.com) → Admin → Data Streams → Measurement ID (G-XXXXXXX) |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID | [Clarity](https://clarity.microsoft.com) → Project → Settings → Project ID |

### Admin & Auth

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `ADMIN_EMAIL` | Admin user email | e.g., `team@manic.agency` |
| `ADMIN_PASSWORD` | Admin user password | Choose a strong password |
| `ADMIN_SEED_ON_BOOT` | Auto-create admin on startup | `true` or `false` |
| `FRONTEND_URL` | Public URL of the app | e.g., `https://gitpaywidget.com` |

### Example `.env` file

```env
# Supabase (Required)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Encryption (Required - generate with: openssl rand -hex 32)
KEY_ENCRYPTION_SECRET=your-32-byte-hex-secret-here

# Stripe (Optional - needed for Stripe payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Lemon Squeezy (Optional - needed for Lemon Squeezy payments)
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...

# Email via Resend (Required)
RESEND_API_KEY=re_...
FROM_EMAIL=GitPayWidget <noreply@gitpaywidget.com>
SUPPORT_EMAIL=team@manic.agency

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Admin (Optional - for seeding admin user)
ADMIN_EMAIL=team@manic.agency
ADMIN_PASSWORD=your-secure-password
ADMIN_SEED_ON_BOOT=true

# App Config
FRONTEND_URL=https://gitpaywidget.com
NODE_ENV=production
```

---

## Developer Setup (Monorepo)

```bash
# Clone the repository
git clone https://github.com/manicinc/gitpaywidget.git
cd gitpaywidget

# Install dependencies
pnpm install

# Copy environment template
cp apps/gitpaywidget/.env.example apps/gitpaywidget/.env.local
# Edit .env.local with your values

# Run development server
pnpm --filter @manicinc/gitpaywidget dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Tables live in Supabase. Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

### Running Tests

```bash
# Unit tests
pnpm --filter @manicinc/gitpaywidget test

# E2E tests
pnpm --filter @manicinc/gitpaywidget test:e2e

# All tests
pnpm --filter @manicinc/gitpaywidget test:all
```

---

## Deployment

### Auto-Deploy (CI/CD)

GitPayWidget automatically deploys to production when you push to `master` or `main`:

1. Push triggers `.github/workflows/gitpaywidget-ci.yml`
2. Runs lint, type check, and tests
3. Builds the Next.js app
4. SSHs to Linode server (50.116.33.200)
5. Pulls latest code and rebuilds Docker containers
6. Runs health check on `/api/init`

**Required GitHub Secrets:**
- `LINODE_SSH_KEY` - SSH private key for server access
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL for builds
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key for builds

### Manual Deploy

```bash
# SSH to server
ssh root@50.116.33.200

# Navigate to project
cd /opt/gitpaywidget

# Pull latest
git pull origin master

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Server Configuration

The production server runs:
- **Docker** with Next.js app on port 3000
- **Nginx** reverse proxy with SSL (Let's Encrypt)
- DNS: `gitpaywidget.com` → 50.116.33.200

---

## Webhook Configuration

### Stripe Webhooks

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://gitpaywidget.com/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy signing secret → add to `.env` as `STRIPE_WEBHOOK_SECRET`

### Lemon Squeezy Webhooks

1. Go to [Lemon Squeezy → Settings → Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
2. Add endpoint: `https://gitpaywidget.com/api/webhook`
3. Add header: `X-GPW-Provider: lemonsqueezy`
4. Select events: Order created, Subscription created/updated/cancelled
5. Copy secret → add to `.env` as `LEMONSQUEEZY_WEBHOOK_SECRET`

---

## Project Structure

```
apps/gitpaywidget/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Protected dashboard
│   ├── docs/              # Documentation
│   └── ...                # Other pages
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── landing/           # Landing page sections
│   ├── layout/            # Nav, Footer
│   └── ui/                # Shared UI components
├── lib/                   # Utilities
│   ├── crypto.ts          # AES-256 encryption
│   ├── email.ts           # Resend email service
│   ├── rateLimit.ts       # API rate limiting
│   └── supabase*.ts       # Supabase clients
├── supabase/              # Database schema
├── tests/                 # Test files
└── public/                # Static assets
```

---

## Roadmap

| Milestone | Description | Status |
|-----------|-------------|--------|
| MVP Checkout | Stripe + Lemon Squeezy adapters | ✅ Complete |
| Embedded Widget | React + vanilla JS (< 5KB) | ✅ Complete |
| Dashboard | Project management + analytics | ✅ Complete |
| Blog & Docs | Full documentation site | ✅ Complete |
| Crypto Support | WalletConnect + Coinbase Commerce | 🚧 In Progress |
| Self-host Mode | Docker compose for self-hosting | 📋 Planned |

---

## Links

- **Website:** [gitpaywidget.com](https://gitpaywidget.com)
- **Docs:** [gitpaywidget.com/docs](https://gitpaywidget.com/docs)
- **GitHub:** [github.com/manicinc/gitpaywidget](https://github.com/manicinc/gitpaywidget)
- **Support:** [team@manic.agency](mailto:team@manic.agency)

---

## License

MIT – free & open source. Commercial hosting available from Manic Agency.

---

**Built by** [Manic Agency LLC](https://manic.agency) – we craft vibrant, playful, and deeply technical products.
