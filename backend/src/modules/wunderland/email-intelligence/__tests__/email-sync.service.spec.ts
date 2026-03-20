/**
 * @file email-sync.service.spec.ts
 * @description Tests for EmailSyncService — full sync, incremental sync,
 *              upsert deduplication, attachment records, thread reconstruction,
 *              error handling, and progress persistence.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailSyncService } from '../services/email-sync.service.js';
import { EmailThreadService } from '../services/email-thread.service.js';
import type {
  IEmailProvider,
  EmailMessage,
  DecryptedCredentials,
  IncrementalSyncResult,
  FullSyncOptions,
  EmailLabel,
  EmailDraft,
} from '../providers/email-provider.interface.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let syncService: EmailSyncService;
let threadService: EmailThreadService;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  threadService = new EmailThreadService(db);
  syncService = new EmailSyncService(db, threadService);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMessage(overrides: Partial<EmailMessage> = {}): EmailMessage {
  return {
    id: `gmail-${generateId()}`,
    threadId: `thread-${generateId()}`,
    messageIdHeader: `<${generateId()}@mail.gmail.com>`,
    inReplyTo: null,
    referencesHeader: [],
    subject: 'Test Subject',
    from: { email: 'sender@example.com', name: 'Sender' },
    to: [{ email: 'recipient@example.com', name: 'Recipient' }],
    cc: [],
    bcc: [],
    bodyText: 'Hello world',
    bodyHtml: null,
    snippet: 'Hello world',
    internalDate: Date.now(),
    receivedDate: Date.now(),
    labels: ['INBOX'],
    isRead: false,
    isStarred: false,
    isDraft: false,
    sizeBytes: 1024,
    attachments: [],
    ...overrides,
  };
}

async function insertAccount(overrides: Record<string, unknown> = {}): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id,
       sync_cursor, sync_enabled, sync_state, total_messages_synced,
       created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      overrides.seed_id ?? generateId(),
      overrides.owner_user_id ?? generateId(),
      overrides.provider ?? 'gmail',
      overrides.email_address ?? `test-${generateId()}@example.com`,
      overrides.credential_id ?? generateId(),
      overrides.sync_cursor ?? null,
      overrides.sync_enabled ?? 1,
      overrides.sync_state ?? 'idle',
      overrides.total_messages_synced ?? 0,
      now,
      now,
    ]
  );
  return id;
}

function createMockProvider(overrides: Partial<IEmailProvider> = {}): IEmailProvider {
  return {
    providerId: 'gmail',
    displayName: 'Gmail',
    initialize: vi.fn().mockResolvedValue(undefined),
    shutdown: vi.fn().mockResolvedValue(undefined),
    testConnection: vi.fn().mockResolvedValue({ ok: true }),
    fullSync: vi.fn(),
    incrementalSync: vi.fn(),
    getCurrentCursor: vi.fn().mockResolvedValue(JSON.stringify({ historyId: '999' })),
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
    ...overrides,
  };
}

async function getAccount(accountId: string) {
  return db.get<Record<string, unknown>>(`SELECT * FROM wunderland_email_accounts WHERE id = ?`, [
    accountId,
  ]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailSyncService', () => {
  describe('full sync when no cursor exists', () => {
    it('syncs messages, updates cursor, and transitions state', async () => {
      const accountId = await insertAccount({ sync_cursor: null });
      const threadId = `thread-full-${generateId()}`;
      const msg1 = makeMessage({ threadId });
      const msg2 = makeMessage({ threadId });

      async function* mockFullSync(_opts: FullSyncOptions) {
        yield [msg1, msg2];
      }

      const mockProvider = createMockProvider({
        fullSync: mockFullSync as unknown as IEmailProvider['fullSync'],
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      // Verify 2 rows in synced messages
      const rows = await db.all<{ id: string }>(
        `SELECT id FROM wunderland_email_synced_messages WHERE account_id = ?`,
        [accountId]
      );
      expect(rows).toHaveLength(2);

      // Verify cursor updated
      const account = await getAccount(accountId);
      expect(account!.sync_cursor).toBe(JSON.stringify({ historyId: '999' }));
      expect(account!.sync_state).toBe('idle');
      expect(account!.total_messages_synced).toBe(2);
      expect(account!.last_full_sync_at).toBeGreaterThan(0);
    });
  });

  describe('incremental sync when cursor exists', () => {
    it('upserts new messages and updates cursor', async () => {
      const existingCursor = JSON.stringify({ historyId: '123' });
      const accountId = await insertAccount({ sync_cursor: existingCursor });
      const threadId = `thread-inc-${generateId()}`;
      const newMsg = makeMessage({ threadId });
      const newCursor = JSON.stringify({ historyId: '456' });

      const mockProvider = createMockProvider({
        incrementalSync: vi.fn().mockResolvedValue({
          newMessages: [newMsg],
          modifiedMessageIds: [],
          deletedMessageIds: [],
          newCursor,
        } satisfies IncrementalSyncResult),
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      // Verify new message upserted
      const rows = await db.all<{ id: string }>(
        `SELECT id FROM wunderland_email_synced_messages WHERE account_id = ?`,
        [accountId]
      );
      expect(rows).toHaveLength(1);

      // Verify cursor updated
      const account = await getAccount(accountId);
      expect(account!.sync_cursor).toBe(newCursor);
      expect(account!.sync_state).toBe('idle');
    });
  });

  describe('upsert deduplication', () => {
    it('does not create duplicate rows for same provider_message_id', async () => {
      const accountId = await insertAccount({ sync_cursor: null });
      const providerMsgId = `gmail-dedup-${generateId()}`;
      const threadId = `thread-dedup-${generateId()}`;
      const msg = makeMessage({ id: providerMsgId, threadId });

      // Sync twice with the same message
      async function* mockFullSync1() {
        yield [msg];
      }
      async function* mockFullSync2() {
        yield [msg];
      }

      const mockProvider1 = createMockProvider({
        fullSync: mockFullSync1 as unknown as IEmailProvider['fullSync'],
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider1,
      });

      // Reset cursor to force another full sync
      await db.run(`UPDATE wunderland_email_accounts SET sync_cursor = NULL WHERE id = ?`, [
        accountId,
      ]);

      const mockProvider2 = createMockProvider({
        fullSync: mockFullSync2 as unknown as IEmailProvider['fullSync'],
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider2,
      });

      // Should have only 1 row (not 2)
      const rows = await db.all<{ id: string }>(
        `SELECT id FROM wunderland_email_synced_messages
         WHERE account_id = ? AND provider_message_id = ?`,
        [accountId, providerMsgId]
      );
      expect(rows).toHaveLength(1);
    });
  });

  describe('attachment records created', () => {
    it('creates attachment rows for messages with attachments', async () => {
      const accountId = await insertAccount({ sync_cursor: null });
      const threadId = `thread-att-${generateId()}`;
      const msg = makeMessage({
        threadId,
        attachments: [
          {
            attachmentId: 'att-1',
            filename: 'report.pdf',
            mimeType: 'application/pdf',
            sizeBytes: 50000,
            contentId: null,
            isInline: false,
          },
          {
            attachmentId: 'att-2',
            filename: 'photo.jpg',
            mimeType: 'image/jpeg',
            sizeBytes: 120000,
            contentId: '<img001>',
            isInline: true,
          },
        ],
      });

      async function* mockFullSync() {
        yield [msg];
      }

      const mockProvider = createMockProvider({
        fullSync: mockFullSync as unknown as IEmailProvider['fullSync'],
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      const attachments = await db.all<{
        filename: string;
        mime_type: string;
        is_inline: number;
        gmail_attachment_id: string;
      }>(
        `SELECT filename, mime_type, is_inline, gmail_attachment_id
         FROM wunderland_email_attachments WHERE account_id = ?`,
        [accountId]
      );

      expect(attachments).toHaveLength(2);
      const filenames = attachments.map((a) => a.filename).sort();
      expect(filenames).toEqual(['photo.jpg', 'report.pdf']);

      const inline = attachments.find((a) => a.filename === 'photo.jpg')!;
      expect(inline.is_inline).toBe(1);
      expect(inline.gmail_attachment_id).toBe('att-2');
    });
  });

  describe('thread reconstruction triggered', () => {
    it('calls reconstructThread for each affected threadId', async () => {
      const accountId = await insertAccount({ sync_cursor: null });
      const sharedThreadId = `thread-recon-${generateId()}`;
      const msg1 = makeMessage({ threadId: sharedThreadId });
      const msg2 = makeMessage({ threadId: sharedThreadId });

      async function* mockFullSync() {
        yield [msg1, msg2];
      }

      const mockProvider = createMockProvider({
        fullSync: mockFullSync as unknown as IEmailProvider['fullSync'],
      });

      const reconstructSpy = vi.spyOn(threadService, 'reconstructThread');

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      // Should be called once for the shared thread (deduplicated)
      const calls = reconstructSpy.mock.calls.filter(
        ([aid, tid]) => aid === accountId && tid === sharedThreadId
      );
      expect(calls).toHaveLength(1);

      reconstructSpy.mockRestore();
    });
  });

  describe('error sets sync_state to error', () => {
    it('persists error state and re-throws', async () => {
      const accountId = await insertAccount({ sync_cursor: null });

      async function* mockFullSync() {
        throw new Error('API quota exceeded');
        // yield is needed for TS to recognize this as a generator
        yield [] as EmailMessage[]; // unreachable
      }

      const mockProvider = createMockProvider({
        fullSync: mockFullSync as unknown as IEmailProvider['fullSync'],
      });

      await expect(
        syncService.syncAccount(accountId, {
          providerFactory: () => mockProvider,
        })
      ).rejects.toThrow('API quota exceeded');

      const account = await getAccount(accountId);
      expect(account!.sync_state).toBe('error');
      expect(account!.last_sync_error).toBe('API quota exceeded');
    });
  });

  describe('progress persisted during full sync', () => {
    it('updates sync_progress_json after each batch', async () => {
      const accountId = await insertAccount({ sync_cursor: null });
      const threadId1 = `thread-prog1-${generateId()}`;
      const threadId2 = `thread-prog2-${generateId()}`;
      const batch1 = [makeMessage({ threadId: threadId1 }), makeMessage({ threadId: threadId1 })];
      const batch2 = [makeMessage({ threadId: threadId2 })];

      const progressSnapshots: string[] = [];

      // Spy on updateSyncProgress to capture calls
      const origUpdate = syncService.updateSyncProgress.bind(syncService);
      vi.spyOn(syncService, 'updateSyncProgress').mockImplementation(async (id, progress) => {
        progressSnapshots.push(JSON.stringify(progress));
        return origUpdate(id, progress);
      });

      async function* mockFullSync() {
        yield batch1;
        yield batch2;
      }

      const mockProvider = createMockProvider({
        fullSync: mockFullSync as unknown as IEmailProvider['fullSync'],
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      // Two batches means two progress updates
      expect(progressSnapshots).toHaveLength(2);

      const p1 = JSON.parse(progressSnapshots[0]);
      expect(p1.syncedMessages).toBe(2);
      expect(p1.type).toBe('full');

      const p2 = JSON.parse(progressSnapshots[1]);
      expect(p2.syncedMessages).toBe(3);
      expect(p2.type).toBe('full');

      // Also verify the final DB value
      const account = await getAccount(accountId);
      const finalProgress = JSON.parse(account!.sync_progress_json as string);
      expect(finalProgress.syncedMessages).toBe(3);

      vi.restoreAllMocks();
    });
  });

  describe('sync_enabled guard', () => {
    it('does nothing if sync_enabled is 0', async () => {
      const accountId = await insertAccount({ sync_enabled: 0, sync_cursor: null });

      const mockProvider = createMockProvider();

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      // Account state should remain unchanged
      const account = await getAccount(accountId);
      expect(account!.sync_state).toBe('idle');
      expect(mockProvider.fullSync).not.toHaveBeenCalled();
    });
  });

  describe('getProviderForAccount', () => {
    it('returns GmailProvider for gmail', () => {
      const provider = syncService.getProviderForAccount({ provider: 'gmail' });
      expect(provider.providerId).toBe('gmail');
    });

    it('throws for unknown provider', () => {
      expect(() => syncService.getProviderForAccount({ provider: 'yahoo' })).toThrow(
        'Unsupported email provider: yahoo'
      );
    });
  });

  describe('incremental sync — deletions', () => {
    it('deletes messages that the provider reports as deleted', async () => {
      const accountId = await insertAccount({ sync_cursor: JSON.stringify({ historyId: '100' }) });
      const threadId = `thread-del-${generateId()}`;

      // Pre-insert a message that will be "deleted"
      const providerMsgId = `gmail-del-${generateId()}`;
      const now = Date.now();
      await db.run(
        `INSERT INTO wunderland_email_synced_messages
          (id, provider_message_id, account_id, thread_id, from_address, internal_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [generateId(), providerMsgId, accountId, threadId, 'a@b.com', now, now, now]
      );

      const mockProvider = createMockProvider({
        incrementalSync: vi.fn().mockResolvedValue({
          newMessages: [],
          modifiedMessageIds: [],
          deletedMessageIds: [providerMsgId],
          newCursor: JSON.stringify({ historyId: '200' }),
        } satisfies IncrementalSyncResult),
      });

      await syncService.syncAccount(accountId, {
        providerFactory: () => mockProvider,
      });

      // Message should be deleted
      const rows = await db.all<{ id: string }>(
        `SELECT id FROM wunderland_email_synced_messages
         WHERE account_id = ? AND provider_message_id = ?`,
        [accountId, providerMsgId]
      );
      expect(rows).toHaveLength(0);
    });
  });
});
