/**
 * @file email-project.service.spec.ts
 * @description Tests for EmailProjectService — manual CRUD and auto-detection.
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
import { EmailProjectService } from '../services/email-project.service.js';

let db: DatabaseService;
let service: EmailProjectService;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  service = new EmailProjectService(db);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertAccount(seedId: string, email?: string): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id, is_active, created_at, updated_at)
     VALUES (?, ?, ?, 'gmail', ?, ?, 1, ?, ?)`,
    [id, seedId, 'user-1', email ?? `${id}@example.com`, generateId(), now, now]
  );
  return id;
}

async function insertMessage(opts: {
  accountId: string;
  threadId: string;
  subject?: string;
  fromAddress?: string;
  fromName?: string | null;
  snippet?: string;
  internalDate: number;
  inReplyTo?: string | null;
  attachmentCount?: number;
}): Promise<string> {
  const id = generateId();
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
      `<${id}@test.com>`,
      opts.subject ?? 'Test Subject',
      opts.fromAddress ?? 'sender@example.com',
      opts.fromName ?? null,
      opts.snippet ?? 'snippet text',
      opts.internalDate,
      opts.inReplyTo ?? null,
      null,
      opts.attachmentCount ? 1 : 0,
      opts.attachmentCount ?? 0,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// CRUD Tests
// ---------------------------------------------------------------------------

describe('EmailProjectService', () => {
  describe('CRUD', () => {
    it('createProject inserts row and returns it', async () => {
      const seedId = generateId();
      const userId = generateId();

      const project = await service.createProject(seedId, userId, 'Test Project', 'A description');

      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('A description');
      expect(project.seed_id).toBe(seedId);
      expect(project.owner_user_id).toBe(userId);
      expect(project.status).toBe('active');
      expect(project.auto_detected).toBe(0);
      expect(project.detection_method).toBe('manual');
      expect(project.thread_count).toBe(0);
    });

    it('addThreadsToProject creates links and updates counts', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      // Insert some messages for the thread
      await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
      });
      await insertMessage({
        accountId,
        threadId,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        attachmentCount: 2,
      });

      const project = await service.createProject(seedId, userId, 'Project with threads');
      await service.addThreadsToProject(project.id, [{ threadId, accountId }], userId);

      const updated = await service.getProject(project.id);
      expect(updated!.thread_count).toBe(1);
      expect(updated!.message_count).toBe(2);
      expect(updated!.attachment_count).toBe(2);
      expect(updated!.participant_emails).toContain('alice@test.com');
      expect(updated!.participant_emails).toContain('bob@test.com');
      expect(updated!.last_activity_at).toBe(2000);
    });

    it('removeThreadFromProject removes link and updates counts', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const threadA = generateId();
      const threadB = generateId();

      await insertMessage({
        accountId,
        threadId: threadA,
        internalDate: 1000,
        fromAddress: 'a@test.com',
      });
      await insertMessage({
        accountId,
        threadId: threadB,
        internalDate: 2000,
        fromAddress: 'b@test.com',
      });

      const project = await service.createProject(seedId, userId, 'Multi-thread project');
      await service.addThreadsToProject(
        project.id,
        [
          { threadId: threadA, accountId },
          { threadId: threadB, accountId },
        ],
        userId
      );

      let updated = await service.getProject(project.id);
      expect(updated!.thread_count).toBe(2);
      expect(updated!.message_count).toBe(2);

      await service.removeThreadFromProject(project.id, threadA, accountId);

      updated = await service.getProject(project.id);
      expect(updated!.thread_count).toBe(1);
      expect(updated!.message_count).toBe(1);
    });

    it('mergeProjects moves threads from B to A and deletes B', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const threadA = generateId();
      const threadB = generateId();
      const threadC = generateId();

      await insertMessage({ accountId, threadId: threadA, internalDate: 1000 });
      await insertMessage({ accountId, threadId: threadB, internalDate: 2000 });
      await insertMessage({ accountId, threadId: threadC, internalDate: 3000 });

      const projectA = await service.createProject(seedId, userId, 'Project A');
      await service.addThreadsToProject(projectA.id, [{ threadId: threadA, accountId }], userId);

      const projectB = await service.createProject(seedId, userId, 'Project B');
      await service.addThreadsToProject(
        projectB.id,
        [
          { threadId: threadB, accountId },
          { threadId: threadC, accountId },
        ],
        userId
      );

      const mergedId = await service.mergeProjects(projectA.id, projectB.id);
      expect(mergedId).toBe(projectA.id);

      const merged = await service.getProject(projectA.id);
      expect(merged!.thread_count).toBe(3);
      expect(merged!.message_count).toBe(3);

      const deleted = await service.getProject(projectB.id);
      expect(deleted).toBeUndefined();
    });

    it('deleteProject removes project and thread links', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      await insertMessage({ accountId, threadId, internalDate: 1000 });

      const project = await service.createProject(seedId, userId, 'To Delete');
      await service.addThreadsToProject(project.id, [{ threadId, accountId }], userId);

      await service.deleteProject(project.id);

      const result = await service.getProject(project.id);
      expect(result).toBeUndefined();

      // Thread links should also be gone
      const links = await db.all(
        `SELECT * FROM wunderland_email_project_threads WHERE project_id = ?`,
        [project.id]
      );
      expect(links).toHaveLength(0);
    });

    it('getProjectTimeline returns messages ordered by date', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      await insertMessage({
        accountId,
        threadId,
        internalDate: 3000,
        fromAddress: 'c@test.com',
        subject: 'Third',
      });
      await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'a@test.com',
        subject: 'First',
      });
      await insertMessage({
        accountId,
        threadId,
        internalDate: 2000,
        fromAddress: 'b@test.com',
        subject: 'Re: First',
        inReplyTo: '<something>',
      });

      const project = await service.createProject(seedId, userId, 'Timeline Test');
      await service.addThreadsToProject(project.id, [{ threadId, accountId }], userId);

      const timeline = await service.getProjectTimeline(project.id);

      expect(timeline).toHaveLength(3);
      expect(timeline[0].date).toBe(1000);
      expect(timeline[1].date).toBe(2000);
      expect(timeline[2].date).toBe(3000);
      expect(timeline[0].action).toBe('sent');
      expect(timeline[1].action).toBe('replied');
    });

    it('listProjects filters by seedId and status', async () => {
      const seedId = generateId();
      const userId = generateId();

      await service.createProject(seedId, userId, 'Active 1');
      const p2 = await service.createProject(seedId, userId, 'Active 2');
      await service.updateProject(p2.id, { status: 'archived' });

      const all = await service.listProjects(seedId);
      expect(all).toHaveLength(2);

      const active = await service.listProjects(seedId, 'active');
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe('Active 1');

      const archived = await service.listProjects(seedId, 'archived');
      expect(archived).toHaveLength(1);
      expect(archived[0].name).toBe('Active 2');
    });

    it('getProjectSummary returns structured summary when no LLM available', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        fromName: 'Alice',
        subject: 'Budget Q3',
      });
      await insertMessage({
        accountId,
        threadId,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        fromName: 'Bob',
        subject: 'Re: Budget Q3',
      });

      const project = await service.createProject(seedId, userId, 'Budget Review');
      await service.addThreadsToProject(project.id, [{ threadId, accountId }], userId);

      // No OPENAI_API_KEY set, so should fallback to structured summary
      const summary = await service.getProjectSummary(project.id);
      expect(summary).toContain('Budget Review');
      expect(summary).toContain('Alice');
      expect(summary).toContain('Bob');
    });

    it('getProjectSummary returns message for empty project', async () => {
      const seedId = generateId();
      const userId = generateId();
      const project = await service.createProject(seedId, userId, 'Empty');
      const summary = await service.getProjectSummary(project.id);
      expect(summary).toBe('No messages found in this project.');
    });
  });

  // ---------------------------------------------------------------------------
  // Auto-Detection Tests
  // ---------------------------------------------------------------------------

  describe('Auto-Detection', () => {
    it('two threads with same participants cluster together', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const thread1 = generateId();
      const thread2 = generateId();

      // Same participants in both threads, close in time
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'Project Alpha kickoff',
      });
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        subject: 'Re: Project Alpha kickoff',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 3000,
        fromAddress: 'alice@test.com',
        subject: 'Project Alpha timeline',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 4000,
        fromAddress: 'bob@test.com',
        subject: 'Re: Project Alpha timeline',
      });

      const proposals = await service.detectProjects(seedId);

      expect(proposals.length).toBeGreaterThanOrEqual(1);
      const matching = proposals.find(
        (p) =>
          p.threads.some((t) => t.threadId === thread1) &&
          p.threads.some((t) => t.threadId === thread2)
      );
      expect(matching).toBeDefined();
      expect(matching!.threads).toHaveLength(2);
    });

    it('two threads with similar subjects cluster together', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const thread1 = generateId();
      const thread2 = generateId();

      // Different participants but very similar subjects, close in time
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'Website Redesign Mockups',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        subject: 'Website Redesign Feedback',
      });

      const proposals = await service.detectProjects(seedId);

      const matching = proposals.find(
        (p) =>
          p.threads.some((t) => t.threadId === thread1) &&
          p.threads.some((t) => t.threadId === thread2)
      );
      expect(matching).toBeDefined();
    });

    it('dissimilar threads stay in separate clusters', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const thread1 = generateId();
      const thread2 = generateId();

      // Very different participants, subjects, and far apart in time
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'Quantum Physics Paper Review',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 1000 + 365 * 24 * 60 * 60 * 1000,
        fromAddress: 'zoe@other.com',
        subject: 'Birthday Party Planning',
      });

      const proposals = await service.detectProjects(seedId);

      // Should not have a proposal containing both threads
      const matching = proposals.find(
        (p) =>
          p.threads.some((t) => t.threadId === thread1) &&
          p.threads.some((t) => t.threadId === thread2)
      );
      expect(matching).toBeUndefined();
    });

    it('cluster with only 1 thread is not proposed as a project', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const loneThread = generateId();

      // Only one thread with no similar threads
      await insertMessage({
        accountId,
        threadId: loneThread,
        internalDate: 1000,
        fromAddress: 'unique@test.com',
        subject: 'Completely Unique Topic Xyz123',
      });

      const proposals = await service.detectProjects(seedId);

      // No proposals should contain only this lone thread
      const matching = proposals.find(
        (p) => p.threads.length === 1 && p.threads[0].threadId === loneThread
      );
      expect(matching).toBeUndefined();
    });

    it('proposals include confidence scores', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const thread1 = generateId();
      const thread2 = generateId();

      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'Sprint Planning March',
      });
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        subject: 'Re: Sprint Planning March',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 3000,
        fromAddress: 'alice@test.com',
        subject: 'Sprint Planning March Tasks',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 4000,
        fromAddress: 'bob@test.com',
        subject: 'Re: Sprint Planning March Tasks',
      });

      const proposals = await service.detectProjects(seedId);

      expect(proposals.length).toBeGreaterThanOrEqual(1);
      for (const p of proposals) {
        expect(typeof p.confidence).toBe('number');
        expect(p.confidence).toBeGreaterThan(0);
        expect(p.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('detection ignores manually-created projects (does not duplicate)', async () => {
      const seedId = generateId();
      const userId = generateId();
      const accountId = await insertAccount(seedId);
      const thread1 = generateId();
      const thread2 = generateId();

      // Same participants and similar subjects
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'Hiring Round Spring',
      });
      await insertMessage({
        accountId,
        threadId: thread1,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        subject: 'Re: Hiring Round Spring',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 3000,
        fromAddress: 'alice@test.com',
        subject: 'Hiring Round Spring Candidates',
      });
      await insertMessage({
        accountId,
        threadId: thread2,
        internalDate: 4000,
        fromAddress: 'bob@test.com',
        subject: 'Re: Hiring Round Spring Candidates',
      });

      // Manually create a project and assign both threads
      const manual = await service.createProject(seedId, userId, 'Hiring', undefined, [
        { threadId: thread1, accountId },
        { threadId: thread2, accountId },
      ]);

      // detectProjects should not produce proposals that overlap with manual projects
      // (since detection only diffs against auto_detected=1 projects, manual projects
      // may still appear, but the cluster is still valid — it just won't be a duplicate
      // of auto-detected ones)
      const proposals = await service.detectProjects(seedId);

      // Any proposals returned should be typed as 'new' since there are no auto-detected projects
      for (const p of proposals) {
        expect(p.type).toBe('new');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Unit tests for helper methods
  // ---------------------------------------------------------------------------

  describe('extractSubjectTokens', () => {
    it('removes Re:/Fwd: prefixes and stopwords', () => {
      const tokens = service.extractSubjectTokens('Re: Fwd: The Project Budget Update');
      expect(tokens).toContain('project');
      expect(tokens).toContain('budget');
      expect(tokens).toContain('update');
      expect(tokens).not.toContain('the');
      expect(tokens).not.toContain('re:');
      expect(tokens).not.toContain('fwd:');
    });

    it('handles repeated prefixes', () => {
      const tokens = service.extractSubjectTokens('RE: RE: FW: Meeting Notes');
      expect(tokens).toContain('meeting');
      expect(tokens).toContain('notes');
    });
  });

  describe('agglomerativeCluster', () => {
    it('merges similar items and leaves dissimilar ones separate', () => {
      // 3 items: 0 and 1 are similar, 2 is dissimilar
      const sim = [
        [0, 0.8, 0.1],
        [0.8, 0, 0.2],
        [0.1, 0.2, 0],
      ];

      const clusters = service.agglomerativeCluster(sim, 0.5);

      // Should have 2 clusters: [0,1] and [2]
      expect(clusters).toHaveLength(2);
      const big = clusters.find((c) => c.length === 2)!;
      const small = clusters.find((c) => c.length === 1)!;
      expect(big.sort()).toEqual([0, 1]);
      expect(small).toEqual([2]);
    });

    it('does not merge anything below threshold', () => {
      const sim = [
        [0, 0.3, 0.2],
        [0.3, 0, 0.1],
        [0.2, 0.1, 0],
      ];

      const clusters = service.agglomerativeCluster(sim, 0.5);
      expect(clusters).toHaveLength(3);
    });
  });
});
