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

The widget → calls **api.gitpaywidget.com** → orchestrates the right provider checkout → returns success & subscription events back to your site.

---

## Roadmap

| Milestone       | Description                                                               | Target         |
| --------------- | ------------------------------------------------------------------------- | -------------- |
| MVP Checkout    | Stripe + Lemon Squeezy provider adapters; project dashboard to paste keys | ✅ in progress |
| Embedded Widget | React + vanilla JS build (5 kB gz) to render plan cards & buttons         | soon           |
| Self-host Mode  | Docker compose stack & instructions                                       | TBD            |
| Crypto Support  | WalletConnect + Coinbase Commerce adapter                                 | TBD            |

---

## Developer setup (monorepo)

```bash
pnpm install
cp apps/gitpaywidget/env.example apps/gitpaywidget/.env.local
# Fill SUPABASE_URL / SERVICE_ROLE key and provider secrets
pnpm --filter @manicinc/gitpaywidget dev
```

Tables live in Supabase (see `supabase/schema.sql`).

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

## License

MIT – free & open source. Commercial hosting & concierge support available from Manic Agency.

---

**Built by** Manic Agency LLC – we craft vibrant, playful, and deeply technical products.

---

### Embedding the widget

```html
<!-- Coming soon: CDN bundle. During alpha import via npm -->
<script type="module">
  import { renderGitPayWidget } from '@gitpaywidget/widget';

  renderGitPayWidget({
    project: 'your-org/your-site',
    plans: [
      {
        id: 'free',
        label: 'Starter',
        price: '$0',
        description: 'Evaluate',
        features: ['Doc summaries'],
      },
      {
        id: 'pro',
        label: 'Pro',
        price: '$9.99',
        description: 'Production',
        features: ['Block summaries'],
      },
    ],
  });
</script>
```
