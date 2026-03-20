/**
 * @file email-project.service.ts
 * @description Manual CRUD for email projects + automatic project detection
 *              via agglomerative clustering of email threads.
 *
 * Projects group related email threads (e.g., "Q3 Budget", "Website Redesign")
 * either manually by the user or automatically via similarity-based clustering.
 */

import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { generateId } from '../../../../core/database/appDatabase.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailProject {
  id: string;
  seed_id: string;
  owner_user_id: string;
  name: string;
  description: string | null;
  status: string;
  auto_detected: number;
  detection_confidence: number | null;
  detection_method: string | null;
  participant_emails: string | null;
  thread_count: number;
  message_count: number;
  attachment_count: number;
  last_activity_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface ProjectProposal {
  id: string;
  name: string;
  description: string;
  confidence: number;
  threads: Array<{ threadId: string; accountId: string }>;
  type: 'new' | 'add_threads';
  existingProjectId?: string;
}

export interface ProjectTimelineEntry {
  date: number;
  from: string;
  subject: string;
  snippet: string;
  messageId: string;
  action: string;
}

// ---------------------------------------------------------------------------
// Internal row shapes
// ---------------------------------------------------------------------------

interface ThreadRow {
  thread_id: string;
  account_id: string;
  subject: string | null;
  from_address: string;
  internal_date: number;
  snippet: string | null;
  in_reply_to: string | null;
}

interface MessageRow {
  id: string;
  from_address: string;
  from_name: string | null;
  subject: string | null;
  snippet: string | null;
  internal_date: number;
  in_reply_to: string | null;
  thread_id: string;
  account_id: string;
}

// ---------------------------------------------------------------------------
// Stopwords for subject token extraction
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'is',
  'was',
  'are',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'can',
  'shall',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'as',
  'into',
  'about',
  'this',
  'that',
  'it',
  'its',
  'and',
  'or',
  'but',
  'not',
  'no',
  'if',
  'so',
]);

const SUBJECT_PREFIXES = /^(re:|fwd:|fw:|aw:|sv:|vs:)\s*/i;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailProjectService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  // =========================================================================
  // Manual CRUD
  // =========================================================================

  async createProject(
    seedId: string,
    userId: string,
    name: string,
    description?: string,
    threads?: Array<{ threadId: string; accountId: string }>
  ): Promise<EmailProject> {
    const id = generateId();
    const now = Date.now();

    await this.db.run(
      `INSERT INTO wunderland_email_projects
        (id, seed_id, owner_user_id, name, description, status,
         auto_detected, detection_method,
         thread_count, message_count, attachment_count,
         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', 0, 'manual', 0, 0, 0, ?, ?)`,
      [id, seedId, userId, name, description ?? null, now, now]
    );

    if (threads && threads.length > 0) {
      await this.addThreadsToProject(id, threads, userId);
    }

    const project = await this.getProject(id);
    return project!;
  }

  async getProject(projectId: string): Promise<EmailProject | undefined> {
    return this.db.get<EmailProject>(`SELECT * FROM wunderland_email_projects WHERE id = ?`, [
      projectId,
    ]);
  }

  async listProjects(seedId: string, status?: string): Promise<EmailProject[]> {
    if (status) {
      return this.db.all<EmailProject>(
        `SELECT * FROM wunderland_email_projects WHERE seed_id = ? AND status = ? ORDER BY updated_at DESC`,
        [seedId, status]
      );
    }
    return this.db.all<EmailProject>(
      `SELECT * FROM wunderland_email_projects WHERE seed_id = ? ORDER BY updated_at DESC`,
      [seedId]
    );
  }

  async updateProject(
    projectId: string,
    updates: { name?: string; description?: string; status?: string }
  ): Promise<void> {
    const sets: string[] = [];
    const params: any[] = [];

    if (updates.name !== undefined) {
      sets.push('name = ?');
      params.push(updates.name);
    }
    if (updates.description !== undefined) {
      sets.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status !== undefined) {
      sets.push('status = ?');
      params.push(updates.status);
    }

    if (sets.length === 0) return;

    sets.push('updated_at = ?');
    params.push(Date.now());
    params.push(projectId);

    await this.db.run(
      `UPDATE wunderland_email_projects SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.db.run(`DELETE FROM wunderland_email_project_threads WHERE project_id = ?`, [
      projectId,
    ]);
    await this.db.run(`DELETE FROM wunderland_email_projects WHERE id = ?`, [projectId]);
  }

  async addThreadsToProject(
    projectId: string,
    threads: Array<{ threadId: string; accountId: string }>,
    addedBy?: string
  ): Promise<void> {
    const now = Date.now();
    const adder = addedBy ?? 'system';

    for (const t of threads) {
      const id = generateId();
      await this.db.run(
        `INSERT OR IGNORE INTO wunderland_email_project_threads
          (id, project_id, thread_id, account_id, added_by, added_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, projectId, t.threadId, t.accountId, adder, now]
      );
    }

    await this.refreshProjectCounts(projectId);
  }

  async removeThreadFromProject(
    projectId: string,
    threadId: string,
    accountId: string
  ): Promise<void> {
    await this.db.run(
      `DELETE FROM wunderland_email_project_threads
       WHERE project_id = ? AND thread_id = ? AND account_id = ?`,
      [projectId, threadId, accountId]
    );
    await this.refreshProjectCounts(projectId);
  }

  async mergeProjects(projectIdA: string, projectIdB: string): Promise<string> {
    // Move all threads from B to A (IGNORE duplicates via UNIQUE constraint)
    const threadsB = await this.db.all<{
      thread_id: string;
      account_id: string;
      added_by: string;
      confidence: number | null;
    }>(
      `SELECT thread_id, account_id, added_by, confidence
       FROM wunderland_email_project_threads WHERE project_id = ?`,
      [projectIdB]
    );

    const now = Date.now();
    for (const t of threadsB) {
      const id = generateId();
      await this.db.run(
        `INSERT OR IGNORE INTO wunderland_email_project_threads
          (id, project_id, thread_id, account_id, added_by, confidence, added_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, projectIdA, t.thread_id, t.account_id, t.added_by, t.confidence, now]
      );
    }

    // Delete project B and its thread links
    await this.db.run(`DELETE FROM wunderland_email_project_threads WHERE project_id = ?`, [
      projectIdB,
    ]);
    await this.db.run(`DELETE FROM wunderland_email_projects WHERE id = ?`, [projectIdB]);

    // Refresh A's counts
    await this.refreshProjectCounts(projectIdA);

    return projectIdA;
  }

  async getProjectSummary(projectId: string): Promise<string> {
    // Load recent messages across all project threads (last 20)
    const messages = await this.db.all<MessageRow>(
      `SELECT m.id, m.from_address, m.from_name, m.subject, m.snippet, m.internal_date,
              m.in_reply_to, m.thread_id, m.account_id
       FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?
       ORDER BY m.internal_date DESC
       LIMIT 20`,
      [projectId]
    );

    if (messages.length === 0) {
      return 'No messages found in this project.';
    }

    const project = await this.getProject(projectId);
    const projectName = project?.name ?? 'Unknown Project';

    // Try LLM summary
    try {
      const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
      if (apiKey) {
        const baseUrl = process.env.OPENROUTER_API_KEY
          ? 'https://openrouter.ai/api/v1'
          : 'https://api.openai.com/v1';
        const model = process.env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'gpt-4o-mini';

        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey, baseURL: baseUrl });

        const messageTexts = messages
          .reverse()
          .map(
            (m) =>
              `[${new Date(m.internal_date).toISOString()}] ${m.from_name ?? m.from_address}: ${m.subject ?? ''}\n${m.snippet ?? ''}`
          )
          .join('\n\n');

        const completion = await client.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You summarize email project threads concisely. Focus on key decisions, action items, and current status. Keep it under 200 words.',
            },
            {
              role: 'user',
              content: `Summarize the email project "${projectName}":\n\n${messageTexts}`,
            },
          ],
          max_tokens: 300,
        });

        const summary = completion.choices?.[0]?.message?.content;
        if (summary) return summary;
      }
    } catch {
      // Fall through to structured summary
    }

    // Structured text summary fallback
    const participants = new Set<string>();
    const subjects = new Set<string>();
    let earliest = Infinity;
    let latest = -Infinity;

    for (const m of messages) {
      participants.add(m.from_name ?? m.from_address);
      if (m.subject) subjects.add(m.subject);
      if (m.internal_date < earliest) earliest = m.internal_date;
      if (m.internal_date > latest) latest = m.internal_date;
    }

    const lines = [
      `Project: ${projectName}`,
      `Messages: ${messages.length} (most recent)`,
      `Participants: ${Array.from(participants).join(', ')}`,
      `Topics: ${Array.from(subjects).slice(0, 5).join('; ')}`,
      `Date range: ${new Date(earliest).toISOString().slice(0, 10)} to ${new Date(latest).toISOString().slice(0, 10)}`,
    ];

    return lines.join('\n');
  }

  async getProjectTimeline(projectId: string): Promise<ProjectTimelineEntry[]> {
    const messages = await this.db.all<MessageRow>(
      `SELECT m.id, m.from_address, m.from_name, m.subject, m.snippet,
              m.internal_date, m.in_reply_to, m.thread_id, m.account_id
       FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?
       ORDER BY m.internal_date ASC`,
      [projectId]
    );

    return messages.map((m) => ({
      date: m.internal_date,
      from: m.from_name ?? m.from_address,
      subject: m.subject ?? '',
      snippet: m.snippet ?? '',
      messageId: m.id,
      action: this.inferAction(m),
    }));
  }

  // =========================================================================
  // Auto-Detection
  // =========================================================================

  async detectProjects(seedId: string): Promise<ProjectProposal[]> {
    // 1. Load all threads with their messages
    const rows = await this.db.all<ThreadRow>(
      `SELECT m.thread_id, m.account_id, m.subject, m.from_address,
              m.internal_date, m.snippet, m.in_reply_to
       FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_accounts a ON m.account_id = a.id
       WHERE a.seed_id = ?
       ORDER BY m.internal_date ASC`,
      [seedId]
    );

    if (rows.length === 0) return [];

    // 2. Build feature vectors per thread
    const threadMap = new Map<
      string,
      {
        threadId: string;
        accountId: string;
        participants: Set<string>;
        subjectTokens: Set<string>;
        earliestDate: number;
        latestDate: number;
      }
    >();

    for (const row of rows) {
      const key = `${row.account_id}:${row.thread_id}`;
      let thread = threadMap.get(key);
      if (!thread) {
        thread = {
          threadId: row.thread_id,
          accountId: row.account_id,
          participants: new Set(),
          subjectTokens: new Set(),
          earliestDate: row.internal_date,
          latestDate: row.internal_date,
        };
        threadMap.set(key, thread);
      }
      thread.participants.add(row.from_address.toLowerCase());
      if (row.subject) {
        for (const token of this.extractSubjectTokens(row.subject)) {
          thread.subjectTokens.add(token);
        }
      }
      if (row.internal_date < thread.earliestDate) thread.earliestDate = row.internal_date;
      if (row.internal_date > thread.latestDate) thread.latestDate = row.internal_date;
    }

    const threads = Array.from(threadMap.values());
    if (threads.length < 2) return [];

    // 3. Compute pairwise similarity
    const n = threads.length;
    const simMatrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const sim = this.computeThreadSimilarity(threads[i], threads[j]);
        simMatrix[i][j] = sim;
        simMatrix[j][i] = sim;
      }
    }

    // 4. Agglomerative clustering (single-linkage)
    const clusters = this.agglomerativeCluster(simMatrix, 0.5);

    // 5. Build proposals from clusters with >= 2 threads
    const proposals: ProjectProposal[] = [];

    // Load existing auto-detected projects to diff against
    const existingProjects = await this.db.all<{
      id: string;
      name: string;
    }>(
      `SELECT p.id, p.name FROM wunderland_email_projects p
       WHERE p.seed_id = ? AND p.auto_detected = 1`,
      [seedId]
    );

    const existingThreadSets = new Map<string, Set<string>>();
    for (const ep of existingProjects) {
      const ptRows = await this.db.all<{ thread_id: string; account_id: string }>(
        `SELECT thread_id, account_id FROM wunderland_email_project_threads WHERE project_id = ?`,
        [ep.id]
      );
      existingThreadSets.set(ep.id, new Set(ptRows.map((r) => `${r.account_id}:${r.thread_id}`)));
    }

    for (const clusterIndices of clusters) {
      if (clusterIndices.length < 2) continue;

      const clusterThreads = clusterIndices.map((idx) => threads[idx]);
      const clusterThreadKeys = new Set(clusterThreads.map((t) => `${t.accountId}:${t.threadId}`));

      // Check if this cluster matches an existing auto-detected project
      let matchedExisting: { id: string; name: string } | null = null;
      for (const [projId, threadSet] of existingThreadSets) {
        const overlap = [...clusterThreadKeys].filter((k) => threadSet.has(k)).length;
        if (overlap > 0 && overlap >= threadSet.size * 0.5) {
          matchedExisting = existingProjects.find((p) => p.id === projId) ?? null;
          break;
        }
      }

      // Compute avg intra-cluster similarity as confidence
      let simSum = 0;
      let simCount = 0;
      for (let i = 0; i < clusterIndices.length; i++) {
        for (let j = i + 1; j < clusterIndices.length; j++) {
          simSum += simMatrix[clusterIndices[i]][clusterIndices[j]];
          simCount++;
        }
      }
      const confidence = simCount > 0 ? simSum / simCount : 0;

      // Generate name from common subject tokens
      const name = this.generateClusterName(clusterThreads);

      const threadList = clusterThreads.map((t) => ({
        threadId: t.threadId,
        accountId: t.accountId,
      }));

      if (matchedExisting) {
        // Filter to only new threads not already in the project
        const existingSet = existingThreadSets.get(matchedExisting.id)!;
        const newThreads = threadList.filter(
          (t) => !existingSet.has(`${t.accountId}:${t.threadId}`)
        );
        if (newThreads.length > 0) {
          proposals.push({
            id: generateId(),
            name: matchedExisting.name,
            description: `Add ${newThreads.length} new thread(s) to existing project`,
            confidence,
            threads: newThreads,
            type: 'add_threads',
            existingProjectId: matchedExisting.id,
          });
        }
      } else {
        proposals.push({
          id: generateId(),
          name,
          description: `Auto-detected project with ${clusterThreads.length} related threads`,
          confidence,
          threads: threadList,
          type: 'new',
        });
      }
    }

    return proposals;
  }

  async applyProposals(
    seedId: string,
    userId: string,
    proposalIds: string[],
    proposals: ProjectProposal[]
  ): Promise<void> {
    const selectedIds = new Set(proposalIds);
    const toApply = proposals.filter((p) => selectedIds.has(p.id));

    for (const proposal of toApply) {
      if (proposal.type === 'add_threads' && proposal.existingProjectId) {
        await this.addThreadsToProject(proposal.existingProjectId, proposal.threads, userId);
      } else {
        const id = generateId();
        const now = Date.now();
        await this.db.run(
          `INSERT INTO wunderland_email_projects
            (id, seed_id, owner_user_id, name, description, status,
             auto_detected, detection_confidence, detection_method,
             thread_count, message_count, attachment_count,
             created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 'active', 1, ?, 'clustering', 0, 0, 0, ?, ?)`,
          [id, seedId, userId, proposal.name, proposal.description, proposal.confidence, now, now]
        );
        await this.addThreadsToProject(id, proposal.threads, userId);
      }
    }
  }

  // =========================================================================
  // Private helpers
  // =========================================================================

  private async refreshProjectCounts(projectId: string): Promise<void> {
    // Count threads
    const threadCount = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_email_project_threads WHERE project_id = ?`,
      [projectId]
    );

    // Count messages and participants across all project threads
    const stats = await this.db.get<{
      msg_count: number;
      att_count: number;
      last_activity: number | null;
    }>(
      `SELECT
         COUNT(*) as msg_count,
         COALESCE(SUM(m.attachment_count), 0) as att_count,
         MAX(m.internal_date) as last_activity
       FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?`,
      [projectId]
    );

    // Collect unique participant emails
    const participants = await this.db.all<{ from_address: string }>(
      `SELECT DISTINCT m.from_address
       FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?`,
      [projectId]
    );

    const participantEmails = participants.map((p) => p.from_address).join(',');
    const now = Date.now();

    await this.db.run(
      `UPDATE wunderland_email_projects
       SET thread_count = ?,
           message_count = ?,
           attachment_count = ?,
           participant_emails = ?,
           last_activity_at = ?,
           updated_at = ?
       WHERE id = ?`,
      [
        threadCount?.cnt ?? 0,
        stats?.msg_count ?? 0,
        stats?.att_count ?? 0,
        participantEmails || null,
        stats?.last_activity ?? null,
        now,
        projectId,
      ]
    );
  }

  /** Extract meaningful tokens from an email subject line */
  extractSubjectTokens(subject: string): string[] {
    // Remove Re:/Fwd: prefixes (possibly repeated)
    let cleaned = subject;
    let prev = '';
    while (cleaned !== prev) {
      prev = cleaned;
      cleaned = cleaned.replace(SUBJECT_PREFIXES, '');
    }

    return cleaned
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.replace(/[^a-z0-9]/g, ''))
      .filter((t) => t.length > 1 && !STOPWORDS.has(t));
  }

  /** Jaccard similarity of two sets */
  private jaccard(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 && b.size === 0) return 0;
    let intersection = 0;
    for (const item of a) {
      if (b.has(item)) intersection++;
    }
    const union = a.size + b.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  /** Compute combined similarity between two threads */
  private computeThreadSimilarity(
    a: {
      participants: Set<string>;
      subjectTokens: Set<string>;
      earliestDate: number;
      latestDate: number;
    },
    b: {
      participants: Set<string>;
      subjectTokens: Set<string>;
      earliestDate: number;
      latestDate: number;
    }
  ): number {
    const participantSim = this.jaccard(a.participants, b.participants);
    const subjectSim = this.jaccard(a.subjectTokens, b.subjectTokens);

    // Temporal proximity: use midpoints of each thread
    const midA = (a.earliestDate + a.latestDate) / 2;
    const midB = (b.earliestDate + b.latestDate) / 2;
    const daysBetween = Math.abs(midA - midB) / (1000 * 60 * 60 * 24);
    const temporalSim = 1 / (1 + daysBetween / 30);

    return participantSim * 0.3 + subjectSim * 0.3 + temporalSim * 0.4;
  }

  /** Simple agglomerative clustering with single-linkage */
  agglomerativeCluster(simMatrix: number[][], threshold: number): number[][] {
    const n = simMatrix.length;
    // Each element starts in its own cluster
    const clusters: number[][] = Array.from({ length: n }, (_, i) => [i]);
    const active = new Set<number>(Array.from({ length: n }, (_, i) => i));

    // Copy the sim matrix so we can update it
    const sim: number[][] = simMatrix.map((row) => [...row]);

    while (active.size > 1) {
      // Find pair with highest similarity
      let bestI = -1;
      let bestJ = -1;
      let bestSim = -Infinity;

      const activeArr = Array.from(active);
      for (let ii = 0; ii < activeArr.length; ii++) {
        for (let jj = ii + 1; jj < activeArr.length; jj++) {
          const i = activeArr[ii];
          const j = activeArr[jj];
          if (sim[i][j] > bestSim) {
            bestSim = sim[i][j];
            bestI = i;
            bestJ = j;
          }
        }
      }

      if (bestSim < threshold) break;

      // Merge bestJ into bestI
      clusters[bestI] = clusters[bestI].concat(clusters[bestJ]);
      clusters[bestJ] = [];
      active.delete(bestJ);

      // Recompute similarities for merged cluster (single-linkage = max)
      for (const k of active) {
        if (k === bestI) continue;
        sim[bestI][k] = Math.max(sim[bestI][k], sim[bestJ][k]);
        sim[k][bestI] = sim[bestI][k];
      }
    }

    return clusters.filter((c) => c.length > 0);
  }

  /** Generate a project name from common subject tokens in a cluster */
  private generateClusterName(threads: Array<{ subjectTokens: Set<string> }>): string {
    const tokenFreq = new Map<string, number>();
    for (const t of threads) {
      for (const token of t.subjectTokens) {
        tokenFreq.set(token, (tokenFreq.get(token) || 0) + 1);
      }
    }

    const sorted = Array.from(tokenFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([token]) => token.charAt(0).toUpperCase() + token.slice(1));

    return sorted.length > 0 ? sorted.join(' ') : 'Unnamed Project';
  }

  private inferAction(msg: MessageRow): string {
    const subj = (msg.subject ?? '').toLowerCase();
    if (subj.startsWith('fwd:') || subj.startsWith('fw:')) return 'forwarded';
    if (msg.in_reply_to) return 'replied';
    return 'sent';
  }
}
