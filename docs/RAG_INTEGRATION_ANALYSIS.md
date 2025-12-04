# RAG Integration Analysis: Frontend ↔ Backend End-to-End Gaps

> **Version:** 1.0.0  
> **Last Updated:** December 2024  
> **Status:** Investigation Complete, Implementation In Progress

## Executive Summary

This document identifies missing integrations, hooks, and components required for end-to-end RAG (Retrieval Augmented Generation) functionality across the `voice-chat-assistant` monorepo, including `agentos-workbench` and the main VCA frontend/backend services.

---

## 1. Current Architecture Overview

### 1.1 Backend Components (`backend/src/`)

| Component | Path | RAG Status |
|-----------|------|------------|
| AgentOS Integration | `integrations/agentos/agentos.integration.ts` | ⚠️ Partial - Config has `maxRAGContextTokens` but no RAG service initialization |
| AgentOS Routes | `integrations/agentos/agentos.routes.ts` | ❌ No RAG-specific endpoints |
| Knowledge Base | `core/knowledge/SqlKnowledgeBaseService.ts` | ❌ Keyword search only, no vector/semantic |
| User Agent Knowledge | `features/agents/userAgentKnowledge.service.ts` | ❌ Document storage only, no RAG ingestion |
| Memory Adapter | `core/memory/SqliteMemoryAdapter.ts` | ❌ Conversation storage, no RAG bridge |

### 1.2 Frontend Components (`frontend/src/`)

| Component | Path | RAG Status |
|-----------|------|------------|
| Agent Store | `store/agent.store.ts` | ❌ No RAG config exposure |
| Chat Store | `store/chat.store.ts` | ❌ No RAG retrieval integration |
| Conversation Manager | `services/conversation.manager.ts` | ❌ Simple truncation, no semantic filtering |
| API Service | `utils/api.ts` | ❌ No RAG endpoints |
| Agent Service | `services/agent.service.ts` | ❌ No RAG capabilities in agent definition |

### 1.3 Workbench Components (`apps/agentos-workbench/src/`)

| Component | Path | RAG Status |
|-----------|------|------------|
| Session Store | `state/sessionStore.ts` | ⚠️ Partial - Has "rag" capability in personas but no config |
| AgentOS Types | `types/agentos.ts` | ❌ No RAG chunk types |

---

## 2. Missing Backend Integrations

### 2.1 RAG Service Initialization in AgentOS Integration

**File:** `backend/src/integrations/agentos/agentos.integration.ts`

**Current State:**
```typescript
// promptEngineConfig includes:
contextManagement: {
  maxRAGContextTokens: Number(process.env.AGENTOS_RAG_CONTEXT_TOKENS ?? 1500),
  // ...
}
```

**Missing:**
- `VectorStoreManager` initialization
- `EmbeddingManager` initialization  
- `RetrievalAugmentor` initialization
- Connection to `sql-storage-adapter` for vector storage

**Required Changes:**
```typescript
// Add to buildEmbeddedAgentOSConfig():
import { 
  VectorStoreManager, 
  EmbeddingManager, 
  RetrievalAugmentor 
} from '@framers/agentos/rag';

const vectorStoreConfig = {
  defaultProviderId: 'sql-vector-store',
  providers: [{
    id: 'sql-vector-store',
    type: 'sql',
    databasePath: process.env.AGENTOS_VECTOR_DB_PATH || './data/vectors.db',
    isDefault: true,
    isDefaultForIngestion: true,
  }],
};

const embeddingConfig = {
  defaultModelId: process.env.AGENTOS_EMBEDDING_MODEL || 'text-embedding-3-small',
  defaultProviderId: 'openai',
};

// Pass to AgentOSConfig
return {
  // ... existing config
  vectorStoreManagerConfig: vectorStoreConfig,
  embeddingManagerConfig: embeddingConfig,
  retrievalAugmentorConfig: {
    defaultChunkSize: 512,
    defaultChunkOverlap: 50,
  },
};
```

### 2.2 RAG API Endpoints

**New File:** `backend/src/integrations/agentos/agentos.rag.routes.ts`

**Required Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/agentos/rag/ingest` | Ingest documents into RAG memory |
| POST | `/api/agentos/rag/query` | Query RAG memory for relevant context |
| GET | `/api/agentos/rag/documents` | List ingested documents |
| DELETE | `/api/agentos/rag/documents/:id` | Delete a document from RAG |
| GET | `/api/agentos/rag/stats` | Get RAG memory statistics |
| POST | `/api/agentos/rag/collections` | Create a new collection |
| GET | `/api/agentos/rag/collections` | List collections |

### 2.3 Knowledge Base → RAG Bridge

**File:** `backend/src/features/agents/userAgentKnowledge.service.ts`

**Current State:**
```typescript
async create(userId: string, agentId: string, input: CreateKnowledgeInput) {
  // Only stores to SQL, no RAG ingestion
  return sqlKnowledgeBaseService.addKnowledgeItem({...});
}
```

**Required Changes:**
```typescript
import { agentosService } from '../../integrations/agentos/agentos.integration.js';

async create(userId: string, agentId: string, input: CreateKnowledgeInput) {
  const agent = await ensureAgentOwnership(userId, agentId);
  await assertKnowledgeCapacity(userId, agentId);

  // Store to SQL knowledge base
  const payload = await sqlKnowledgeBaseService.addKnowledgeItem({...});

  // Ingest into RAG if enabled
  if (agent.config?.ragEnabled) {
    await agentosService.ingestToRAG({
      documentId: payload.id,
      content: input.content,
      metadata: {
        agentId,
        userId,
        type: input.type,
        tags: input.tags,
      },
      collectionId: `agent-${agentId}`,
    });
  }

  return payload;
}
```

### 2.4 Conversation → RAG Persistence Hook

**File:** `backend/src/integrations/agentos/agentos.stream-router.ts`

**Required Hook:** After conversation turn completion, optionally persist to RAG:

```typescript
// In SSE stream handler, after final response:
if (personaConfig?.memoryConfig?.ragConfig?.enabled) {
  await agentosService.ingestConversationTurn({
    conversationId,
    userId,
    messages: [userMessage, assistantResponse],
    category: 'conversation_memory',
  });
}
```

---

## 3. Missing Frontend Integrations

### 3.1 RAG API Client Functions

**File:** `frontend/src/utils/api.ts`

**Required Additions:**
```typescript
export const ragAPI = {
  /** Ingest a document into RAG memory */
  ingest: (payload: RagIngestPayload) => 
    api.post<RagIngestResponse>('/agentos/rag/ingest', payload),

  /** Query RAG memory for relevant context */
  query: (payload: RagQueryPayload) => 
    api.post<RagQueryResponse>('/agentos/rag/query', payload),

  /** List documents in RAG memory */
  listDocuments: (params?: RagListParams) => 
    api.get<RagDocumentsResponse>('/agentos/rag/documents', { params }),

  /** Delete a document from RAG memory */
  deleteDocument: (documentId: string) => 
    api.delete(`/agentos/rag/documents/${documentId}`),

  /** Get RAG memory statistics */
  getStats: (agentId?: string) => 
    api.get<RagStatsResponse>('/agentos/rag/stats', { params: { agentId } }),
};
```

### 3.2 Agent RAG Configuration in Frontend

**File:** `frontend/src/services/agent.service.ts`

**Update `IAgentCapability`:**
```typescript
export interface IAgentCapability {
  // ... existing
  ragEnabled?: boolean;
  ragConfig?: {
    autoIngestConversations?: boolean;
    retrievalTriggers?: ('always' | 'keyword' | 'semantic')[];
    maxRetrievedChunks?: number;
  };
}
```

### 3.3 RAG Context Display in Chat

**File:** `frontend/src/store/chat.store.ts`

**Required State:**
```typescript
// Add to store state
const ragRetrievalContext = ref<Record<string, RagRetrievalResult[]>>({});

// Add function to store retrieval context
function setRagRetrievalContext(messageId: string, context: RagRetrievalResult[]): void {
  ragRetrievalContext.value[messageId] = context;
}

// Export getter
const getRagContextForMessage = (messageId: string): RagRetrievalResult[] => 
  ragRetrievalContext.value[messageId] ?? [];
```

### 3.4 RAG Settings Component

**New File:** `frontend/src/components/settings/RagSettings.vue`

**Features:**
- Toggle RAG memory per agent
- Configure ingestion triggers
- Configure retrieval settings
- View memory statistics
- Clear/manage memory

---

## 4. Missing Workbench Integrations

### 4.1 RAG Chunk Types

**File:** `apps/agentos-workbench/src/types/agentos.ts`

**Add:**
```typescript
export enum AgentOSChunkType {
  // ... existing
  RAG_RETRIEVAL = "rag_retrieval",
  RAG_INGESTION = "rag_ingestion",
}

export interface AgentOSRagRetrievalChunk extends AgentOSBaseChunk {
  type: AgentOSChunkType.RAG_RETRIEVAL;
  retrievedChunks: Array<{
    content: string;
    score: number;
    documentId: string;
    metadata?: Record<string, unknown>;
  }>;
  query: string;
  totalResults: number;
}

export interface AgentOSRagIngestionChunk extends AgentOSBaseChunk {
  type: AgentOSChunkType.RAG_INGESTION;
  documentId: string;
  status: 'success' | 'failed';
  chunksCreated?: number;
  error?: string;
}
```

### 4.2 Persona RAG Configuration Panel

**New File:** `apps/agentos-workbench/src/components/PersonaRagConfig.tsx`

**Features:**
- Enable/disable RAG for persona
- Configure memory categories
- Set retrieval thresholds
- Configure lifecycle policies

### 4.3 Memory Dashboard Panel

**New File:** `apps/agentos-workbench/src/components/MemoryDashboard.tsx`

**Features:**
- View total documents/chunks
- Memory usage by category
- Recent ingestion activity
- Retrieval diagnostics
- Memory cleanup tools

---

## 5. Implementation Priority

### Phase 1: Backend Core (High Priority)
1. ✅ RAG module in `@framers/agentos` package
2. ⬜ RAG service initialization in `agentos.integration.ts`
3. ⬜ RAG API routes (`agentos.rag.routes.ts`)
4. ⬜ Knowledge → RAG bridge

### Phase 2: Frontend Integration (Medium Priority)
5. ⬜ RAG API client functions
6. ⬜ Agent capability types update
7. ⬜ RAG context in chat store
8. ⬜ RAG settings component

### Phase 3: Workbench & Polish (Lower Priority)
9. ⬜ RAG chunk types
10. ⬜ Persona RAG config panel
11. ⬜ Memory dashboard

### Phase 4: Testing & Documentation
12. ⬜ Integration tests
13. ⬜ E2E tests
14. ⬜ User documentation

---

## 6. Environment Variables

**New variables for RAG configuration:**

```bash
# RAG Vector Store
AGENTOS_VECTOR_DB_PATH=./data/vectors.db
AGENTOS_VECTOR_STORE_TYPE=sql  # sql | pinecone | qdrant

# Embeddings
AGENTOS_EMBEDDING_PROVIDER=openai
AGENTOS_EMBEDDING_MODEL=text-embedding-3-small
AGENTOS_EMBEDDING_DIMENSIONS=1536

# RAG Behavior
AGENTOS_RAG_DEFAULT_ENABLED=false
AGENTOS_RAG_AUTO_INGEST_CONVERSATIONS=false
AGENTOS_RAG_MAX_RETRIEVED_CHUNKS=5
AGENTOS_RAG_SIMILARITY_THRESHOLD=0.7

# Memory Lifecycle
AGENTOS_RAG_RETENTION_DAYS=90
AGENTOS_RAG_MAX_DOCUMENTS_PER_AGENT=1000
```

---

## 7. TSDoc Requirements

All new components must include:
- Module-level documentation
- Interface/type documentation
- Function-level TSDoc with `@param`, `@returns`, `@throws`
- Inline comments for complex logic
- Example usage where appropriate

---

## 8. Testing Strategy

### Unit Tests
- RAG route handlers
- Ingestion service
- Retrieval service
- Knowledge → RAG bridge

### Integration Tests
- Full ingestion → retrieval flow
- Conversation persistence
- Multi-agent RAG isolation

### E2E Tests
- Frontend RAG settings → Backend effect
- Chat with RAG context display
- Knowledge upload → RAG availability

---

## Appendix: Related Files

### Backend
- `backend/src/integrations/agentos/agentos.integration.ts`
- `backend/src/integrations/agentos/agentos.routes.ts`
- `backend/src/features/agents/userAgentKnowledge.service.ts`
- `backend/src/core/knowledge/SqlKnowledgeBaseService.ts`

### Frontend
- `frontend/src/utils/api.ts`
- `frontend/src/store/chat.store.ts`
- `frontend/src/services/agent.service.ts`

### Workbench
- `apps/agentos-workbench/src/types/agentos.ts`
- `apps/agentos-workbench/src/state/sessionStore.ts`

### AgentOS Package
- `packages/agentos/src/rag/`
- `packages/agentos/docs/RAG_MEMORY_CONFIGURATION.md`

