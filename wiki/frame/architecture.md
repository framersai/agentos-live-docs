<div align="center">
  <img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame.dev" width="150">

# Frame.dev Architecture

**Technical foundation for AI-powered knowledge infrastructure**

</div>

---

## 🏗️ System Architecture

Frame.dev's architecture is designed for scalability, extensibility, and AI-native operations.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Web Apps   │  │  Native Apps  │  │   API Clients    │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │     Auth      │  │ Rate Limiting │  │   Load Balancer  │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Core Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Knowledge    │  │      AI       │  │   Integration    │  │
│  │   Service     │  │   Service     │  │    Service       │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  PostgreSQL  │  │ Vector Store  │  │  Object Storage  │  │
│  │   (PGlite)   │  │   (pgvector)  │  │     (S3/R2)      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Core Components

### 1. Knowledge Service

The heart of Frame.dev's architecture, managing all knowledge operations.

**Key Features:**
- **Graph Database**: Neo4j-inspired property graph on PostgreSQL
- **Content Processing**: Multi-format ingestion (20+ formats)
- **Semantic Search**: Vector embeddings with pgvector
- **Version Control**: Git-like branching for knowledge

**Architecture:**
```typescript
interface KnowledgeService {
  // Core operations
  createStrand(data: StrandData): Promise<Strand>;
  linkStrands(source: UUID, target: UUID, type: LinkType): Promise<Link>;
  
  // Search & retrieval
  search(query: string, options: SearchOptions): Promise<SearchResults>;
  getRelated(strandId: UUID, depth: number): Promise<KnowledgeGraph>;
  
  // Versioning
  createBranch(name: string): Promise<Branch>;
  merge(source: Branch, target: Branch): Promise<MergeResult>;
}
```

### 2. AI Service

Manages all AI/ML operations and model orchestration.

**Components:**
- **Model Registry**: Track available models and capabilities
- **Inference Pipeline**: Optimized for low-latency responses
- **RAG Engine**: Retrieval-Augmented Generation
- **Fine-tuning**: Custom model adaptation

**Flow:**
```
Query → Embedding → Vector Search → Context Assembly → LLM → Response
         ↓              ↓                ↓                ↓
    [Embedding]    [pgvector]    [Knowledge Graph]   [Model Hub]
```

### 3. Integration Service

Connects to external data sources and services.

**Supported Integrations:**
- **Documents**: Markdown, Org, Notion, Obsidian, Roam
- **Code**: GitHub, GitLab, Bitbucket
- **Media**: Images, Audio, Video transcription
- **APIs**: REST, GraphQL, Webhooks

## 🗄️ Data Models

### Strand (Atomic Knowledge Unit)

```typescript
interface Strand {
  id: UUID;
  slug: string;
  title: string;
  content: {
    raw: string;
    processed: any;
    embeddings?: Float32Array;
  };
  metadata: {
    version: string;
    contentType: ContentType;
    created: Date;
    modified: Date;
    author: string;
  };
  taxonomy: {
    subjects: string[];
    topics: string[];
    tags: string[];
  };
  relationships: Relationship[];
}
```

### Loom (Knowledge Collection)

```typescript
interface Loom {
  id: UUID;
  slug: string;
  title: string;
  summary: string;
  strands: UUID[];
  ordering: OrderingType;
  metadata: LoomMetadata;
}
```

### Weave (Knowledge Universe)

```typescript
interface Weave {
  slug: string;
  title: string;
  description: string;
  looms: Map<string, Loom>;
  maintainer: string;
  license: string;
}
```

## 🔒 Security Architecture

### Authentication & Authorization

- **OAuth 2.0 / OpenID Connect** for third-party auth
- **JWT tokens** for session management
- **Role-Based Access Control (RBAC)**
- **API key management** for service accounts

### Data Security

- **Encryption at rest** (AES-256)
- **TLS 1.3** for all communications
- **End-to-end encryption** for sensitive content
- **Zero-knowledge architecture** for private vaults

### Privacy

- **Local-first defaults** - data stays on device
- **Selective sync** - choose what goes to cloud
- **Data portability** - export everything
- **GDPR compliant** - right to deletion

## 🚀 Deployment Architecture

### Cloud-Native Design

```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frame-knowledge-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: knowledge-service
  template:
    metadata:
      labels:
        app: knowledge-service
    spec:
      containers:
      - name: service
        image: framersai/knowledge-service:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### Scaling Strategy

- **Horizontal scaling** for API services
- **Read replicas** for database
- **CDN** for static assets
- **Edge computing** for low-latency

## 🔌 API Design

### RESTful Principles

```http
# Create a strand
POST /api/v1/strands
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Knowledge Title",
  "content": "Content here",
  "taxonomy": {
    "subjects": ["AI", "Knowledge Management"]
  }
}

# Search knowledge
GET /api/v1/search?q=AI+architecture&limit=10
Authorization: Bearer {token}
```

### GraphQL Alternative

```graphql
query SearchKnowledge($query: String!, $limit: Int) {
  search(query: $query, limit: $limit) {
    strands {
      id
      title
      summary
      relationships {
        type
        target {
          id
          title
        }
      }
    }
  }
}
```

## 🔄 Event-Driven Architecture

### Event Bus

```typescript
// Event definitions
interface KnowledgeEvent {
  type: 'strand.created' | 'strand.updated' | 'strand.linked';
  timestamp: Date;
  payload: any;
  metadata: EventMetadata;
}

// Event handling
eventBus.on('strand.created', async (event) => {
  await indexingService.index(event.payload);
  await notificationService.notify(event.payload.author);
});
```

## 📊 Monitoring & Observability

### Metrics

- **Application metrics** via Prometheus
- **Distributed tracing** with OpenTelemetry
- **Log aggregation** using ELK stack
- **Real-time dashboards** in Grafana

### Health Checks

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = await Promise.all([
    database.ping(),
    redis.ping(),
    vectorStore.ping()
  ]);
  
  res.json({
    status: checks.every(c => c.ok) ? 'healthy' : 'degraded',
    services: checks
  });
});
```

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
  <sub>Building scalable knowledge infrastructure</sub>
</div>
