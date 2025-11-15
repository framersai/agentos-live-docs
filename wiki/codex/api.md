<div align="center">
  <img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame Codex API" width="150">

# Frame Codex API Reference

**RESTful and GraphQL APIs for accessing Frame Codex content**

</div>

---

## 🚀 Overview

The Frame Codex API provides programmatic access to the knowledge repository. Available in both REST and GraphQL formats, the API enables:

- Search across all knowledge content
- Retrieve specific strands, looms, and weaves
- Access relationship graphs
- Subscribe to content updates
- Contribute new content (authenticated)

## 🔑 Authentication

### API Keys

All API requests require authentication via API key:

```http
Authorization: Bearer YOUR_API_KEY
```

Get your API key at [frame.dev/account/api](https://frame.dev/account/api)

### Rate Limits

| Tier | Requests/Hour | Requests/Day | Burst |
|------|---------------|--------------|-------|
| Free | 100 | 1,000 | 10/min |
| Pro | 1,000 | 10,000 | 100/min |
| Enterprise | Unlimited | Unlimited | Custom |

## 🔌 REST API

### Base URL

```
https://api.frame.dev/codex/v1
```

### Endpoints

#### Search Content

Search across all strands in the Codex.

```http
GET /search
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |
| weaves | array | No | Filter by weave slugs |
| subjects | array | No | Filter by subjects |
| topics | array | No | Filter by topics |
| difficulty | string | No | Filter by difficulty |
| limit | integer | No | Results per page (default: 20, max: 100) |
| offset | integer | No | Pagination offset |

**Example Request:**
```bash
curl -X GET "https://api.frame.dev/codex/v1/search?q=machine+learning&weaves=technology&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
{
  "results": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "slug": "transformer-architecture",
      "title": "Understanding Transformer Architecture",
      "summary": "A comprehensive guide to the Transformer architecture...",
      "weave": "technology",
      "loom": "machine-learning",
      "difficulty": "intermediate",
      "score": 0.95
    }
  ],
  "total": 42,
  "facets": {
    "weaves": {
      "technology": 35,
      "science": 7
    },
    "difficulties": {
      "beginner": 10,
      "intermediate": 25,
      "advanced": 7
    }
  }
}
```

#### Get Weave

Retrieve information about a specific weave.

```http
GET /weaves/{slug}
```

**Example Request:**
```bash
curl -X GET "https://api.frame.dev/codex/v1/weaves/technology" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
{
  "slug": "technology",
  "title": "Technology & Computer Science",
  "description": "A comprehensive collection of knowledge...",
  "maintainedBy": {
    "organization": "Frame.dev Community",
    "contact": "tech-weave@frame.dev"
  },
  "license": "CC-BY-4.0",
  "statistics": {
    "loomCount": 42,
    "strandCount": 3847,
    "lastUpdated": "2024-11-15T00:00:00Z"
  }
}
```

#### List Looms

Get all looms within a weave.

```http
GET /weaves/{weave}/looms
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tags | array | No | Filter by tags |
| difficulty | string | No | Filter by difficulty |

**Example Request:**
```bash
curl -X GET "https://api.frame.dev/codex/v1/weaves/technology/looms?tags=ai,ml" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Get Loom

Retrieve a specific loom with its strands.

```http
GET /weaves/{weave}/looms/{loom}
```

**Example Request:**
```bash
curl -X GET "https://api.frame.dev/codex/v1/weaves/technology/looms/machine-learning" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
{
  "slug": "machine-learning",
  "title": "Machine Learning Fundamentals",
  "summary": "A comprehensive introduction to machine learning...",
  "tags": ["artificial-intelligence", "data-science"],
  "ordering": {
    "type": "sequential",
    "sequence": ["introduction", "supervised-learning", "neural-networks"]
  },
  "strands": [
    {
      "slug": "introduction",
      "title": "Introduction to Machine Learning",
      "summary": "Basic concepts and terminology..."
    }
  ]
}
```

#### Get Strand

Retrieve a specific strand's content and metadata.

```http
GET /weaves/{weave}/looms/{loom}/strands/{strand}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | No | Response format: json, markdown, html |
| include_relationships | boolean | No | Include full relationship data |

**Example Request:**
```bash
curl -X GET "https://api.frame.dev/codex/v1/weaves/technology/looms/machine-learning/strands/transformer-architecture?format=json" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Get Relationships

Get the relationship graph for a strand.

```http
GET /strands/{id}/relationships
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| depth | integer | No | Graph traversal depth (default: 1, max: 3) |
| types | array | No | Filter by relationship types |

**Example Request:**
```bash
curl -X GET "https://api.frame.dev/codex/v1/strands/f47ac10b-58cc-4372-a567-0e02b2c3d479/relationships?depth=2" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
{
  "root": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "nodes": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Understanding Transformer Architecture",
      "type": "strand"
    },
    {
      "id": "a1b2c3d4-58cc-4372-a567-0e02b2c3d479",
      "title": "Basic Neural Networks",
      "type": "strand"
    }
  ],
  "edges": [
    {
      "from": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "to": "a1b2c3d4-58cc-4372-a567-0e02b2c3d479",
      "type": "prerequisite",
      "description": "Basic neural networks understanding required"
    }
  ]
}
```

## 📊 GraphQL API

### Endpoint

```
https://api.frame.dev/codex/graphql
```

### Schema

```graphql
type Query {
  # Search across all content
  search(
    query: String!
    weaves: [String!]
    subjects: [String!]
    topics: [String!]
    difficulty: Difficulty
    limit: Int
    offset: Int
  ): SearchResults!
  
  # Get specific content
  weave(slug: String!): Weave
  loom(weave: String!, slug: String!): Loom
  strand(id: ID!): Strand
  
  # List content
  weaves: [Weave!]!
  looms(weave: String!, tags: [String!]): [Loom!]!
  strands(weave: String!, loom: String!): [Strand!]!
  
  # Relationships
  relationships(
    strandId: ID!
    depth: Int
    types: [RelationshipType!]
  ): RelationshipGraph!
}

type Weave {
  slug: String!
  title: String!
  description: String!
  maintainedBy: Maintainer!
  license: String!
  tags: [String!]!
  statistics: WeaveStats!
  looms: [Loom!]!
}

type Loom {
  slug: String!
  title: String!
  summary: String!
  tags: [String!]!
  ordering: Ordering!
  relationships: [LoomRelationship!]!
  strands: [Strand!]!
}

type Strand {
  id: ID!
  slug: String!
  title: String!
  summary: String!
  content: String!
  version: String!
  contentType: String!
  difficulty: Difficulty!
  taxonomy: Taxonomy!
  relationships: [StrandRelationship!]!
  publishing: Publishing!
}

type SearchResults {
  results: [SearchResult!]!
  total: Int!
  facets: SearchFacets!
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum RelationshipType {
  PREREQUISITE
  RELATED
  FOLLOWS
  REFERENCES
  CONTRADICTS
  UPDATES
}
```

### Example Queries

#### Search Query

```graphql
query SearchCodex($query: String!) {
  search(query: $query, limit: 10) {
    results {
      id
      title
      summary
      weave
      loom
      difficulty
      score
    }
    total
    facets {
      weaves {
        slug
        count
      }
      difficulties {
        level
        count
      }
    }
  }
}
```

#### Get Strand with Relationships

```graphql
query GetStrand($id: ID!) {
  strand(id: $id) {
    id
    title
    summary
    content
    taxonomy {
      subjects
      topics
      subtopics
    }
    relationships {
      type
      target {
        id
        title
        summary
      }
      description
    }
  }
}
```

#### Browse Weave Hierarchy

```graphql
query BrowseWeave($weaveSlug: String!) {
  weave(slug: $weaveSlug) {
    title
    description
    looms {
      slug
      title
      summary
      strands {
        slug
        title
        difficulty
      }
    }
  }
}
```

## 🔄 Webhooks

Subscribe to content changes via webhooks.

### Configure Webhook

```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["strand.created", "strand.updated", "loom.created"],
  "filters": {
    "weaves": ["technology"],
    "topics": ["machine-learning"]
  }
}
```

### Webhook Payload

```json
{
  "event": "strand.created",
  "timestamp": "2024-11-15T10:30:00Z",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "slug": "new-ml-technique",
    "title": "Revolutionary ML Technique Discovered",
    "weave": "technology",
    "loom": "machine-learning"
  }
}
```

## 🛠️ SDKs & Libraries

### JavaScript/TypeScript

```bash
npm install @framersai/codex-sdk
```

```typescript
import { CodexClient } from '@framersai/codex-sdk';

const client = new CodexClient({
  apiKey: 'YOUR_API_KEY'
});

// Search
const results = await client.search('transformer architecture', {
  weaves: ['technology'],
  limit: 10
});

// Get specific content
const strand = await client.getStrand('technology', 'ml', 'transformers');
```

### Python

```bash
pip install frame-codex
```

```python
from frame_codex import CodexClient

client = CodexClient(api_key='YOUR_API_KEY')

# Search
results = client.search('transformer architecture', 
                       weaves=['technology'],
                       limit=10)

# Get specific content
strand = client.get_strand('technology', 'ml', 'transformers')
```

## 🚨 Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Strand with ID 'xyz123' not found",
    "details": {
      "resource_type": "strand",
      "resource_id": "xyz123"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing API key |
| FORBIDDEN | 403 | Insufficient permissions |
| RESOURCE_NOT_FOUND | 404 | Requested resource not found |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| VALIDATION_ERROR | 400 | Invalid request parameters |
| INTERNAL_ERROR | 500 | Server error |

## 📈 Best Practices

1. **Cache responses** when possible to reduce API calls
2. **Use pagination** for large result sets
3. **Request only needed fields** in GraphQL
4. **Handle rate limits** gracefully with exponential backoff
5. **Subscribe to webhooks** instead of polling for updates

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
  <sub>Access the world's knowledge programmatically</sub>
</div>
