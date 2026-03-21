# Email Intelligence Assistant — Design Specification

**Date:** 2026-03-19
**Status:** Draft
**Approach:** B — Email Intelligence Module (Backend NestJS module + Extension tools)

---

## 1. Overview

### 1.1 Purpose

Build a full-featured email intelligence assistant for the Wunderland platform that transforms raw email into structured, queryable project knowledge. The system connects Gmail inboxes (multi-account) to a Wunderbot, syncs and indexes all messages and attachments into a local RAG pipeline, reconstructs thread hierarchies, auto-detects project groupings, and surfaces insights via three interfaces: the Rabbithole dashboard UI, channel bots (Telegram/Discord/Slack), and the Wunderland CLI/TUI.

### 1.2 Goals

- **Full email lifecycle management** — read, compose, reply, search, label, archive via any interface
- **Hierarchical thread reconstruction** — parent→child reply chains from RFC 2822 headers, not just Gmail's flat `threadId`
- **Cross-thread project intelligence** — auto-detect project clusters from participants, subjects, and semantic similarity; allow manual curation
- **Multimodal RAG indexing** — email bodies, PDF/DOCX text extraction (eager), image/screenshot transcription via vision LLM (deferred), all searchable
- **Attachment first-class support** — linked to emails, threads, and projects; stored in media-library with email provenance metadata
- **Timeline visualization** — per-project event timelines reconstructed from email dates and content
- **Reports & export** — on-demand + scheduled digests in PDF, Markdown, and JSON
- **Batteries-included setup** — email intelligence enabled by default in agent workflows, OAuth flow integrated into existing channel-oauth infrastructure
- **Multi-provider ready** — Gmail API at launch (multi-inbox), generic IMAP as fast-follow

### 1.3 Non-Goals

- Real-time push notifications via Gmail Pub/Sub (future enhancement, not launch)
- Microsoft Graph API / Outlook dedicated adapter (future, after IMAP generic)
- Calendar integration (separate existing module at `/app/dashboard/[seedId]/calendar/`)
- Email composition AI (auto-drafting responses) — may be added later but not in scope

---

## 2. Architecture

### 2.1 System Context

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interfaces                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Rabbithole    │  │ Channel Bot  │  │ Wunderland CLI    │  │
│  │ Dashboard     │  │ (Telegram,   │  │ / TUI             │  │
│  │ /email/* tabs │  │  Discord...) │  │                   │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────────┘  │
│         │                 │                   │              │
│         │ REST API        │ ITool execute()   │ ITool        │
│         ▼                 ▼                   ▼              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        Email Intelligence Module (NestJS)            │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │    │
│  │  │ Sync Service  │  │ Thread Svc   │  │ Project   │  │    │
│  │  │ (Gmail API    │  │ (hierarchy   │  │ Detection │  │    │
│  │  │  polling)     │  │  reconstruct)│  │ Service   │  │    │
│  │  └──────┬───────┘  └──────────────┘  └───────────┘  │    │
│  │         │                                            │    │
│  │  ┌──────┴───────┐  ┌──────────────┐  ┌───────────┐  │    │
│  │  │ RAG Index    │  │ Attachment   │  │ Report    │  │    │
│  │  │ Service      │  │ Service      │  │ Generator │  │    │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│         │                 │                   │              │
│         ▼                 ▼                   ▼              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ SQLite       │  │ Vector Store │  │ Media Library     │  │
│  │ (threads,    │  │ (embeddings) │  │ (attachment       │  │
│  │  projects,   │  │              │  │  binaries)        │  │
│  │  metadata)   │  │              │  │                   │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Module Structure

```
backend/src/modules/wunderland/email-intelligence/
├── email-intelligence.module.ts          # NestJS module definition
├── email-intelligence.controller.ts      # REST API endpoints
├── email-intelligence.dto.ts             # Request/response DTOs
├── services/
│   ├── email-sync.service.ts             # Sync orchestrator (scheduling, history tracking)
│   ├── email-thread.service.ts           # Thread hierarchy reconstruction
│   ├── email-project.service.ts          # Project auto-detection + manual CRUD
│   ├── email-rag.service.ts              # Email-specific RAG indexing pipeline
│   ├── email-attachment.service.ts       # Extraction, transcription, media-library integration
│   ├── email-report.service.ts           # Report generation (PDF/MD/JSON)
│   └── email-digest.service.ts           # Scheduled digest generation + delivery
├── providers/
│   ├── email-provider.interface.ts       # IEmailProvider — common interface for all providers
│   ├── gmail-provider.ts                 # Gmail API v1 implementation
│   └── imap-provider.ts                  # Generic IMAP implementation (fast-follow)
├── extractors/
│   ├── pdf-extractor.ts                  # PDF text extraction (pdf-parse)
│   ├── docx-extractor.ts                 # DOCX text extraction (mammoth)
│   ├── xlsx-extractor.ts                 # XLSX → structured text (xlsx)
│   ├── image-transcriber.ts              # Vision LLM multimodal description
│   └── extractor-registry.ts            # MIME type → extractor routing
└── __tests__/
    ├── email-sync.service.spec.ts
    ├── email-thread.service.spec.ts
    ├── email-project.service.spec.ts
    └── email-rag.service.spec.ts
```

### 2.3 Extension Tools (AgentOS ITool implementations)

**Existing Gmail extension** at `packages/agentos-extensions/registry/curated/productivity/gmail/` remains unchanged at launch — its 6 tools handle direct Gmail I/O using env-var/secrets credential resolution (no database lookup). The extension is NOT refactored to `IEmailProvider`; instead, the new backend `gmail-provider.ts` is a separate implementation that shares no code with the extension. The extension continues to resolve credentials from `options`, `secrets` map, or env vars (`GOOGLE_CLIENT_ID`, `GMAIL_CLIENT_ID`, etc.) per its existing `index.ts` factory:

```
Existing tools (unchanged, @framers/agentos-ext-email-gmail):
  listMessages.ts         # List inbox messages
  readMessage.ts          # Read full message by ID
  sendMessage.ts          # Compose and send
  replyMessage.ts         # Thread reply
  searchMessages.ts       # Gmail query syntax search
  listLabels.ts           # List labels with counts
```

**New extension pack** `@framers/agentos-ext-email-intelligence` at `packages/agentos-extensions/registry/curated/productivity/email-intelligence/` — these tools depend on the backend Email Intelligence Module via REST API calls, kept separate from the self-contained Gmail extension:

```
packages/agentos-extensions/registry/curated/productivity/email-intelligence/
├── package.json
├── manifest.json
├── CAPABILITY.yaml                     # For CapabilityDiscoveryEngine indexing
├── SKILL.md                            # LLM instructions for email intelligence
├── src/
│   ├── index.ts                        # Extension pack factory (createExtensionPack)
│   ├── EmailIntelligenceClient.ts      # HTTP client for backend REST API (uses X-Internal-Secret header, matching Slack OAuth callback pattern)
│   └── tools/
│       ├── getThreadHierarchy.ts       # Get full parent→child tree for a thread
│       ├── listProjects.ts             # List auto-detected and manual projects
│       ├── getProjectSummary.ts        # AI-generated project status summary
│       ├── getProjectTimeline.ts       # Timeline events for a project
│       ├── searchAcrossThreads.ts      # Semantic RAG search across all indexed email
│       ├── getAttachment.ts            # Retrieve attachment with extracted text/transcription
│       ├── createProject.ts            # Manually create a project
│       ├── addThreadToProject.ts       # Assign a thread to a project
│       ├── generateReport.ts           # Generate PDF/MD/JSON report for a project
│       ├── getDigestPreview.ts         # Preview what a scheduled digest would contain
│       ├── listAccounts.ts             # List connected email accounts
│       └── syncStatus.ts              # Check sync health and progress
└── test/
    └── index.spec.ts
```

---

## 3. Prerequisites & Schema Migrations

Before creating new tables, several existing schema gaps must be resolved. These are pre-existing issues in the codebase that this feature exposes.

### 3.0.1 Credential Schema Extension

**Problem:** `ChannelTokenRefreshService` queries `metadata` and `expires_at` columns on `wunderbot_credentials`, but these columns do NOT exist in `appDatabase.ts` (lines 845-860). The service will crash at runtime for any OAuth credential refresh.

**Fix:** Add columns to `wunderbot_credentials` via `ensureColumnExists` in `appDatabase.ts`:

```sql
-- Add to ensureColumnExists migration block
ALTER TABLE wunderbot_credentials ADD COLUMN metadata TEXT DEFAULT NULL;
  -- JSON blob: { refreshToken, expiresAt, lastRefreshAttempt, lastRefreshError }
ALTER TABLE wunderbot_credentials ADD COLUMN expires_at BIGINT DEFAULT NULL;
  -- Epoch ms — when the access token expires (fallback if metadata.expiresAt missing)
```

**Also update** `CredentialsService.createCredential()` to accept and store `metadata` and `expires_at` parameters. This fix is required for Gmail OAuth AND retroactively fixes the existing Slack/Discord token refresh which has the same latent bug.

### 3.0.2 Table Name Collision

**Problem:** `wunderland_email_messages` already exists (appDatabase.ts line 452) for SMTP sent/draft history with columns: `user_id, seed_id, folder, from_address, to_address, subject, body, status, created_at, updated_at`.

**Fix:** The new synced-inbox table is named `wunderland_email_synced_messages` to avoid collision. The existing SMTP table remains unchanged and continues to be used by the existing `EmailIntegrationService`.

### 3.0.3 Media Library Provenance Extension

**Problem:** `MediaLibraryService` (`wunderland_media_assets` table) only supports generic `tags` (JSON array of strings). It has no source/provenance fields to track where an asset came from.

**Fix:** Add columns via `ensureColumnExists`:

```sql
ALTER TABLE wunderland_media_assets ADD COLUMN source_type TEXT DEFAULT NULL;
  -- 'email_attachment' | 'social_post' | 'upload' | null
ALTER TABLE wunderland_media_assets ADD COLUMN source_ref TEXT DEFAULT NULL;
  -- JSON: { messageId, threadId, accountId, projectIds } for email attachments
```

**Also update** `MediaLibraryService.upload()` to accept optional `sourceType` and `sourceRef` parameters.

### 3.0.4 Vector Memory Per-Agent Collections

**Problem:** `WunderlandVectorMemoryService` is hardwired to a single collection `wunderland_seed_memory` (lines 68-69). Cannot support per-agent email RAG collections.

**Fix:** Do NOT modify `WunderlandVectorMemoryService`. Instead, the `EmailIntelligenceModule` creates its own `EmailVectorMemoryService` that directly uses `RetrievalAugmentor`, `EmbeddingManager`, and `VectorStoreManager` from `@framers/agentos` — the same underlying libraries, but configured with email-specific collections (`email_bodies_{seedId}`, `email_attachments_{seedId}`). This avoids touching the orchestration module entirely.

```typescript
// EmailVectorMemoryService manages its own RAG pipeline:
// - Imports @framers/agentos RAG classes directly (they're exported from the package)
// - Creates per-agent data sources on first access
// - No dependency on OrchestrationModule
```

### 3.0.5 Extension Tool Auth Contract

**Problem:** The `@framers/agentos-ext-email-intelligence` extension pack tools call backend REST APIs, but have no authentication mechanism. The extension manifest only passes `seedId` and `backendUrl`.

**Fix:** Use the `X-Internal-Secret` header pattern, matching existing Slack/Discord OAuth callbacks (see `apps/rabbithole/src/app/api/channels/oauth/slack/callback/route.ts:39`):

```typescript
// EmailIntelligenceClient.ts
class EmailIntelligenceClient {
  constructor(
    private readonly backendUrl: string,
    private readonly seedId: string,
    private readonly internalSecret: string // from INTERNAL_API_SECRET env var
  ) {}

  private async request(path: string, options?: RequestInit) {
    return fetch(`${this.backendUrl}/wunderland/email-intelligence/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': this.internalSecret,
        'X-Seed-Id': this.seedId,
        ...options?.headers,
      },
    });
  }
}
```

The extension pack factory resolves `INTERNAL_API_SECRET` from env vars or secrets map. Backend validates the header on all email-intelligence endpoints.

**Open design question answered:** The intelligence tools run as internal backend capabilities called via `X-Internal-Secret`. They are NOT designed for external AgentOS runtimes over HTTP — external runtimes should use the existing Gmail extension (6 tools) directly.

---

## 4. Data Model

### 4.1 New SQLite Tables

All tables follow the existing `appDatabase.ts` pattern using `ensureColumnExists` for migrations. Column names use `snake_case` per existing convention.

#### `wunderland_email_accounts`

Tracks connected email inboxes per agent.

| Column                  | Type                   | Description                                                                                                                                                                                         |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | TEXT PK                | UUID                                                                                                                                                                                                |
| `seed_id`               | TEXT NOT NULL          | Agent seed ID (FK → wunderbots)                                                                                                                                                                     |
| `owner_user_id`         | TEXT NOT NULL          | User who connected the account                                                                                                                                                                      |
| `provider`              | TEXT NOT NULL          | `'gmail'` or `'imap'`                                                                                                                                                                               |
| `email_address`         | TEXT NOT NULL          | Full email address                                                                                                                                                                                  |
| `display_name`          | TEXT                   | Human-readable label ("Work Gmail")                                                                                                                                                                 |
| `credential_id`         | TEXT NOT NULL          | FK → `wunderbot_credentials` (encrypted OAuth tokens)                                                                                                                                               |
| `sync_cursor`           | TEXT                   | Provider-owned opaque cursor blob. For Gmail: JSON `{ historyId: string }`. For IMAP: JSON `{ uidValidity: number, lastUid: number }`. Each provider serializes/deserializes its own cursor format. |
| `last_full_sync_at`     | INTEGER                | Epoch ms of last full sync                                                                                                                                                                          |
| `sync_interval_ms`      | INTEGER DEFAULT 300000 | Polling interval (default 5 minutes)                                                                                                                                                                |
| `sync_enabled`          | INTEGER DEFAULT 1      | Boolean — pause/resume sync                                                                                                                                                                         |
| `sync_state`            | TEXT DEFAULT 'idle'    | `'idle'` \| `'syncing'` \| `'indexing'` \| `'error'` — persistent sync state                                                                                                                        |
| `sync_progress_json`    | TEXT                   | JSON `{ totalMessages, syncedMessages, indexedMessages, startedAt, estimatedCompletionAt }` — persisted progress (survives restarts)                                                                |
| `last_sync_error`       | TEXT                   | Last error message if sync_state = 'error'                                                                                                                                                          |
| `total_messages_synced` | INTEGER DEFAULT 0      | Running count                                                                                                                                                                                       |
| `is_active`             | INTEGER DEFAULT 1      | Soft delete                                                                                                                                                                                         |
| `created_at`            | INTEGER NOT NULL       | Epoch ms                                                                                                                                                                                            |
| `updated_at`            | INTEGER NOT NULL       | Epoch ms                                                                                                                                                                                            |

**Unique constraint:** `(seed_id, email_address)` — one agent can't connect the same inbox twice.

#### `wunderland_email_synced_messages`

Stores synced email messages with full metadata.

| Column                | Type              | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | TEXT PK           | UUID — provider-agnostic (avoids ID collisions between Gmail/IMAP providers)                                                                                                                                                                                                                                                                                                                                    |
| `provider_message_id` | TEXT NOT NULL     | Provider-specific message ID (Gmail message ID, IMAP UID)                                                                                                                                                                                                                                                                                                                                                       |
| `account_id`          | TEXT NOT NULL     | FK → `wunderland_email_accounts`                                                                                                                                                                                                                                                                                                                                                                                |
| `thread_id`           | TEXT NOT NULL     | Provider thread ID (Gmail: threadId)                                                                                                                                                                                                                                                                                                                                                                            |
| `message_id_header`   | TEXT              | RFC 2822 `Message-ID` header value                                                                                                                                                                                                                                                                                                                                                                              |
| `subject`             | TEXT              | Email subject line                                                                                                                                                                                                                                                                                                                                                                                              |
| `from_address`        | TEXT NOT NULL     | Sender email address                                                                                                                                                                                                                                                                                                                                                                                            |
| `from_name`           | TEXT              | Sender display name                                                                                                                                                                                                                                                                                                                                                                                             |
| `to_addresses`        | TEXT              | JSON array of `{email, name}`                                                                                                                                                                                                                                                                                                                                                                                   |
| `cc_addresses`        | TEXT              | JSON array of `{email, name}`                                                                                                                                                                                                                                                                                                                                                                                   |
| `bcc_addresses`       | TEXT              | JSON array of `{email, name}`                                                                                                                                                                                                                                                                                                                                                                                   |
| `body_text`           | TEXT              | Plain text body                                                                                                                                                                                                                                                                                                                                                                                                 |
| `body_html`           | TEXT              | HTML body (stored for rendering, not indexed). **Must be sanitized via DOMPurify before rendering in dashboard** to prevent XSS. Additionally, **strip or proxy all remote images** (`<img src="https://...">`) to block tracking pixels — render via a backend proxy endpoint or replace with placeholder. Large bodies (>50KB) stored externally in media-library with a `body_html_media_id` reference here. |
| `body_html_media_id`  | TEXT              | FK → media library — for large HTML bodies (>50KB) offloaded to storage. When set, `body_html` column is null and content is fetched from media-library on demand.                                                                                                                                                                                                                                              |
| `snippet`             | TEXT              | Short preview (Gmail snippet or first 200 chars)                                                                                                                                                                                                                                                                                                                                                                |
| `internal_date`       | INTEGER NOT NULL  | Epoch ms — when the email was actually sent                                                                                                                                                                                                                                                                                                                                                                     |
| `received_date`       | INTEGER           | Epoch ms — when it arrived in inbox                                                                                                                                                                                                                                                                                                                                                                             |
| `labels`              | TEXT              | JSON array of label strings                                                                                                                                                                                                                                                                                                                                                                                     |
| `is_read`             | INTEGER DEFAULT 0 | Boolean                                                                                                                                                                                                                                                                                                                                                                                                         |
| `is_starred`          | INTEGER DEFAULT 0 | Boolean                                                                                                                                                                                                                                                                                                                                                                                                         |
| `is_draft`            | INTEGER DEFAULT 0 | Boolean                                                                                                                                                                                                                                                                                                                                                                                                         |
| `in_reply_to`         | TEXT              | RFC 2822 `In-Reply-To` header (Message-ID of parent)                                                                                                                                                                                                                                                                                                                                                            |
| `references_header`   | TEXT              | JSON array — RFC 2822 `References` header chain                                                                                                                                                                                                                                                                                                                                                                 |
| `parent_message_id`   | TEXT              | FK → self — reconstructed hierarchy parent                                                                                                                                                                                                                                                                                                                                                                      |
| `thread_depth`        | INTEGER DEFAULT 0 | Nesting level in thread tree (0 = root)                                                                                                                                                                                                                                                                                                                                                                         |
| `thread_position`     | INTEGER DEFAULT 0 | Chronological position within thread                                                                                                                                                                                                                                                                                                                                                                            |
| `has_attachments`     | INTEGER DEFAULT 0 | Boolean                                                                                                                                                                                                                                                                                                                                                                                                         |
| `attachment_count`    | INTEGER DEFAULT 0 | Number of attachments                                                                                                                                                                                                                                                                                                                                                                                           |
| `size_bytes`          | INTEGER           | Total message size                                                                                                                                                                                                                                                                                                                                                                                              |
| `rag_indexed_at`      | INTEGER           | Epoch ms — null means not yet indexed                                                                                                                                                                                                                                                                                                                                                                           |
| `rag_chunk_ids`       | TEXT              | JSON array of RAG chunk IDs for this message                                                                                                                                                                                                                                                                                                                                                                    |
| `created_at`          | INTEGER NOT NULL  | Epoch ms                                                                                                                                                                                                                                                                                                                                                                                                        |
| `updated_at`          | INTEGER NOT NULL  | Epoch ms                                                                                                                                                                                                                                                                                                                                                                                                        |

**Indices:**

- `idx_email_messages_provider_id` on `(account_id, provider_message_id)` UNIQUE — deduplicate synced messages
- `idx_email_messages_account_thread` on `(account_id, thread_id)` — fast thread lookups
- `idx_email_messages_internal_date` on `(internal_date)` — timeline ordering
- `idx_email_messages_from` on `(from_address)` — participant queries
- `idx_email_messages_rag_indexed` on `(rag_indexed_at)` — find un-indexed messages
- `idx_email_messages_message_id_header` on `(message_id_header)` — In-Reply-To lookups

#### `wunderland_email_attachments`

Tracks attachments with extraction status and provenance.

| Column                   | Type                   | Description                                                                  |
| ------------------------ | ---------------------- | ---------------------------------------------------------------------------- |
| `id`                     | TEXT PK                | UUID                                                                         |
| `message_id`             | TEXT NOT NULL          | FK → `wunderland_email_synced_messages`                                      |
| `account_id`             | TEXT NOT NULL          | FK → `wunderland_email_accounts`                                             |
| `gmail_attachment_id`    | TEXT                   | Gmail attachment ID (for lazy download)                                      |
| `filename`               | TEXT NOT NULL          | Original filename                                                            |
| `mime_type`              | TEXT NOT NULL          | MIME type (e.g., `application/pdf`)                                          |
| `size_bytes`             | INTEGER                | File size                                                                    |
| `content_id`             | TEXT                   | CID for inline images                                                        |
| `is_inline`              | INTEGER DEFAULT 0      | Boolean — inline image vs. attachment                                        |
| `media_library_id`       | TEXT                   | FK → media library (stored binary)                                           |
| `extraction_status`      | TEXT DEFAULT 'pending' | `'pending'` \| `'extracted'` \| `'transcribed'` \| `'failed'` \| `'skipped'` |
| `extracted_text`         | TEXT                   | For PDFs/DOCX — eagerly extracted text content                               |
| `multimodal_description` | TEXT                   | For images — LLM-generated description (deferred)                            |
| `extraction_error`       | TEXT                   | Error message if extraction failed                                           |
| `rag_indexed_at`         | INTEGER                | Epoch ms — null means not yet indexed                                        |
| `rag_chunk_ids`          | TEXT                   | JSON array of RAG chunk IDs                                                  |
| `created_at`             | INTEGER NOT NULL       | Epoch ms                                                                     |
| `updated_at`             | INTEGER NOT NULL       | Epoch ms                                                                     |

**Indices:**

- `idx_email_attachments_message` on `(message_id)` — attachments per message
- `idx_email_attachments_extraction` on `(extraction_status)` — find pending extractions
- `idx_email_attachments_mime` on `(mime_type)` — filter by type

#### `wunderland_email_projects`

User-facing project groupings that span multiple threads.

| Column                 | Type                  | Description                                                                             |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| `id`                   | TEXT PK               | UUID                                                                                    |
| `seed_id`              | TEXT NOT NULL         | Agent seed ID                                                                           |
| `owner_user_id`        | TEXT NOT NULL         | Project owner                                                                           |
| `name`                 | TEXT NOT NULL         | Project display name                                                                    |
| `description`          | TEXT                  | AI-generated or user-provided description                                               |
| `status`               | TEXT DEFAULT 'active' | `'active'` \| `'archived'` \| `'completed'`                                             |
| `auto_detected`        | INTEGER DEFAULT 0     | Boolean — was this auto-detected?                                                       |
| `detection_confidence` | REAL                  | 0.0–1.0 confidence score for auto-detected projects                                     |
| `detection_method`     | TEXT                  | `'participant_cluster'` \| `'subject_pattern'` \| `'semantic_similarity'` \| `'manual'` |
| `participant_emails`   | TEXT                  | JSON array of unique participant emails across all threads                              |
| `thread_count`         | INTEGER DEFAULT 0     | Denormalized count                                                                      |
| `message_count`        | INTEGER DEFAULT 0     | Denormalized count                                                                      |
| `attachment_count`     | INTEGER DEFAULT 0     | Denormalized count                                                                      |
| `last_activity_at`     | INTEGER               | Epoch ms of most recent message in any thread                                           |
| `created_at`           | INTEGER NOT NULL      | Epoch ms                                                                                |
| `updated_at`           | INTEGER NOT NULL      | Epoch ms                                                                                |

#### `wunderland_email_project_threads`

Many-to-many: threads can belong to multiple projects.

| Column       | Type             | Description                          |
| ------------ | ---------------- | ------------------------------------ |
| `id`         | TEXT PK          | UUID                                 |
| `project_id` | TEXT NOT NULL    | FK → `wunderland_email_projects`     |
| `thread_id`  | TEXT NOT NULL    | Provider thread ID                   |
| `account_id` | TEXT NOT NULL    | FK → `wunderland_email_accounts`     |
| `added_by`   | TEXT NOT NULL    | `'auto'` \| `'manual'`               |
| `confidence` | REAL             | For auto-added, the similarity score |
| `added_at`   | INTEGER NOT NULL | Epoch ms                             |

**Unique constraint:** `(project_id, thread_id, account_id)`

#### `wunderland_email_digests`

Scheduled digest configuration per agent.

| Column                | Type                    | Description                                                                           |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `id`                  | TEXT PK                 | UUID                                                                                  |
| `seed_id`             | TEXT NOT NULL           | Agent seed ID                                                                         |
| `owner_user_id`       | TEXT NOT NULL           | User who configured it                                                                |
| `name`                | TEXT                    | Digest name ("Daily Morning Brief")                                                   |
| `schedule`            | TEXT NOT NULL           | Cron expression or `'daily'` \| `'weekly'` shorthand                                  |
| `format`              | TEXT DEFAULT 'markdown' | `'pdf'` \| `'markdown'` \| `'json'`                                                   |
| `delivery_channel`    | TEXT NOT NULL           | `'dashboard'` \| `'email'` \| `'telegram'` \| `'discord'` \| `'slack'` \| `'webhook'` |
| `delivery_target`     | TEXT NOT NULL           | Email address, channel ID, or webhook URL                                             |
| `filter_projects`     | TEXT                    | JSON array of project IDs (null = all)                                                |
| `filter_accounts`     | TEXT                    | JSON array of account IDs (null = all)                                                |
| `include_attachments` | INTEGER DEFAULT 0       | Include attachment summaries                                                          |
| `include_timeline`    | INTEGER DEFAULT 1       | Include timeline events                                                               |
| `is_active`           | INTEGER DEFAULT 1       | Boolean                                                                               |
| `last_sent_at`        | INTEGER                 | Epoch ms                                                                              |
| `cron_job_id`         | TEXT                    | FK → existing Wunderland cron system                                                  |
| `created_at`          | INTEGER NOT NULL        | Epoch ms                                                                              |
| `updated_at`          | INTEGER NOT NULL        | Epoch ms                                                                              |

### 3.2 Existing Tables Reused

| Table                       | Usage                                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wunderbot_credentials`     | Single row per account with `credential_type: 'google_oauth_token'` — `encrypted_value` holds the access token, `metadata` JSON holds `{ refreshToken, email, expiresAt }`. Client ID/secret are env vars (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), not stored per-credential. Matches existing `ChannelTokenRefreshService` pattern. |
| Media library tables        | Stores attachment binaries via `media-library` module                                                                                                                                                                                                                                                                                     |
| `agentos_rag_collections`   | Two RAG collections per agent: `email_bodies_{seedId}` (message content) and `email_attachments_{seedId}` (extracted attachment text)                                                                                                                                                                                                     |
| `agentos_rag_documents`     | Chunked email content with embeddings                                                                                                                                                                                                                                                                                                     |
| `agentos_rag_documents_fts` | Full-text search over email content                                                                                                                                                                                                                                                                                                       |
| `wunderland_cron_jobs`      | Stores scheduled digest and sync cron entries                                                                                                                                                                                                                                                                                             |

### 3.3 RAG Data Sources

Each agent gets dedicated RAG collections:

| Collection ID                | Content                                              | Chunking Strategy                              |
| ---------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| `email_bodies_{seedId}`      | Email body text, subject, participants               | `recursive_character`, 1024 chars, 128 overlap |
| `email_attachments_{seedId}` | Extracted text from PDFs/DOCX + image transcriptions | `recursive_character`, 512 chars, 64 overlap   |

**Metadata stored per chunk:**

```typescript
{
  messageId: string;
  threadId: string;
  accountId: string;
  from: string;
  to: string[];
  subject: string;
  date: number;         // epoch ms
  labels: string[];
  projectIds: string[]; // updated when project associations change
  attachmentId?: string; // if chunk is from an attachment
  chunkType: 'email_body' | 'attachment_text' | 'attachment_image_description';
}
```

---

## 4. Email Provider Interface

### 4.1 `IEmailProvider`

Common interface for all email providers. Gmail implements it at launch, IMAP follows.

```typescript
interface IEmailProvider {
  readonly providerId: string; // 'gmail' | 'imap'
  readonly displayName: string;

  // Lifecycle
  initialize(credentials: DecryptedCredentials): Promise<void>;
  shutdown(): Promise<void>;
  testConnection(): Promise<{ ok: boolean; error?: string }>;

  // Sync — uses opaque cursor blob owned by each provider
  fullSync(options: FullSyncOptions): AsyncGenerator<EmailMessage[]>;
  incrementalSync(cursor: string): Promise<IncrementalSyncResult>; // cursor is provider-specific opaque JSON
  getCurrentCursor(): Promise<string>; // returns serialized cursor for storage in sync_cursor column

  // Messages
  getMessage(messageId: string): Promise<EmailMessage>;
  getThread(threadId: string): Promise<EmailMessage[]>;
  getAttachmentContent(messageId: string, attachmentId: string): Promise<Buffer>;

  // Actions
  sendMessage(draft: EmailDraft): Promise<{ messageId: string; threadId: string }>;
  replyToMessage(messageId: string, draft: EmailDraft): Promise<{ messageId: string }>;
  modifyLabels(messageId: string, add: string[], remove: string[]): Promise<void>;
  markAsRead(messageId: string): Promise<void>;
  archiveMessage(messageId: string): Promise<void>;
  trashMessage(messageId: string): Promise<void>;

  // Search
  search(query: string, maxResults?: number): Promise<EmailMessage[]>;
  listLabels(): Promise<EmailLabel[]>;
}

interface FullSyncOptions {
  maxMessages?: number; // Limit for initial sync (default: 5000)
  afterDate?: Date; // Only sync messages after this date
  labelFilter?: string[]; // Only sync these labels (default: all)
  batchSize?: number; // Messages per batch yield (default: 100)
}

interface IncrementalSyncResult {
  newMessages: EmailMessage[];
  modifiedMessageIds: string[]; // Labels/read status changed
  deletedMessageIds: string[];
  newCursor: string; // opaque provider cursor to store for next incrementalSync call
}

interface EmailMessage {
  id: string;
  threadId: string;
  messageIdHeader: string; // RFC 2822 Message-ID
  inReplyTo: string | null; // RFC 2822 In-Reply-To
  referencesHeader: string[]; // RFC 2822 References chain
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  bodyText: string | null;
  bodyHtml: string | null;
  snippet: string;
  internalDate: number; // epoch ms — when the email was sent
  receivedDate: number | null; // epoch ms — when it arrived in inbox
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  sizeBytes: number;
  attachments: EmailAttachmentMeta[];
}

interface EmailAttachmentMeta {
  attachmentId: string; // Provider-specific ID for lazy download
  filename: string;
  mimeType: string;
  sizeBytes: number;
  contentId: string | null; // CID for inline images
  isInline: boolean;
}

interface EmailAddress {
  email: string;
  name: string | null;
}

interface EmailDraft {
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    content: Buffer;
  }>;
  inReplyTo?: string; // Message-ID header for threading
  references?: string[]; // References chain for threading
}

interface EmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageCount: number;
  unreadCount: number;
}
```

### 4.2 Gmail Provider Implementation

`gmail-provider.ts` wraps the existing `googleapis` library (already a dependency in the Gmail extension).

**OAuth token management:**

- Reads encrypted tokens from `wunderbot_credentials` via `CredentialsService`
- Uses `google-auth-library` `OAuth2Client` with auto-refresh
- On token refresh, writes new access token back to credential vault
- Extends existing `channel-oauth.controller.ts` with Gmail-specific OAuth flow:
  - `GET /wunderland/channels/oauth/gmail/initiate?seedId=X` — generates Google OAuth URL with scopes: `gmail.readonly`, `gmail.send`, `gmail.modify`, `gmail.labels`
  - `GET /wunderland/channels/oauth/gmail/callback` — exchanges code, stores tokens, creates `wunderland_email_accounts` record

**Sync implementation:**

- `fullSync()` uses `gmail.users.messages.list()` with pagination, yields batches of full messages via `gmail.users.messages.get(format: 'full')`
- `incrementalSync()` uses `gmail.users.history.list(startHistoryId)` which returns only changes (new messages, label changes, deletes) — extremely quota-efficient
- MIME parsing reuses existing `GmailService.ts` logic for multipart/alternative, multipart/mixed, etc.

**Quota awareness:**

- Gmail API quota: 250 units/second per user
- `messages.list` = 5 units, `messages.get` = 5 units, `history.list` = 2 units
- Full sync of 5000 messages ≈ 25,050 units ≈ 100 seconds at max rate
- Incremental sync typically < 10 units per poll (only changes since last historyId)

---

## 5. Core Services

### 5.1 Email Sync Service

Orchestrates the sync lifecycle for all connected email accounts.

**Responsibilities:**

- On module init, loads all active `wunderland_email_accounts` and schedules sync cron jobs
- Full sync on first connection (paginated, yields batches to avoid memory spikes)
- Incremental sync on poll interval (default every 5 minutes via existing `CronScheduler`)
- Persists messages to `wunderland_email_synced_messages` (upsert — Gmail may return modified messages)
- Triggers downstream processing: thread reconstruction, RAG indexing, attachment extraction
- Tracks `last_sync_history_id` for efficient incremental sync
- Exposes sync health metrics: last sync time, messages synced, errors

**Sync pipeline per batch:**

```
1. Fetch batch from provider (fullSync or incrementalSync)
2. Upsert messages into wunderland_email_synced_messages
3. For each new message with attachments:
   a. Create wunderland_email_attachments records
   b. For text-based attachments (PDF/DOCX/XLSX/TXT/CSV):
      - Download content via provider.getAttachmentContent()
      - Store binary in media-library
      - Run extractor → populate extracted_text
      - Set extraction_status = 'extracted'
   c. For image attachments (PNG/JPG/GIF/WEBP):
      - Download content, store in media-library
      - Set extraction_status = 'pending' (deferred transcription)
4. Trigger email-thread.service.reconstructThread(threadId)
5. Queue RAG indexing for new/modified messages
6. Update account.last_sync_history_id
```

**Error handling:**

- Transient errors (network, 429 rate limit): exponential backoff, retry up to 3 times
- Auth errors (401/403): mark account as `sync_enabled = false`, notify user via channel
- Partial failures: continue syncing remaining messages, log failures

### 5.2 Email Thread Service

Reconstructs true parent→child hierarchies from RFC 2822 headers.

**Why not just use Gmail's `threadId`?**
Gmail groups messages by subject line similarity, which creates false thread groupings. RFC 2822 `In-Reply-To` and `References` headers provide the actual reply chain.

**Algorithm:**

```
reconstructThread(threadId):
  1. Load all messages in thread, ordered by internal_date ASC
  2. Build message lookup: messageIdHeader → message
  3. For each message:
     a. If in_reply_to exists and points to a known message:
        - Set parent_message_id = that message's id
        - Set thread_depth = parent.thread_depth + 1
     b. Else if references_header has entries:
        - Walk references array from end to start
        - First match in our lookup becomes parent
     c. Else:
        - This is a thread root (thread_depth = 0)
  4. Compute thread_position (chronological order within thread)
  5. Persist parent_message_id, thread_depth, thread_position
  6. Return tree structure
```

**Output — `ThreadHierarchy`:**

```typescript
interface ThreadHierarchy {
  threadId: string;
  subject: string;
  messageCount: number;
  participantCount: number;
  participants: EmailAddress[];
  dateRange: { earliest: number; latest: number };
  rootMessages: ThreadNode[]; // Forest — multiple roots possible (split threads)
  flatTimeline: ThreadTimelineEntry[];
}

interface ThreadNode {
  messageId: string;
  from: EmailAddress;
  subject: string;
  snippet: string;
  date: number;
  depth: number;
  attachments: EmailAttachmentMeta[];
  children: ThreadNode[];
}

interface ThreadTimelineEntry {
  messageId: string;
  from: EmailAddress;
  date: number;
  action: 'sent' | 'replied' | 'forwarded';
  snippet: string;
}
```

### 5.3 Email Project Service

Detects and manages project groupings across threads.

**Auto-detection pipeline** (runs after sync, configurable interval):

```
detectProjects(seedId):
  1. Load all threads for this agent's accounts
  2. Build feature vectors per thread:
     - Participant set (normalized emails)
     - Subject tokens (stopwords removed, stemmed)
     - Label set
     - Date range
     - Semantic embedding of concatenated snippets (via EmbeddingManager)
  3. Cluster threads using combined similarity:
     - Participant overlap: Jaccard similarity (weight 0.3)
     - Subject similarity: TF-IDF cosine (weight 0.2)
     - Semantic similarity: embedding cosine (weight 0.4)
     - Temporal proximity: decay function on date gap (weight 0.1)
  4. Agglomerative clustering with threshold 0.6
  5. For each cluster:
     - Generate project name via LLM (input: subjects + snippets)
     - Generate project description via LLM
     - Compute confidence score (average intra-cluster similarity)
  6. Diff against existing projects:
     - New clusters → create projects with auto_detected=true
     - Existing projects with new matching threads → suggest additions
     - Never auto-remove manually-added threads
  7. Return proposed changes for user review (or auto-apply if confidence > 0.8)
```

**Manual operations:**

- `createProject(name, description, threadIds[])` — manual project creation
- `addThreadsToProject(projectId, threadIds[])` — manual thread assignment
- `removeThreadFromProject(projectId, threadId)` — unlink
- `mergeProjects(projectIdA, projectIdB)` — combine two projects
- `archiveProject(projectId)` — mark complete/inactive
- `getProjectSummary(projectId)` — LLM-generated status summary from recent messages
- `getProjectTimeline(projectId)` — chronological event extraction

**Project summary prompt template:**

```
You are analyzing email threads belonging to project "{projectName}".

Here are the most recent messages across all threads in this project:
{recentMessages}

Provide a structured summary:
1. Current status (one line)
2. Key decisions made (bullet points)
3. Outstanding action items (bullet points with owner if identifiable)
4. Blockers or risks (bullet points)
5. Next expected milestone

Base your analysis only on the email content provided.
```

### 5.4 Email RAG Service

Email-specific wrapper around the existing AgentOS RAG pipeline (`RetrievalAugmentor`, `EmbeddingManager`, `VectorStoreManager`).

**Indexing pipeline:**

```
indexMessage(message):
  1. Build document text:
     "From: {from}\nTo: {to}\nDate: {date}\nSubject: {subject}\n\n{bodyText}"
  2. Create RagDocumentInput:
     - id: "email_{messageId}"
     - content: document text
     - dataSourceId: "email_bodies_{seedId}"
     - metadata: { messageId, threadId, accountId, from, to, subject, date, labels, projectIds }
  3. Ingest via RetrievalAugmentor.ingestDocuments()
     - Chunking: recursive_character, 1024 chars, 128 overlap
  4. Store chunk IDs back to message.rag_chunk_ids
  5. Update message.rag_indexed_at

indexAttachment(attachment):
  1. Get text content:
     - If extraction_status == 'extracted': use extracted_text
     - If extraction_status == 'transcribed': use multimodal_description
     - If extraction_status == 'pending' and is image: trigger transcription first
  2. Create RagDocumentInput:
     - id: "attachment_{attachmentId}"
     - content: extracted/transcribed text
     - dataSourceId: "email_attachments_{seedId}"
     - metadata: { attachmentId, messageId, threadId, filename, mimeType, projectIds }
  3. Ingest via RetrievalAugmentor.ingestDocuments()
     - Chunking: recursive_character, 512 chars, 64 overlap
  4. Store chunk IDs, update rag_indexed_at
```

**Query interface:**

```typescript
interface EmailRAGQuery {
  query: string; // Natural language question
  seedId: string;
  accountIds?: string[]; // Filter to specific accounts
  projectIds?: string[]; // Filter to specific projects
  threadIds?: string[]; // Filter to specific threads
  dateRange?: { from?: number; to?: number };
  participantFilter?: string[]; // Filter by sender/recipient
  includeAttachments?: boolean; // Search attachment content too
  topK?: number; // Default 10
  strategy?: 'similarity' | 'mmr' | 'hybrid'; // Default 'mmr'
}

interface EmailRAGResult {
  answer: string; // LLM-generated answer
  sources: EmailRAGSource[]; // Cited email chunks
  confidence: number;
  tokensUsed: number;
}

interface EmailRAGSource {
  messageId: string;
  threadId: string;
  from: string;
  subject: string;
  date: number;
  snippet: string; // The relevant chunk text
  relevanceScore: number;
  projectIds: string[];
  attachmentId?: string; // If source is an attachment
  attachmentFilename?: string;
}
```

**Retrieval uses existing capabilities:**

- MMR strategy (default) for diversity — avoids returning 5 chunks from the same long email
- Hybrid search (dense + FTS5) when available
- Metadata filtering for account/project/date scoping
- HyDE (Hypothetical Document Embedding) for improved recall on vague queries
- Reranking via Cohere or local cross-encoder for high-precision queries

### 5.5 Email Attachment Service

Manages extraction, transcription, and media-library integration.

**Tiered processing strategy:**

| MIME Type Category                                                          | Processing                     | Timing                                  | Library                                       |
| --------------------------------------------------------------------------- | ------------------------------ | --------------------------------------- | --------------------------------------------- |
| `application/pdf`                                                           | Text extraction + OCR fallback | Eager (on sync)                         | `pdf-parse` + `tesseract.js` for scanned PDFs |
| `application/vnd.openxmlformats-officedocument.wordprocessingml.document`   | Text + structure extraction    | Eager                                   | `mammoth`                                     |
| `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`         | Cell data → structured text    | Eager                                   | `xlsx`                                        |
| `application/vnd.openxmlformats-officedocument.presentationml.presentation` | Slide text extraction          | Eager                                   | `pptx-parser` or custom ZIP+XML               |
| `text/*` (plain, csv, html, code)                                           | Direct text                    | Eager                                   | Built-in                                      |
| `image/*` (png, jpg, gif, webp)                                             | Vision LLM description         | Deferred (on query or background queue) | OpenAI `gpt-4o` or configurable vision model  |
| `application/zip`, other archives                                           | Skip (log as unsupported)      | —                                       | —                                             |

**Image transcription flow:**

```
transcribeImage(attachmentId):
  1. Load binary from media-library
  2. Convert to base64
  3. Call vision LLM with prompt:
     "Describe this image in detail. If it's a screenshot, transcribe all visible text.
      If it's a diagram, describe the structure and relationships.
      If it contains code, extract the code.
      Focus on information that would be useful for understanding
      the email conversation this was attached to."
  4. Store result in attachment.multimodal_description
  5. Set extraction_status = 'transcribed'
  6. Trigger RAG indexing of the description
```

**Media-library integration:**

- Uses existing `MediaLibraryService` for binary storage
- Extends metadata with email provenance:
  - `source_type: 'email_attachment'`
  - `source_message_id`: email message ID
  - `source_thread_id`: thread ID
  - `source_account_id`: account ID
  - `source_project_ids`: associated projects (updated on project changes)

### 5.6 Email Report Service

Generates exportable reports in multiple formats.

**Report types:**

1. **Project Report** — comprehensive summary of a project
   - Project overview (name, status, participants, date range)
   - AI-generated executive summary
   - Timeline of key events
   - Thread summaries (per-thread, chronological)
   - Attachment inventory with extracted content previews
   - Participant contribution analysis
   - Outstanding action items

2. **Thread Report** — deep dive on a single thread
   - Full thread hierarchy (tree view)
   - Message-by-message content
   - Attachment details
   - Timeline

3. **Digest Report** — periodic summary
   - New messages since last digest
   - Project status updates
   - Unread/unanswered threads
   - Key highlights (LLM-selected)

**Format implementations:**

```typescript
interface IReportFormatter {
  format(report: ReportData): Promise<Buffer | string>;
  mimeType: string;
  fileExtension: string;
}

// Implementations:
// MarkdownFormatter — structured markdown with headers, tables, code blocks
// JsonFormatter — raw structured data
// PdfFormatter — uses @react-pdf/renderer or pdfkit for styled output
```

**Report generation flow:**

```
generateReport(projectId, format):
  1. Load project + all threads + messages + attachments
  2. Generate AI summary via LLM (project summary prompt)
  3. Extract timeline events from messages
  4. Build ReportData structure
  5. Pass to appropriate IReportFormatter
  6. Return file buffer + metadata (filename, mimeType, sizeBytes)
```

### 5.7 Email Digest Service

Scheduled digest delivery via the existing Wunderland cron system.

**Setup flow:**

1. User configures digest via dashboard or CLI command
2. Creates `wunderland_email_digests` record
3. Registers cron job via existing `CronScheduler`:
   - `every: '1d'` for daily, `every: '1w'` for weekly
   - Callback triggers `generateAndDeliverDigest(digestId)`

**Delivery:**

- `email` → sends via SMTP through existing email integration
- `telegram` / `discord` / `slack` → sends via corresponding channel adapter
- `webhook` → POST to configured URL with report as attachment

---

## 6. Gmail OAuth Flow

### 6.1 OAuth Integration

Extends the existing `channel-oauth.controller.ts` and `channel-oauth.service.ts`.

**Required Google OAuth Scopes:**

- `https://www.googleapis.com/auth/gmail.readonly` — read messages, threads, labels
- `https://www.googleapis.com/auth/gmail.send` — send messages
- `https://www.googleapis.com/auth/gmail.modify` — modify labels, mark read/unread
- `https://www.googleapis.com/auth/gmail.labels` — create/manage labels
- `https://www.googleapis.com/auth/userinfo.email` — get user's email address

**Flow:**

```
1. User clicks "Connect Gmail" in dashboard →
   GET /wunderland/channels/oauth/gmail/initiate?seedId=X

2. Backend generates state token, stores in wunderland_channel_oauth_states (10-min TTL):
   { stateId, seedId, ownerUserId, provider: 'gmail', createdAt }
   Note: table name is wunderland_channel_oauth_states (not wunderland_oauth_states) per existing schema.

3. Redirect to Google OAuth consent screen:
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id={GOOGLE_CLIENT_ID}&
     redirect_uri={GOOGLE_CALLBACK_URL}&
     response_type=code&
     scope=gmail.readonly gmail.send gmail.modify gmail.labels userinfo.email&
     state={stateId}&
     access_type=offline&
     prompt=consent

4. User grants consent → Google redirects to:
   GET /wunderland/channels/oauth/gmail/callback?code=X&state=Y

5. Backend validates state, exchanges code for tokens:
   POST https://oauth2.googleapis.com/token
   → { access_token, refresh_token, expires_in, token_type }

6. Fetch user email:
   GET https://www.googleapis.com/oauth2/v2/userinfo
   → { email, name }

7. Store credentials (encrypted AES-256-GCM via CredentialsService):
   - Single credential row with credential_type: 'google_oauth_token'
   - encrypted_value: encrypted access_token
   - metadata JSON: { refreshToken: encrypted_refresh_token, email: user_email, expiresAt: epoch_ms }
   - This matches the existing ChannelTokenRefreshService pattern which reads
     metadata.refreshToken for auto-refresh (consistent with Slack/Discord OAuth storage)

8. Create wunderland_email_accounts record:
   { seedId, provider: 'gmail', emailAddress, credentialId, syncEnabled: true }

9. Trigger initial full sync

10. Redirect user back to /app/dashboard/{seedId}/email
```

**Token refresh:**

- Extend existing `ChannelTokenRefreshService` to handle Gmail tokens
- Check `expires_in` before each API call
- Use `refresh_token` to obtain new `access_token`
- Update encrypted credential in vault

### 6.2 Multi-Inbox Support

- Users can repeat the OAuth flow for additional Gmail accounts
- Each creates a separate `wunderland_email_accounts` record with its own credentials
- Sync runs independently per account
- Dashboard shows unified inbox across all accounts with account indicator
- RAG index is shared per agent (queries search across all accounts)
- Projects can span accounts (thread from work Gmail + thread from personal Gmail = same project)

### 6.3 CLI/TUI OAuth

For headless environments (CLI/TUI), use the device authorization grant flow:

```
1. CLI calls: POST /wunderland/channels/oauth/gmail/device-initiate
   → { verificationUrl, userCode, deviceCode, expiresIn }

2. CLI displays:
   "Visit https://rabbithole.app/connect-gmail and enter code: ABCD-1234"

3. CLI polls: POST /wunderland/channels/oauth/gmail/device-poll
   with { deviceCode }
   → 202 (pending) or 200 (tokens received)

4. Once tokens received, same storage + account creation flow
```

---

## 7. REST API

### 7.1 Endpoints

All endpoints scoped under `/wunderland/email-intelligence/` with `seedId` passed as a required query parameter (matching the existing email controller convention at `/wunderland/email/*`). Endpoints require either JWT auth (dashboard calls) or `X-Internal-Secret` header (extension tool calls), plus agent ownership verification.

**Note on route convention:** The existing `email.controller.ts` uses `/wunderland/email/*` with seedId in query/body — NOT `/wunderland/agents/:seedId/email/*`. We follow the same pattern for consistency.

**Account Management:**

| Method   | Path                          | Description                              |
| -------- | ----------------------------- | ---------------------------------------- |
| `GET`    | `/accounts`                   | List connected email accounts for agent  |
| `GET`    | `/accounts/:accountId/status` | Sync status, health, last error          |
| `DELETE` | `/accounts/:accountId`        | Disconnect account, remove data          |
| `PATCH`  | `/accounts/:accountId`        | Update sync settings (interval, enabled) |
| `POST`   | `/accounts/:accountId/sync`   | Trigger immediate sync                   |

**Messages & Threads:**

| Method   | Path                                      | Description                                                                                                                                                                   |
| -------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/messages`                               | List messages (paginated, filterable by account, label, date, read status)                                                                                                    |
| `GET`    | `/messages/:messageId`                    | Full message with parsed body and attachments                                                                                                                                 |
| `GET`    | `/threads`                                | List threads (paginated, with message counts, last activity)                                                                                                                  |
| `GET`    | `/threads/:threadId?accountId=X`          | Thread hierarchy — full tree with all messages. `accountId` required because thread IDs are provider-scoped (same thread ID could theoretically exist in different accounts). |
| `GET`    | `/threads/:threadId/timeline?accountId=X` | Timeline events for thread                                                                                                                                                    |
| `POST`   | `/messages/send`                          | Send new email                                                                                                                                                                |
| `POST`   | `/messages/:messageId/reply`              | Reply to message (maintains threading)                                                                                                                                        |
| `PATCH`  | `/messages/:messageId`                    | Update labels, read/starred status                                                                                                                                            |
| `DELETE` | `/messages/:messageId`                    | Trash message                                                                                                                                                                 |

**Projects:**

| Method   | Path                                     | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/projects`                              | List all projects (active, archived)     |
| `POST`   | `/projects`                              | Create manual project                    |
| `GET`    | `/projects/:projectId`                   | Project details with thread list         |
| `PATCH`  | `/projects/:projectId`                   | Update name, description, status         |
| `DELETE` | `/projects/:projectId`                   | Delete project (doesn't delete threads)  |
| `POST`   | `/projects/:projectId/threads`           | Add threads to project                   |
| `DELETE` | `/projects/:projectId/threads/:threadId` | Remove thread from project               |
| `POST`   | `/projects/merge`                        | Merge two projects                       |
| `GET`    | `/projects/:projectId/summary`           | AI-generated project summary             |
| `GET`    | `/projects/:projectId/timeline`          | Project-level timeline                   |
| `POST`   | `/projects/detect`                       | Trigger auto-detection, return proposals |
| `POST`   | `/projects/detect/apply`                 | Apply selected auto-detected projects    |

**Intelligence & RAG:**

| Method | Path             | Description                                                                  |
| ------ | ---------------- | ---------------------------------------------------------------------------- |
| `POST` | `/query`         | Natural language query across all email (RAG)                                |
| `GET`  | `/stats`         | Dashboard stats (unread, awaiting reply, active projects, avg response time) |
| `GET`  | `/participants`  | Top participants across all accounts with message counts                     |
| `GET`  | `/stale-threads` | Threads with no activity in N days                                           |

**Attachments:**

| Method | Path                                    | Description                                                     |
| ------ | --------------------------------------- | --------------------------------------------------------------- |
| `GET`  | `/attachments`                          | List attachments (filterable by message, thread, project, type) |
| `GET`  | `/attachments/:attachmentId`            | Attachment metadata + extracted text                            |
| `GET`  | `/attachments/:attachmentId/download`   | Download binary                                                 |
| `POST` | `/attachments/:attachmentId/transcribe` | Trigger image transcription (deferred → immediate)              |

**Reports & Digests:**

| Method   | Path                          | Description                                     |
| -------- | ----------------------------- | ----------------------------------------------- | ---- | ---------- |
| `POST`   | `/reports/project/:projectId` | Generate project report (body: `{ format: 'pdf' | 'md' | 'json' }`) |
| `POST`   | `/reports/thread/:threadId`   | Generate thread report                          |
| `GET`    | `/digests`                    | List configured digests                         |
| `POST`   | `/digests`                    | Create scheduled digest                         |
| `PATCH`  | `/digests/:digestId`          | Update digest config                            |
| `DELETE` | `/digests/:digestId`          | Delete digest                                   |
| `POST`   | `/digests/:digestId/preview`  | Preview next digest content                     |
| `POST`   | `/digests/:digestId/send-now` | Send digest immediately                         |

### 7.2 Query Parameters Convention

Following existing Wunderland API patterns:

- Pagination: `?page=1&limit=20` (default limit 20, max 100)
- Sorting: `?sort=date&order=desc`
- Filtering: `?accountId=X&label=INBOX&isRead=false&after=1709251200000&before=1711929600000`
- Search: `?q=search+terms` (passes to provider search or RAG)

---

## 8. Rabbithole Dashboard UI

### 8.1 Route Structure

Expands existing `/app/dashboard/[seedId]/email/` from a simple SMTP test page into a full email intelligence interface.

```
/app/dashboard/[seedId]/email/                # Landing — redirects to inbox or setup
/app/dashboard/[seedId]/email/inbox           # Thread-centric inbox view (View A)
/app/dashboard/[seedId]/email/projects        # Project-centric view (View B)
/app/dashboard/[seedId]/email/intelligence    # Analytics dashboard (View C widgets)
/app/dashboard/[seedId]/email/thread/[id]     # Thread detail with hierarchy
/app/dashboard/[seedId]/email/project/[id]    # Project detail with timeline
/app/dashboard/[seedId]/email/settings        # Account management, sync config, digest setup
```

### 8.2 View A — Inbox (Thread-Centric)

**Layout:** Two-panel (thread list left, thread detail right), similar to Superhuman/Gmail.

**Thread list panel (left):**

- Account selector dropdown (all accounts, or filter to one)
- Label/folder filter tabs (Inbox, Starred, Sent, All Mail, custom labels)
- Search bar (submits to RAG query or provider search)
- Thread cards showing: sender, subject, snippet, date, project tag badges, attachment count badge, unread indicator
- Infinite scroll with pagination

**Thread detail panel (right):**

- Thread subject + metadata (participant count, message count, date span)
- AI thread summary card (collapsible, green accent border)
- Message list in chronological order with:
  - Sender avatar/initial, name, date
  - Body content (rendered HTML or plain text)
  - Attachment chips (clickable to view/download)
  - Reply depth indentation matching thread hierarchy
- Reply composer at bottom
- Project assignment dropdown ("Add to project...")

### 8.3 View B — Projects (Project-Centric)

**Layout:** Card grid with drill-down.

**Project list:**

- Cards per project: name, status badge, description, thread/message/attachment counts, last activity date, participant avatars
- "Auto-detected" badge for auto-detected projects with confidence indicator
- "+ Create Project" card (manual creation)
- "Detect Projects" button (triggers auto-detection, shows proposals in modal)
- Filter by status (active, archived, completed)

**Project detail (`/email/project/[id]`):**

- Project header: name, description (editable), status, participant list
- Tabs: Timeline | Threads | Attachments | Reports
- **Timeline tab:** Vertical timeline of key events extracted from emails, with dates, participants, and snippets. Each event links to its source message.
- **Threads tab:** List of all threads in project, each showing hierarchy preview, last message date, message count
- **Attachments tab:** Grid/list of all attachments across all project threads, with extracted text previews, download links
- **Reports tab:** Generate on-demand reports (PDF/MD/JSON), configure scheduled digests

### 8.4 View C — Intelligence Widget

**Persistent AI chat panel** (right sidebar, collapsible, available on all email views):

- Chat input at bottom: "Ask about your emails..."
- Conversational responses with structured formatting (bullet points, status indicators, tables)
- Source citations with clickable links to specific messages/threads
- Action suggestions ("Would you like me to export this as a report?")
- Context-aware: knows which view/project/thread the user is looking at

**Intelligence dashboard (`/email/intelligence`):**

- Stat cards row: Unread count, Awaiting Reply count, Active Projects count, Avg Response Time
- Project activity heatmap (which projects had most activity this week)
- Top participants chart (bar chart of message volume by person)
- Stale threads list (threads with no reply in >3 days, sorted by staleness)
- Attachment processing queue (pending transcriptions count, recent extractions)
- Sync health indicator per account

### 8.5 UI Components (Shared)

Following existing Rabbithole patterns (`OrnateToggle`, `OrnateKnob`, `IntegrationCard`, `StatWidget`, `seedToColor`):

| Component               | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `EmailThreadCard`       | Thread preview in inbox list                            |
| `EmailMessageBubble`    | Single message in thread view                           |
| `ThreadHierarchyTree`   | Indented tree view of reply chain                       |
| `ProjectCard`           | Project preview in grid                                 |
| `ProjectTimeline`       | Vertical timeline component                             |
| `AttachmentChip`        | Inline attachment indicator (filename, type icon, size) |
| `AttachmentPreview`     | Expanded view with extracted text / image preview       |
| `EmailAIWidget`         | Persistent chat panel (Gemini-style)                    |
| `AccountSwitcher`       | Multi-account dropdown                                  |
| `SyncStatusBadge`       | Account sync health indicator                           |
| `DigestConfigurator`    | Digest schedule/format/delivery setup form              |
| `ProjectDetectionModal` | Review auto-detected project proposals                  |
| `ReportGeneratorModal`  | Format selection + generate report                      |

### 8.6 Styling

- Uses existing Rabbithole CSS variables: `--color-text`, `--color-text-dim`, `--color-text-muted`, `--input-bg`, `--border-subtle`, `--color-error`
- Font: `IBM Plex Mono` for metadata, system font for body text
- Accent colors: uses `seedToColor(seedId)` for agent-specific theming
- Component classes: `post-card`, `badge`, `btn btn--primary`, `btn--ghost`, `empty-state` pattern
- Dark theme only (matches existing Rabbithole)

---

## 9. Channel Bot & CLI Interface

### 9.1 Wunderbot Tool Commands

When a user interacts with their Wunderbot via any channel (Telegram, Discord, Slack) or CLI, the following natural language intents are handled:

**Conversational (default):**

- "What's happening with Project Alpha?" → RAG query → conversational summary
- "Any new emails from Sarah?" → filtered search → natural language response
- "Summarize the API redesign thread" → thread summary → conversational
- "What are my unread emails?" → stats + list → conversational

**Structured (slash commands or explicit requests):**

- `/email inbox` → formatted thread list (last 10, with dates/subjects/senders)
- `/email thread <id>` → thread hierarchy tree (ASCII art in terminal, rich text in channels)
- `/email projects` → project list table
- `/email project <name>` → project summary with timeline
- `/email search <query>` → RAG search results with source citations
- `/email report <project> <format>` → generates and sends report file
- `/email sync status` → sync health for all accounts
- `/email accounts` → list connected accounts

### 9.2 CLI/TUI Formatting

For CLI/TUI output, use structured formatting compatible with existing Wunderland CLI patterns:

**Thread list:**

```
┌─────────────────────────────────────────────────────────┐
│ Inbox (3 unread)                    work@gmail.com      │
├─────────────────────────────────────────────────────────┤
│ ● Sarah Chen          Re: Q2 Launch Timeline      2h   │
│   [Project Alpha] [📎 3]                                │
│                                                         │
│ ○ Mike Torres          API redesign proposal       5h   │
│   [Backend Rewrite]                                     │
│                                                         │
│ ○ Legal Team           Contract review — NDA v3    1d   │
│   [Vendor Eval] [📎 1]                                  │
└─────────────────────────────────────────────────────────┘
```

**Thread hierarchy:**

```
Re: Q2 Launch Timeline (8 messages, 4 participants)
├── Sarah Chen (Mar 3) — Initial kickoff email
│   ├── Mike Torres (Mar 4) — API timeline estimate
│   │   └── Sarah Chen (Mar 5) — Confirmed, updated doc
│   ├── Lisa Park (Mar 6) — QA requirements
│   │   ├── Sarah Chen (Mar 7) — Acknowledged
│   │   └── Lisa Park (Mar 12) — QA sign-off pending
│   └── David Kim (Mar 8) — Design assets ready
└── Sarah Chen (Mar 15) — Updated timeline [📎 timeline-v3.pdf, mockup.png]
```

**Project summary:**

```
═══ Project Alpha ═══
Status: Active | 12 threads | 47 emails | 6 participants
Last activity: 2h ago

📌 Launch moved to March 15
✅ API ready (Mike, confirmed Mar 7)
✅ Design handoff complete (David, Mar 8)
⏳ QA sign-off pending (Lisa)
⚠️  NDA with vendor unsigned

Timeline:
  Mar 3  ──── Kickoff (Sarah)
  Mar 7  ──── API confirmed (Mike)
  Mar 8  ──── Design assets ready (David)
  Mar 12 ──── QA requirements clarified (Lisa)
  Mar 15 ──── Target launch date
```

---

## 10. Agent Setup & Default Configuration

### 10.1 Batteries-Included Setup

Email intelligence should be enabled by default when an agent is created, requiring minimal configuration:

**Agent creation flow (extended):**

```
1. User creates new Wunderbot via agent-builder
2. Agent config includes email_intelligence section:
   {
     emailIntelligence: {
       enabled: true,              // on by default
       autoSync: true,             // sync starts immediately on account connect
       syncIntervalMs: 300000,     // 5 min default
       ragIndexing: true,          // auto-index to RAG
       attachmentProcessing: {
         eagerTypes: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'csv'],
         deferredTypes: ['png', 'jpg', 'gif', 'webp'],
         maxAttachmentSizeMb: 25,
       },
       projectDetection: {
         enabled: true,
         autoApplyThreshold: 0.8,  // auto-apply if confidence > 0.8
         detectionIntervalMs: 3600000, // re-detect hourly
       },
       defaultDigest: {
         enabled: false,           // user opts in
         schedule: 'daily',
         format: 'markdown',
       },
     }
   }
3. Dashboard shows "Connect Gmail" button prominently on email tab
4. After OAuth, sync begins automatically
5. No additional configuration required — everything works out of the box
```

### 10.2 Extension Registration

The email intelligence tools are registered as an extension pack in the agent's manifest:

```typescript
// In createCuratedManifest() — auto-included when email accounts exist
{
  package: '@framers/agentos-ext-email-intelligence',
  enabled: true,
  priority: 50,
  options: {
    seedId: agent.seedId,
    backendUrl: process.env.BACKEND_URL,
  },
}
```

### 10.3 Skill Registration

New skill: `email-intelligence` added to `packages/agentos-skills-registry/registry/curated/`:

```yaml
# SKILL.md frontmatter
metadata:
  agentos:
    primaryEnv: GOOGLE_CLIENT_ID
    requires_tools: [searchAcrossThreads, getProjectSummary, getThreadHierarchy]
    categories: [productivity, email, intelligence]
```

Skill content provides the LLM with email-specific instructions:

- How to interpret thread hierarchies
- When to use RAG search vs. provider search
- How to format project summaries
- When to suggest report generation
- How to handle multi-account queries

---

## 11. Error Handling & Edge Cases

### 11.1 Sync Failures

| Error                                | Handling                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| OAuth token expired, refresh fails   | Mark account `sync_enabled = false`, notify user: "Gmail access expired, please reconnect" |
| Gmail API rate limit (429)           | Exponential backoff: 1s, 2s, 4s, max 3 retries, then skip batch                            |
| Network timeout                      | Retry once, then mark sync as partial, continue next interval                              |
| Message deleted between list and get | Skip silently, will be caught as deletion in next incremental sync                         |
| Attachment too large (>25MB)         | Skip download, set `extraction_status = 'skipped'`, store metadata only                    |
| PDF extraction fails                 | Set `extraction_status = 'failed'`, store error, index metadata only                       |
| Vision LLM unavailable               | Leave image as `pending`, retry in next background cycle                                   |

### 11.2 Data Consistency

- Thread hierarchy reconstruction is idempotent — re-running on same thread produces same result
- RAG indexing uses upsert — re-indexing a message updates existing chunks
- Project detection diffs against existing projects — never duplicates or overwrites manual edits
- Deletion cascade: deleting an account removes all messages, attachments, and project-thread links for that account

### 11.3 Privacy & Security

- All credentials stored AES-256-GCM encrypted (existing CredentialsService)
- Email content stored in agent's SQLite database (same security boundary as other agent data)
- RAG embeddings are per-agent collections — no cross-agent data leakage
- API endpoints enforce ownership: user must own the agent to access its email data
- No email content logged to application logs — only message IDs and metadata
- Attachment binaries served through authenticated media-library endpoints

---

## 12. Dependencies

### 12.1 New NPM Packages

| Package                           | Purpose                                              | Size Impact                                                                                                                                                                                                          |
| --------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pdf-parse`                       | PDF text extraction                                  | ~50KB                                                                                                                                                                                                                |
| `mammoth`                         | DOCX → text/HTML                                     | ~200KB                                                                                                                                                                                                               |
| `xlsx`                            | Excel parsing                                        | ~300KB                                                                                                                                                                                                               |
| `tesseract.js`                    | OCR for scanned PDFs (optional, disabled by default) | ~2MB (WASM, lazy-loaded only when `ocrEnabled: true` in config). Not loaded at startup — dynamically imported on first scanned PDF detection. Can be disabled entirely via `attachmentProcessing.ocrEnabled: false`. |
| `pptx-parser`                     | PPTX slide text extraction                           | ~30KB                                                                                                                                                                                                                |
| `@react-pdf/renderer` or `pdfkit` | PDF report generation                                | ~500KB                                                                                                                                                                                                               |
| `dompurify` + `jsdom`             | HTML sanitization for email body rendering           | ~100KB                                                                                                                                                                                                               |

### 12.2 Existing Packages Reused

| Package                        | Already Used By                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `googleapis`                   | Gmail extension (`@framers/agentos-ext-email-gmail`)                                    |
| `google-auth-library`          | Gmail extension                                                                         |
| `nodemailer`                   | Email channel adapter extension (NOT in backend — backend uses custom `smtp-client.js`) |
| `@anthropic-ai/sdk` / `openai` | LLM calls (summaries, transcription)                                                    |

### 12.3 Existing Services Reused

| Service                         | Module                     | Usage                                     |
| ------------------------------- | -------------------------- | ----------------------------------------- |
| `CredentialsService`            | `wunderland/credentials`   | Store/retrieve encrypted OAuth tokens     |
| `ChannelTokenRefreshService`    | `wunderland/channels`      | Auto-refresh Gmail OAuth tokens           |
| `MediaLibraryService`           | `wunderland/media-library` | Store attachment binaries                 |
| `CronScheduler`                 | `wunderland/cron`          | Schedule sync polling and digest delivery |
| `WunderlandVectorMemoryService` | `wunderland/orchestration` | RAG embedding and retrieval               |
| `EmbeddingManager`              | `@framers/agentos`         | Generate embeddings                       |
| `RetrievalAugmentor`            | `@framers/agentos`         | Ingest and query RAG                      |
| `VectorStoreManager`            | `@framers/agentos`         | Manage vector collections                 |

---

## 13. Testing Strategy

### 13.1 Unit Tests

| Service                    | Key Test Cases                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `email-thread.service`     | Linear chain, forked thread, orphan message, missing In-Reply-To fallback to References, circular reference handling |
| `email-project.service`    | Cluster detection with known data, manual CRUD, merge operation, confidence thresholds                               |
| `email-rag.service`        | Document construction, metadata assembly, chunk ID storage, query with filters                                       |
| `email-attachment.service` | PDF extraction, DOCX extraction, image transcription mock, size limit skip, MIME routing                             |
| `gmail-provider`           | Auth initialization, token refresh, full sync pagination, incremental sync history parsing, MIME parsing             |
| `email-report.service`     | Markdown output structure, JSON schema compliance, PDF generation (smoke test)                                       |

### 13.2 Integration Tests

- Full sync → thread reconstruction → RAG indexing pipeline (with mock Gmail API)
- OAuth flow end-to-end (with mock Google OAuth server)
- Multi-account unified query (two accounts, verify cross-account RAG results)
- Project detection → proposal → apply → verify project structure
- Report generation in all three formats
- Digest scheduling and delivery (mock channel delivery)

### 13.3 Test Data

- Mock Gmail API responses with realistic thread structures (linear, forked, merged)
- Sample attachments: small PDF, DOCX, PNG screenshot, CSV
- Pre-computed embeddings for deterministic RAG tests

---

## 14. Migration Path

### 14.1 From Existing Email Page

The current `/app/dashboard/[seedId]/email/` page (SMTP test form) is preserved as a subsection of the new email settings page. No functionality is removed.

### 14.2 From Existing Gmail Extension

The 6 existing Gmail extension tools continue to work unchanged. The extension's `GmailService` is NOT refactored — it remains a standalone service with env-var/secrets credential resolution. The backend's `gmail-provider.ts` is a separate, independent implementation of `IEmailProvider` that reads credentials from the encrypted credential vault. No code is shared between them at launch. A future refactor could extract shared Gmail API logic, but it's not required for v1.

### 14.3 Database Migrations

All new tables are created via the existing `ensureColumnExists` + `CREATE TABLE IF NOT EXISTS` pattern used throughout `appDatabase.ts`. No breaking schema changes. Existing `wunderland_email_synced_messages` table (if any records exist from the old SMTP test feature) is extended with new columns using `ensureColumnExists`.

---

## 15. NestJS Module Integration

### 15.1 Module Import Chain

`EmailIntelligenceModule` must be added to `WunderlandModule` imports carefully to avoid the documented startup hang pitfall.

**Imports (what EmailIntelligenceModule needs):**

- `CredentialsModule` — for encrypted credential access
- `MediaLibraryModule` — for attachment binary storage
- `CronModule` — for scheduling sync and digest jobs. Uses `CronJobService` CRUD API (`createJob`, `updateJob`, `toggleJob`) to persist jobs to `wunderland_cron_jobs` table with `schedule_kind: 'every'` and `payload_kind: 'email_sync'` or `'email_digest'`. **Not** decorator-based `@Cron()` — all jobs are persisted DB records tied to specific agents.
- `ChannelsModule` — for `ChannelTokenRefreshService` (Gmail token refresh)

**Does NOT import:**

- `OrchestrationModule` — does NOT import this module. Email intelligence uses its own `EmailVectorMemoryService` (see section 3.0.4) which directly instantiates `@framers/agentos` RAG classes (`RetrievalAugmentor`, `EmbeddingManager`, `VectorStoreManager`) without going through `WunderlandVectorMemoryService`. This avoids the circular dependency entirely and allows per-agent email-specific collections.
- `EmailIntegrationModule` (existing SMTP module) — coexists independently. Old SMTP endpoints at `/wunderland/email/*` (with `seedId` in query/body, per existing convention) remain unchanged. New email intelligence endpoints use `/wunderland/email-intelligence/*` with `seedId` in query/body to match the same convention.

**Registration in WunderlandModule:**

```typescript
// In wunderland.module.ts — add to imports array AFTER CredentialsModule and MediaLibraryModule
EmailIntelligenceModule,
```

### 15.2 Coexistence with Existing Email Module

The existing `EmailIntegrationModule` (`backend/src/modules/wunderland/email/`) handles outbound SMTP only. It continues to function independently:

- `GET /wunderland/email/status?seedId=X` — SMTP credential status (unchanged)
- `POST /wunderland/email/test` (seedId in body) — send test email (unchanged)

The new `EmailIntelligenceModule` handles inbound sync, intelligence, and RAG. The dashboard UI merges both: the email settings page includes SMTP config (from old module) and Gmail OAuth (from new module).

---

## 16. Rate Limiting & Cost Controls

### 16.1 LLM-Intensive Endpoint Limits

Several endpoints trigger LLM calls. Rate limits prevent runaway costs:

| Endpoint                           | Rate Limit              | Reason                                 |
| ---------------------------------- | ----------------------- | -------------------------------------- |
| `POST /query` (RAG query)          | 30 per hour per agent   | Each call embeds query + runs LLM      |
| `GET /projects/:id/summary`        | 10 per hour per project | Full LLM summary generation            |
| `POST /projects/detect`            | 3 per hour per agent    | Clusters + LLM naming for each cluster |
| `POST /attachments/:id/transcribe` | 20 per hour per agent   | Vision LLM call per image              |
| `POST /reports/*`                  | 5 per hour per agent    | LLM summary + formatting               |
| `POST /digests/:id/send-now`       | 3 per hour per digest   | LLM summary + delivery                 |

Implemented via SQLite-backed rate counter table (`wunderland_email_rate_limits`: `seed_id`, `endpoint`, `window_start`, `count`). Persists across restarts and is consistent in single-worker deployments. Returns `429 Too Many Requests` with `Retry-After` header when exceeded. For multi-worker deployments, can be replaced with Redis counters.

### 16.2 Sync Quota Protection

- Gmail API quota tracked per account: max 250 units/second
- Full sync capped at `maxMessages` (default 5000) to limit initial cost
- Incremental sync is inherently cheap (~2-10 API units per poll)

---

## 17. Demo Mode & Paywall

### 17.1 Demo Mode Pattern

Following the existing Rabbithole demo mode convention documented in project memory:

```typescript
const showDemo = isDemo || (ready && isAuthenticated && !isPaid);
```

When `showDemo` is true:

- Load from `DEMO_EMAIL_THREADS`, `DEMO_PROJECTS`, `DEMO_ATTACHMENTS` (defined in `@/lib/demo-data.ts`)
- Never call email intelligence API
- Show demo banner with sign-in / upgrade CTA
- Only paid users get live API data and can connect Gmail accounts

### 17.2 Demo Data

Static demo data includes:

- 3 sample threads with realistic hierarchy (linear, forked, merged)
- 2 auto-detected projects with sample summaries and timelines
- 5 sample attachments (mix of PDF, image, DOCX)
- Pre-generated project summary and timeline data

---

## 18. Sync Progress Reporting

### 18.1 Initial Sync Progress

A full sync of 5000 messages takes ~100 seconds. The UI needs progress feedback:

- `GET /accounts/:accountId/status` returns sync state from the **persistent** `sync_state` and `sync_progress_json` columns on `wunderland_email_accounts` — not in-memory state. This survives server restarts.
- The sync service updates these columns after each batch:
  ```typescript
  // Written to sync_progress_json column:
  {
    totalMessages?: number;      // estimated total
    syncedMessages?: number;     // downloaded so far
    indexedMessages?: number;    // RAG indexed so far
    startedAt?: number;          // epoch ms
    estimatedCompletionAt?: number;
  }
  // Written to sync_state column:
  'idle' | 'syncing' | 'indexing' | 'complete' | 'error'
  // Written to last_sync_error column (if error):
  'OAuth token expired' | 'Rate limit exceeded' | etc.
  ```
- Dashboard polls this endpoint every 3 seconds during initial sync
- Shows progress bar with message count

---

## 19. Data Retention & Cleanup

### 19.1 Retention Policy

Configurable per-agent, defaults:

| Data Type                 | Default Retention        | Configurable              |
| ------------------------- | ------------------------ | ------------------------- |
| Email messages            | 365 days                 | Yes                       |
| RAG embeddings            | Same as messages         | Tied to message retention |
| Attachment binaries       | 180 days (metadata kept) | Yes                       |
| Attachment extracted text | Same as messages         | Tied to message retention |
| Archived projects         | Indefinite               | Manual delete only        |
| Digest history            | 90 days                  | Yes                       |

### 19.2 Cleanup Job

A weekly cron job (via existing `CronScheduler`) runs `cleanupExpiredData(seedId)`:

1. Delete messages older than retention period
2. Remove corresponding RAG chunks
3. Delete attachment binaries past retention (keep metadata row with `extraction_status = 'expired'`)
4. Compact SQLite database (`VACUUM`)
5. Log cleanup stats

---

## 20. Design Decisions (Codex-Reviewed)

### 20.1 Open Questions — Answers

These three questions were raised by Codex during code-level spec review:

**Q1: Should the new intelligence tools run as internal backend capabilities, or do you explicitly want them callable from external AgentOS runtimes over HTTP?**

**A: Internal backend capabilities only.** The `@framers/agentos-ext-email-intelligence` tools call the backend via `X-Internal-Secret` header. They are NOT designed for external AgentOS runtimes over HTTP. Reasoning:

- The intelligence tools depend on synced state (indexed messages, thread hierarchies, project clusters) that only exists in the backend's SQLite database. An external runtime would need to replicate this state, defeating the purpose.
- External AgentOS runtimes that need email access should use the existing standalone Gmail extension (6 tools) which connects directly to the Gmail API using env-var credentials — no backend dependency.
- The backend is the single source of truth for email intelligence. Channel bots and the dashboard both query the same backend. Adding a third external path creates consistency risks.
- If external runtime support is ever needed, it can be added as a thin proxy layer without changing the internal architecture.

**Q2: Do you want to preserve the existing SMTP sent/draft history table as-is, or are you willing to rename/migrate it?**

**A: Preserve as-is.** The existing `wunderland_email_messages` table (SMTP sent/drafts) is untouched. The new synced-inbox table is `wunderland_email_synced_messages`. Reasoning:

- The SMTP table is actively used by `EmailIntegrationService` and the existing dashboard email page. Renaming it would break working functionality and require migrating the controller, service, and frontend API client.
- The two tables serve fundamentally different purposes: outbound message history (SMTP) vs. inbound synced inbox (Gmail API). Different schemas, different lifecycle, different consumers. Separate tables is the correct model.
- A future enhancement could unify them behind a view or query layer, but that's unnecessary for v1.

**Q3: Is v1 truly multi-provider, or should the first implementation narrow hard to Gmail and postpone the provider abstraction until after launch?**

**A: v1 is Gmail-only with a thin provider abstraction.** Only `gmail-provider.ts` is implemented. The `IEmailProvider` interface and `sync_cursor` (opaque blob) exist but IMAP provider follows as documented fast-follow. Reasoning:

- The abstraction cost is negligible — it's one interface file (`email-provider.interface.ts`) and using `sync_cursor` (opaque JSON string) instead of `historyId` (string). This adds maybe 20 lines of code.
- Without the abstraction, adding IMAP later means refactoring the sync service, the account table schema, and every place that references `historyId`. That's a much larger cost than getting the interface right from day one.
- The interface does NOT attempt to abstract Gmail-specific features (labels, thread grouping) — it keeps those as provider capabilities that IMAP simply won't implement. This avoids over-abstraction.
- The `sync_cursor` approach is proven — it's how Stripe, Slack, and most pagination/sync APIs work. Each provider owns its cursor format.

### 20.2 Architecture Decisions

Additional decisions made during spec review:

4. **Gmail extension is NOT refactored** — The existing `GmailService` in the extension and the backend's `gmail-provider.ts` are completely independent implementations. No shared code at launch. The extension resolves credentials from env vars/secrets; the backend reads from the encrypted credential vault. A future refactor could extract shared Gmail API logic but is not required.

5. **No OrchestrationModule dependency** — Email intelligence creates its own `EmailVectorMemoryService` using `@framers/agentos` RAG classes directly (`RetrievalAugmentor`, `EmbeddingManager`, `VectorStoreManager`), with per-agent collections (`email_bodies_{seedId}`, `email_attachments_{seedId}`). Does not import or depend on `WunderlandVectorMemoryService` which is hardwired to a single `wunderland_seed_memory` collection. This cleanly separates concerns and avoids circular module imports.

6. **Route convention matches existing** — `/wunderland/email-intelligence/*` with `seedId` in query/body, matching existing `/wunderland/email/*` pattern. NOT path-scoped (`/wunderland/agents/:seedId/...`). The frontend API client passes `seedId` the same way it does for the existing email endpoints.

7. **Credential schema migration is a prerequisite, not optional** — Adding `metadata` and `expires_at` columns to `wunderbot_credentials` fixes a latent bug that affects ALL OAuth token refresh (Slack, Discord, and now Gmail). This migration must land before or alongside the email intelligence feature, but benefits the entire platform.

---

## 21. Known Limitations

- **Thread reconstruction for external replies:** If a reply was sent from an account not connected to this agent, the `In-Reply-To` header references a `Message-ID` not in our database. These messages appear as thread roots rather than children. This is inherent to any single-side email indexing system.
- **Cross-account threading:** Two connected accounts may both have messages in the same thread. The system deduplicates by `message_id_header` (RFC 2822 Message-ID) but displays them under whichever account synced them first.
- **Gmail subject-based threading:** Gmail's `threadId` groups by subject similarity, which can create false groupings. Our RFC 2822 hierarchy reconstruction corrects this but the `thread_id` column still stores Gmail's grouping for efficient sync.
- **Thread identity is account-scoped:** Thread IDs are provider-specific. All thread-related API routes require `accountId` as a query parameter. Project-thread associations use `(project_id, thread_id, account_id)` composite key.

---

## 22. Future Enhancements (Out of Scope)

- **Gmail Push Notifications** — Pub/Sub webhook for real-time sync (eliminates polling)
- **Microsoft Graph API** — Dedicated Outlook/Exchange provider
- **Generic IMAP Provider** — For ProtonMail, FastMail, self-hosted (fast-follow after launch)
- **AI Auto-Draft** — Generate reply drafts based on context and user style
- **Smart Labels** — Auto-label emails based on project/topic detection
- **Email Analytics** — Response time trends, busiest hours, communication patterns over time
- **Shared Projects** — Multiple users collaborating on the same project view
- **Calendar Correlation** — Link email threads to calendar events
