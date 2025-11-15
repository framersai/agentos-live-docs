<div align="center">
  <img src="../../logos/openstrand-logo.svg" alt="OpenStrand Architecture" width="150">

# OpenStrand Architecture

**Comprehensive technical design specification**

</div>

---

## 🏗️ System Overview

OpenStrand is an AI-native knowledge infrastructure designed for personal knowledge management. It combines local-first principles with cloud capabilities, offering seamless AI integration and advanced knowledge graph features.

### Design Principles

1. **Local-First, Cloud-Ready**: Data sovereignty with optional sync
2. **AI-Native**: Built for AI integration from the ground up
3. **Privacy-Focused**: User-controlled data and encryption
4. **Extensible**: Plugin architecture for customization
5. **Developer-Friendly**: Clean APIs and SDKs

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                        │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   Web App    │  │ Desktop App  │  │    Mobile Apps        │ │
│  │  (Next.js)   │  │  (Electron)  │  │  (React Native)       │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────────┐
│                         OpenStrand SDK                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Core API    │  │ Sync Engine  │  │   Plugin System       │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────────┐
│                      Backend Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Fastify API  │  │   Workers    │  │   AI Services         │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────────┐
│                        Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ PostgreSQL/  │  │   Vector     │  │   Object Storage      │ │
│  │   PGlite     │  │   Store      │  │     (S3/Local)        │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🗄️ Data Architecture

### Core Data Models

#### Strand (Knowledge Atom)

```typescript
interface Strand {
  // Identification
  id: string;                    // UUID v7 for time-ordering
  slug: string;                  // URL-safe identifier
  
  // Content
  title: string;
  content: Content;              // Polymorphic content
  contentType: ContentType;      // MIME type
  
  // Metadata
  created: Date;
  modified: Date;
  accessed: Date;
  version: number;               // Optimistic locking
  
  // Organization
  loomId?: string;              // Parent loom
  tags: string[];               // Flat tags
  
  // AI Features
  embedding?: Float32Array;      // Vector embedding
  summary?: string;             // AI-generated summary
  
  // Relationships
  links: Link[];                // Outgoing links
  backlinks: Link[];           // Incoming links
  
  // Sync
  syncStatus: SyncStatus;
  syncMetadata?: SyncMetadata;
}
```

#### Loom (Collection)

```typescript
interface Loom {
  id: string;
  slug: string;
  title: string;
  description: string;
  
  // Hierarchy
  parentId?: string;            // Parent loom
  path: string;                 // Materialized path
  
  // Content
  strandIds: string[];          // Ordered strands
  childLoomIds: string[];       // Sub-looms
  
  // Metadata
  created: Date;
  modified: Date;
  color?: string;               // Visual customization
  icon?: string;                // Emoji or icon ID
  
  // Settings
  defaultView: ViewType;        // List, graph, kanban
  sortOrder: SortOrder;
  filters: Filter[];
}
```

#### Weave (Universe)

```typescript
interface Weave {
  id: string;
  name: string;
  description: string;
  
  // Access
  ownerId: string;
  visibility: 'private' | 'shared' | 'public';
  permissions: Permission[];
  
  // Statistics
  stats: {
    strandCount: number;
    loomCount: number;
    totalSize: number;
    lastModified: Date;
  };
  
  // Configuration
  settings: WeaveSettings;
  aiConfig: AIConfiguration;
  syncConfig: SyncConfiguration;
}
```

### Database Schema

#### PostgreSQL Schema

```sql
-- Core tables
CREATE TABLE weaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE looms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weave_id UUID REFERENCES weaves(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES looms(id),
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    path TEXT NOT NULL, -- Materialized path for hierarchy
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(weave_id, slug)
);

CREATE TABLE strands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weave_id UUID REFERENCES weaves(id) ON DELETE CASCADE,
    loom_id UUID REFERENCES looms(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL, -- Structured content
    content_text TEXT, -- Plain text for FTS
    content_type TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 dimensions
    metadata JSONB DEFAULT '{}',
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(weave_id, slug)
);

-- Relationships
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES strands(id) ON DELETE CASCADE,
    target_id UUID REFERENCES strands(id) ON DELETE CASCADE,
    link_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id, link_type)
);

-- Indexes for performance
CREATE INDEX idx_strands_weave_loom ON strands(weave_id, loom_id);
CREATE INDEX idx_strands_embedding ON strands USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_strands_content_text ON strands USING gin(to_tsvector('english', content_text));
CREATE INDEX idx_looms_path ON looms USING gist(path gist_trgm_ops);
```

#### Local Storage (PGlite)

```typescript
// PGlite configuration for local-first operation
const db = new PGlite({
  dataDir: './openstrand-data',
  extensions: {
    pgvector: true,
    fts: true
  }
});

// Automatic migration on startup
await db.exec(SCHEMA_SQL);
```

## 🔄 Sync Architecture

### Conflict-Free Replicated Data Types (CRDTs)

```typescript
// CRDT implementation for collaborative editing
class StrandCRDT {
  private clock: VectorClock;
  private operations: Operation[];
  
  // Apply local operation
  applyLocal(op: Operation): void {
    this.clock.increment(this.replicaId);
    op.timestamp = this.clock.copy();
    this.operations.push(op);
    this.integrate(op);
  }
  
  // Merge remote operations
  merge(remote: Operation[]): void {
    for (const op of remote) {
      if (!this.hasOperation(op)) {
        this.operations.push(op);
        this.integrate(op);
        this.clock.merge(op.timestamp);
      }
    }
  }
}
```

### Sync Protocol

```typescript
// Merkle tree for efficient sync
class SyncEngine {
  async sync(remote: RemoteEndpoint): Promise<SyncResult> {
    // 1. Exchange Merkle roots
    const localRoot = await this.getMerkleRoot();
    const remoteRoot = await remote.getMerkleRoot();
    
    if (localRoot === remoteRoot) {
      return { status: 'up-to-date' };
    }
    
    // 2. Find differences
    const diff = await this.findDifferences(remote);
    
    // 3. Exchange changes
    const localChanges = await this.getChanges(diff.missing);
    const remoteChanges = await remote.getChanges(diff.extra);
    
    // 4. Apply changes
    await this.applyChanges(remoteChanges);
    await remote.applyChanges(localChanges);
    
    return { status: 'synced', changes: diff };
  }
}
```

## 🤖 AI Integration

### Embedding Pipeline

```typescript
class EmbeddingService {
  private model: EmbeddingModel;
  private cache: EmbeddingCache;
  
  async embedStrand(strand: Strand): Promise<Float32Array> {
    // Check cache
    const cached = await this.cache.get(strand.id, strand.version);
    if (cached) return cached;
    
    // Prepare content
    const text = this.extractText(strand);
    const chunks = this.chunkText(text, 8000); // Token limit
    
    // Generate embeddings
    const embeddings = await Promise.all(
      chunks.map(chunk => this.model.embed(chunk))
    );
    
    // Combine embeddings (weighted average)
    const combined = this.combineEmbeddings(embeddings);
    
    // Cache result
    await this.cache.set(strand.id, strand.version, combined);
    
    return combined;
  }
}
```

### AI Services

```typescript
interface AIService {
  // Semantic search
  search(query: string, options: SearchOptions): Promise<SearchResult[]>;
  
  // Similar content
  findSimilar(strand: Strand, limit: number): Promise<Strand[]>;
  
  // Chat with context
  chat(prompt: string, context: Context): Promise<ChatResponse>;
  
  // Content generation
  generate(prompt: string, template: Template): Promise<string>;
  
  // Summarization
  summarize(content: string, style: SummaryStyle): Promise<string>;
}
```

### RAG Implementation

```typescript
class RAGService {
  async answer(question: string, weave: Weave): Promise<Answer> {
    // 1. Embed question
    const questionEmbedding = await this.embed(question);
    
    // 2. Retrieve relevant strands
    const relevant = await this.vectorSearch(
      questionEmbedding,
      weave.id,
      { limit: 10, threshold: 0.7 }
    );
    
    // 3. Rerank results
    const reranked = await this.rerank(question, relevant);
    
    // 4. Build context
    const context = this.buildContext(reranked);
    
    // 5. Generate answer
    const answer = await this.llm.complete({
      system: 'You are a helpful assistant...',
      prompt: `Context: ${context}\n\nQuestion: ${question}`,
      temperature: 0.7
    });
    
    return {
      answer: answer.text,
      sources: reranked,
      confidence: answer.confidence
    };
  }
}
```

## 🔌 Plugin Architecture

### Plugin Interface

```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  
  // Lifecycle
  activate(context: PluginContext): Promise<void>;
  deactivate(): Promise<void>;
  
  // Hooks
  hooks?: {
    beforeStrandCreate?: (strand: Strand) => Promise<Strand>;
    afterStrandCreate?: (strand: Strand) => Promise<void>;
    beforeSearch?: (query: SearchQuery) => Promise<SearchQuery>;
    renderStrand?: (strand: Strand) => Promise<ReactNode>;
  };
  
  // Commands
  commands?: Command[];
  
  // UI Extensions
  panels?: Panel[];
  statusBarItems?: StatusBarItem[];
}
```

### Plugin Examples

```typescript
// Link preview plugin
class LinkPreviewPlugin implements Plugin {
  id = 'link-preview';
  name = 'Link Preview';
  
  async activate(context: PluginContext) {
    context.registerCommand({
      id: 'link-preview.fetch',
      title: 'Fetch Link Preview',
      execute: async (url: string) => {
        const preview = await this.fetchPreview(url);
        return preview;
      }
    });
    
    context.registerHook('renderStrand', async (strand) => {
      const links = this.extractLinks(strand.content);
      const previews = await Promise.all(
        links.map(link => this.fetchPreview(link))
      );
      return <LinkPreviews previews={previews} />;
    });
  }
}
```

## 🔒 Security Architecture

### Encryption

```typescript
class EncryptionService {
  // Client-side encryption before sync
  async encryptStrand(strand: Strand, key: CryptoKey): Promise<EncryptedStrand> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = JSON.stringify(strand);
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(plaintext)
    );
    
    return {
      id: strand.id,
      ciphertext: base64.encode(ciphertext),
      iv: base64.encode(iv),
      algorithm: 'AES-GCM'
    };
  }
  
  // Derive key from password
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
}
```

### Access Control

```typescript
interface AccessControl {
  // Check permissions
  canRead(user: User, resource: Resource): boolean;
  canWrite(user: User, resource: Resource): boolean;
  canDelete(user: User, resource: Resource): boolean;
  
  // Grant/revoke access
  grant(user: User, resource: Resource, permission: Permission): void;
  revoke(user: User, resource: Resource, permission: Permission): void;
  
  // Share with encryption
  share(resource: Resource, recipient: User, permissions: Permission[]): ShareLink;
}
```

## 📊 Performance Optimizations

### Indexing Strategy

```typescript
class IndexingService {
  // Incremental indexing
  async indexStrand(strand: Strand): Promise<void> {
    // Full-text search index
    await this.fts.index(strand.id, {
      title: strand.title,
      content: this.extractText(strand),
      tags: strand.tags
    });
    
    // Vector index
    const embedding = await this.embedder.embed(strand);
    await this.vectorDB.upsert(strand.id, embedding);
    
    // Graph edges
    for (const link of strand.links) {
      await this.graph.addEdge(strand.id, link.targetId, link.type);
    }
  }
  
  // Batch operations
  async reindexWeave(weaveId: string): Promise<void> {
    const strands = await this.db.getStrandsByWeave(weaveId);
    
    await this.parallel(strands, async (batch) => {
      const embeddings = await this.embedder.embedBatch(batch);
      await this.vectorDB.upsertBatch(embeddings);
    }, { batchSize: 100 });
  }
}
```

### Caching Strategy

```typescript
class CacheService {
  private memory: LRUCache<string, any>;
  private disk: DiskCache;
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache
    const memoryHit = this.memory.get(key);
    if (memoryHit) return memoryHit;
    
    // L2: Disk cache
    const diskHit = await this.disk.get(key);
    if (diskHit) {
      this.memory.set(key, diskHit);
      return diskHit;
    }
    
    return null;
  }
  
  // Cache warming
  async warmCache(weaveId: string): Promise<void> {
    const popular = await this.getPopularStrands(weaveId);
    const embeddings = await this.vectorDB.getBatch(
      popular.map(s => s.id)
    );
    
    for (const [id, embedding] of embeddings) {
      await this.set(`embedding:${id}`, embedding);
    }
  }
}
```

## 🚀 Deployment Architecture

### Container Architecture

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./server
    environment:
      DATABASE_URL: postgresql://...
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    deploy:
      replicas: 3
      
  postgres:
    image: pgvector/pgvector:pg16
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    
  worker:
    build: ./worker
    environment:
      QUEUE_URL: redis://redis:6379
    deploy:
      replicas: 2
```

### Scaling Strategy

1. **Horizontal Scaling**
   - API servers behind load balancer
   - Read replicas for database
   - Distributed vector index

2. **Edge Deployment**
   - CDN for static assets
   - Edge functions for auth
   - Regional data centers

3. **Performance Targets**
   - < 50ms search latency
   - < 200ms AI response
   - 99.9% uptime SLA

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
  <sub>Building the future of personal knowledge management</sub>
</div>
