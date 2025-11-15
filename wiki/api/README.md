<div align="center">
  <img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame.dev APIs" width="150">

# Frame.dev API Documentation

**Complete integration guide for the Frame ecosystem**

</div>

---

## 🚀 Overview

The Frame ecosystem provides comprehensive APIs for building AI-powered knowledge applications. Our APIs are designed to be:

- **🔧 Developer-Friendly**: Clean, intuitive interfaces with excellent documentation
- **🚀 Performant**: Low latency, high throughput, global edge deployment
- **🔒 Secure**: Industry-standard authentication and encryption
- **📊 Scalable**: Handle from single users to enterprise deployments
- **🔄 Consistent**: Unified patterns across all services

## 🗺️ API Ecosystem

```
┌─────────────────────────────────────────────────────────┐
│                    Frame.dev APIs                        │
├─────────────────────┬───────────────────┬───────────────┤
│   Frame Codex API   │  OpenStrand API   │  Frame AI API │
│  (Knowledge Base)   │     (PKMS)        │  (AI Services)│
├─────────────────────┴───────────────────┴───────────────┤
│                   Core Services                          │
│     Auth  │  Storage  │  Search  │  Sync  │  Analytics │
└─────────────────────────────────────────────────────────┘
```

## 🔑 Getting Started

### 1. Create an Account

Sign up at [frame.dev](https://frame.dev) to get your API credentials.

### 2. Get API Keys

```bash
# Using the CLI
frame auth login
frame api-keys create --name "My App"

# Or via dashboard
# Visit https://frame.dev/dashboard/api-keys
```

### 3. Make Your First Request

```bash
# Test your API key
curl -X GET https://api.frame.dev/v1/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```javascript
// Using JavaScript SDK
import { FrameClient } from '@framersai/sdk';

const client = new FrameClient({
  apiKey: 'YOUR_API_KEY'
});

const status = await client.getStatus();
console.log('API Status:', status);
```

## 📚 Available APIs

### [Frame Codex API](../codex/api.md)

Access the knowledge repository programmatically.

**Key Features:**
- Search across all knowledge strands
- Retrieve weaves, looms, and strands
- Access relationship graphs
- Subscribe to content updates

**Example:**
```typescript
// Search the Codex
const results = await codex.search('quantum computing', {
  weaves: ['technology'],
  limit: 10
});
```

### [OpenStrand API](../openstrand/api.md)

Build personal knowledge management applications.

**Key Features:**
- Manage vaults and strands
- AI-powered search and chat
- Real-time collaboration
- Plugin development

**Example:**
```typescript
// Create a knowledge strand
const strand = await vault.strands.create({
  title: 'Meeting Notes',
  content: 'Discussion points...',
  tags: ['work', 'important']
});
```

### Frame AI API

Powerful AI services for knowledge processing.

**Key Features:**
- Text generation and completion
- Semantic search and embeddings
- Document summarization
- Knowledge synthesis

**Example:**
```typescript
// Generate embeddings
const embeddings = await ai.embed('Understanding quantum mechanics');

// Synthesize knowledge
const synthesis = await ai.synthesize({
  question: 'What are the key AI trends?',
  sources: ['strand-1', 'strand-2']
});
```

## 🔐 Authentication

### API Key Authentication

Most straightforward for server-side applications.

```http
Authorization: Bearer YOUR_API_KEY
```

```typescript
const client = new FrameClient({
  apiKey: process.env.FRAME_API_KEY
});
```

### OAuth 2.0

For user-facing applications requiring user consent.

```typescript
// Initialize OAuth flow
const authUrl = client.oauth.getAuthorizationUrl({
  clientId: 'YOUR_CLIENT_ID',
  redirectUri: 'http://localhost:3000/callback',
  scopes: ['read:vaults', 'write:strands']
});

// Handle callback
const tokens = await client.oauth.exchangeCode(code);
```

### JWT (Self-Hosted)

For self-hosted deployments with custom auth.

```typescript
const token = jwt.sign(
  { userId: '123', permissions: ['read', 'write'] },
  process.env.JWT_SECRET
);

const client = new FrameClient({
  auth: { type: 'jwt', token }
});
```

## 🌐 REST API Conventions

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.frame.dev` |
| Staging | `https://staging-api.frame.dev` |
| Self-Hosted | `https://your-domain.com/api` |

### Request Format

```http
POST /v1/resource
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
X-Request-ID: unique-request-id

{
  "field": "value"
}
```

### Response Format

```json
{
  "data": {
    "id": "resource-id",
    "type": "resource-type",
    "attributes": {
      "field": "value"
    }
  },
  "meta": {
    "requestId": "unique-request-id",
    "timestamp": "2024-11-15T10:30:00Z"
  }
}
```

### Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "title",
        "code": "required",
        "message": "Title is required"
      }
    ]
  },
  "meta": {
    "requestId": "unique-request-id",
    "timestamp": "2024-11-15T10:30:00Z"
  }
}
```

### Pagination

```http
GET /v1/resources?limit=20&offset=40
```

```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "total": 100,
      "limit": 20,
      "offset": 40,
      "hasMore": true
    }
  },
  "links": {
    "first": "/v1/resources?limit=20&offset=0",
    "prev": "/v1/resources?limit=20&offset=20",
    "next": "/v1/resources?limit=20&offset=60",
    "last": "/v1/resources?limit=20&offset=80"
  }
}
```

## 📊 GraphQL API

### Endpoint

```
https://api.frame.dev/graphql
```

### Schema Exploration

```graphql
# Introspection query
{
  __schema {
    types {
      name
      description
    }
  }
}
```

### Example Query

```graphql
query GetKnowledge($search: String!) {
  codexSearch(query: $search, limit: 10) {
    results {
      id
      title
      summary
      score
    }
  }
  
  myVaults {
    id
    name
    stats {
      strandCount
      totalSize
    }
  }
}
```

### Subscriptions

```graphql
subscription OnStrandUpdated($vaultId: ID!) {
  strandUpdated(vaultId: $vaultId) {
    id
    title
    modifiedAt
    modifiedBy {
      id
      name
    }
  }
}
```

## 🔄 Webhooks

### Configuring Webhooks

```http
POST /v1/webhooks
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "url": "https://your-app.com/webhook",
  "events": [
    "strand.created",
    "strand.updated",
    "vault.shared"
  ],
  "secret": "webhook-secret"
}
```

### Webhook Payload

```json
{
  "id": "evt_123",
  "type": "strand.created",
  "created": "2024-11-15T10:30:00Z",
  "data": {
    "object": {
      "id": "strand_456",
      "title": "New Strand",
      "vaultId": "vault_789"
    }
  }
}
```

### Verifying Webhooks

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${digest}`)
  );
}
```

## ⚡ Rate Limits

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699999999
X-RateLimit-Policy: 1000;w=3600
```

### Handling Rate Limits

```typescript
async function makeRequest(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return makeRequest(url, options); // Retry
  }
  
  return response;
}
```

## 🛠️ SDKs & Libraries

### Official SDKs

| Language | Package | Documentation |
|----------|---------|---------------|
| JavaScript/TypeScript | `@framersai/sdk` | [Docs](./sdk-js.md) |
| Python | `frame-sdk` | [Docs](./sdk-python.md) |
| Go | `github.com/framersai/go-sdk` | [Docs](./sdk-go.md) |
| Ruby | `frame-ruby` | [Docs](./sdk-ruby.md) |

### Community SDKs

| Language | Repository | Maintainer |
|----------|------------|------------|
| Rust | [frame-rust](https://github.com/community/frame-rust) | Community |
| Java | [frame-java](https://github.com/community/frame-java) | Community |
| PHP | [frame-php](https://github.com/community/frame-php) | Community |

## 📈 Best Practices

### 1. Use Idempotency Keys

```typescript
const response = await client.strands.create({
  title: 'Important Note',
  content: 'Content here'
}, {
  idempotencyKey: 'unique-operation-id'
});
```

### 2. Implement Exponential Backoff

```typescript
async function retryWithBackoff(fn: Function, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

### 3. Batch Operations

```typescript
// Instead of multiple calls
for (const item of items) {
  await client.strands.create(item);
}

// Use batch operations
await client.strands.createBatch(items);
```

### 4. Use Field Filtering

```typescript
// Only request needed fields
const strand = await client.strands.get(id, {
  fields: ['id', 'title', 'summary']
});
```

### 5. Cache Appropriately

```typescript
const cache = new Map();

async function getCachedStrand(id: string) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const strand = await client.strands.get(id);
  cache.set(id, strand);
  
  // Clear cache after TTL
  setTimeout(() => cache.delete(id), 5 * 60 * 1000);
  
  return strand;
}
```

## 🚨 Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Handling Example

```typescript
try {
  const strand = await client.strands.get('invalid-id');
} catch (error) {
  if (error instanceof FrameAPIError) {
    switch (error.code) {
      case 'NOT_FOUND':
        console.log('Strand not found');
        break;
      case 'RATE_LIMITED':
        console.log(`Rate limited. Retry after ${error.retryAfter}s`);
        break;
      default:
        console.error('API Error:', error.message);
    }
  }
}
```

## 📞 Support

### Resources

- **Documentation**: [docs.frame.dev](https://docs.frame.dev)
- **API Status**: [status.frame.dev](https://status.frame.dev)
- **Community Forum**: [community.frame.dev](https://community.frame.dev)
- **GitHub Issues**: [github.com/framersai/api-issues](https://github.com/framersai/api-issues)

### Contact

- **Support**: [support@frame.dev](mailto:support@frame.dev)
- **Enterprise**: [enterprise@frame.dev](mailto:enterprise@frame.dev)
- **Security**: [security@frame.dev](mailto:security@frame.dev)

---

<div align="center">
  <br/>
  <p>
    <a href="https://frame.dev">Frame.dev</a> •
    <a href="https://frame.dev/codex">Frame Codex</a> •
    <a href="https://openstrand.ai">OpenStrand</a>
  </p>
  <p>
    <a href="https://github.com/framersai">GitHub</a> •
    <a href="https://twitter.com/framersai">Twitter</a>
  </p>
  <br/>
  <sub>Build with confidence on Frame.dev APIs</sub>
</div>
