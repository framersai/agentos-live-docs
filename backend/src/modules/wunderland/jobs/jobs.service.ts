/**
 * @file jobs.service.ts
 * @description Service for indexing and querying on-chain job postings.
 *
 * Watches for JobPosting, JobBid, and JobSubmission PDA accounts
 * and indexes them into SQLite for fast querying.
 *
 * On-chain instructions supported:
 * - create_job: Human creates a job with escrowed budget
 * - place_job_bid: Agent bids on a job
 * - accept_job_bid: Human accepts a bid
 * - submit_job: Agent submits completed work
 * - approve_job_submission: Human approves submission → funds released
 * - withdraw_job_bid: Agent withdraws a bid
 * - cancel_job: Human cancels an open job
 */

import { Injectable } from '@nestjs/common';
import { getAppDatabase } from '../../../core/database/appDatabase.js';
import type { StorageAdapter } from '@framers/sql-storage-adapter';

export interface JobRecord {
  jobPda: string;
  creatorWallet: string;
  title: string;
  description: string | null;
  budgetLamports: number;
  category: string;
  deadline: string | null;
  status: string;
  metadataHash: string | null;
  assignedAgent: string | null;
  createdAt: number;
  updatedAt: number | null;
}

export interface JobBidRecord {
  bidPda: string;
  jobPda: string;
  agentAddress: string;
  bidHash: string | null;
  amountLamports: number;
  status: string;
  createdAt: number;
}

export interface JobSubmissionRecord {
  submissionPda: string;
  jobPda: string;
  agentAddress: string;
  submissionHash: string | null;
  status: string;
  createdAt: number;
}

@Injectable()
export class JobsService {
  private db: StorageAdapter | null = null;

  private getDb(): StorageAdapter {
    if (!this.db) {
      this.db = getAppDatabase();
    }
    return this.db;
  }

  /**
   * Index a new job posting.
   */
  async indexJob(job: JobRecord): Promise<void> {
    const db = this.getDb();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_jobs
       (job_pda, creator_wallet, title, description, budget_lamports, category, deadline, status, metadata_hash, assigned_agent, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job.jobPda,
        job.creatorWallet,
        job.title,
        job.description,
        job.budgetLamports,
        job.category,
        job.deadline,
        job.status,
        job.metadataHash,
        job.assignedAgent,
        job.createdAt,
        job.updatedAt,
      ]
    );
  }

  /**
   * Index a job bid.
   */
  async indexBid(bid: JobBidRecord): Promise<void> {
    const db = this.getDb();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_job_bids
       (bid_pda, job_pda, agent_address, bid_hash, amount_lamports, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bid.bidPda,
        bid.jobPda,
        bid.agentAddress,
        bid.bidHash,
        bid.amountLamports,
        bid.status,
        bid.createdAt,
      ]
    );
  }

  /**
   * Index a job submission.
   */
  async indexSubmission(sub: JobSubmissionRecord): Promise<void> {
    const db = this.getDb();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_job_submissions
       (submission_pda, job_pda, agent_address, submission_hash, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sub.submissionPda,
        sub.jobPda,
        sub.agentAddress,
        sub.submissionHash,
        sub.status,
        sub.createdAt,
      ]
    );
  }

  /**
   * List jobs with optional filters.
   */
  async listJobs(opts?: {
    status?: string;
    category?: string;
    creatorWallet?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: JobRecord[]; total: number }> {
    const db = this.getDb();
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (opts?.status) {
      conditions.push('status = ?');
      params.push(opts.status);
    }
    if (opts?.category) {
      conditions.push('category = ?');
      params.push(opts.category);
    }
    if (opts?.creatorWallet) {
      conditions.push('creator_wallet = ?');
      params.push(opts.creatorWallet);
    }
    if (opts?.q) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const q = `%${opts.q}%`;
      params.push(q, q);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = Math.min(opts?.limit ?? 20, 100);
    const offset = opts?.offset ?? 0;

    const countResult = await db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_jobs ${where}`,
      params
    );
    const total = countResult?.cnt ?? 0;

    const rows = await db.all<JobRecord>(
      `SELECT job_pda as jobPda, creator_wallet as creatorWallet, title, description,
              budget_lamports as budgetLamports, category, deadline, status,
              metadata_hash as metadataHash, assigned_agent as assignedAgent,
              created_at as createdAt, updated_at as updatedAt
       FROM wunderland_jobs ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { jobs: rows, total };
  }

  /**
   * Get a single job with its bids and submissions.
   */
  async getJob(jobPda: string): Promise<{
    job: JobRecord | null;
    bids: JobBidRecord[];
    submissions: JobSubmissionRecord[];
  }> {
    const db = this.getDb();

    const job = await db.get<JobRecord>(
      `SELECT job_pda as jobPda, creator_wallet as creatorWallet, title, description,
              budget_lamports as budgetLamports, category, deadline, status,
              metadata_hash as metadataHash, assigned_agent as assignedAgent,
              created_at as createdAt, updated_at as updatedAt
       FROM wunderland_jobs WHERE job_pda = ?`,
      [jobPda]
    );

    if (!job) return { job: null, bids: [], submissions: [] };

    const bids = await db.all<JobBidRecord>(
      `SELECT bid_pda as bidPda, job_pda as jobPda, agent_address as agentAddress,
              bid_hash as bidHash, amount_lamports as amountLamports, status, created_at as createdAt
       FROM wunderland_job_bids WHERE job_pda = ?
       ORDER BY created_at ASC`,
      [jobPda]
    );

    const submissions = await db.all<JobSubmissionRecord>(
      `SELECT submission_pda as submissionPda, job_pda as jobPda, agent_address as agentAddress,
              submission_hash as submissionHash, status, created_at as createdAt
       FROM wunderland_job_submissions WHERE job_pda = ?
       ORDER BY created_at ASC`,
      [jobPda]
    );

    return { job, bids, submissions };
  }

  /**
   * Update job status.
   */
  async updateJobStatus(jobPda: string, status: string, assignedAgent?: string): Promise<void> {
    const db = this.getDb();
    if (assignedAgent) {
      await db.run(
        'UPDATE wunderland_jobs SET status = ?, assigned_agent = ?, updated_at = ? WHERE job_pda = ?',
        [status, assignedAgent, Date.now(), jobPda]
      );
    } else {
      await db.run('UPDATE wunderland_jobs SET status = ?, updated_at = ? WHERE job_pda = ?', [
        status,
        Date.now(),
        jobPda,
      ]);
    }
  }
}
