# Email Intelligence — Plan 2: Backend Core (Provider + Sync + Threads + OAuth)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Gmail provider, email sync service, thread hierarchy reconstruction, and Gmail OAuth flow so that a Wunderbot can connect a Gmail inbox and sync messages with proper threading.

**Architecture:** `IEmailProvider` interface → `GmailProvider` implementation → `EmailSyncService` orchestrates polling → `EmailThreadService` reconstructs hierarchies → `EmailIntelligenceController` exposes REST API. Gmail OAuth extends existing `channel-oauth` controller/service.

**Tech Stack:** TypeScript, NestJS, googleapis, google-auth-library, SQLite, Vitest

**Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md` (Sections 4, 5.1, 5.2, 6)

**Prerequisite:** Plan 1 (Prerequisites & Schema Migrations) must be complete.

---

### Task 1: Define `IEmailProvider` interface and types

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/providers/email-provider.interface.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-provider-types.spec.ts`

- [ ] **Step 1: Write the type validation test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-provider-types.spec.ts
import { describe, it, expect } from 'vitest';
import type {
  IEmailProvider,
  EmailMessage,
  EmailDraft,
  FullSyncOptions,
  IncrementalSyncResult,
} from '../providers/email-provider.interface';

describe('IEmailProvider types', () => {
  it('should define EmailMessage with all required fields', () => {
    const msg: EmailMessage = {
      id: 'msg_1',
      threadId: 'thread_1',
      messageIdHeader: '<abc@gmail.com>',
      inReplyTo: null,
      referencesHeader: [],
      subject: 'Test',
      from: { email: 'a@b.com', name: 'Alice' },
      to: [{ email: 'b@c.com', name: 'Bob' }],
      cc: [],
      bcc: [],
      bodyText: 'Hello',
      bodyHtml: '<p>Hello</p>',
      snippet: 'Hello',
      internalDate: Date.now(),
      receivedDate: Date.now(),
      labels: ['INBOX'],
      isRead: false,
      isStarred: false,
      isDraft: false,
      sizeBytes: 1024,
      attachments: [],
    };
    expect(msg.id).toBe('msg_1');
    expect(msg.from.email).toBe('a@b.com');
  });

  it('should define IncrementalSyncResult with opaque cursor', () => {
    const result: IncrementalSyncResult = {
      newMessages: [],
      modifiedMessageIds: [],
      deletedMessageIds: [],
      newCursor: JSON.stringify({ historyId: '12345' }),
    };
    expect(JSON.parse(result.newCursor).historyId).toBe('12345');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-provider-types.spec.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create the interface file**

```typescript
// backend/src/modules/wunderland/email-intelligence/providers/email-provider.interface.ts

export interface EmailAddress {
  email: string;
  name: string | null;
}

export interface EmailAttachmentMeta {
  attachmentId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  contentId: string | null;
  isInline: boolean;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  messageIdHeader: string;
  inReplyTo: string | null;
  referencesHeader: string[];
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  bodyText: string | null;
  bodyHtml: string | null;
  snippet: string;
  internalDate: number;
  receivedDate: number | null;
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  sizeBytes: number;
  attachments: EmailAttachmentMeta[];
}

export interface EmailDraft {
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  attachments?: Array<{ filename: string; mimeType: string; content: Buffer }>;
  inReplyTo?: string;
  references?: string[];
}

export interface EmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageCount: number;
  unreadCount: number;
}

export interface FullSyncOptions {
  maxMessages?: number;
  afterDate?: Date;
  labelFilter?: string[];
  batchSize?: number;
}

export interface IncrementalSyncResult {
  newMessages: EmailMessage[];
  modifiedMessageIds: string[];
  deletedMessageIds: string[];
  newCursor: string;
}

export interface IEmailProvider {
  readonly providerId: string;
  readonly displayName: string;

  initialize(credentials: {
    accessToken: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;
  }): Promise<void>;
  shutdown(): Promise<void>;
  testConnection(): Promise<{ ok: boolean; error?: string }>;

  fullSync(options: FullSyncOptions): AsyncGenerator<EmailMessage[]>;
  incrementalSync(cursor: string): Promise<IncrementalSyncResult>;
  getCurrentCursor(): Promise<string>;

  getMessage(messageId: string): Promise<EmailMessage>;
  getThread(threadId: string): Promise<EmailMessage[]>;
  getAttachmentContent(messageId: string, attachmentId: string): Promise<Buffer>;

  sendMessage(draft: EmailDraft): Promise<{ messageId: string; threadId: string }>;
  replyToMessage(messageId: string, draft: EmailDraft): Promise<{ messageId: string }>;
  modifyLabels(messageId: string, add: string[], remove: string[]): Promise<void>;
  markAsRead(messageId: string): Promise<void>;
  archiveMessage(messageId: string): Promise<void>;
  trashMessage(messageId: string): Promise<void>;

  search(query: string, maxResults?: number): Promise<EmailMessage[]>;
  listLabels(): Promise<EmailLabel[]>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-provider-types.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/providers/email-provider.interface.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-provider-types.spec.ts
git commit -m "feat(email-intelligence): define IEmailProvider interface and types

Provider-agnostic interface with opaque sync cursor. Gmail implements at launch,
IMAP follows as fast-follow."
```

---

### Task 2: Implement `GmailProvider`

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/providers/gmail-provider.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/gmail-provider.spec.ts`

**Docs to check:**

- Existing GmailService: `packages/agentos-extensions/registry/curated/productivity/gmail/src/GmailService.ts` (for MIME parsing reference)
- googleapis types: `gmail_v1.Schema$Message`, `gmail_v1.Schema$MessagePart`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/gmail-provider.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GmailProvider } from '../providers/gmail-provider';

// Mock googleapis
vi.mock('googleapis', () => ({
  google: {
    gmail: vi.fn(() => ({
      users: {
        messages: {
          list: vi.fn(),
          get: vi.fn(),
        },
        history: {
          list: vi.fn(),
        },
        labels: {
          list: vi.fn(),
        },
      },
    })),
  },
}));

describe('GmailProvider', () => {
  let provider: GmailProvider;

  beforeEach(() => {
    provider = new GmailProvider();
  });

  it('should have providerId "gmail"', () => {
    expect(provider.providerId).toBe('gmail');
  });

  it('should initialize with OAuth credentials', async () => {
    await provider.initialize({
      accessToken: 'at_123',
      refreshToken: 'rt_123',
      clientId: 'cid',
      clientSecret: 'cs',
    });
    const result = await provider.testConnection();
    expect(result.ok).toBe(true);
  });

  it('should return opaque cursor as JSON with historyId', async () => {
    await provider.initialize({
      accessToken: 'at_123',
      refreshToken: 'rt_123',
      clientId: 'cid',
      clientSecret: 'cs',
    });
    const cursor = await provider.getCurrentCursor();
    const parsed = JSON.parse(cursor);
    expect(parsed).toHaveProperty('historyId');
  });

  it('should parse Gmail message into EmailMessage format', () => {
    // Test the internal parseMessage method
    const gmailMsg = {
      id: 'msg_1',
      threadId: 'thread_1',
      internalDate: '1710000000000',
      labelIds: ['INBOX', 'UNREAD'],
      sizeEstimate: 2048,
      snippet: 'Hello world',
      payload: {
        headers: [
          { name: 'From', value: 'Alice <alice@test.com>' },
          { name: 'To', value: 'Bob <bob@test.com>' },
          { name: 'Subject', value: 'Test Subject' },
          { name: 'Message-ID', value: '<abc123@mail.gmail.com>' },
          { name: 'In-Reply-To', value: '<parent@mail.gmail.com>' },
          { name: 'References', value: '<root@mail.gmail.com> <parent@mail.gmail.com>' },
          { name: 'Date', value: 'Fri, 8 Mar 2024 10:00:00 +0000' },
        ],
        mimeType: 'text/plain',
        body: { data: Buffer.from('Hello world').toString('base64url') },
        parts: [],
      },
    };
    const parsed = (provider as any).parseMessage(gmailMsg);
    expect(parsed.id).toBe('msg_1');
    expect(parsed.from.email).toBe('alice@test.com');
    expect(parsed.from.name).toBe('Alice');
    expect(parsed.subject).toBe('Test Subject');
    expect(parsed.messageIdHeader).toBe('<abc123@mail.gmail.com>');
    expect(parsed.inReplyTo).toBe('<parent@mail.gmail.com>');
    expect(parsed.referencesHeader).toEqual(['<root@mail.gmail.com>', '<parent@mail.gmail.com>']);
    expect(parsed.bodyText).toBe('Hello world');
    expect(parsed.isRead).toBe(false); // UNREAD label present
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/gmail-provider.spec.ts`
Expected: FAIL — GmailProvider doesn't exist

- [ ] **Step 3: Implement GmailProvider**

Create `backend/src/modules/wunderland/email-intelligence/providers/gmail-provider.ts` implementing `IEmailProvider`. Key methods:

- `initialize()` — create `OAuth2Client`, set credentials, instantiate `gmail_v1.Gmail`
- `parseMessage()` — private method converting `gmail_v1.Schema$Message` to `EmailMessage` (parse headers for From/To/Subject/Message-ID/In-Reply-To/References, decode base64url body, extract attachment metadata from payload parts)
- `parseEmailAddress()` — parse `"Name <email>"` format
- `fullSync()` — `async function*` using `messages.list()` with pagination, yielding batches of parsed messages
- `incrementalSync()` — use `history.list(startHistoryId)`, return new/modified/deleted
- `getCurrentCursor()` — `JSON.stringify({ historyId })`
- `testConnection()` — call `labels.list()` as a health check

Reference the existing `GmailService.ts` MIME parsing logic but implement independently (no shared code per spec decision).

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/gmail-provider.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/providers/gmail-provider.ts backend/src/modules/wunderland/email-intelligence/__tests__/gmail-provider.spec.ts
git commit -m "feat(email-intelligence): implement GmailProvider with MIME parsing

Gmail API v1 implementation of IEmailProvider. Handles message parsing,
full sync with pagination, incremental sync via history.list, and opaque cursor."
```

---

### Task 3: Implement `EmailThreadService`

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-thread.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-thread.service.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-thread.service.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { EmailThreadService } from '../services/email-thread.service';

describe('EmailThreadService', () => {
  let service: EmailThreadService;
  // Mock db with in-memory message store

  describe('reconstructThread', () => {
    it('should reconstruct a linear reply chain', async () => {
      // Insert 3 messages: A → B → C (linear chain)
      // A: Message-ID=<a>, no In-Reply-To
      // B: Message-ID=<b>, In-Reply-To=<a>
      // C: Message-ID=<c>, In-Reply-To=<b>
      const hierarchy = await service.reconstructThread('acc_1', 'thread_1');
      expect(hierarchy.rootMessages).toHaveLength(1);
      expect(hierarchy.rootMessages[0].messageId).toBe('msg_a');
      expect(hierarchy.rootMessages[0].children).toHaveLength(1);
      expect(hierarchy.rootMessages[0].children[0].messageId).toBe('msg_b');
      expect(hierarchy.rootMessages[0].children[0].children).toHaveLength(1);
      expect(hierarchy.rootMessages[0].children[0].children[0].messageId).toBe('msg_c');
    });

    it('should reconstruct a forked thread', async () => {
      // A → B, A → C (two replies to same parent)
      const hierarchy = await service.reconstructThread('acc_1', 'thread_fork');
      expect(hierarchy.rootMessages).toHaveLength(1);
      expect(hierarchy.rootMessages[0].children).toHaveLength(2);
    });

    it('should handle orphan messages as separate roots', async () => {
      // A (root), D (no In-Reply-To, no References match) = 2 roots
      const hierarchy = await service.reconstructThread('acc_1', 'thread_orphan');
      expect(hierarchy.rootMessages).toHaveLength(2);
    });

    it('should fallback to References header when In-Reply-To not matched', async () => {
      // A: Message-ID=<a>
      // B: In-Reply-To=<unknown>, References=<a> <unknown>
      // B should parent to A via References fallback
      const hierarchy = await service.reconstructThread('acc_1', 'thread_ref');
      expect(hierarchy.rootMessages).toHaveLength(1);
      expect(hierarchy.rootMessages[0].children).toHaveLength(1);
    });

    it('should compute thread_depth and thread_position', async () => {
      const hierarchy = await service.reconstructThread('acc_1', 'thread_1');
      // Verify depths: A=0, B=1, C=2
      expect(hierarchy.rootMessages[0].depth).toBe(0);
      expect(hierarchy.rootMessages[0].children[0].depth).toBe(1);
      expect(hierarchy.rootMessages[0].children[0].children[0].depth).toBe(2);
      // Timeline should be chronological
      expect(hierarchy.flatTimeline).toHaveLength(3);
      expect(hierarchy.flatTimeline[0].date).toBeLessThan(hierarchy.flatTimeline[1].date);
    });

    it('should handle circular references gracefully', async () => {
      // A: In-Reply-To=<b>, B: In-Reply-To=<a> — circular
      // Should not infinite loop, treat one as root
      const hierarchy = await service.reconstructThread('acc_1', 'thread_circular');
      expect(hierarchy.rootMessages.length).toBeGreaterThan(0);
      expect(hierarchy.messageCount).toBe(2);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-thread.service.spec.ts`
Expected: FAIL — service doesn't exist

- [ ] **Step 3: Implement EmailThreadService**

Create `backend/src/modules/wunderland/email-intelligence/services/email-thread.service.ts`:

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../../../../core/database/database.service';

export interface ThreadHierarchy {
  threadId: string;
  accountId: string;
  subject: string;
  messageCount: number;
  participantCount: number;
  participants: Array<{ email: string; name: string | null }>;
  dateRange: { earliest: number; latest: number };
  rootMessages: ThreadNode[];
  flatTimeline: ThreadTimelineEntry[];
}

export interface ThreadNode {
  messageId: string;
  from: { email: string; name: string | null };
  subject: string;
  snippet: string;
  date: number;
  depth: number;
  attachments: Array<{ filename: string; mimeType: string }>;
  children: ThreadNode[];
}

export interface ThreadTimelineEntry {
  messageId: string;
  from: { email: string; name: string | null };
  date: number;
  action: 'sent' | 'replied' | 'forwarded';
  snippet: string;
}

@Injectable()
export class EmailThreadService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  async reconstructThread(accountId: string, threadId: string): Promise<ThreadHierarchy> {
    // 1. Load all messages in thread ordered by internal_date ASC
    const messages = await this.db.all(
      `SELECT * FROM wunderland_email_synced_messages
       WHERE account_id = ? AND thread_id = ?
       ORDER BY internal_date ASC`,
      [accountId, threadId]
    );

    // 2. Build lookup: message_id_header → message
    const headerLookup = new Map<string, any>();
    const idLookup = new Map<string, any>();
    for (const msg of messages) {
      if (msg.message_id_header) headerLookup.set(msg.message_id_header, msg);
      idLookup.set(msg.id, msg);
    }

    // 3. Reconstruct parent-child relationships
    const visited = new Set<string>();
    for (const msg of messages) {
      if (visited.has(msg.id)) continue;
      visited.add(msg.id);

      let parent: any = null;

      // Try In-Reply-To first
      if (msg.in_reply_to) {
        parent = headerLookup.get(msg.in_reply_to);
      }

      // Fallback to References (walk from end to start)
      if (!parent && msg.references_header) {
        const refs: string[] = JSON.parse(msg.references_header || '[]');
        for (let i = refs.length - 1; i >= 0; i--) {
          parent = headerLookup.get(refs[i]);
          if (parent && parent.id !== msg.id) break;
          parent = null;
        }
      }

      // Guard against circular references
      if (parent && parent.id === msg.id) parent = null;

      const parentId = parent ? parent.id : null;
      const depth = parent ? (parent._depth ?? 0) + 1 : 0;
      msg._parentId = parentId;
      msg._depth = depth;
    }

    // 4. Compute thread_position and persist
    let position = 0;
    for (const msg of messages) {
      msg._position = position++;
      await this.db.run(
        `UPDATE wunderland_email_synced_messages
         SET parent_message_id = ?, thread_depth = ?, thread_position = ?
         WHERE id = ?`,
        [msg._parentId, msg._depth, msg._position, msg.id]
      );
    }

    // 5. Build tree
    const childrenMap = new Map<string | null, any[]>();
    for (const msg of messages) {
      const key = msg._parentId ?? null;
      if (!childrenMap.has(key)) childrenMap.set(key, []);
      childrenMap.get(key)!.push(msg);
    }

    const buildNode = (msg: any): ThreadNode => ({
      messageId: msg.id,
      from: { email: msg.from_address, name: msg.from_name },
      subject: msg.subject ?? '',
      snippet: msg.snippet ?? '',
      date: msg.internal_date,
      depth: msg._depth,
      attachments: [], // populated separately
      children: (childrenMap.get(msg.id) ?? []).map(buildNode),
    });

    const roots = (childrenMap.get(null) ?? []).map(buildNode);

    // 6. Build participants and timeline
    const participantMap = new Map<string, { email: string; name: string | null }>();
    const timeline: ThreadTimelineEntry[] = [];
    for (const msg of messages) {
      participantMap.set(msg.from_address, { email: msg.from_address, name: msg.from_name });
      timeline.push({
        messageId: msg.id,
        from: { email: msg.from_address, name: msg.from_name },
        date: msg.internal_date,
        action: msg._parentId ? 'replied' : 'sent',
        snippet: msg.snippet ?? '',
      });
    }

    return {
      threadId,
      accountId,
      subject: messages[0]?.subject ?? '',
      messageCount: messages.length,
      participantCount: participantMap.size,
      participants: Array.from(participantMap.values()),
      dateRange: {
        earliest: messages[0]?.internal_date ?? 0,
        latest: messages[messages.length - 1]?.internal_date ?? 0,
      },
      rootMessages: roots,
      flatTimeline: timeline,
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-thread.service.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/services/email-thread.service.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-thread.service.spec.ts
git commit -m "feat(email-intelligence): implement thread hierarchy reconstruction

Reconstructs parent→child reply chains from RFC 2822 In-Reply-To and References
headers. Handles linear chains, forks, orphans, and circular references."
```

---

### Task 4: Implement `EmailSyncService`

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-sync.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-sync.service.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-sync.service.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailSyncService } from '../services/email-sync.service';

describe('EmailSyncService', () => {
  describe('syncAccount', () => {
    it('should perform full sync when no cursor exists', async () => {
      // Account with sync_cursor = null → triggers fullSync
      // Verify messages are upserted to wunderland_email_synced_messages
      // Verify sync_cursor is updated after sync
      // Verify sync_state transitions: idle → syncing → idle
    });

    it('should perform incremental sync when cursor exists', async () => {
      // Account with sync_cursor = '{"historyId":"123"}' → triggers incrementalSync
      // Verify only new/modified messages processed
      // Verify sync_cursor updated to newCursor from result
    });

    it('should upsert messages by (account_id, provider_message_id)', async () => {
      // Sync same message twice → only one row in DB
    });

    it('should create attachment records for messages with attachments', async () => {
      // Sync a message with 2 attachments
      // Verify 2 rows in wunderland_email_attachments
    });

    it('should trigger thread reconstruction after sync', async () => {
      // Verify EmailThreadService.reconstructThread called for affected thread IDs
    });

    it('should set sync_state to error on auth failure', async () => {
      // Provider throws 401 → sync_state = 'error', last_sync_error set
    });

    it('should update sync_progress_json during full sync', async () => {
      // After each batch, verify progress is persisted to DB
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-sync.service.spec.ts`
Expected: FAIL — service doesn't exist

- [ ] **Step 3: Implement EmailSyncService**

Create `backend/src/modules/wunderland/email-intelligence/services/email-sync.service.ts`:

Key responsibilities:

- `syncAccount(accountId)` — orchestrates full or incremental sync based on `sync_cursor` state
- `upsertMessages(accountId, messages[])` — INSERT OR REPLACE into `wunderland_email_synced_messages` using `(account_id, provider_message_id)` unique constraint
- `createAttachmentRecords(messageId, accountId, attachments[])` — create `wunderland_email_attachments` rows
- `updateSyncProgress(accountId, progress)` — persist progress to `sync_progress_json` column
- `updateSyncState(accountId, state, error?)` — update `sync_state` and `last_sync_error`
- Uses `GmailProvider` (injected via factory based on account.provider)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-sync.service.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/services/email-sync.service.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-sync.service.spec.ts
git commit -m "feat(email-intelligence): implement email sync service

Orchestrates full and incremental sync via IEmailProvider. Upserts messages,
creates attachment records, updates persistent sync state and progress."
```

---

### Task 5: Implement Gmail OAuth flow

**Files:**

- Modify: `backend/src/modules/wunderland/channels/channel-oauth.controller.ts` (add Gmail endpoints)
- Modify: `backend/src/modules/wunderland/channels/channel-oauth.service.ts` (add Gmail methods)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/gmail-oauth.spec.ts`

**Docs to check:**

- Existing Slack OAuth pattern: `channel-oauth.controller.ts` lines 49-71
- State table: `wunderland_channel_oauth_states`
- Callback pattern: `apps/rabbithole/src/app/api/channels/oauth/slack/callback/route.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/gmail-oauth.spec.ts
import { describe, it, expect } from 'vitest';

describe('Gmail OAuth flow', () => {
  it('should generate Google OAuth URL with correct scopes', async () => {
    const result = await oauthService.initiateGmailOAuth(testUserId, testSeedId);
    expect(result.url).toContain('accounts.google.com');
    expect(result.url).toContain('gmail.readonly');
    expect(result.url).toContain('gmail.send');
    expect(result.url).toContain('gmail.modify');
    expect(result.url).toContain('access_type=offline');
    expect(result.stateId).toBeTruthy();
  });

  it('should store state in wunderland_channel_oauth_states', async () => {
    const result = await oauthService.initiateGmailOAuth(testUserId, testSeedId);
    const state = await db.get('SELECT * FROM wunderland_channel_oauth_states WHERE state_id = ?', [
      result.stateId,
    ]);
    expect(state).toBeDefined();
    expect(state.provider).toBe('gmail');
    expect(state.seed_id).toBe(testSeedId);
  });

  it('should create email account record on successful callback', async () => {
    // Mock Google token exchange and userinfo
    const result = await oauthService.handleGmailCallback('mock_code', 'mock_state');
    expect(result.accountId).toBeTruthy();
    expect(result.emailAddress).toBe('test@gmail.com');

    const account = await db.get('SELECT * FROM wunderland_email_accounts WHERE id = ?', [
      result.accountId,
    ]);
    expect(account.provider).toBe('gmail');
    expect(account.sync_enabled).toBe(1);
  });

  it('should store credential with metadata containing refresh token', async () => {
    const result = await oauthService.handleGmailCallback('mock_code', 'mock_state');
    const cred = await db.get('SELECT * FROM wunderbot_credentials WHERE credential_id = ?', [
      result.credentialId,
    ]);
    expect(cred.credential_type).toBe('google_oauth_token');
    const metadata = JSON.parse(cred.metadata);
    expect(metadata.refreshToken).toBeTruthy();
    expect(metadata.email).toBe('test@gmail.com');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/gmail-oauth.spec.ts`
Expected: FAIL — `initiateGmailOAuth` doesn't exist

- [ ] **Step 3: Add Gmail OAuth methods to channel-oauth.service.ts**

Add `initiateGmailOAuth(userId, seedId)` and `handleGmailCallback(code, state)` methods following the existing Slack pattern:

- `initiateGmailOAuth`: Generate state, store in `wunderland_channel_oauth_states`, build Google consent URL with scopes
- `handleGmailCallback`: Validate state, exchange code for tokens via `https://oauth2.googleapis.com/token`, fetch email via userinfo, store credential with metadata `{ refreshToken, email, expiresAt }`, create `wunderland_email_accounts` record

- [ ] **Step 4: Add Gmail endpoints to channel-oauth.controller.ts**

```typescript
@UseGuards(AuthGuard)
@Get('gmail/initiate')
async initiateGmail(
  @CurrentUser() user: any,
  @CurrentUser('id') userId: string,
  @Query('seedId') seedId?: string,
) {
  this.assertPaidAccess(user);
  if (!seedId) throw new BadRequestException('seedId query parameter is required.');
  return this.oauthService.initiateGmailOAuth(userId, seedId);
}

@Post('gmail/callback')
async gmailCallback(@Req() req: Request, @Body() body: ChannelOAuthCallbackDto) {
  this.assertInternalSecret(req);
  return this.oauthService.handleGmailCallback(body.code, body.state);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/gmail-oauth.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/src/modules/wunderland/channels/channel-oauth.controller.ts backend/src/modules/wunderland/channels/channel-oauth.service.ts backend/src/modules/wunderland/email-intelligence/__tests__/gmail-oauth.spec.ts
git commit -m "feat(email-intelligence): implement Gmail OAuth flow

Extends channel-oauth with Gmail initiate/callback. Stores credential with
metadata.refreshToken pattern. Creates wunderland_email_accounts on success."
```

---

### Task 6: Implement `EmailIntelligenceController` (core endpoints)

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/email-intelligence.controller.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/email-intelligence.dto.ts`
- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts` (register services + controller)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-controller.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-controller.spec.ts
import { describe, it, expect } from 'vitest';

describe('EmailIntelligenceController', () => {
  describe('GET /accounts', () => {
    it('should list connected email accounts for agent', async () => {
      const res = await request.get('/wunderland/email-intelligence/accounts?seedId=test_seed');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.accounts)).toBe(true);
    });
  });

  describe('GET /accounts/:accountId/status', () => {
    it('should return sync state from persistent columns', async () => {
      const res = await request.get(
        `/wunderland/email-intelligence/accounts/${accountId}/status?seedId=test_seed`
      );
      expect(res.body.syncState).toBe('idle');
      expect(res.body).toHaveProperty('totalMessagesSynced');
    });
  });

  describe('GET /threads/:threadId', () => {
    it('should return thread hierarchy with accountId param', async () => {
      const res = await request.get(
        `/wunderland/email-intelligence/threads/${threadId}?seedId=test_seed&accountId=${accountId}`
      );
      expect(res.body.rootMessages).toBeDefined();
      expect(res.body.flatTimeline).toBeDefined();
    });
  });

  describe('POST /accounts/:accountId/sync', () => {
    it('should trigger immediate sync', async () => {
      const res = await request.post(
        `/wunderland/email-intelligence/accounts/${accountId}/sync?seedId=test_seed`
      );
      expect(res.status).toBe(202);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-intelligence-controller.spec.ts`
Expected: FAIL — controller doesn't exist

- [ ] **Step 3: Create DTOs**

```typescript
// backend/src/modules/wunderland/email-intelligence/email-intelligence.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SeedIdQuery {
  @IsString() seedId!: string;
}

export class ThreadQuery extends SeedIdQuery {
  @IsString() accountId!: string;
}

export class ListMessagesQuery extends SeedIdQuery {
  @IsOptional() @IsString() accountId?: string;
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() isRead?: string;
  @IsOptional() @IsNumber() after?: number;
  @IsOptional() @IsNumber() before?: number;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
```

- [ ] **Step 4: Create controller with core endpoints**

Create `backend/src/modules/wunderland/email-intelligence/email-intelligence.controller.ts` with routes under `@Controller('wunderland/email-intelligence')`:

- `GET /accounts` — list accounts (requires seedId query)
- `GET /accounts/:accountId/status` — sync status from persistent columns
- `DELETE /accounts/:accountId` — disconnect account
- `PATCH /accounts/:accountId` — update sync settings
- `POST /accounts/:accountId/sync` — trigger immediate sync (returns 202)
- `GET /messages` — list messages (paginated, filterable)
- `GET /messages/:messageId` — full message
- `GET /threads` — list threads
- `GET /threads/:threadId` — thread hierarchy (requires accountId query)
- `GET /threads/:threadId/timeline` — timeline events

Auth: validate JWT OR `X-Internal-Secret` header, then verify agent ownership via `seedId`.

- [ ] **Step 5: Register in module**

Update `email-intelligence.module.ts` to register `EmailSyncService`, `EmailThreadService`, `GmailProvider`, and `EmailIntelligenceController`.

- [ ] **Step 6: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-intelligence-controller.spec.ts`
Expected: PASS

- [ ] **Step 7: Verify backend starts**

Run: `cd backend && timeout 15 npx tsx --tsconfig tsconfig.json src/main.ts`
Expected: Server starts, no hang

- [ ] **Step 8: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/email-intelligence.controller.ts backend/src/modules/wunderland/email-intelligence/email-intelligence.dto.ts backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-intelligence-controller.spec.ts
git commit -m "feat(email-intelligence): implement REST controller with core endpoints

Account management, message listing, thread hierarchy endpoints.
Supports JWT and X-Internal-Secret auth. All routes under /wunderland/email-intelligence/*."
```

---

### Task 7: Wire sync scheduling via CronJobService

**Files:**

- Modify: `backend/src/modules/wunderland/email-intelligence/services/email-sync.service.ts` (add scheduling)
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-sync-scheduling.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/modules/wunderland/email-intelligence/__tests__/email-sync-scheduling.spec.ts
import { describe, it, expect } from 'vitest';

describe('Email sync scheduling', () => {
  it('should create a cron job when account is connected', async () => {
    await syncService.scheduleSync(accountId);
    const jobs = await cronService.listJobs(testUserId, testSeedId);
    const syncJob = jobs.find((j) => j.payload_kind === 'email_sync');
    expect(syncJob).toBeDefined();
    expect(syncJob.schedule_kind).toBe('every');
    expect(syncJob.schedule_config).toContain('300000'); // 5 min
  });

  it('should remove cron job when account is disconnected', async () => {
    await syncService.unscheduleSync(accountId);
    const jobs = await cronService.listJobs(testUserId, testSeedId);
    const syncJob = jobs.find((j) => j.payload_kind === 'email_sync');
    expect(syncJob).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-sync-scheduling.spec.ts`
Expected: FAIL

- [ ] **Step 3: Add scheduling methods to EmailSyncService**

Add `scheduleSync(accountId)` and `unscheduleSync(accountId)` using `CronJobService.createJob()` with `schedule_kind: 'every'`, `schedule_config: JSON.stringify({ intervalMs: account.sync_interval_ms })`, `payload_kind: 'email_sync'`, `payload_config: JSON.stringify({ accountId })`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && npx vitest run src/modules/wunderland/email-intelligence/__tests__/email-sync-scheduling.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/wunderland/email-intelligence/services/email-sync.service.ts backend/src/modules/wunderland/email-intelligence/__tests__/email-sync-scheduling.spec.ts
git commit -m "feat(email-intelligence): wire sync scheduling via CronJobService

Creates persistent cron job per account using CronJobService CRUD API.
Removes job when account disconnected."
```

---

## Appendix A: Test Scaffolding

All test files in this plan need a shared setup pattern. See **Plan 1 Appendix A** for the base database initialization pattern using `better-sqlite3` in-memory + `initializeDatabase()`.

**Additional setup for Plan 2 tests:**

```typescript
// For GmailProvider tests — mock googleapis:
import { vi } from 'vitest';
vi.mock('googleapis', () => ({
  google: {
    gmail: vi.fn(() => ({
      users: {
        messages: { list: vi.fn(), get: vi.fn() },
        history: { list: vi.fn() },
        labels: { list: vi.fn() },
      },
    })),
  },
}));
vi.mock('google-auth-library', () => ({
  OAuth2Client: vi.fn().mockImplementation(() => ({
    setCredentials: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue({ token: 'at_mock' }),
  })),
}));

// For EmailSyncService tests — mock provider factory:
const mockProvider = {
  providerId: 'gmail',
  displayName: 'Gmail',
  initialize: vi.fn(),
  shutdown: vi.fn(),
  testConnection: vi.fn().mockResolvedValue({ ok: true }),
  fullSync: vi.fn(async function* () {
    yield [
      /* mock messages */
    ];
  }),
  incrementalSync: vi.fn().mockResolvedValue({
    newMessages: [],
    modifiedMessageIds: [],
    deletedMessageIds: [],
    newCursor: JSON.stringify({ historyId: '999' }),
  }),
  getCurrentCursor: vi.fn().mockResolvedValue(JSON.stringify({ historyId: '123' })),
  getMessage: vi.fn(),
  getThread: vi.fn(),
  getAttachmentContent: vi.fn(),
  sendMessage: vi.fn(),
  replyToMessage: vi.fn(),
  modifyLabels: vi.fn(),
  markAsRead: vi.fn(),
  archiveMessage: vi.fn(),
  trashMessage: vi.fn(),
  search: vi.fn(),
  listLabels: vi.fn(),
};

// For controller tests — use NestJS testing module:
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

let app: INestApplication;
let request: supertest.SuperTest<supertest.Test>;

beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [EmailIntelligenceController],
    providers: [
      { provide: EmailSyncService, useValue: mockSyncService },
      { provide: EmailThreadService, useValue: mockThreadService },
      { provide: DatabaseService, useValue: db },
    ],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  request = supertest(app.getHttpServer());
});

afterEach(async () => {
  await app?.close();
});

// For OAuth tests — mock fetch for Google token exchange:
vi.mock('node-fetch', () => ({
  default: vi.fn().mockImplementation((url: string) => {
    if (url.includes('oauth2.googleapis.com/token')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'at_mock',
            refresh_token: 'rt_mock',
            expires_in: 3600,
            token_type: 'Bearer',
          }),
      });
    }
    if (url.includes('oauth2/v2/userinfo')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ email: 'test@gmail.com', name: 'Test User' }),
      });
    }
  }),
}));
```

**Circular reference guard fix (Task 3 — EmailThreadService):**

The `reconstructThread` implementation should use an ancestor set when walking the parent chain to prevent true cycles (A→B→A), not just self-references:

```typescript
// In the parent-finding loop, add cycle detection:
const ancestorSet = new Set<string>();
let current = parent;
while (current) {
  if (ancestorSet.has(current.id)) {
    parent = null;
    break;
  } // cycle detected
  ancestorSet.add(current.id);
  current = current._parentId ? idLookup.get(current._parentId) : null;
}
```

---

## Appendix B: Scope

This plan covers **spec sections 4 (IEmailProvider), 5.1 (Sync), 5.2 (Threads), and 6 (OAuth)**. The following are deferred:

| Spec Section                                         | Covered In |
| ---------------------------------------------------- | ---------- |
| 3.0.4 EmailVectorMemoryService                       | Plan 3     |
| 5.3 Email Project Service                            | Plan 3     |
| 5.4 Email RAG Service                                | Plan 3     |
| 5.5 Email Attachment Service (extraction)            | Plan 3     |
| 5.6 Email Report Service                             | Plan 4     |
| 5.7 Email Digest Service                             | Plan 4     |
| 7.1 Project/Intelligence/Attachment/Report endpoints | Plans 3-4  |
| 8 Dashboard UI                                       | Plan 6     |
| 10.3 Skill Registration                              | Plan 5     |
| 16 Rate Limiting logic                               | Plan 3     |
| 2.3 Extension Pack (ITool implementations)           | Plan 5     |

**EmailSyncService note:** The sync pipeline step 5 ("Queue RAG indexing for new/modified messages") is a no-op stub in this plan. The actual RAG indexing is implemented in Plan 3 when `EmailRagService` and `EmailVectorMemoryService` are built. The sync service calls `this.ragService?.indexMessage(msg)` with optional chaining so it works without the RAG service present.
