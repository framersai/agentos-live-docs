# GitPayWidget – Plug-and-play payments for static sites

> **Status:** private alpha (v0.1.0)
>
> Built with ❤️ by [Manic Agency](https://manic.agency) – an experimental design & development collective.
>
> Contact: team@manic.agency

---

## What is it?

**GitPayWidget** lets any GitHub-hosted page – especially static sites like GitHub Pages, Docs, or Jekyll blogs – embed a single `<script>` tag and start accepting payments via Stripe, Lemon Squeezy, and (soon) crypto providers. No servers, PCI scope, or OAuth dance on your side – we handle provider checkout sessions, webhooks, and plan management for you.

```html
<!-- one-line integration -->
<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="your-project-slug"
  data-plan="pro"
></script>
```

The widget → calls **gitpaywidget.com/api** → orchestrates the right provider checkout → returns success & subscription events back to your site.

---

## Features

- ✅ Stripe + Lemon Squeezy support (crypto coming soon)
- ✅ Supabase auth & project management
- ✅ Encrypted provider credentials storage
- ✅ Customizable themes per project
- ✅ Analytics dashboard (MRR, checkouts, conversion)
- ✅ Webhook handling for subscription events
- ✅ TypeScript SDK + vanilla JS widget
- ✅ Docker + Nginx production deployment
- ✅ Automated CI/CD via GitHub Actions

---

## Quick Start

### 1. Sign up at gitpaywidget.com

- Login with GitHub OAuth
- Create a new project
- Add your Stripe/Lemon Squeezy keys

### 2. Embed the widget

```html
<script type="module">
  import { renderGitPayWidget } from 'https://cdn.gitpaywidget.com/v0/widget.js';

  renderGitPayWidget({
    project: 'your-org/your-site',
    plans: [
      {
        id: 'free',
        label: 'Starter',
        price: '$0',
        description: 'Evaluate',
        features: ['Basic features'],
      },
      {
        id: 'pro',
        label: 'Pro',
        price: '$9.99',
        description: 'Production',
        features: ['Advanced features', 'Priority support'],
      },
    ],
    autoTheme: true,
  });
</script>
```

### 3. Customize theme (optional)

In your dashboard:

- Set accent color
- Customize CTA label
- Add custom CSS

---

## Developer Setup

```bash
pnpm install
cp apps/gitpaywidget/env.example apps/gitpaywidget/.env.local
# Fill SUPABASE_URL / SERVICE_ROLE key and provider secrets
pnpm --filter @manicinc/gitpaywidget dev
```

Tables live in Supabase (see `apps/gitpaywidget/supabase/schema.sql`).

### Building & deploying

```bash
# Build widget bundle for CDN
pnpm --filter @gitpaywidget/widget build

# Production Next.js app
docker-compose -f docker-compose.prod.yml up -d
```

**Nginx** reverse-proxy serves the app at `gitpaywidget.com`. Configure DNS A record → your Linode/VPS IP, then add SSL via Let's Encrypt (certbot).

### Performance tips

- Widget JS is < 5 kB gzipped; lazy-loads SDK on first interaction.
- Next.js config enables `optimizePackageImports` for widget/SDK treeshaking.
- Dynamic OG image (`opengraph-image.tsx`) generates branded social cards on demand.
- Sitemap + robots ensure SEO indexing of public pages only.

---

## Roadmap

| Milestone       | Description                                                               | Target       |
| --------------- | ------------------------------------------------------------------------- | ------------ |
| MVP Checkout    | Stripe + Lemon Squeezy provider adapters; project dashboard to paste keys | ✅ completed |
| Embedded Widget | React + vanilla JS build (5 kB gz) to render plan cards & buttons         | ✅ completed |
| Self-host Mode  | Docker compose stack & instructions                                       | ✅ completed |
| Crypto Support  | WalletConnect + Coinbase Commerce adapter                                 | Q1 2026      |
| Usage Analytics | Real-time webhooks → MRR/churn dashboards                                 | Q1 2026      |

---

## Architecture

```
┌─────────────────┐
│  Static Site    │
│  (GitHub Pages) │
└────────┬────────┘
         │ <script>
         v
┌─────────────────┐
│  GitPayWidget   │
│  Widget (5 KB)  │
└────────┬────────┘
         │ fetch /api/checkout
         v
┌─────────────────┐
│  Next.js API    │
│  (gitpaywidget  │
│  .com)          │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    v          v
┌────────┐  ┌────────┐
│ Stripe │  │ Lemon  │
│        │  │Squeezy │
└────────┘  └────────┘
```

---

## API Documentation

Auto-generated TypeDoc available at `/docs` after running:

```bash
pnpm docs
```

---

## License

MIT – free & open source. Commercial hosting & concierge support available from Manic Agency.

---

## Deployment

See [DEPLOYMENT.md](apps/gitpaywidget/DEPLOYMENT.md) for full production setup instructions.

---

**Built by** [Manic Agency LLC](https://manic.agency) – we craft vibrant, playful, and deeply technical products.

**Contact:** team@manic.agency
