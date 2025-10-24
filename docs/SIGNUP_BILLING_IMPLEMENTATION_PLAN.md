---
title: "Voice Chat Assistant – Registration & Billing Implementation Plan"
status: draft
last_updated: 2025-10-16
owner: manicinc/product
---

# 1. Objectives

1. Deliver a production-ready registration flow that:
   - Collects user credentials (email + password) and creates a Supabase user.
   - Allows visitors to select a pricing tier and complete payment via Stripe.
   - Activates the purchased plan automatically after checkout (via webhook + backend sync).
2. Replace demo placeholders on the landing page with live plan cards that deep-link into the registration flow.
3. Improve i18n polish on marketing pages (strings in locale files, fade transitions already in place).

# 2. High-Level Flow

```
Landing ➜ “Explore Memberships” ➜ /register (Step 1: Account)
                                          ➜ /register/plan (Step 2: Plan + billing summary)
                                          ➜ /register/payment (Step 3: “Complete purchase”)
                                          ➜ Stripe checkout (hosted)
                                          ➜ Webhook notifies backend ➜ subscription activated
                                          ➜ /register/success (confirmation, next steps)
```

## 2.1 States

| State | Description | Owner |
|-------|-------------|-------|
| `pending_registration` | Email/password captured, Supabase user created, no plan chosen yet. | Frontend + Supabase |
| `checkout_created` | Stripe checkout link issued, awaiting webhook. | Backend |
| `active` | Webhook confirms payment, app user record updated with `subscription_status = active`. | Backend |
| `failed` | Checkout cancelled/expired. Offer retry from account settings. | Backend |


# 3. Backend Deliverables

## 3.1 Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/auth/register` | POST | Public | Creates Supabase user + local `app_users` row. Returns temp JWT for verification/resume. |
| `/api/billing/checkout` | POST | Auth (temp JWT acceptable) | Accepts `planId`, creates Stripe checkout session, stores checkout ref tied to user. |
| `/api/billing/status/:checkoutId` | GET | Auth | Polling endpoint to see if checkout has been confirmed. |
| `/api/billing/webhook` | POST | Public (verified signature) | Existing hook – ensure it updates user plan, subscription status, `stripe_customer_id`. |

## 3.2 Database / Models

- extend `app_users`:
  - `subscription_plan_id` (string)
  - `subscription_status` (enum: `none`, `pending`, `active`, `cancelled`, `past_due`)
  - `stripe_customer_id`
  - `stripe_subscription_id`
- new table `checkout_sessions`:
  - `id` (Stripe checkout id)
  - `user_id`
  - `plan_id`
  - `status` (`created`, `paid`, `failed`, `expired`)
  - `created_at`, `updated_at`

## 3.3 Services

- Supabase service helper for user creation (existing functions).
- Stripe client wrapper:
  - create checkout
  - verify webhook signature (already partially implemented).
- Notification queue (optional) to email `team@manic.agency` for new signup (future).

## 3.4 Docs

- Update `CONFIGURATION.md` with required env vars:
  - `STRIPESQUEEZY_...`
  - `SUPABASE_...`
- Update `PRODUCTION_SETUP.md` with steps for Stripe webhooks.


# 4. Frontend Deliverables

## 4.1 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/register` | `views/register/RegisterAccount.vue` | Collect email/password, show password requirements. |
| `/register/plan` | `views/register/RegisterPlan.vue` | Plan cards, comparisons, CTA to continue. |
| `/register/payment` | `views/register/RegisterPayment.vue` | Summary + “Continue to secure checkout” button. |
| `/register/success` | `views/register/RegisterSuccess.vue` | Confetti, instructions, CTA to open app. |

All routes need locale-prefixed variants via router config.

## 4.2 Components

- `components/register/PlanSelector.vue`
- `components/register/ProgressStepper.vue`
- `components/register/PlanFeaturesModal.vue`
- `components/register/CheckoutSummaryCard.vue`

## 4.3 State Management

- New Pinia store `useRegistrationStore`:
  - Holds registration form data, selected plan, checkout state.
  - Persists to sessionStorage to survive refresh.

## 4.4 Visual/UX Guidelines (per `DESIGN_SYSTEM`)

- Theme aware (Sakura Sunset et al.).
- Motion: Soft fade/slide transitions, glows for CTAs.
- Input fields: same treatment as login form (floating labels).
- Display plan benefits using icons from design system.
- Show testimonials or micro-copy to reinforce purchase.

## 4.5 Internationalization

- Extract landing hero, plan descriptions, button labels into locale files.
- Provide English default; other locales can fall back gracefully for new text.
- Use the new locale transition overlay to avoid flashing.


# 5. Integration Details

1. **Account creation**
   - POST `/api/auth/register` with email/password.
   - Backend returns `{ token, user }` using same JWT structure as login.
   - Store token in memory (not localStorage until plan active).

2. **Plan selection**
   - User picks plan; update store.

3. **Create checkout**
   - POST `/api/billing/checkout` with planId.
   - Response contains `checkoutUrl`. Redirect user in new tab or same tab.

4. **Checkout completion**
   - On `/register/payment` poll `/api/billing/status/:checkoutId` every 3s (timeout 2 min) OR open WebSocket in future.
   - When status `paid`, call `/api/auth` to refresh session and redirect to `/register/success`.

5. **Webhook**
   - Validate signature.
   - Update user record `subscription_status='active'`, set plan id.
   - For first-time purchases, send welcome email (future).


# 6. Task Breakdown

## 6.1 Discovery & Docs (current step)

- [ ] Finalize this implementation plan (doc).
- [ ] Update `PRODUCTION_SETUP.md`, `README.md` with new flow overview.

## 6.2 Backend

- [ ] Add `checkout_sessions` table migration / init script.
- [ ] Implement `/api/auth/register`.
- [ ] Extend `postCheckoutSession` to accept plan, create session record.
- [ ] Add `/api/billing/status/:checkoutId`.
- [ ] Update webhook handler to transition `checkout_sessions` + `app_users`.
- [ ] Unit / integration tests for new routes (if feasible) and manual test checklist.

## 6.3 Frontend

- [ ] Add router entries for new registration flow (with locale awareness).
- [ ] Create Pinia store `useRegistrationStore`.
- [ ] Scaffold pages/components with design-system styling.
- [ ] Connect API calls (register ➜ plan ➜ payment).
- [ ] Replace landing “Explore Memberships” CTA to route to `/register`.
- [ ] Update plan cards to use real data and link to plan step.
- [ ] i18n: move hero + plan copy into locale files.

## 6.4 QA & Deployment

- [ ] Create staging test script (manual) for signup + payment (using LS test mode).
- [ ] Verify webhook logs update correctly.
- [ ] Ensure emails and toasts show success/failure.
- [ ] Update docs with final instructions.


# 7. Risks & Mitigations

- **Webhook race conditions**: ensure idempotent updates using checkout ID.
- **Partial registrations**: cron job (future) to clean up `pending` users older than X days.
- **Locale coverage**: since translations might be missing, ensure fallback copy is elegant.
- **Billing errors**: Show helpful error page if checkout fails (link to support).


# 8. Next Actions

1. Land this document in `docs/`.
2. Update docs for ops.
3. Begin implementation starting with backend routes (scaffold) and frontend register page skeleton.
