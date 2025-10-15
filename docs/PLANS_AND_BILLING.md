# Plans, Pricing, and Billing

This note defines the commercial plans, daily token budgets, and billing integrations for Voice Chat Assistant. All plan metadata lives in `shared/planCatalog.ts` so both backend and frontend read the same source of truth.

## Plan Catalog Overview

| Plan | Monthly Price | Usage Allocation | Daily Platform Allowance | BYO Keys | Audience |
| --- | --- | --- | --- | --- | --- |
| Global Lifetime Access | Invite-only | Internal allocation | ~31,800 GPT-4o tokens (USD 0.35) | No | Internal cohorts |
| Free | $0 | N/A | ~1,800 GPT-4o tokens (~51K GPT-4o mini) | No | Product evaluation |
| Basic | $9 | 35% -> USD 0.105/day | ~9,500 GPT-4o tokens | No | Individual developers |
| Creator | $18 | 40% -> USD 0.24/day | ~21,800 GPT-4o tokens | Optional after allowance | Freelancers and builders |
| Organization | $99 | 45% -> USD 1.485/day | ~135,000 GPT-4o tokens (shared) | Optional after allowance | Teams (>= five seats) |

### Why these numbers?

1. **Model cost assumptions**
   - GPT-4o blended cost per 1K tokens ~ USD 0.011 (40% input @ 0.005 + 60% output @ 0.015).
   - GPT-4o mini blended cost per 1K tokens ~ USD 0.00039 (40% input @ 0.00015 + 60% output @ 0.00060).
2. **Budget allocation**
   - Basic allocates 35% of revenue to usage, Creator 40%, Organization 45%.
   - Daily allowance = (monthly price * allocation percentage) / 30.
   - Approximate GPT-4o tokens = floor((daily allowance USD / 0.011) * 1000).
3. **Margins**
   - Gross margin stays above ~55% for each paid tier while funding the built-in usage budget.
   - Creator and Organization tiers fall back to bring-your-own keys after the house allowance is used.

## Platform vs BYO Keys

- **Basic**: usage stops when the platform budget is exhausted.
- **Creator**: platform budget first, then BYO keys with UI telemetry and reporting.
- **Organization**: shared pool first, optional seat caps, then BYO keys per member.

The rollover rules are exported from `shared/planCatalog.ts` so both UI and API can explain the behaviour.

## Global Lifetime Access

- Maintain a small list of shared passphrases (rotate manually via config or admin tooling).
- Each passphrase maps to the same allowance as Basic (USD 0.35/day ~31,800 GPT-4o tokens) but enforced per IP.
- Document rotation in the internal runbook: issue new passphrase, offer a grace period, then retire the old one.

## Provider Toggle

Plans ship checkout descriptors for both Lemon Squeezy and Stripe. Only populate the env vars for the provider you use.

```
# Lemon Squeezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_BASIC_PRODUCT_ID=
LEMONSQUEEZY_BASIC_VARIANT_ID=
LEMONSQUEEZY_CREATOR_PRODUCT_ID=
LEMONSQUEEZY_CREATOR_VARIANT_ID=
LEMONSQUEEZY_ORG_PRODUCT_ID=
LEMONSQUEEZY_ORG_VARIANT_ID=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_BASIC_PRODUCT_ID=
STRIPE_BASIC_PRICE_ID=
STRIPE_CREATOR_PRODUCT_ID=
STRIPE_CREATOR_PRICE_ID=
STRIPE_ORG_PRODUCT_ID=
STRIPE_ORG_PRICE_ID=
```

For the frontend, mirror the IDs using `VITE_LEMONSQUEEZY_*` and `VITE_STRIPE_*` so buttons and modals render correctly.

## Lemon Squeezy Checklist

1. Create Basic, Creator, and Organization products with matching variants.
2. Store the product/variant IDs in the env vars above.
3. Point the webhook to `/api/billing/webhook` and share the secret with the backend.
4. (Optional) create add-on variants for additional Organization seats.

### Where to find Lemon Squeezy IDs

1. Login to the Lemon Squeezy dashboard and open **Products**.
2. Create or select your plan product (Basic, Creator, Organization).
3. Inside the product, open the **Variants** tab.
4. Click a variant and copy its numeric ID from the URL (`/variants/{variant_id}`) or from the API panel in the sidebar.
5. Copy the product ID from the parent product URL (`/products/{product_id}`) or the same API panel.
6. Paste both IDs into `.env` (`LEMONSQUEEZY_*`) and `frontend/.env.local` (`VITE_LEMONSQUEEZY_*`).
7. Optional: visit **Checkout > Advanced Settings** to set `success_url` and `cancel_url` so they match your environment defaults.

The IDs are short numeric strings (for example `123456`) and are visible without calling the API.
## Stripe Checklist (Optional)

1. Create the same three products and monthly price IDs.
2. Add the secret key and price IDs to the env vars above.
3. Configure a webhook for `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted`.
4. Implement the Stripe webhook handler (mirrors the Lemon Squeezy handler) before enabling for customers.

## Team and Organization Flow

- Tables: `organizations`, `organization_members`, `organization_invites`.
- Roles: admin (billing + seats), builder (full usage), viewer (read-only future).
- Invites: admin triggers email, recipient accepts, seat count enforced before activation.
- UI: Settings > Team Management now handles seat limits, member roles, and distributing invite links.
- Usage telemetry tracks `platform_spend_usd` and `byo_spend_usd` so dashboards can break out cost sources.

## Reuse Checklist

1. Edit `shared/planCatalog.ts` when pricing or features change.
2. Update `.env.sample`, `CONFIGURATION.md`, and this doc with any new env vars.
3. Re-run marketing copy (About page, Login hints, Settings billing card) which now pull directly from the shared plan catalog.
4. Copy the same files into any derivative app so pricing stays DRY.

## Roadmap

- Add Stripe checkout + webhook parity.
- Build team management UI (invitations, seat caps, role assignment).
- Add an admin tool for global passphrase rotation.
- Expand telemetry dashboards to show platform vs BYO spend per plan.
