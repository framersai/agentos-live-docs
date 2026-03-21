# Email Intelligence — Plan 3: Intelligence Layer (RAG + Projects + Attachments)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the intelligence layer that transforms raw synced email into queryable knowledge — RAG indexing, attachment extraction, project auto-detection, and natural language querying.

**Architecture:** `EmailVectorMemoryService` wraps `@framers/agentos` RAG classes with per-agent collections. `EmailAttachmentService` extracts text from PDFs/DOCX (eager) and transcribes images (deferred). `EmailProjectService` clusters threads into projects. `EmailRagService` orchestrates indexing and querying. All services are registered in `EmailIntelligenceModule` and exposed via new REST endpoints.

**Tech Stack:** TypeScript, NestJS, `@framers/agentos` RAG (RetrievalAugmentor, EmbeddingManager, VectorStoreManager), pdf-parse, mammoth, xlsx, OpenAI (vision), SQLite, Vitest

**Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md` (Sections 3.0.4, 5.3, 5.4, 5.5, 7.1 intelligence/project/attachment endpoints)

**Prerequisite:** Plans 1 and 2 must be complete.

---

### Task 1: Implement EmailAttachmentService (text extraction)

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-attachment.service.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/extractors/extractor-registry.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/extractors/pdf-extractor.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/extractors/docx-extractor.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/extractors/xlsx-extractor.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/extractors/text-extractor.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/extractors/image-transcriber.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-attachment.service.spec.ts`

**What to implement:**

`ExtractorRegistry` — routes MIME types to extractors:

- `application/pdf` → PdfExtractor (uses `pdf-parse`)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` → DocxExtractor (uses `mammoth`)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` → XlsxExtractor (uses `xlsx`)
- `text/*` → TextExtractor (direct Buffer.toString)
- `image/*` → ImageTranscriber (deferred — vision LLM)
- Unknown → returns null (skip)

Each extractor implements:

```typescript
interface IAttachmentExtractor {
  extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }>;
}
```

`ImageTranscriber` — calls OpenAI vision API with base64 image and descriptive prompt. Accepts optional `OPENAI_API_KEY` or `OPENROUTER_API_KEY` env var.

`EmailAttachmentService`:

- `processAttachment(attachmentId)` — downloads binary from media-library (or provider), routes to extractor, stores `extracted_text` or `multimodal_description`, updates `extraction_status`
- `processEagerAttachments(messageId)` — processes all text-based attachments for a message
- `transcribeImage(attachmentId)` — explicit image transcription trigger
- Tiered: text-based = eager (on sync), images = deferred (on query or explicit trigger)

**Install dependencies** in backend: `pdf-parse`, `mammoth`, `xlsx`

**Tests:** Mock file content (small PDF buffer, DOCX buffer, etc). Verify extraction_status transitions and extracted_text storage.

- [ ] **Step 1:** Install npm dependencies: `cd backend && pnpm add pdf-parse mammoth xlsx`
- [ ] **Step 2:** Write tests for ExtractorRegistry and EmailAttachmentService
- [ ] **Step 3:** Implement extractors (pdf, docx, xlsx, text, image transcriber)
- [ ] **Step 4:** Implement ExtractorRegistry
- [ ] **Step 5:** Implement EmailAttachmentService
- [ ] **Step 6:** Run tests, verify pass
- [ ] **Step 7:** Commit

---

### Task 2: Implement EmailVectorMemoryService (per-agent RAG collections)

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-vector-memory.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-vector-memory.service.spec.ts`

**What to implement:**

This service wraps `@framers/agentos` RAG classes directly (NOT through WunderlandVectorMemoryService). It creates per-agent collections.

```typescript
@Injectable()
export class EmailVectorMemoryService {
  private augmentors = new Map<string, RetrievalAugmentor>(); // seedId → augmentor

  // Get or create RAG augmentor for a seed
  async getAugmentor(seedId: string): Promise<RetrievalAugmentor> { ... }

  // Ingest email body document
  async ingestEmailBody(seedId: string, doc: RagDocumentInput): Promise<string[]> { ... }

  // Ingest attachment text
  async ingestAttachment(seedId: string, doc: RagDocumentInput): Promise<string[]> { ... }

  // Query across email content
  async query(seedId: string, queryText: string, options?: RagRetrievalOptions): Promise<RagRetrievalResult> { ... }
}
```

Collections: `email_bodies_{seedId}` and `email_attachments_{seedId}`

Uses lazy initialization — creates EmbeddingManager, VectorStoreManager, RetrievalAugmentor on first access per seed. Provider auto-detection: Ollama → OpenAI → OpenRouter (same fallback as WunderlandVectorMemoryService).

**Tests:** Mock the agentos RAG classes. Verify collection names, ingest calls, query delegation.

- [ ] **Step 1:** Write tests
- [ ] **Step 2:** Implement EmailVectorMemoryService
- [ ] **Step 3:** Run tests, verify pass
- [ ] **Step 4:** Commit

---

### Task 3: Implement EmailRagService (indexing + querying)

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-rag.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-rag.service.spec.ts`

**What to implement:**

```typescript
@Injectable()
export class EmailRagService {
  constructor(
    private readonly db: DatabaseService,
    private readonly vectorMemory: EmailVectorMemoryService,
    private readonly attachmentService: EmailAttachmentService,
  ) {}

  // Index a single email message into RAG
  async indexMessage(seedId: string, messageId: string): Promise<void> { ... }

  // Index an attachment into RAG
  async indexAttachment(seedId: string, attachmentId: string): Promise<void> { ... }

  // Batch index all un-indexed messages for a seed
  async indexPendingMessages(seedId: string): Promise<{ indexed: number }> { ... }

  // Natural language query
  async query(params: EmailRAGQuery): Promise<EmailRAGResult> { ... }
}
```

`indexMessage()`:

1. Load message from DB
2. Build document: `"From: {from}\nTo: {to}\nDate: {date}\nSubject: {subject}\n\n{bodyText}"`
3. Create RagDocumentInput with metadata (messageId, threadId, accountId, from, to, subject, date, labels, projectIds)
4. Ingest via vectorMemory.ingestEmailBody()
5. Store chunk IDs in message.rag_chunk_ids, set message.rag_indexed_at

`query()`:

1. Build metadata filters from params (accountIds, projectIds, threadIds, dateRange, participantFilter)
2. Query both collections (email_bodies + email_attachments if includeAttachments)
3. Map results to EmailRAGSource[] with message metadata
4. Return EmailRAGResult

Also wire `indexMessage` into `EmailSyncService` — after messages are upserted, call `ragService.indexMessage()` for each new message.

**Tests:** Mock vectorMemory and DB. Verify document construction, metadata, chunk ID storage, query delegation.

- [ ] **Step 1:** Write tests
- [ ] **Step 2:** Implement EmailRagService
- [ ] **Step 3:** Wire into EmailSyncService (add optional ragService injection, call after upsert)
- [ ] **Step 4:** Run tests, verify pass
- [ ] **Step 5:** Commit

---

### Task 4: Implement EmailProjectService (manual CRUD)

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-project.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-project.service.spec.ts`

**What to implement (manual operations only, auto-detection in Task 5):**

```typescript
@Injectable()
export class EmailProjectService {
  constructor(private readonly db: DatabaseService) {}

  async createProject(seedId: string, userId: string, name: string, description?: string, threadIds?: Array<{ threadId: string; accountId: string }>): Promise<any> { ... }
  async getProject(projectId: string): Promise<any> { ... }
  async listProjects(seedId: string, status?: string): Promise<any[]> { ... }
  async updateProject(projectId: string, updates: { name?: string; description?: string; status?: string }): Promise<void> { ... }
  async deleteProject(projectId: string): Promise<void> { ... }
  async addThreadsToProject(projectId: string, threads: Array<{ threadId: string; accountId: string }>): Promise<void> { ... }
  async removeThreadFromProject(projectId: string, threadId: string, accountId: string): Promise<void> { ... }
  async mergeProjects(projectIdA: string, projectIdB: string): Promise<string> { ... }
  async getProjectSummary(projectId: string): Promise<string> { ... }
  async getProjectTimeline(projectId: string): Promise<any[]> { ... }
}
```

- `createProject`: Insert into `wunderland_email_projects`, optionally add thread links
- `addThreadsToProject`: Insert into `wunderland_email_project_threads`, update denormalized counts
- `mergeProjects`: Move all threads from B to A, update counts, delete B
- `getProjectSummary`: Load recent messages across all project threads, call LLM with summary prompt
- `getProjectTimeline`: Load all messages across project threads ordered by date, extract timeline events

**Tests:** In-memory DB. Test CRUD operations, thread linking, merge, count updates.

- [ ] **Step 1:** Write tests for CRUD and merge
- [ ] **Step 2:** Implement EmailProjectService
- [ ] **Step 3:** Run tests, verify pass
- [ ] **Step 4:** Commit

---

### Task 5: Implement project auto-detection

**Files:**

- Modify: `backend/src/modules/wunderland/email-intelligence/services/email-project.service.ts` (add detectProjects method)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-project-detection.spec.ts`

**What to implement:**

```typescript
async detectProjects(seedId: string): Promise<ProjectProposal[]> { ... }
async applyProposals(seedId: string, userId: string, proposalIds: string[]): Promise<void> { ... }
```

`detectProjects()`:

1. Load all threads grouped by (account_id, thread_id) with participant sets and subject lines
2. For each thread, build a feature vector:
   - Participant set (emails only, normalized lowercase)
   - Subject tokens (split on whitespace, remove Re:/Fwd:/common stopwords)
3. Compute pairwise similarity between threads:
   - Participant overlap: Jaccard similarity (weight 0.3)
   - Subject token overlap: Jaccard similarity (weight 0.3)
   - Temporal proximity: `1 / (1 + daysBetween/30)` (weight 0.4)
4. Agglomerative clustering: merge thread pairs with similarity > 0.5
5. For each cluster of 2+ threads:
   - Name = most common subject tokens or LLM-generated
   - Description = LLM summary of cluster's subjects/participants
   - Confidence = average intra-cluster similarity
6. Diff against existing auto-detected projects
7. Return `ProjectProposal[]` (new projects to create, threads to add to existing)

**Simplification from spec:** Skip semantic embeddings for v1 auto-detection. Use Jaccard on participants + subjects + temporal proximity instead. This avoids an embedding dependency in the clustering loop and is sufficient for initial project grouping. Semantic similarity can be added as an enhancement.

**Tests:** Create threads with known participant/subject patterns. Verify clusters form correctly.

- [ ] **Step 1:** Write tests for clustering logic
- [ ] **Step 2:** Implement detectProjects and applyProposals
- [ ] **Step 3:** Run tests, verify pass
- [ ] **Step 4:** Commit

---

### Task 6: Add intelligence REST endpoints

**Files:**

- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.controller.ts` (add project/RAG/attachment endpoints)
- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.dto.ts` (add DTOs)
- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts` (register new services)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-endpoints.spec.ts`

**New endpoints:**

Projects:

- `GET /projects?seedId=X` — list projects
- `POST /projects?seedId=X` — create manual project (body: name, description, threadIds)
- `GET /projects/:projectId?seedId=X` — project details with thread list
- `PATCH /projects/:projectId?seedId=X` — update name/description/status
- `DELETE /projects/:projectId?seedId=X` — delete project
- `POST /projects/:projectId/threads?seedId=X` — add threads to project
- `DELETE /projects/:projectId/threads/:threadId?seedId=X&accountId=Y` — remove thread
- `POST /projects/merge?seedId=X` — merge two projects (body: projectIdA, projectIdB)
- `GET /projects/:projectId/summary?seedId=X` — AI summary
- `GET /projects/:projectId/timeline?seedId=X` — timeline events
- `POST /projects/detect?seedId=X` — trigger auto-detection, return proposals
- `POST /projects/detect/apply?seedId=X` — apply selected proposals

Intelligence/RAG:

- `POST /query?seedId=X` — natural language query (body: EmailRAGQuery)
- `GET /stats?seedId=X` — dashboard stats (unread count, awaiting reply, active projects, avg response time)

Attachments:

- `GET /attachments?seedId=X` — list attachments (filterable)
- `GET /attachments/:attachmentId?seedId=X` — attachment detail + extracted text
- `POST /attachments/:attachmentId/transcribe?seedId=X` — trigger image transcription

**Register services in module:** Add EmailAttachmentService, EmailVectorMemoryService, EmailRagService, EmailProjectService to providers.

**Tests:** Test controller methods with mocked services.

- [ ] **Step 1:** Add DTOs for new endpoints
- [ ] **Step 2:** Write tests for key endpoints (create project, query, detect, transcribe)
- [ ] **Step 3:** Implement endpoints in controller
- [ ] **Step 4:** Register all new services in module
- [ ] **Step 5:** Run tests, verify pass
- [ ] **Step 6:** Commit

---

### Task 7: Implement rate limiting

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-rate-limit.service.ts`
- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.controller.ts` (add rate limit checks)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-rate-limit.spec.ts`

**What to implement:**

SQLite-backed rate limiter using the `wunderland_email_rate_limits` table (created in Plan 1).

```typescript
@Injectable()
export class EmailRateLimitService {
  constructor(private readonly db: DatabaseService) {}

  // Check and increment. Returns { allowed: boolean, retryAfterMs?: number }
  async checkAndIncrement(seedId: string, endpoint: string, maxPerHour: number): Promise<{ allowed: boolean; retryAfterMs?: number }> { ... }

  // Cleanup old windows
  async cleanupExpired(): Promise<void> { ... }
}
```

Rate limits per spec:

- `POST /query`: 30/hour
- `GET /projects/:id/summary`: 10/hour
- `POST /projects/detect`: 3/hour
- `POST /attachments/:id/transcribe`: 20/hour
- `POST /reports/*`: 5/hour

Add `@RateLimit(endpoint, maxPerHour)` checks at the start of rate-limited controller methods.

**Tests:** Verify counter increments, window resets, rejection after limit.

- [ ] **Step 1:** Write tests
- [ ] **Step 2:** Implement EmailRateLimitService
- [ ] **Step 3:** Add rate limit checks to controller
- [ ] **Step 4:** Run tests, verify pass
- [ ] **Step 5:** Commit

---

## Scope

This plan covers **spec sections 3.0.4, 5.3, 5.4, 5.5, 7.1 (intelligence endpoints), and 16 (rate limiting)**. Deferred:

| Spec Section            | Covered In |
| ----------------------- | ---------- |
| 5.6 Report Service      | Plan 4     |
| 5.7 Digest Service      | Plan 4     |
| 19 Data Retention       | Plan 4     |
| 2.3 Extension Pack      | Plan 5     |
| 8 Dashboard UI          | Plan 6     |
| 10.3 Skill Registration | Plan 5     |
| 17 Demo Mode            | Plan 6     |
