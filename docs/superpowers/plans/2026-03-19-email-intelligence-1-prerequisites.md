# Email Intelligence — Plan 1: Prerequisites & Schema Migrations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix existing schema gaps and add new tables required by the Email Intelligence feature.

**Architecture:** Four schema migrations (credential metadata, media-library provenance, rate-limit table, email intelligence tables) applied via the existing `ensureColumnExists` + `CREATE TABLE IF NOT EXISTS` pattern in `appDatabase.ts`. Also updates `CredentialsService` and `MediaLibraryService` to support new columns.

**Tech Stack:** SQLite, NestJS, TypeScript, Vitest

**Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md` (Sections 3.0.1–3.0.3, 4.1)

---

### Task 1: Add `metadata` and `expires_at` columns to `wunderbot_credentials`

**Files:**

- Modify: `backend/src/core/database/appDatabase.ts` (ensureColumnExists block, after line ~866)
- Modify: `backend/src/modules/wunderland/credentials/credentials.service.ts` (createCredential method)
- Modify: `backend/src/modules/wunderland/dto/credentials.dto.ts` (add optional fields)
- Test: `backend/src/modules/wunderland/credentials/__tests__/credentials-metadata.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/credentials/__tests__/credentials-metadata.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('CredentialsService metadata support', () => {
  it('should store and retrieve metadata JSON on a credential', async () => {
    // This test will fail because createCredential doesn't accept metadata yet
    const result = await credentialsService.createCredential(testUserId, {
      seedId: testSeedId,
      type: 'google_oauth_token',
      label: 'Gmail: test@gmail.com',
      value: 'encrypted-access-token',
      metadata: JSON.stringify({ refreshToken: 'rt_123', expiresAt: Date.now() + 3600000 }),
      expiresAt: Date.now() + 3600000,
    });
    expect(result.credential).toBeDefined();
    expect(result.credential.credential_id).toBeTruthy();

    // Retrieve and verify metadata persisted
    const row = await db.get(
      'SELECT metadata, expires_at FROM wunderbot_credentials WHERE credential_id = ?',
      [result.credential.credential_id]
    );
    expect(row.metadata).toContain('refreshToken');
    expect(row.expires_at).toBeGreaterThan(Date.now());
  });

  it('should allow null metadata for backward compatibility', async () => {
    const result = await credentialsService.createCredential(testUserId, {
      seedId: testSeedId,
      type: 'smtp_host',
      label: 'SMTP Host',
      value: 'smtp.gmail.com',
    });
    const row = await db.get(
      'SELECT metadata, expires_at FROM wunderbot_credentials WHERE credential_id = ?',
      [result.credential.credential_id]
    );
    expect(row.metadata).toBeNull();
    expect(row.expires_at).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/credentials/__tests__/credentials-metadata.spec.ts`
Expected: FAIL — `metadata` column doesn't exist, `createCredential` doesn't accept metadata param

- [ ] **Step 3: Add columns to appDatabase.ts**

In `backend/src/core/database/appDatabase.ts`, find the `wunderbot_credentials` ensureColumnExists block (after line ~866) and add:

```typescript
// After existing wunderbot_credentials ensureColumnExists calls
await ensureColumnExists(db, 'wunderbot_credentials', 'metadata', 'TEXT DEFAULT NULL');
await ensureColumnExists(db, 'wunderbot_credentials', 'expires_at', 'BIGINT DEFAULT NULL');
```

- [ ] **Step 4: Update CreateCredentialDto**

In `backend/src/modules/wunderland/dto/credentials.dto.ts`, add optional fields:

```typescript
@IsOptional()
@IsString()
metadata?: string;  // JSON blob: { refreshToken, expiresAt, lastRefreshAttempt, lastRefreshError }

@IsOptional()
@IsNumber()
expiresAt?: number;  // Epoch ms — when the access token expires
```

- [ ] **Step 5: Update CredentialsService.createCredential()**

In `backend/src/modules/wunderland/credentials/credentials.service.ts`, modify the INSERT to include metadata and expires_at:

```typescript
// In the createCredential method, update the INSERT statement:
await this.db.run(
  `INSERT INTO wunderbot_credentials
    (credential_id, seed_id, owner_user_id, credential_type, label,
     encrypted_value, masked_value, metadata, expires_at, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    credentialId,
    dto.seedId,
    userId,
    dto.type,
    dto.label ?? null,
    encrypted,
    masked,
    dto.metadata ?? null,
    dto.expiresAt ?? null,
    now,
    now,
  ]
);
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/credentials/__tests__/credentials-metadata.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/src/core/database/appDatabase.ts backend/src/modules/wunderland/credentials/credentials.service.ts backend/src/modules/wunderland/dto/credentials.dto.ts backend/src/modules/wunderland/credentials/__tests__/credentials-metadata.spec.ts
git commit -m "feat(credentials): add metadata and expires_at columns to wunderbot_credentials

Fixes latent bug where ChannelTokenRefreshService queries these columns but they
don't exist in the schema. Required for Gmail OAuth token storage."
```

---

### Task 2: Add provenance columns to `wunderland_media_assets`

**Files:**

- Modify: `backend/src/core/database/appDatabase.ts` (ensureColumnExists block for media_assets)
- Modify: `backend/src/modules/wunderland/media-library/media-library.service.ts` (upload method)
- Test: `backend/src/modules/wunderland/media-library/__tests__/media-provenance.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/media-library/__tests__/media-provenance.spec.ts
import { describe, it, expect } from 'vitest';

describe('MediaLibraryService provenance', () => {
  it('should store source_type and source_ref on upload', async () => {
    const result = await mediaLibraryService.upload({
      seedId: testSeedId,
      ownerUserId: testUserId,
      file: Buffer.from('test pdf content'),
      originalName: 'timeline-v3.pdf',
      mimeType: 'application/pdf',
      tags: ['email-attachment'],
      sourceType: 'email_attachment',
      sourceRef: JSON.stringify({ messageId: 'msg_1', threadId: 'thread_1', accountId: 'acc_1' }),
    });

    const row = await db.get(
      'SELECT source_type, source_ref FROM wunderland_media_assets WHERE id = ?',
      [result.id]
    );
    expect(row.source_type).toBe('email_attachment');
    expect(JSON.parse(row.source_ref).messageId).toBe('msg_1');
  });

  it('should allow null provenance for backward compatibility', async () => {
    const result = await mediaLibraryService.upload({
      seedId: testSeedId,
      ownerUserId: testUserId,
      file: Buffer.from('test'),
      originalName: 'photo.jpg',
      mimeType: 'image/jpeg',
    });

    const row = await db.get(
      'SELECT source_type, source_ref FROM wunderland_media_assets WHERE id = ?',
      [result.id]
    );
    expect(row.source_type).toBeNull();
    expect(row.source_ref).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/media-library/__tests__/media-provenance.spec.ts`
Expected: FAIL — columns don't exist, upload doesn't accept sourceType/sourceRef

- [ ] **Step 3: Add columns to appDatabase.ts**

```typescript
// After existing wunderland_media_assets ensureColumnExists calls
await ensureColumnExists(db, 'wunderland_media_assets', 'source_type', 'TEXT DEFAULT NULL');
await ensureColumnExists(db, 'wunderland_media_assets', 'source_ref', 'TEXT DEFAULT NULL');
```

- [ ] **Step 4: Update UploadMediaInput interface and upload method**

In `backend/src/modules/wunderland/media-library/media-library.service.ts`:

```typescript
export interface UploadMediaInput {
  seedId: string;
  ownerUserId: string;
  file: Buffer;
  originalName: string;
  mimeType: string;
  tags?: string[];
  sourceType?: string; // 'email_attachment' | 'social_post' | 'upload'
  sourceRef?: string; // JSON: { messageId, threadId, accountId, projectIds }
}
```

Update the INSERT in the upload method to include `source_type` and `source_ref`.

- [ ] **Step 5: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/media-library/__tests__/media-provenance.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/src/core/database/appDatabase.ts backend/src/modules/wunderland/media-library/media-library.service.ts backend/src/modules/wunderland/media-library/__tests__/media-provenance.spec.ts
git commit -m "feat(media-library): add source_type and source_ref provenance columns

Enables tracking where media assets came from (email attachments, social posts, etc.)
Required for email attachment → media library linking."
```

---

### Task 3: Create email intelligence tables

**Files:**

- Modify: `backend/src/core/database/appDatabase.ts` (add new table creation block)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-tables.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-tables.spec.ts
import { describe, it, expect } from 'vitest';

describe('Email Intelligence tables', () => {
  it('should create wunderland_email_accounts table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_accounts'"
    );
    expect(result).toBeDefined();
    expect(result.name).toBe('wunderland_email_accounts');
  });

  it('should create wunderland_email_synced_messages table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_synced_messages'"
    );
    expect(result).toBeDefined();
  });

  it('should create wunderland_email_attachments table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_attachments'"
    );
    expect(result).toBeDefined();
  });

  it('should create wunderland_email_projects table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_projects'"
    );
    expect(result).toBeDefined();
  });

  it('should create wunderland_email_project_threads table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_project_threads'"
    );
    expect(result).toBeDefined();
  });

  it('should create wunderland_email_digests table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_digests'"
    );
    expect(result).toBeDefined();
  });

  it('should create wunderland_email_rate_limits table', async () => {
    const result = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='wunderland_email_rate_limits'"
    );
    expect(result).toBeDefined();
  });

  it('should enforce unique constraint on email_accounts (seed_id, email_address)', async () => {
    const now = Date.now();
    await db.run(
      `INSERT INTO wunderland_email_accounts (id, seed_id, owner_user_id, provider, email_address, credential_id, created_at, updated_at)
       VALUES ('acc1', 'seed1', 'user1', 'gmail', 'test@gmail.com', 'cred1', ?, ?)`,
      [now, now]
    );
    await expect(
      db.run(
        `INSERT INTO wunderland_email_accounts (id, seed_id, owner_user_id, provider, email_address, credential_id, created_at, updated_at)
       VALUES ('acc2', 'seed1', 'user1', 'gmail', 'test@gmail.com', 'cred2', ?, ?)`,
        [now, now]
      )
    ).rejects.toThrow(/UNIQUE/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-tables.spec.ts`
Expected: FAIL — tables don't exist

- [ ] **Step 3: Add all email intelligence tables to appDatabase.ts**

Add the following block in `backend/src/core/database/appDatabase.ts` after the existing email messages table block (~line 474):

```typescript
// ── Email Intelligence tables ──────────────────────────────────────
await db.exec(`
  CREATE TABLE IF NOT EXISTS wunderland_email_accounts (
    id TEXT PRIMARY KEY,
    seed_id TEXT NOT NULL,
    owner_user_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    email_address TEXT NOT NULL,
    display_name TEXT,
    credential_id TEXT NOT NULL,
    sync_cursor TEXT,
    last_full_sync_at BIGINT,
    sync_interval_ms INTEGER DEFAULT 300000,
    sync_enabled INTEGER DEFAULT 1,
    sync_state TEXT DEFAULT 'idle',
    sync_progress_json TEXT,
    last_sync_error TEXT,
    total_messages_synced INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    UNIQUE(seed_id, email_address)
  );

  CREATE INDEX IF NOT EXISTS idx_email_accounts_seed
    ON wunderland_email_accounts(seed_id, is_active);

  CREATE TABLE IF NOT EXISTS wunderland_email_synced_messages (
    id TEXT PRIMARY KEY,
    provider_message_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    thread_id TEXT NOT NULL,
    message_id_header TEXT,
    subject TEXT,
    from_address TEXT NOT NULL,
    from_name TEXT,
    to_addresses TEXT,
    cc_addresses TEXT,
    bcc_addresses TEXT,
    body_text TEXT,
    body_html TEXT,
    body_html_media_id TEXT,
    snippet TEXT,
    internal_date BIGINT NOT NULL,
    received_date BIGINT,
    labels TEXT,
    is_read INTEGER DEFAULT 0,
    is_starred INTEGER DEFAULT 0,
    is_draft INTEGER DEFAULT 0,
    in_reply_to TEXT,
    references_header TEXT,
    parent_message_id TEXT,
    thread_depth INTEGER DEFAULT 0,
    thread_position INTEGER DEFAULT 0,
    has_attachments INTEGER DEFAULT 0,
    attachment_count INTEGER DEFAULT 0,
    size_bytes INTEGER,
    rag_indexed_at BIGINT,
    rag_chunk_ids TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_email_messages_provider_id
    ON wunderland_email_synced_messages(account_id, provider_message_id);
  CREATE INDEX IF NOT EXISTS idx_email_messages_account_thread
    ON wunderland_email_synced_messages(account_id, thread_id);
  CREATE INDEX IF NOT EXISTS idx_email_messages_internal_date
    ON wunderland_email_synced_messages(internal_date);
  CREATE INDEX IF NOT EXISTS idx_email_messages_from
    ON wunderland_email_synced_messages(from_address);
  CREATE INDEX IF NOT EXISTS idx_email_messages_rag_indexed
    ON wunderland_email_synced_messages(rag_indexed_at);
  CREATE INDEX IF NOT EXISTS idx_email_messages_message_id_header
    ON wunderland_email_synced_messages(message_id_header);

  CREATE TABLE IF NOT EXISTS wunderland_email_attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    gmail_attachment_id TEXT,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER,
    content_id TEXT,
    is_inline INTEGER DEFAULT 0,
    media_library_id TEXT,
    extraction_status TEXT DEFAULT 'pending',
    extracted_text TEXT,
    multimodal_description TEXT,
    extraction_error TEXT,
    rag_indexed_at BIGINT,
    rag_chunk_ids TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_email_attachments_message
    ON wunderland_email_attachments(message_id);
  CREATE INDEX IF NOT EXISTS idx_email_attachments_extraction
    ON wunderland_email_attachments(extraction_status);
  CREATE INDEX IF NOT EXISTS idx_email_attachments_mime
    ON wunderland_email_attachments(mime_type);

  CREATE TABLE IF NOT EXISTS wunderland_email_projects (
    id TEXT PRIMARY KEY,
    seed_id TEXT NOT NULL,
    owner_user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    auto_detected INTEGER DEFAULT 0,
    detection_confidence REAL,
    detection_method TEXT,
    participant_emails TEXT,
    thread_count INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    attachment_count INTEGER DEFAULT 0,
    last_activity_at BIGINT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_email_projects_seed
    ON wunderland_email_projects(seed_id, status);

  CREATE TABLE IF NOT EXISTS wunderland_email_project_threads (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    thread_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    added_by TEXT NOT NULL,
    confidence REAL,
    added_at BIGINT NOT NULL,
    UNIQUE(project_id, thread_id, account_id)
  );

  CREATE TABLE IF NOT EXISTS wunderland_email_digests (
    id TEXT PRIMARY KEY,
    seed_id TEXT NOT NULL,
    owner_user_id TEXT NOT NULL,
    name TEXT,
    schedule TEXT NOT NULL,
    format TEXT DEFAULT 'markdown',
    delivery_channel TEXT NOT NULL,
    delivery_target TEXT NOT NULL,
    filter_projects TEXT,
    filter_accounts TEXT,
    include_attachments INTEGER DEFAULT 0,
    include_timeline INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    last_sent_at BIGINT,
    cron_job_id TEXT,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wunderland_email_rate_limits (
    seed_id TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    window_start BIGINT NOT NULL,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (seed_id, endpoint, window_start)
  );
`);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-tables.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/core/database/appDatabase.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-tables.spec.ts
git commit -m "feat(email-intelligence): create all email intelligence SQLite tables

Tables: email_accounts, email_synced_messages, email_attachments,
email_projects, email_project_threads, email_digests, email_rate_limits"
```

---

### Task 4: Create `EmailIntelligenceModule` skeleton and register in WunderlandModule

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts`
- Modify: `backend/src/modules/wunderland/wunderland.module.ts` (add to imports)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-module.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-module.spec.ts
import { describe, it, expect } from 'vitest';
import { EmailIntelligenceModule } from '../email-intelligence.module';

describe('EmailIntelligenceModule', () => {
  it('should be defined', () => {
    expect(EmailIntelligenceModule).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-intelligence-module.spec.ts`
Expected: FAIL — module doesn't exist

- [ ] **Step 3: Create the module**

```typescript
// backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts
import { Module } from '@nestjs/common';
import { CredentialsModule } from '../credentials/credentials.module';
import { MediaLibraryModule } from '../media-library/media-library.module';
import { CronModule } from '../cron/cron.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [CredentialsModule, MediaLibraryModule, CronModule, ChannelsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class EmailIntelligenceModule {}
```

- [ ] **Step 4: Register in WunderlandModule**

In `backend/src/modules/wunderland/wunderland.module.ts`, add import and registration:

```typescript
import { EmailIntelligenceModule } from './email-intelligence/email-intelligence.module';

// In the imports array, after EmailIntegrationModule:
EmailIntelligenceModule,
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-intelligence-module.spec.ts`
Expected: PASS

- [ ] **Step 6: Verify backend starts without hanging**

Run: `cd backend && timeout 15 npx tsx --tsconfig tsconfig.json src/main.ts`
Expected: Server starts and begins listening (exits after timeout). No hang. This catches the documented WunderlandModule startup hang pitfall.

- [ ] **Step 7: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts backend/src/modules/wunderland/wunderland.module.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-module.spec.ts
git commit -m "feat(email-intelligence): create module skeleton and register in WunderlandModule

Empty module with CredentialsModule, MediaLibraryModule, CronModule, ChannelsModule imports.
Verified no startup hang."
```

---

## Appendix A: Test Scaffolding

All test files in this plan need a shared setup pattern. Use this as the base for each test file:

```typescript
// Shared test setup pattern for all email-intelligence tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { initializeDatabase } from '../../../../core/database/appDatabase';

// Test constants
const testUserId = 'test-user-001';
const testSeedId = 'test-seed-001';

let rawDb: any;
let db: { run: Function; get: Function; all: Function; generateId: Function };

beforeEach(async () => {
  // Create in-memory SQLite database with full schema
  rawDb = new Database(':memory:');

  // Wrap in the same interface used by DatabaseService
  db = {
    run: (sql: string, params?: any[]) => rawDb.prepare(sql).run(...(params ?? [])),
    get: (sql: string, params?: any[]) => rawDb.prepare(sql).get(...(params ?? [])),
    all: (sql: string, params?: any[]) => rawDb.prepare(sql).all(...(params ?? [])),
    generateId: () => `id_${Math.random().toString(36).slice(2)}`,
  };

  // Initialize full schema (runs all CREATE TABLE IF NOT EXISTS)
  await initializeDatabase(rawDb);

  // Insert required foreign key records
  rawDb
    .prepare(`INSERT INTO app_users (id, display_name, created_at) VALUES (?, ?, ?)`)
    .run(testUserId, 'Test User', Date.now());
  rawDb
    .prepare(
      `INSERT INTO wunderbots (seed_id, owner_user_id, display_name, status, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?)`
    )
    .run(testSeedId, testUserId, 'Test Bot', Date.now(), Date.now());
});

afterEach(() => {
  rawDb?.close();
});
```

For service tests, instantiate the service after db setup:

```typescript
// For CredentialsService tests:
import { CredentialsService } from '../credentials.service';
let credentialsService: CredentialsService;
// In beforeEach, after db setup:
credentialsService = new CredentialsService(db as any);

// For MediaLibraryService tests:
import { MediaLibraryService } from '../media-library.service';
let mediaLibraryService: MediaLibraryService;
// In beforeEach, after db setup:
mediaLibraryService = new MediaLibraryService(db as any);
```

**Note on BIGINT vs INTEGER:** The plan uses `BIGINT` for epoch timestamp columns, matching the existing `wunderbot_credentials` table convention. SQLite treats both identically (dynamic typing). The spec uses `INTEGER` notation but the actual codebase uses `BIGINT`. Follow the codebase convention.

---

## Scope

This plan covers **spec sections 3.0.1, 3.0.2, 3.0.3, and 4.1** (prerequisites and data model). The following are explicitly deferred to later plans:

| Spec Section                                     | Covered In                  |
| ------------------------------------------------ | --------------------------- |
| 3.0.4 EmailVectorMemoryService                   | Plan 3 (Intelligence Layer) |
| 3.0.5 Extension Auth Contract                    | Plan 5 (Extension Pack)     |
| 4, 5.1, 5.2, 6 Provider/Sync/Thread/OAuth        | Plan 2 (Backend Core)       |
| 5.3-5.7 Projects/RAG/Attachments/Reports/Digests | Plans 3-4                   |
| 8 Dashboard UI                                   | Plan 6                      |
| 16 Rate Limiting (logic)                         | Plan 3                      |
| 17 Demo Mode                                     | Plan 6                      |
| 19 Data Retention                                | Plan 4                      |
