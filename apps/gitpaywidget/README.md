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
pnpm --filter @manicinc/gitpaywidget dev
```

This directory currently contains only docs; the Next.js code will land shortly.

---

## License

MIT – free & open source. Commercial hosting & concierge support available from Manic Agency.

---

**Built by** Manic Agency LLC – we craft vibrant, playful, and deeply technical products.
