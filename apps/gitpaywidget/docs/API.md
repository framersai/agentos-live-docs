# GitPayWidget API Reference

Base URL: `https://gitpaywidget.com/api`

---

## Authentication

Most endpoints require Supabase session authentication via cookies. The SDK handles this automatically when users sign in with GitHub OAuth.

---

## Public Endpoints

### GET `/public/projects/:slug/settings`

Fetch widget theme settings for a project (used by the widget for auto-theming).

**Parameters:**
- `slug` (path): Project slug (e.g., `acme/site`)

**Response:**
```json
{
  "accent_hex": "#8b5cf6",
  "cta_label": "Get started",
  "custom_css": ".gpw-plan-card { border-radius: 24px; }"
}
```

**Status Codes:**
- `200`: Success
- `404`: Project not found

---

## Checkout

### POST `/checkout`

Create a hosted checkout session with Stripe or Lemon Squeezy.

**Request Body:**
```json
{
  "project": "acme/site",
  "plan": "pro",
  "metadata": {
    "userId": "12345",
    "referrer": "landing-page"
  }
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_a1b2c3...",
  "provider": "stripe"
}
```

**Status Codes:**
- `200`: Checkout session created
- `404`: Project not found or no provider keys configured
- `500`: Provider API error

---

## Projects (Auth Required)

### GET `/projects`

List all projects owned by the authenticated user.

**Response:**
```json
{
  "projects": [
    {
      "id": "cuid...",
      "slug": "acme/site",
      "name": "Acme Landing Page",
      "created_at": "2025-11-18T12:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `401`: Not authenticated

---

### POST `/projects`

Create a new project.

**Request Body:**
```json
{
  "name": "My Landing Page",
  "slug": "myorg/landing"
}
```

**Response:**
```json
{
  "id": "cuid...",
  "slug": "myorg/landing",
  "name": "My Landing Page",
  "created_at": "2025-11-18T12:00:00Z"
}
```

**Status Codes:**
- `201`: Project created
- `400`: Invalid slug or name
- `409`: Slug already exists
- `401`: Not authenticated

---

### PATCH `/projects/:slug`

Update project name or slug.

**Request Body:**
```json
{
  "name": "Updated Name",
  "slug": "new-slug"
}
```

**Response:**
```json
{
  "id": "cuid...",
  "slug": "new-slug",
  "name": "Updated Name"
}
```

**Status Codes:**
- `200`: Updated
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

### DELETE `/projects/:slug`

Delete a project and all associated provider keys.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200`: Deleted
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

## Provider Keys (Auth Required)

### GET `/projects/:slug/keys`

List provider credentials for a project (returns masked summaries, not decrypted secrets).

**Response:**
```json
{
  "keys": [
    {
      "provider": "stripe",
      "updatedAt": "2025-11-18T12:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

### POST `/projects/:slug/keys`

Store or update encrypted provider credentials.

**Request Body:**
```json
{
  "provider": "stripe",
  "secret": "{\"secretKey\":\"sk_test_...\",\"webhookSecret\":\"whsec_...\"}"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200`: Saved
- `400`: Invalid provider or malformed secret
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

## Analytics (Auth Required)

### GET `/projects/:slug/analytics`

Fetch revenue and conversion metrics for a project.

**Response:**
```json
{
  "mrr": 249900,
  "checkoutsToday": 12,
  "conversionRate": 0.23,
  "updatedAt": "2025-11-18T12:00:00Z"
}
```

**Fields:**
- `mrr`: Monthly recurring revenue in cents
- `checkoutsToday`: Number of checkout sessions created today
- `conversionRate`: Percentage of visitors who complete checkout (0-1)

**Status Codes:**
- `200`: Success
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

## Settings (Auth Required)

### GET `/projects/:slug/settings`

Get widget theme settings (authenticated version).

**Response:**
```json
{
  "accent_hex": "#8b5cf6",
  "cta_label": "Get started",
  "custom_css": ""
}
```

**Status Codes:**
- `200`: Success
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

### POST `/projects/:slug/settings`

Update widget theme settings.

**Request Body:**
```json
{
  "accent_hex": "#ec4899",
  "cta_label": "Start free trial",
  "custom_css": ".gpw-plan-card { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200`: Updated
- `400`: Invalid hex color
- `404`: Project not found
- `403`: Not the owner
- `401`: Not authenticated

---

## Webhooks

### POST `/webhook`

Receive webhook events from Stripe or Lemon Squeezy.

**Headers:**
- `X-GPW-Provider` (optional): `stripe` | `lemonsqueezy` (auto-detected if omitted)
- Provider-specific signature headers (e.g., `Stripe-Signature`)

**Response:**
```json
{
  "received": true
}
```

**Status Codes:**
- `200`: Event processed
- `400`: Invalid signature or payload

**Note:** This endpoint is called by payment providers, not client applications.

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

Common status codes:
- `400`: Bad request (invalid params)
- `401`: Unauthenticated
- `403`: Forbidden (not the owner)
- `404`: Resource not found
- `500`: Internal server error

---

## Rate Limits

- **Public endpoints**: 60 req/min per IP
- **Authenticated endpoints**: 120 req/min per user
- **Webhook endpoint**: No limit (verified via signature)

Rate limits enforced via Nginx (see `deployment/nginx.conf`).

---

## Support

Questions? Contact **team@manic.agency**

---

**Built by** Manic Agency LLC

