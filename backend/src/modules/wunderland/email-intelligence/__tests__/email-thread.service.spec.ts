/**
 * @file email-thread.service.spec.ts
 * @description Tests for EmailThreadService — RFC 2822 thread reconstruction.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailThreadService } from '../services/email-thread.service.js';

let db: DatabaseService;
let service: EmailThreadService;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  service = new EmailThreadService(db);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface InsertMessageOpts {
  id?: string;
  accountId: string;
  threadId: string;
  messageIdHeader?: string;
  subject?: string;
  fromAddress?: string;
  fromName?: string | null;
  snippet?: string;
  internalDate: number;
  inReplyTo?: string | null;
  referencesHeader?: string[] | null;
  hasAttachments?: number;
  attachmentCount?: number;
}

async function insertMessage(opts: InsertMessageOpts): Promise<string> {
  const id = opts.id ?? generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_synced_messages
      (id, provider_message_id, account_id, thread_id, message_id_header,
       subject, from_address, from_name, snippet, internal_date,
       in_reply_to, references_header,
       has_attachments, attachment_count,
       created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      `provider-${id}`,
      opts.accountId,
      opts.threadId,
      opts.messageIdHeader ?? null,
      opts.subject ?? 'Test Subject',
      opts.fromAddress ?? 'sender@example.com',
      opts.fromName ?? null,
      opts.snippet ?? 'snippet',
      opts.internalDate,
      opts.inReplyTo ?? null,
      opts.referencesHeader ? JSON.stringify(opts.referencesHeader) : null,
      opts.hasAttachments ?? 0,
      opts.attachmentCount ?? 0,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailThreadService', () => {
  describe('reconstructThread', () => {
    it('handles empty thread gracefully', async () => {
      const accountId = generateId();
      const threadId = generateId();

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.messageCount).toBe(0);
      expect(result.rootMessages).toHaveLength(0);
      expect(result.flatTimeline).toHaveLength(0);
    });

    it('reconstructs a linear chain A -> B -> C', async () => {
      const accountId = generateId();
      const threadId = generateId();
      const msgIdA = '<a@example.com>';
      const msgIdB = '<b@example.com>';
      const msgIdC = '<c@example.com>';

      const idA = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdA,
        subject: 'Hello',
        fromAddress: 'alice@example.com',
        fromName: 'Alice',
        internalDate: 1000,
      });

      const idB = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdB,
        subject: 'Re: Hello',
        fromAddress: 'bob@example.com',
        fromName: 'Bob',
        internalDate: 2000,
        inReplyTo: msgIdA,
      });

      const idC = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdC,
        subject: 'Re: Hello',
        fromAddress: 'alice@example.com',
        fromName: 'Alice',
        internalDate: 3000,
        inReplyTo: msgIdB,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.messageCount).toBe(3);
      expect(result.rootMessages).toHaveLength(1);

      const root = result.rootMessages[0];
      expect(root.messageId).toBe(idA);
      expect(root.depth).toBe(0);
      expect(root.children).toHaveLength(1);

      const child = root.children[0];
      expect(child.messageId).toBe(idB);
      expect(child.depth).toBe(1);
      expect(child.children).toHaveLength(1);

      const grandchild = child.children[0];
      expect(grandchild.messageId).toBe(idC);
      expect(grandchild.depth).toBe(2);
      expect(grandchild.children).toHaveLength(0);

      // Verify persisted depths
      const rowA = await db.get<{ thread_depth: number; thread_position: number }>(
        `SELECT thread_depth, thread_position FROM wunderland_email_synced_messages WHERE id = ?`,
        [idA]
      );
      expect(rowA!.thread_depth).toBe(0);
      expect(rowA!.thread_position).toBe(0);

      const rowC = await db.get<{ thread_depth: number; thread_position: number }>(
        `SELECT thread_depth, thread_position FROM wunderland_email_synced_messages WHERE id = ?`,
        [idC]
      );
      expect(rowC!.thread_depth).toBe(2);
      expect(rowC!.thread_position).toBe(2);
    });

    it('reconstructs a forked thread A -> B and A -> C', async () => {
      const accountId = generateId();
      const threadId = generateId();
      const msgIdA = `<fork-a-${generateId()}@example.com>`;

      const idA = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdA,
        subject: 'Discussion',
        fromAddress: 'alice@example.com',
        internalDate: 1000,
      });

      const idB = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<fork-b-${generateId()}@example.com>`,
        subject: 'Re: Discussion',
        fromAddress: 'bob@example.com',
        internalDate: 2000,
        inReplyTo: msgIdA,
      });

      const idC = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<fork-c-${generateId()}@example.com>`,
        subject: 'Re: Discussion',
        fromAddress: 'charlie@example.com',
        internalDate: 3000,
        inReplyTo: msgIdA,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.rootMessages).toHaveLength(1);
      const root = result.rootMessages[0];
      expect(root.messageId).toBe(idA);
      expect(root.children).toHaveLength(2);
      expect(root.children.map((c) => c.messageId).sort()).toEqual([idB, idC].sort());
      expect(root.children[0].depth).toBe(1);
      expect(root.children[1].depth).toBe(1);
    });

    it('handles orphan messages as separate roots', async () => {
      const accountId = generateId();
      const threadId = generateId();

      const idA = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<orphan-a-${generateId()}@example.com>`,
        subject: 'Topic A',
        fromAddress: 'alice@example.com',
        internalDate: 1000,
      });

      const idD = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<orphan-d-${generateId()}@example.com>`,
        subject: 'Topic D',
        fromAddress: 'dave@example.com',
        internalDate: 2000,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.rootMessages).toHaveLength(2);
      expect(result.rootMessages.map((r) => r.messageId)).toEqual([idA, idD]);
      expect(result.rootMessages[0].depth).toBe(0);
      expect(result.rootMessages[1].depth).toBe(0);
    });

    it('uses References header as fallback when In-Reply-To is unknown', async () => {
      const accountId = generateId();
      const threadId = generateId();
      const msgIdA = `<ref-a-${generateId()}@example.com>`;
      const unknownMsgId = `<unknown-${generateId()}@example.com>`;

      const idA = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdA,
        subject: 'Original',
        fromAddress: 'alice@example.com',
        internalDate: 1000,
      });

      const idB = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<ref-b-${generateId()}@example.com>`,
        subject: 'Re: Original',
        fromAddress: 'bob@example.com',
        internalDate: 2000,
        inReplyTo: unknownMsgId, // points to unknown message
        referencesHeader: [msgIdA, unknownMsgId], // A is known
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.rootMessages).toHaveLength(1);
      const root = result.rootMessages[0];
      expect(root.messageId).toBe(idA);
      expect(root.children).toHaveLength(1);
      expect(root.children[0].messageId).toBe(idB);
      expect(root.children[0].depth).toBe(1);
    });

    it('handles circular references without infinite loop', async () => {
      const accountId = generateId();
      const threadId = generateId();
      const msgIdA = `<cycle-a-${generateId()}@example.com>`;
      const msgIdB = `<cycle-b-${generateId()}@example.com>`;

      const idA = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdA,
        subject: 'Cycle A',
        fromAddress: 'alice@example.com',
        internalDate: 1000,
        inReplyTo: msgIdB, // A points to B
      });

      const idB = await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdB,
        subject: 'Cycle B',
        fromAddress: 'bob@example.com',
        internalDate: 2000,
        inReplyTo: msgIdA, // B points to A
      });

      const result = await service.reconstructThread(accountId, threadId);

      // Should not hang; both messages should be present
      expect(result.messageCount).toBe(2);
      // At least one must be a root (cycle was broken)
      expect(result.rootMessages.length).toBeGreaterThanOrEqual(1);
      // All messages accounted for
      const allIds = new Set<string>();
      function collectIds(nodes: typeof result.rootMessages) {
        for (const n of nodes) {
          allIds.add(n.messageId);
          collectIds(n.children);
        }
      }
      collectIds(result.rootMessages);
      expect(allIds.has(idA)).toBe(true);
      expect(allIds.has(idB)).toBe(true);
    });

    it('flat timeline is sorted by date ascending', async () => {
      const accountId = generateId();
      const threadId = generateId();

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<timeline-c-${generateId()}@example.com>`,
        fromAddress: 'charlie@example.com',
        internalDate: 3000,
      });

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<timeline-a-${generateId()}@example.com>`,
        fromAddress: 'alice@example.com',
        internalDate: 1000,
      });

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<timeline-b-${generateId()}@example.com>`,
        fromAddress: 'bob@example.com',
        internalDate: 2000,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.flatTimeline).toHaveLength(3);
      expect(result.flatTimeline[0].date).toBe(1000);
      expect(result.flatTimeline[1].date).toBe(2000);
      expect(result.flatTimeline[2].date).toBe(3000);
    });

    it('deduplicates participants by email', async () => {
      const accountId = generateId();
      const threadId = generateId();
      const msgIdA = `<dedup-a-${generateId()}@example.com>`;

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdA,
        fromAddress: 'alice@example.com',
        fromName: 'Alice',
        internalDate: 1000,
      });

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<dedup-b-${generateId()}@example.com>`,
        fromAddress: 'bob@example.com',
        fromName: 'Bob',
        internalDate: 2000,
        inReplyTo: msgIdA,
      });

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<dedup-c-${generateId()}@example.com>`,
        fromAddress: 'alice@example.com',
        fromName: 'Alice Smith', // same email, different display name
        internalDate: 3000,
        inReplyTo: msgIdA,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.messageCount).toBe(3);
      expect(result.participantCount).toBe(2);
      expect(result.participants.map((p) => p.email).sort()).toEqual(
        ['alice@example.com', 'bob@example.com'].sort()
      );
    });

    it('infers forwarded action from subject prefix', async () => {
      const accountId = generateId();
      const threadId = generateId();
      const msgIdA = `<fwd-a-${generateId()}@example.com>`;

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: msgIdA,
        subject: 'Original',
        fromAddress: 'alice@example.com',
        internalDate: 1000,
      });

      await insertMessage({
        accountId,
        threadId,
        messageIdHeader: `<fwd-b-${generateId()}@example.com>`,
        subject: 'Fwd: Original',
        fromAddress: 'bob@example.com',
        internalDate: 2000,
        inReplyTo: msgIdA,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.flatTimeline[0].action).toBe('sent');
      expect(result.flatTimeline[1].action).toBe('forwarded');
    });

    it('correctly reports date range', async () => {
      const accountId = generateId();
      const threadId = generateId();

      await insertMessage({
        accountId,
        threadId,
        fromAddress: 'a@example.com',
        internalDate: 5000,
      });

      await insertMessage({
        accountId,
        threadId,
        fromAddress: 'b@example.com',
        internalDate: 1000,
      });

      await insertMessage({
        accountId,
        threadId,
        fromAddress: 'c@example.com',
        internalDate: 9000,
      });

      const result = await service.reconstructThread(accountId, threadId);

      expect(result.dateRange.earliest).toBe(1000);
      expect(result.dateRange.latest).toBe(9000);
    });
  });
});
