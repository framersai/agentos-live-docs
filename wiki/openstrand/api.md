<div align="center">
  <img src="../../logos/openstrand-logo.svg" alt="OpenStrand API" width="150">

# OpenStrand API Reference

**Complete API documentation for developers**

</div>

---

## 🚀 Getting Started

### Installation

```bash
# npm
npm install @openstrand/sdk

# yarn
yarn add @openstrand/sdk

# pnpm
pnpm add @openstrand/sdk
```

### Basic Usage

```typescript
import { OpenStrand } from '@openstrand/sdk';

// Initialize client
const openstrand = new OpenStrand({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.openstrand.ai', // or self-hosted URL
  version: 'v1'
});

// Create a vault
const vault = await openstrand.createVault({
  name: 'My Knowledge Base',
  description: 'Personal knowledge management'
});

// Create a strand
const strand = await vault.strands.create({
  title: 'My First Note',
  content: 'This is my first note in OpenStrand!',
  tags: ['welcome', 'tutorial']
});
```

## 📚 Core Concepts

### Authentication

```typescript
// API Key authentication
const client = new OpenStrand({
  apiKey: process.env.OPENSTRAND_API_KEY
});

// OAuth authentication
const client = new OpenStrand({
  oauth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/callback'
  }
});

// JWT authentication (self-hosted)
const client = new OpenStrand({
  auth: {
    type: 'jwt',
    token: await getJWTToken()
  }
});
```

### Error Handling

```typescript
try {
  const strand = await vault.strands.get('non-existent-id');
} catch (error) {
  if (error instanceof OpenStrandError) {
    console.error(`Error ${error.code}: ${error.message}`);
    
    switch (error.code) {
      case 'NOT_FOUND':
        // Handle not found
        break;
      case 'UNAUTHORIZED':
        // Refresh token
        break;
      case 'RATE_LIMITED':
        // Retry after delay
        const retryAfter = error.retryAfter;
        break;
    }
  }
}
```

## 🗄️ Vault API

### Vault Management

```typescript
class VaultAPI {
  // List all vaults
  async list(options?: {
    limit?: number;
    offset?: number;
    orderBy?: 'created' | 'modified' | 'name';
  }): Promise<PaginatedResponse<Vault>>;
  
  // Create a vault
  async create(data: {
    name: string;
    description?: string;
    settings?: VaultSettings;
  }): Promise<Vault>;
  
  // Get vault by ID
  async get(id: string): Promise<Vault>;
  
  // Update vault
  async update(id: string, data: Partial<Vault>): Promise<Vault>;
  
  // Delete vault
  async delete(id: string): Promise<void>;
  
  // Get vault statistics
  async getStats(id: string): Promise<VaultStats>;
  
  // Export vault
  async export(id: string, format: 'json' | 'markdown' | 'opml'): Promise<Blob>;
  
  // Import data into vault
  async import(id: string, data: File | Blob, options?: ImportOptions): Promise<ImportResult>;
}
```

### Vault Settings

```typescript
interface VaultSettings {
  // AI configuration
  ai: {
    provider: 'openai' | 'anthropic' | 'local';
    model: string;
    temperature: number;
    embeddings: {
      model: string;
      dimensions: number;
    };
  };
  
  // Sync configuration
  sync: {
    enabled: boolean;
    interval: number;
    encryption: boolean;
    conflictResolution: 'manual' | 'latest' | 'merge';
  };
  
  // Privacy settings
  privacy: {
    telemetry: boolean;
    crashReports: boolean;
    encryption: 'none' | 'transit' | 'e2e';
  };
}
```

## 📝 Strand API

### Strand Management

```typescript
class StrandAPI {
  // Create a strand
  async create(data: {
    title: string;
    content: Content;
    contentType?: string;
    loomId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
  }): Promise<Strand>;
  
  // Get strand by ID
  async get(id: string, options?: {
    includeContent?: boolean;
    includeRelationships?: boolean;
    includeVersions?: boolean;
  }): Promise<Strand>;
  
  // Update strand
  async update(id: string, data: {
    title?: string;
    content?: Content;
    tags?: string[];
    metadata?: Record<string, any>;
  }): Promise<Strand>;
  
  // Delete strand
  async delete(id: string): Promise<void>;
  
  // List strands
  async list(options?: {
    loomId?: string;
    tags?: string[];
    contentType?: string;
    search?: string;
    limit?: number;
    offset?: number;
    orderBy?: StrandOrderBy;
  }): Promise<PaginatedResponse<Strand>>;
  
  // Get strand versions
  async getVersions(id: string): Promise<StrandVersion[]>;
  
  // Revert to version
  async revert(id: string, version: number): Promise<Strand>;
}
```

### Content Types

```typescript
// Text content
const textStrand = await vault.strands.create({
  title: 'Text Note',
  content: {
    type: 'text',
    data: 'This is plain text content'
  }
});

// Markdown content
const mdStrand = await vault.strands.create({
  title: 'Markdown Note',
  content: {
    type: 'markdown',
    data: '# Heading\n\nThis is **markdown** content'
  }
});

// Structured content
const structuredStrand = await vault.strands.create({
  title: 'Structured Data',
  content: {
    type: 'json',
    data: {
      name: 'John Doe',
      age: 30,
      interests: ['coding', 'reading']
    }
  }
});

// Binary content
const imageStrand = await vault.strands.create({
  title: 'Profile Picture',
  content: {
    type: 'file',
    data: imageFile,
    mimeType: 'image/jpeg'
  }
});
```

## 🧵 Loom API

### Loom Management

```typescript
class LoomAPI {
  // Create a loom
  async create(data: {
    name: string;
    description?: string;
    parentId?: string;
    color?: string;
    icon?: string;
    settings?: LoomSettings;
  }): Promise<Loom>;
  
  // Get loom
  async get(id: string, options?: {
    includeStrands?: boolean;
    includeChildren?: boolean;
    includeStats?: boolean;
  }): Promise<Loom>;
  
  // Update loom
  async update(id: string, data: Partial<Loom>): Promise<Loom>;
  
  // Delete loom
  async delete(id: string, options?: {
    deleteStrands?: boolean;
  }): Promise<void>;
  
  // List looms
  async list(options?: {
    parentId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Loom>>;
  
  // Move loom
  async move(id: string, newParentId: string | null): Promise<Loom>;
  
  // Get loom path
  async getPath(id: string): Promise<Loom[]>;
}
```

### Loom Organization

```typescript
// Create nested structure
const projectLoom = await vault.looms.create({
  name: 'My Project',
  icon: '📁'
});

const researchLoom = await vault.looms.create({
  name: 'Research',
  parentId: projectLoom.id,
  icon: '🔬'
});

const notesLoom = await vault.looms.create({
  name: 'Meeting Notes',
  parentId: projectLoom.id,
  icon: '📝'
});

// Get loom hierarchy
const path = await vault.looms.getPath(notesLoom.id);
// Returns: [projectLoom, notesLoom]
```

## 🔗 Relationship API

### Link Management

```typescript
class RelationshipAPI {
  // Create link
  async createLink(data: {
    sourceId: string;
    targetId: string;
    type: LinkType;
    metadata?: Record<string, any>;
  }): Promise<Link>;
  
  // Get links for strand
  async getLinks(strandId: string, options?: {
    direction?: 'outgoing' | 'incoming' | 'both';
    types?: LinkType[];
    limit?: number;
  }): Promise<Link[]>;
  
  // Delete link
  async deleteLink(id: string): Promise<void>;
  
  // Get related strands
  async getRelated(strandId: string, options?: {
    depth?: number;
    types?: LinkType[];
    limit?: number;
  }): Promise<RelatedStrand[]>;
  
  // Find path between strands
  async findPath(sourceId: string, targetId: string, options?: {
    maxDepth?: number;
    types?: LinkType[];
  }): Promise<StrandPath[]>;
}
```

### Link Types

```typescript
enum LinkType {
  REFERENCE = 'reference',
  RELATED = 'related',
  PARENT = 'parent',
  CHILD = 'child',
  PREREQUISITE = 'prerequisite',
  NEXT = 'next',
  CONTRADICTS = 'contradicts',
  SUPPORTS = 'supports',
  CUSTOM = 'custom'
}

// Create different link types
await vault.relationships.createLink({
  sourceId: strand1.id,
  targetId: strand2.id,
  type: LinkType.REFERENCE,
  metadata: {
    context: 'Used as source for statistics'
  }
});
```

## 🔍 Search API

### Search Operations

```typescript
class SearchAPI {
  // Semantic search
  async search(query: string, options?: {
    vaultId?: string;
    loomIds?: string[];
    tags?: string[];
    contentTypes?: string[];
    dateRange?: DateRange;
    limit?: number;
    offset?: number;
    threshold?: number;
  }): Promise<SearchResults>;
  
  // Keyword search
  async searchKeywords(keywords: string[], options?: SearchOptions): Promise<SearchResults>;
  
  // Advanced search with filters
  async advancedSearch(filters: {
    must?: SearchClause[];
    should?: SearchClause[];
    mustNot?: SearchClause[];
    filter?: FilterClause[];
  }): Promise<SearchResults>;
  
  // Get similar strands
  async findSimilar(strandId: string, options?: {
    limit?: number;
    threshold?: number;
    inLoom?: string;
  }): Promise<SimilarityResult[]>;
  
  // Search suggestions
  async suggest(prefix: string, options?: {
    types?: ('strands' | 'tags' | 'looms')[];
    limit?: number;
  }): Promise<Suggestions>;
}
```

### Search Examples

```typescript
// Semantic search
const results = await vault.search('quantum computing applications', {
  loomIds: ['physics', 'computer-science'],
  threshold: 0.7,
  limit: 20
});

// Advanced search
const advanced = await vault.search.advancedSearch({
  must: [
    { field: 'content', contains: 'machine learning' }
  ],
  should: [
    { field: 'tags', contains: 'AI' },
    { field: 'tags', contains: 'ML' }
  ],
  filter: [
    { field: 'created', gte: '2024-01-01' },
    { field: 'contentType', equals: 'text/markdown' }
  ]
});

// Find similar content
const similar = await vault.search.findSimilar(strand.id, {
  limit: 10,
  threshold: 0.8
});
```

## 🤖 AI API

### AI Operations

```typescript
class AIAPI {
  // Chat with knowledge base
  async chat(messages: ChatMessage[], options?: {
    context?: {
      strandIds?: string[];
      loomIds?: string[];
      search?: string;
      limit?: number;
    };
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }): Promise<ChatResponse | AsyncIterable<ChatChunk>>;
  
  // Generate content
  async generate(prompt: string, options?: {
    template?: string;
    variables?: Record<string, any>;
    outputFormat?: 'text' | 'markdown' | 'json';
    maxTokens?: number;
  }): Promise<GeneratedContent>;
  
  // Summarize content
  async summarize(strandIds: string[], options?: {
    style?: 'brief' | 'detailed' | 'bullets';
    maxLength?: number;
  }): Promise<Summary>;
  
  // Extract information
  async extract(strandId: string, schema: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'array';
      description?: string;
      required?: boolean;
    };
  }): Promise<ExtractedData>;
  
  // Analyze connections
  async analyzeConnections(strandIds: string[]): Promise<ConnectionAnalysis>;
}
```

### AI Examples

```typescript
// Chat with context
const response = await vault.ai.chat([
  { role: 'user', content: 'What do my notes say about quantum entanglement?' }
], {
  context: {
    loomIds: ['physics'],
    search: 'quantum entanglement',
    limit: 10
  },
  temperature: 0.7,
  stream: true
});

// Stream response
for await (const chunk of response) {
  process.stdout.write(chunk.content);
}

// Generate study guide
const studyGuide = await vault.ai.generate(
  'Create a study guide for {{topic}}',
  {
    variables: { topic: 'Machine Learning' },
    outputFormat: 'markdown',
    maxTokens: 2000
  }
);

// Extract structured data
const extracted = await vault.ai.extract(strand.id, {
  mainTopic: {
    type: 'string',
    description: 'The main topic of the document'
  },
  keyPoints: {
    type: 'array',
    description: 'Key points or takeaways'
  },
  sentiment: {
    type: 'string',
    description: 'Overall sentiment: positive, negative, or neutral'
  }
});
```

## 🔄 Sync API

### Sync Operations

```typescript
class SyncAPI {
  // Get sync status
  async getStatus(): Promise<SyncStatus>;
  
  // Trigger sync
  async sync(options?: {
    force?: boolean;
    direction?: 'push' | 'pull' | 'both';
  }): Promise<SyncResult>;
  
  // Get sync history
  async getHistory(options?: {
    limit?: number;
    since?: Date;
  }): Promise<SyncEvent[]>;
  
  // Resolve conflicts
  async getConflicts(): Promise<SyncConflict[]>;
  async resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge'): Promise<void>;
  
  // Configure sync
  async configure(settings: SyncSettings): Promise<void>;
}
```

## 🔌 Plugin API

### Plugin Development

```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description?: string;
  
  // Lifecycle hooks
  activate(context: PluginContext): Promise<void>;
  deactivate(): Promise<void>;
  
  // Optional capabilities
  commands?: Command[];
  hooks?: PluginHooks;
  ui?: UIContributions;
  settings?: SettingsSchema;
}

interface PluginContext {
  // OpenStrand APIs
  vault: VaultAPI;
  strands: StrandAPI;
  ai: AIAPI;
  
  // Plugin APIs
  storage: PluginStorage;
  events: EventEmitter;
  
  // UI APIs
  showMessage(message: string, type?: 'info' | 'warning' | 'error'): void;
  showInputBox(options: InputBoxOptions): Promise<string | undefined>;
  
  // Register contributions
  registerCommand(command: Command): Disposable;
  registerHook(event: string, handler: Function): Disposable;
}
```

### Plugin Example

```typescript
const citationPlugin: Plugin = {
  id: 'citation-manager',
  name: 'Citation Manager',
  version: '1.0.0',
  author: 'OpenStrand Community',
  
  async activate(context: PluginContext) {
    // Register command
    context.registerCommand({
      id: 'citation.insert',
      title: 'Insert Citation',
      execute: async () => {
        const doi = await context.showInputBox({
          prompt: 'Enter DOI',
          placeholder: '10.1234/example'
        });
        
        if (doi) {
          const citation = await this.fetchCitation(doi);
          // Insert into current strand
        }
      }
    });
    
    // Register hook
    context.registerHook('beforeStrandSave', async (strand) => {
      // Auto-format citations
      strand.content = await this.formatCitations(strand.content);
      return strand;
    });
  },
  
  async deactivate() {
    // Cleanup
  }
};
```

## 📊 Analytics API

### Analytics Operations

```typescript
class AnalyticsAPI {
  // Get vault statistics
  async getStats(vaultId: string, options?: {
    period?: 'day' | 'week' | 'month' | 'year';
    metrics?: Metric[];
  }): Promise<VaultStats>;
  
  // Get activity timeline
  async getActivity(options?: {
    limit?: number;
    types?: ActivityType[];
    since?: Date;
  }): Promise<Activity[]>;
  
  // Get insights
  async getInsights(): Promise<Insights>;
  
  // Export analytics
  async export(format: 'csv' | 'json'): Promise<Blob>;
}
```

## 🚀 WebSocket API

### Real-time Updates

```typescript
// Connect to WebSocket
const ws = openstrand.connect();

// Subscribe to events
ws.on('strand:created', (strand) => {
  console.log('New strand created:', strand.title);
});

ws.on('strand:updated', (strand) => {
  console.log('Strand updated:', strand.title);
});

ws.on('sync:progress', (progress) => {
  console.log(`Sync progress: ${progress.percent}%`);
});

// Join collaborative session
const session = await ws.joinSession('strand-id');

session.on('user:joined', (user) => {
  console.log(`${user.name} joined`);
});

session.on('cursor:moved', (cursor) => {
  updateCursorPosition(cursor);
});

session.on('content:changed', (change) => {
  applyChange(change);
});
```

## 📦 SDK Configuration

### Advanced Configuration

```typescript
const openstrand = new OpenStrand({
  // API configuration
  apiKey: 'your-api-key',
  baseUrl: 'https://api.openstrand.ai',
  version: 'v1',
  
  // Request configuration
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000,
  
  // Cache configuration
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    storage: 'memory' // or 'localStorage'
  },
  
  // Debug configuration
  debug: {
    enabled: true,
    logLevel: 'info', // 'error' | 'warn' | 'info' | 'debug'
    logRequests: true,
    logResponses: false
  },
  
  // Custom headers
  headers: {
    'X-Custom-Header': 'value'
  },
  
  // Interceptors
  interceptors: {
    request: async (config) => {
      // Modify request config
      return config;
    },
    response: async (response) => {
      // Process response
      return response;
    },
    error: async (error) => {
      // Handle errors
      throw error;
    }
  }
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
  <sub>Build amazing knowledge applications</sub>
</div>
