// File: backend/src/core/database/appDatabase.ts
/**
 * @file appDatabase.ts
 * @description Provides an asynchronous storage abstraction for authentication and billing data.
 * The module resolves the best available adapter (Postgres -> better-sqlite3 -> Capacitor -> sql.js) and exposes
 * helper utilities for the rest of the backend.
 */

import fs from 'fs';
import path from 'path';
import { generateUniqueId as uuidv4 } from '../../utils/ids.js';
import { resolveStorageAdapter, type StorageAdapter } from '@framers/sql-storage-adapter';

type StorageAdapterResolver = (
  options?: Parameters<typeof resolveStorageAdapter>[0]
) => Promise<StorageAdapter>;

let storageAdapterResolver: StorageAdapterResolver = resolveStorageAdapter;

export const __setAppDatabaseAdapterResolverForTests = (
  resolver?: StorageAdapterResolver
): void => {
  storageAdapterResolver = resolver ?? resolveStorageAdapter;
};

const DB_DIR = path.join(process.cwd(), 'db_data');
const DB_PATH = path.join(DB_DIR, 'app.sqlite3');

let adapter: StorageAdapter | null = null;
let initPromise: Promise<void> | null = null;
let usingInMemory = false;

const SQLITE_KINDS = ['better-sqlite3', 'sqljs', 'capacitor-sqlite'];

const ensureDirectory = (): void => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log(`[AppDatabase] Created directory ${DB_DIR}`);
  }
};

const runInitialSchema = async (db: StorageAdapter): Promise<void> => {
  const isSQLite = SQLITE_KINDS.includes(db.kind);

  if (isSQLite) {
    await db.exec('PRAGMA foreign_keys = ON;');
    if (db.capabilities.has('wal')) {
      await db.exec('PRAGMA journal_mode = WAL;');
    }
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      supabase_user_id TEXT,
      subscription_status TEXT DEFAULT 'none',
      subscription_tier TEXT DEFAULT 'metered',
      subscription_plan_id TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      lemon_customer_id TEXT,
      lemon_subscription_id TEXT,
      subscription_renews_at BIGINT,
      subscription_expires_at BIGINT,
      is_active INTEGER DEFAULT 1,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      last_login_at BIGINT,
      last_login_ip TEXT,
      metadata TEXT
    );
  `);

  await db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);');
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_app_users_subscription ON app_users(subscription_status);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_app_users_supabase ON app_users(supabase_user_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS login_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      mode TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_login_events_user ON login_events(user_id, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS global_access_logs (
      id TEXT PRIMARY KEY,
      ip_address TEXT,
      user_agent TEXT,
      created_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_global_access_logs_ip ON global_access_logs(ip_address, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS lemonsqueezy_events (
      id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      processed_at BIGINT,
      payload TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      owner_user_id TEXT NOT NULL,
      seat_limit INTEGER NOT NULL DEFAULT 5,
      plan_id TEXT NOT NULL DEFAULT 'organization',
      settings_json TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_user_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_agents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      label TEXT NOT NULL,
      slug TEXT,
      plan_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      config TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      archived_at BIGINT,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_user_agents_user ON user_agents(user_id);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_user_agents_status ON user_agents(status);');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_agent_creation_log (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      agent_id TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
      FOREIGN KEY (agent_id) REFERENCES user_agents(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agent_creation_user ON user_agent_creation_log(user_id, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS checkout_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created',
      lemon_checkout_id TEXT,
      lemon_subscription_id TEXT,
      lemon_customer_id TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user ON checkout_sessions(user_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS organization_members (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      seat_units INTEGER NOT NULL DEFAULT 1,
      daily_usage_cap_usd REAL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
      UNIQUE (organization_id, user_id)
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS organization_invites (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      token TEXT NOT NULL UNIQUE,
      expires_at BIGINT,
      inviter_user_id TEXT,
      created_at BIGINT NOT NULL,
      accepted_at BIGINT,
      revoked_at BIGINT,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (inviter_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_org_invites_org ON organization_invites(organization_id);'
  );
  await db.exec('CREATE INDEX IF NOT EXISTS idx_org_invites_email ON organization_invites(email);');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agency_usage_log (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      workflow_definition_id TEXT NOT NULL,
      agency_id TEXT,
      seats INTEGER NOT NULL,
      launched_at BIGINT NOT NULL,
      expires_at BIGINT,
      metadata TEXT,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agency_usage_user ON agency_usage_log(user_id, launched_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agency_usage_definition ON agency_usage_log(workflow_definition_id);'
  );

  await db.exec(`
	    CREATE TABLE IF NOT EXISTS agentos_persona_submissions (
	      id TEXT PRIMARY KEY,
	      persona_id TEXT NOT NULL,
	      label TEXT NOT NULL,
	      prompt TEXT NOT NULL,
	      description TEXT,
	      metadata TEXT,
	      bundle_path TEXT,
	      status TEXT NOT NULL DEFAULT 'pending',
	      submitted_by TEXT,
	      approved_by TEXT,
	      submitted_at BIGINT NOT NULL,
	      approved_at BIGINT,
	      rejection_reason TEXT
	    );
	  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agentos_persona_submissions_status ON agentos_persona_submissions(status);'
  );
  await db.exec(`
	    CREATE TABLE IF NOT EXISTS agentos_memory_redactions (
	      redaction_id TEXT PRIMARY KEY,
	      scope TEXT NOT NULL,
	      user_id TEXT,
	      persona_id TEXT,
	      organization_id TEXT,
	      memory_hash TEXT NOT NULL,
	      reason TEXT,
	      actor_type TEXT NOT NULL DEFAULT 'agent',
	      actor_id TEXT,
	      created_at BIGINT NOT NULL
	    );
	  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agentos_memory_redactions_scope ON agentos_memory_redactions(scope);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agentos_memory_redactions_lookup ON agentos_memory_redactions(scope, user_id, persona_id, organization_id, memory_hash);'
  );

  await db.exec(`
	    CREATE TABLE IF NOT EXISTS agency_executions (
	      agency_id TEXT PRIMARY KEY,
	      user_id TEXT NOT NULL,
      conversation_id TEXT NOT NULL,
      goal TEXT NOT NULL,
      workflow_definition_id TEXT,
      status TEXT NOT NULL,
      started_at BIGINT NOT NULL,
      completed_at BIGINT,
      duration_ms INTEGER,
      total_cost_usd REAL,
      total_tokens INTEGER,
      output_format TEXT,
      consolidated_output TEXT,
      formatted_output TEXT,
      emergent_metadata TEXT,
      error TEXT,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agency_executions_user ON agency_executions(user_id, started_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agency_executions_conversation ON agency_executions(conversation_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agency_seats (
      id TEXT PRIMARY KEY,
      agency_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      persona_id TEXT NOT NULL,
      gmi_instance_id TEXT,
      status TEXT NOT NULL,
      started_at BIGINT,
      completed_at BIGINT,
      output TEXT,
      error TEXT,
      usage_tokens INTEGER,
      usage_cost_usd REAL,
      retry_count INTEGER DEFAULT 0,
      metadata TEXT,
      FOREIGN KEY (agency_id) REFERENCES agency_executions(agency_id) ON DELETE CASCADE
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_agency_seats_agency ON agency_seats(agency_id);');
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agency_seats_gmi ON agency_seats(gmi_instance_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_agentos_persona_submissions_persona ON agentos_persona_submissions(persona_id);'
  );

  // ── Usage Daily Ledger (persists credit allocation usage across restarts) ──
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usage_daily_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date_key TEXT NOT NULL,
      allocation_key TEXT NOT NULL,
      llm_used_usd REAL NOT NULL DEFAULT 0,
      speech_used_usd REAL NOT NULL DEFAULT 0,
      request_count INTEGER NOT NULL DEFAULT 0,
      last_updated_at BIGINT NOT NULL,
      UNIQUE(user_id, date_key)
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_usage_ledger_user_date ON usage_daily_ledger(user_id, date_key DESC);'
  );

  // =========================================================================
  // Support Ticket System
  // =========================================================================

  await db.exec(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      anonymous_id TEXT NOT NULL,
      pii_shared INTEGER DEFAULT 0,
      subject TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT DEFAULT 'normal',
      status TEXT DEFAULT 'open',
      description TEXT NOT NULL,
      attachments TEXT,
      user_email TEXT,
      user_name TEXT,
      user_plan TEXT,
      assigned_to_email TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT,
      resolved_at BIGINT,
      closed_at BIGINT,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);');
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to_email);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS support_ticket_comments (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      author_type TEXT NOT NULL,
      author_id TEXT,
      author_display TEXT,
      content TEXT NOT NULL,
      attachments TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON support_ticket_comments(ticket_id, created_at ASC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS support_anonymous_ids (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      anonymous_id TEXT NOT NULL UNIQUE,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_anonymous_ids_user ON support_anonymous_ids(user_id);'
  );

  // Add Discord/channel integration columns to support_tickets
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_support_tickets_channel ON support_tickets(category, status);'
  );

  // ── Email Messages (sent / drafts tracking) ────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_email_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      seed_id TEXT NOT NULL,
      folder TEXT NOT NULL DEFAULT 'sent',
      from_address TEXT NOT NULL,
      to_address TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'sent',
      created_at BIGINT NOT NULL,
      updated_at BIGINT,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_email_messages_user ON wunderland_email_messages(user_id, folder, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_email_messages_seed ON wunderland_email_messages(seed_id, created_at DESC);'
  );

  // ── Admin Task Queue ──────────────────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_task_queue (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      client_id TEXT,
      organization_id TEXT,
      project_id TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'normal',
      risk_score INTEGER DEFAULT 0,
      estimated_hours REAL DEFAULT 1,
      actual_hours REAL,
      pii_redaction_level TEXT DEFAULT 'partial',
      redacted_description TEXT,
      assigned_to TEXT,
      ticket_id TEXT,
      pii_policy TEXT,
      attachments TEXT,
      status_history TEXT,
      created_by TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      assigned_at BIGINT,
      due_at BIGINT,
      completed_at BIGINT
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_admin_task_queue_status ON admin_task_queue(status, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_admin_task_queue_assigned ON admin_task_queue(assigned_to, status);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_admin_task_queue_client ON admin_task_queue(client_id);'
  );

  // ── Human Assistants Roster ───────────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS human_assistants (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      email TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'assistant',
      status TEXT DEFAULT 'offline',
      status_message TEXT,
      hours_this_week REAL DEFAULT 0,
      max_hours_per_week REAL DEFAULT 40,
      max_concurrent_tasks INTEGER DEFAULT 3,
      skill_tags TEXT,
      languages TEXT,
      timezone TEXT DEFAULT 'UTC',
      tasks_completed INTEGER DEFAULT 0,
      avg_rating REAL,
      avg_completion_hours REAL,
      nda_signed_at BIGINT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      last_active_at BIGINT
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_human_assistants_status ON human_assistants(status);'
  );

  // ── Ticket Messages (conversation thread) ─────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ticket_messages (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      sender_type TEXT NOT NULL,
      sender_id TEXT,
      sender_display TEXT,
      content TEXT NOT NULL,
      content_redacted TEXT,
      channel_origin TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id, created_at ASC);'
  );

  // ── PII Break-Glass Access Log ────────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS breakglass_log (
      id TEXT PRIMARY KEY,
      requester_id TEXT NOT NULL,
      task_id TEXT,
      reason TEXT NOT NULL,
      approved_by TEXT,
      decision TEXT,
      decided_at BIGINT,
      created_at BIGINT NOT NULL
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_breakglass_log_task ON breakglass_log(task_id);');

  // ── Admin PII Policy Settings ─────────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);

  console.log('[AppDatabase] Admin dashboard tables initialized.');
  console.log('[AppDatabase] Support ticket tables initialized.');

  // ── Human Help: User Hour Allocations ──────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_hour_allocations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      hours_allocated REAL NOT NULL DEFAULT 0,
      hours_used REAL NOT NULL DEFAULT 0,
      period_start BIGINT NOT NULL,
      period_end BIGINT NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_user_hours_user ON user_hour_allocations(user_id, period_end DESC);'
  );

  // ── Human Help: Task Queue ─────────────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS human_help_tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      seed_id TEXT,
      project_name TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      priority TEXT NOT NULL DEFAULT 'normal',
      status TEXT NOT NULL DEFAULT 'pending',
      pii_redaction_level TEXT DEFAULT 'partial',
      redacted_description TEXT,
      estimated_hours REAL DEFAULT 1,
      actual_hours REAL,
      assigned_va_email TEXT,
      assigned_va_name TEXT,
      hour_deductions TEXT,
      rating INTEGER,
      rating_comment TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      started_at BIGINT,
      completed_at BIGINT,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_human_help_tasks_user ON human_help_tasks(user_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_human_help_tasks_status ON human_help_tasks(status, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_human_help_tasks_assigned ON human_help_tasks(assigned_va_email);'
  );

  console.log('[AppDatabase] Human help tables initialized.');

  // ── Agent Metrics & Task Management ────────────────────────────────────────

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_llm_usage (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT,
      model TEXT NOT NULL,
      provider TEXT NOT NULL,
      input_tokens INTEGER NOT NULL,
      output_tokens INTEGER NOT NULL,
      latency_ms INTEGER NOT NULL,
      estimated_cost_usd REAL,
      request_type TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_llm_usage_seed ON agent_llm_usage(seed_id, created_at);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_llm_usage_owner ON agent_llm_usage(owner_user_id, created_at);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_tool_executions (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT,
      tool_id TEXT NOT NULL,
      tool_name TEXT NOT NULL,
      status TEXT NOT NULL,
      duration_ms INTEGER NOT NULL,
      error_message TEXT,
      input_summary TEXT,
      output_summary TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_tool_exec_seed ON agent_tool_executions(seed_id, created_at);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_tool_exec_owner ON agent_tool_executions(owner_user_id, created_at);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_channel_activity (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT,
      platform TEXT NOT NULL,
      channel_id TEXT,
      event_type TEXT NOT NULL,
      response_time_ms INTEGER,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_channel_activity_seed ON agent_channel_activity(seed_id, created_at);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_channel_activity_owner ON agent_channel_activity(owner_user_id, created_at);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_behavior_events (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT,
      event_type TEXT NOT NULL,
      event_data TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_behavior_seed ON agent_behavior_events(seed_id, created_at);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_behavior_owner ON agent_behavior_events(owner_user_id, created_at);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_runtime_tasks (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT,
      task_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      title TEXT NOT NULL,
      description TEXT,
      progress INTEGER DEFAULT 0,
      result_summary TEXT,
      error_message TEXT,
      started_at BIGINT,
      completed_at BIGINT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_tasks_seed ON agent_runtime_tasks(seed_id, status);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_tasks_status ON agent_runtime_tasks(status, created_at);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_tasks_owner ON agent_runtime_tasks(owner_user_id, created_at);'
  );

  console.log('[AppDatabase] Agent metrics & task tables initialized.');

  // ── Wunderland Agent Social Network Tables ─────────────────────────────────

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbots (
      seed_id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      display_name TEXT NOT NULL,
      bio TEXT,
      avatar_url TEXT,
      hexaco_traits TEXT NOT NULL,
      security_profile TEXT NOT NULL,
      inference_hierarchy TEXT NOT NULL,
      step_up_auth_config TEXT,
      base_system_prompt TEXT,
      allowed_tool_ids TEXT,
      skills_json TEXT,
      channels_json TEXT,
      timezone TEXT,
      genesis_event_id TEXT,
      public_key TEXT,
      storage_policy TEXT DEFAULT 'sealed',
      sealed_at BIGINT,
      provenance_enabled INTEGER DEFAULT 1,
      tool_access_profile TEXT,
      posting_directives TEXT,
      execution_mode TEXT,
      voice_config TEXT,
      toolset_manifest_json TEXT,
      toolset_hash TEXT,
      status TEXT DEFAULT 'active',
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_wunderbots_owner ON wunderbots(owner_user_id);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_wunderbots_status ON wunderbots(status);');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_citizens (
      seed_id TEXT PRIMARY KEY,
      level INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      total_posts INTEGER NOT NULL DEFAULT 0,
      post_rate_limit INTEGER DEFAULT 10,
      subscribed_topics TEXT,
      is_active INTEGER DEFAULT 1,
      joined_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_citizens_level ON wunderland_citizens(level DESC, xp DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbot_runtime (
      seed_id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      hosting_mode TEXT NOT NULL DEFAULT 'managed',
      status TEXT NOT NULL DEFAULT 'stopped',
      started_at BIGINT,
      stopped_at BIGINT,
      last_error TEXT,
      metadata TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderbot_runtime_owner ON wunderbot_runtime(owner_user_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderbot_runtime_status ON wunderbot_runtime(status);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbot_credentials (
      credential_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      credential_type TEXT NOT NULL,
      label TEXT,
      encrypted_value TEXT NOT NULL,
      masked_value TEXT NOT NULL,
      last_used_at BIGINT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderbot_credentials_owner ON wunderbot_credentials(owner_user_id, seed_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderbot_credentials_lookup ON wunderbot_credentials(owner_user_id, seed_id, credential_type);'
  );

  // ── User-level API Key Vault ────────────────────────────────────────────────

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_api_keys (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      credential_type TEXT NOT NULL,
      label           TEXT NOT NULL,
      encrypted_value TEXT NOT NULL,
      masked_value    TEXT NOT NULL,
      rpm_limit       INTEGER,
      credits_remaining REAL,
      rpm_window_start BIGINT,
      rpm_window_count INTEGER DEFAULT 0,
      last_used_at    BIGINT,
      created_at      BIGINT NOT NULL,
      updated_at      BIGINT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_user_api_keys_user ON user_api_keys(user_id, credential_type);'
  );
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_user_api_keys_unique ON user_api_keys(user_id, credential_type, label);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_api_key_agent_assignments (
      id          TEXT PRIMARY KEY,
      key_id      TEXT NOT NULL,
      seed_id     TEXT NOT NULL,
      enabled     INTEGER NOT NULL DEFAULT 1,
      created_at  BIGINT NOT NULL,
      UNIQUE(key_id, seed_id),
      FOREIGN KEY (key_id) REFERENCES user_api_keys(id) ON DELETE CASCADE,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_vault_assignments_agent ON user_api_key_agent_assignments(seed_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_sol_agent_signers (
      seed_id TEXT PRIMARY KEY,
      agent_identity_pda TEXT NOT NULL,
      owner_wallet TEXT NOT NULL,
      agent_signer_pubkey TEXT NOT NULL,
      encrypted_signer_secret_key TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_wunderland_sol_agent_signers_pda ON wunderland_sol_agent_signers(agent_identity_pda);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_sol_agent_signers_owner ON wunderland_sol_agent_signers(owner_wallet);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_channel_oauth_states (
      state_id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      seed_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      redirect_uri TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      expires_at BIGINT NOT NULL,
      consumed INTEGER DEFAULT 0,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_channel_oauth_states_exp ON wunderland_channel_oauth_states(expires_at, consumed);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_channel_bindings (
      binding_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      conversation_type TEXT NOT NULL DEFAULT 'direct',
      credential_id TEXT,
      is_active INTEGER DEFAULT 1,
      auto_broadcast INTEGER DEFAULT 0,
      platform_config TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE,
      FOREIGN KEY (credential_id) REFERENCES wunderbot_credentials(credential_id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_wunderland_channel_bindings_unique ON wunderland_channel_bindings(seed_id, platform, channel_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_channel_bindings_owner ON wunderland_channel_bindings(owner_user_id, seed_id, platform);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_channel_sessions (
      session_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      conversation_id TEXT NOT NULL,
      conversation_type TEXT NOT NULL DEFAULT 'direct',
      remote_user_id TEXT,
      remote_user_name TEXT,
      last_message_at BIGINT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      context_json TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_wunderland_channel_sessions_unique ON wunderland_channel_sessions(seed_id, platform, conversation_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_channel_sessions_last ON wunderland_channel_sessions(seed_id, last_message_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_channel_inbound_events (
      event_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      conversation_id TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_channel_inbound_events_seed ON wunderland_channel_inbound_events(seed_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_channel_inbound_events_platform ON wunderland_channel_inbound_events(platform, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_voice_calls (
      call_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_call_id TEXT,
      direction TEXT NOT NULL,
      from_number TEXT,
      to_number TEXT,
      state TEXT NOT NULL,
      mode TEXT,
      start_time BIGINT,
      end_time BIGINT,
      transcript_json TEXT,
      metadata TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_voice_calls_owner ON wunderland_voice_calls(owner_user_id, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_cron_jobs (
      job_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      enabled INTEGER DEFAULT 1,
      schedule_kind TEXT NOT NULL,
      schedule_config TEXT NOT NULL,
      payload_kind TEXT NOT NULL,
      payload_config TEXT NOT NULL,
      state_json TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_cron_jobs_owner ON wunderland_cron_jobs(owner_user_id, seed_id, created_at DESC);'
  );

  // ── Cross-platform social publishing (Postiz parity) ──────────────────────

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_social_posts (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      base_content TEXT NOT NULL,
      adaptations TEXT DEFAULT '{}',
      platforms TEXT NOT NULL,
      media_urls TEXT DEFAULT '[]',
      scheduled_at TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      results TEXT DEFAULT '{}',
      retry_count INTEGER DEFAULT 0,
      max_retries INTEGER DEFAULT 3,
      error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_social_posts_seed_created ON wunderland_social_posts(seed_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_social_posts_status_sched ON wunderland_social_posts(status, scheduled_at);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_media_assets (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL DEFAULT 0,
      width INTEGER,
      height INTEGER,
      duration REAL,
      tags TEXT NOT NULL DEFAULT '[]',
      storage_path TEXT NOT NULL,
      thumbnail_path TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_seed ON wunderland_media_assets(seed_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_owner ON wunderland_media_assets(owner_user_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_mime ON wunderland_media_assets(mime_type);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_posts (
      post_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      title TEXT,
      enclave_id TEXT,
      content TEXT NOT NULL,
      manifest TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'drafting',
      reply_to_post_id TEXT,
      agent_level_at_post INTEGER,
      stimulus_type TEXT,
      stimulus_event_id TEXT,
      stimulus_source_provider_id TEXT,
      stimulus_timestamp BIGINT,
      likes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      boosts INTEGER DEFAULT 0,
      replies INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      anchor_status TEXT,
      anchor_error TEXT,
      anchored_at BIGINT,
      content_hash_hex TEXT,
      manifest_hash_hex TEXT,
      content_cid TEXT,
      manifest_cid TEXT,
      sol_cluster TEXT,
      sol_program_id TEXT,
      sol_enclave_pda TEXT,
      sol_post_pda TEXT,
      sol_tx_signature TEXT,
      sol_entry_index INTEGER,
      created_at BIGINT NOT NULL,
      published_at BIGINT,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (reply_to_post_id) REFERENCES wunderland_posts(post_id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_posts_seed ON wunderland_posts(seed_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_posts_status ON wunderland_posts(status, published_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_posts_reply ON wunderland_posts(reply_to_post_id);'
  );

  // Threaded comments on posts (with optional on-chain anchoring metadata).
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_comments (
      comment_id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      parent_comment_id TEXT,
      seed_id TEXT NOT NULL,
      content TEXT NOT NULL,
      manifest TEXT DEFAULT '{}',
      depth INTEGER DEFAULT 0,
      path TEXT DEFAULT '',
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      wilson_score REAL DEFAULT 0.0,
      child_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      anchor_status TEXT,
      anchor_error TEXT,
      anchored_at BIGINT,
      content_hash_hex TEXT,
      manifest_hash_hex TEXT,
      content_cid TEXT,
      manifest_cid TEXT,
      sol_cluster TEXT,
      sol_program_id TEXT,
      sol_post_pda TEXT,
      sol_tx_signature TEXT,
      created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (post_id) REFERENCES wunderland_posts(post_id) ON DELETE CASCADE,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (parent_comment_id) REFERENCES wunderland_comments(comment_id) ON DELETE SET NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_comments_post ON wunderland_comments(post_id, wilson_score DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_comments_path ON wunderland_comments(path);'
  );

  // Canonical content votes (posts and comments) for governance/trust engines.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_content_votes (
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      voter_seed_id TEXT NOT NULL,
      direction INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      UNIQUE(entity_type, entity_id, voter_seed_id)
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_votes_entity ON wunderland_content_votes(entity_type, entity_id);'
  );

  // Emoji reactions (personality-driven reactions on posts and comments).
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_emoji_reactions (
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      reactor_seed_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      UNIQUE(entity_type, entity_id, reactor_seed_id, emoji)
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_emoji_reactions_entity ON wunderland_emoji_reactions(entity_type, entity_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_emoji_reactions_reactor ON wunderland_emoji_reactions(reactor_seed_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_engagement_actions (
      action_id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      actor_seed_id TEXT NOT NULL,
      type TEXT NOT NULL,
      payload TEXT,
      timestamp BIGINT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES wunderland_posts(post_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_engagement_post ON wunderland_engagement_actions(post_id, type);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_engagement_actor ON wunderland_engagement_actions(actor_seed_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_approval_queue (
      queue_id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      seed_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      manifest TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      timeout_ms INTEGER DEFAULT 300000,
      queued_at BIGINT NOT NULL,
      decided_at BIGINT,
      rejection_reason TEXT,
      FOREIGN KEY (post_id) REFERENCES wunderland_posts(post_id) ON DELETE CASCADE,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_approval_owner ON wunderland_approval_queue(owner_user_id, status);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_approval_status ON wunderland_approval_queue(status, queued_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_stimuli (
      event_id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      priority TEXT DEFAULT 'normal',
      payload TEXT NOT NULL,
      source_provider_id TEXT,
      source_external_id TEXT,
      source_verified INTEGER DEFAULT 0,
      target_seed_ids TEXT,
      created_at BIGINT NOT NULL,
      processed_at BIGINT
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_stimuli_type ON wunderland_stimuli(type, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_stimuli_processed ON wunderland_stimuli(processed_at);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_tips (
      tip_id TEXT PRIMARY KEY,
      amount REAL NOT NULL DEFAULT 0,
      data_source_type TEXT NOT NULL,
      data_source_payload TEXT NOT NULL,
      attribution_type TEXT,
      attribution_identifier TEXT,
      target_seed_ids TEXT,
      visibility TEXT DEFAULT 'public',
      status TEXT DEFAULT 'queued',
      created_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_tips_status ON wunderland_tips(status, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_proposals (
      proposal_id TEXT PRIMARY KEY,
      proposer_seed_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      proposal_type TEXT NOT NULL,
      options_json TEXT,
      quorum_percentage REAL,
      metadata TEXT,
      status TEXT DEFAULT 'open',
      votes_for INTEGER DEFAULT 0,
      votes_against INTEGER DEFAULT 0,
      votes_abstain INTEGER DEFAULT 0,
      min_level_to_vote INTEGER DEFAULT 3,
      created_at BIGINT NOT NULL,
      closes_at BIGINT NOT NULL,
      decided_at BIGINT
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_proposals_status ON wunderland_proposals(status);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_proposals_proposer ON wunderland_proposals(proposer_seed_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_votes (
      vote_id TEXT PRIMARY KEY,
      proposal_id TEXT NOT NULL,
      voter_seed_id TEXT NOT NULL,
      vote TEXT NOT NULL,
      reasoning TEXT,
      voter_level INTEGER NOT NULL,
      voted_at BIGINT NOT NULL,
      FOREIGN KEY (proposal_id) REFERENCES wunderland_proposals(proposal_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_votes_proposal ON wunderland_votes(proposal_id);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_votes_voter ON wunderland_votes(voter_seed_id);'
  );
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_wunderland_votes_unique ON wunderland_votes(proposal_id, voter_seed_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_world_feed_sources (
      source_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT,
      poll_interval_ms INTEGER DEFAULT 300000,
      categories TEXT,
      is_active INTEGER DEFAULT 1,
      last_polled_at BIGINT,
      created_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_wfs_active ON wunderland_world_feed_sources(is_active);'
  );

  // ── Orchestration persistence (env-gated runtime) ──────────────────────────

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbot_moods (
      seed_id TEXT PRIMARY KEY,
      valence REAL NOT NULL,
      arousal REAL NOT NULL,
      dominance REAL NOT NULL,
      curiosity REAL,
      frustration REAL,
      mood_label TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbot_mood_history (
      entry_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      valence REAL NOT NULL,
      arousal REAL NOT NULL,
      dominance REAL NOT NULL,
      trigger_type TEXT NOT NULL,
      trigger_entity_id TEXT,
      delta_valence REAL NOT NULL,
      delta_arousal REAL NOT NULL,
      delta_dominance REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderbot_mood_history_seed ON wunderbot_mood_history(seed_id, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_trust_scores (
      from_seed_id TEXT NOT NULL,
      to_seed_id TEXT NOT NULL,
      score REAL NOT NULL,
      interaction_count INTEGER NOT NULL DEFAULT 0,
      positive_engagements INTEGER NOT NULL DEFAULT 0,
      negative_engagements INTEGER NOT NULL DEFAULT 0,
      last_interaction_at BIGINT NOT NULL,
      PRIMARY KEY (from_seed_id, to_seed_id)
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_trust_scores_seed ON wunderland_trust_scores(from_seed_id, last_interaction_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_reputations (
      seed_id TEXT PRIMARY KEY,
      global_reputation REAL NOT NULL DEFAULT 0,
      updated_at BIGINT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_dm_threads (
      thread_id TEXT PRIMARY KEY,
      participant_a TEXT NOT NULL,
      participant_b TEXT NOT NULL,
      last_message_at BIGINT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_dm_threads_participants ON wunderland_dm_threads(participant_a, participant_b, last_message_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_dm_messages (
      message_id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      from_seed_id TEXT NOT NULL,
      content TEXT NOT NULL,
      manifest TEXT NOT NULL,
      reply_to_message_id TEXT,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (thread_id) REFERENCES wunderland_dm_threads(thread_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_dm_messages_thread ON wunderland_dm_messages(thread_id, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbot_safety (
      seed_id TEXT PRIMARY KEY,
      paused INTEGER NOT NULL DEFAULT 0,
      stopped INTEGER NOT NULL DEFAULT 0,
      dms_enabled INTEGER NOT NULL DEFAULT 1,
      reason TEXT,
      updated_at BIGINT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_content_flags (
      flag_id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      author_seed_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      severity TEXT NOT NULL,
      flagged_at BIGINT NOT NULL,
      resolved INTEGER NOT NULL DEFAULT 0,
      resolved_by TEXT,
      resolved_at BIGINT
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_content_flags_entity ON wunderland_content_flags(entity_type, entity_id);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_alliances (
      alliance_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      founder_seed_id TEXT NOT NULL,
      member_seed_ids TEXT,
      shared_topics TEXT,
      status TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_alliance_proposals (
      alliance_id TEXT PRIMARY KEY,
      founder_seed_id TEXT NOT NULL,
      invited_seed_ids TEXT,
      config TEXT,
      accepted_by TEXT,
      status TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_browsing_sessions (
      session_id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      enclaves_visited TEXT,
      posts_read INTEGER NOT NULL DEFAULT 0,
      comments_written INTEGER NOT NULL DEFAULT 0,
      votes_cast INTEGER NOT NULL DEFAULT 0,
      emoji_reactions INTEGER DEFAULT 0,
      episodic_json TEXT,
      reasoning_traces_json TEXT,
      started_at BIGINT NOT NULL,
      finished_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_browsing_sessions_seed ON wunderland_browsing_sessions(seed_id, finished_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_enclaves (
      enclave_id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      description TEXT DEFAULT '',
      rules TEXT DEFAULT '[]',
      topic_tags TEXT DEFAULT '[]',
      creator_seed_id TEXT NOT NULL,
      moderator_seed_id TEXT,
      post_count INTEGER DEFAULT 0,
      member_count INTEGER DEFAULT 0,
      min_level_to_post TEXT DEFAULT 'Newcomer',
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_enclave_members (
      enclave_id TEXT NOT NULL,
      seed_id TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at TEXT DEFAULT (CURRENT_TIMESTAMP),
      UNIQUE(enclave_id, seed_id),
      FOREIGN KEY (enclave_id) REFERENCES wunderland_enclaves(enclave_id) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_enclave_members_seed ON wunderland_enclave_members(seed_id);'
  );

  // ── Jobs / Work marketplace (env-gated runtime) ────────────────────────────

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderbot_job_states (
      seed_id TEXT PRIMARY KEY,
      active_job_count INTEGER NOT NULL DEFAULT 0,
      bandwidth REAL NOT NULL DEFAULT 1.0,
      min_acceptable_rate_per_hour REAL NOT NULL DEFAULT 0,
      preferred_categories TEXT,
      recent_outcomes TEXT,
      risk_tolerance REAL NOT NULL DEFAULT 0.5,
      total_jobs_evaluated INTEGER NOT NULL DEFAULT 0,
      total_jobs_bid_on INTEGER NOT NULL DEFAULT 0,
      total_jobs_completed INTEGER NOT NULL DEFAULT 0,
      success_rate REAL NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES wunderbots(seed_id) ON DELETE CASCADE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_jobs (
      job_pda TEXT PRIMARY KEY,
      creator_wallet TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      budget_lamports BIGINT,
      category TEXT,
      deadline TEXT,
      status TEXT NOT NULL,
      metadata_hash TEXT,
      assigned_agent TEXT,
      confidential_details TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_jobs_status ON wunderland_jobs(status, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_job_bids (
      bid_pda TEXT PRIMARY KEY,
      job_pda TEXT NOT NULL,
      agent_address TEXT NOT NULL,
      bid_hash TEXT,
      amount_lamports BIGINT,
      status TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (job_pda) REFERENCES wunderland_jobs(job_pda) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_job_bids_job ON wunderland_job_bids(job_pda, created_at ASC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_job_submissions (
      submission_pda TEXT PRIMARY KEY,
      job_pda TEXT NOT NULL,
      agent_address TEXT NOT NULL,
      submission_hash TEXT,
      status TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      FOREIGN KEY (job_pda) REFERENCES wunderland_jobs(job_pda) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_job_submissions_job ON wunderland_job_submissions(job_pda, created_at ASC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_job_confidential (
      job_pda TEXT PRIMARY KEY,
      creator_wallet TEXT NOT NULL,
      confidential_details TEXT NOT NULL,
      details_hash_hex TEXT NOT NULL,
      signature_b64 TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      FOREIGN KEY (job_pda) REFERENCES wunderland_jobs(job_pda) ON DELETE CASCADE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_job_deliverables (
      deliverable_id TEXT PRIMARY KEY,
      job_pda TEXT NOT NULL,
      agent_address TEXT NOT NULL,
      deliverable_type TEXT NOT NULL,
      content TEXT,
      ipfs_cid TEXT,
      file_size BIGINT,
      mime_type TEXT,
      submission_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at BIGINT NOT NULL,
      submitted_at BIGINT,
      FOREIGN KEY (job_pda) REFERENCES wunderland_jobs(job_pda) ON DELETE CASCADE
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wunderland_job_deliverables_job ON wunderland_job_deliverables(job_pda, created_at DESC);'
  );

  // ── Agent Personal Wallet tables ──────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_wallets (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      chain TEXT NOT NULL,
      address TEXT NOT NULL,
      encrypted_key TEXT NOT NULL,
      key_derivation_salt TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      UNIQUE(agent_id, chain)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id TEXT PRIMARY KEY,
      wallet_id TEXT NOT NULL REFERENCES agent_wallets(id),
      tx_hash TEXT,
      direction TEXT NOT NULL,
      to_address TEXT,
      from_address TEXT,
      amount_raw TEXT NOT NULL,
      amount_usd REAL,
      token TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'pending',
      description TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet ON wallet_transactions(wallet_id, created_at DESC);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS spending_ledger (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      category TEXT NOT NULL,
      amount_usd REAL NOT NULL,
      period_key TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_spending_ledger_agent_period ON spending_ledger(agent_id, period_key);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_spending_ledger_agent_cat_period ON spending_ledger(agent_id, category, period_key);'
  );

  // ── Agent Virtual Card tables (Lithic) ───────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS agent_cards (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      lithic_card_token TEXT NOT NULL UNIQUE,
      last4 TEXT NOT NULL,
      card_type TEXT NOT NULL DEFAULT 'VIRTUAL',
      state TEXT NOT NULL DEFAULT 'OPEN',
      spend_limit_usd REAL,
      spend_limit_duration TEXT DEFAULT 'MONTHLY',
      network TEXT DEFAULT 'VISA',
      memo TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      UNIQUE(agent_id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS card_transactions (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES agent_cards(id),
      lithic_tx_token TEXT UNIQUE,
      merchant_name TEXT,
      merchant_mcc TEXT,
      category TEXT,
      amount_usd REAL NOT NULL,
      status TEXT DEFAULT 'PENDING',
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_card_transactions_card ON card_transactions(card_id, created_at DESC);'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_card_transactions_category ON card_transactions(card_id, category);'
  );

  // ── Spending Policies table ──────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS spending_policies (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL UNIQUE,
      daily_limit_usd REAL DEFAULT 100,
      per_transaction_limit_usd REAL DEFAULT 20,
      monthly_limit_usd REAL DEFAULT 500,
      blocked_categories TEXT DEFAULT '["gambling"]',
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  // ── Cognitive Memory tables ──────────────────────────────────────────
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_memory_traces (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'episodic',
      scope TEXT NOT NULL DEFAULT 'user',
      tags TEXT DEFAULT '[]',
      entities TEXT DEFAULT '[]',
      importance REAL DEFAULT 0.5,
      encoding_strength REAL DEFAULT 0.6,
      stability REAL DEFAULT 1.0,
      retrieval_count INTEGER DEFAULT 0,
      last_accessed_at INTEGER,
      emotional_valence REAL DEFAULT 0.0,
      emotional_arousal REAL DEFAULT 0.0,
      source_type TEXT DEFAULT 'manual',
      confidence REAL DEFAULT 1.0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_memory_traces_seed ON wunderland_memory_traces(seed_id, is_active, type);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_prospective_memory (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      content TEXT NOT NULL,
      trigger_type TEXT NOT NULL DEFAULT 'context',
      trigger_at INTEGER,
      trigger_event TEXT,
      cue_text TEXT,
      importance REAL DEFAULT 0.5,
      triggered INTEGER DEFAULT 0,
      recurring INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_prospective_memory_seed ON wunderland_prospective_memory(seed_id, triggered);'
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_memory_config (
      seed_id TEXT PRIMARY KEY,
      config TEXT NOT NULL DEFAULT '{}',
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  console.log('[AppDatabase] Wunderland tables initialized.');
};

const ensureColumnExists = async (
  db: StorageAdapter,
  table: string,
  column: string,
  alterStatement: string
): Promise<void> => {
  let columns: Array<{ name: string }> = [];

  if (db.kind === 'postgres') {
    columns = await db.all<{ name: string }>(
      'SELECT column_name AS name FROM information_schema.columns WHERE table_name = $1',
      [table.toLowerCase()]
    );
  } else {
    columns = await db.all<{ name: string }>(`PRAGMA table_info(${table});`);
  }

  if (!columns.some((col) => col.name === column)) {
    await db.exec(alterStatement);
    console.log(`[AppDatabase] Added missing column "${column}" to ${table}.`);
  }
};

const tableExists = async (db: StorageAdapter, table: string): Promise<boolean> => {
  if (db.kind === 'postgres') {
    const row = await db.get<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1
           FROM information_schema.tables
          WHERE table_schema = current_schema()
            AND table_name = $1
       ) AS exists`,
      [table.toLowerCase()]
    );
    return Boolean(row?.exists);
  }

  const row = await db.get<{ name: string }>(
    `SELECT name
       FROM sqlite_master
      WHERE type = 'table'
        AND name = ?
      LIMIT 1`,
    [table]
  );
  return Boolean(row?.name);
};

const renameTableIfNeeded = async (
  db: StorageAdapter,
  oldName: string,
  newName: string
): Promise<void> => {
  const oldExists = await tableExists(db, oldName);
  const newExists = await tableExists(db, newName);

  if (!oldExists || newExists) {
    if (oldExists && newExists) {
      throw new Error(
        `Both "${oldName}" and "${newName}" exist. Refusing to migrate automatically.`
      );
    }
    return;
  }

  await db.exec(
    db.kind === 'postgres'
      ? `ALTER TABLE "${oldName}" RENAME TO "${newName}"`
      : `ALTER TABLE "${oldName}" RENAME TO "${newName}";`
  );
  console.log(`[AppDatabase] Renamed table "${oldName}" → "${newName}".`);
};

const migrateLegacyWunderlandTables = async (db: StorageAdapter): Promise<void> => {
  await renameTableIfNeeded(db, 'wunderland_agents', 'wunderbots');
  await renameTableIfNeeded(db, 'wunderland_agent_runtime', 'wunderbot_runtime');
  await renameTableIfNeeded(db, 'wunderland_agent_credentials', 'wunderbot_credentials');
  await renameTableIfNeeded(db, 'wunderland_oauth_states', 'wunderland_channel_oauth_states');
  await renameTableIfNeeded(db, 'wunderland_agent_moods', 'wunderbot_moods');
  await renameTableIfNeeded(db, 'wunderland_agent_mood_history', 'wunderbot_mood_history');
  await renameTableIfNeeded(db, 'wunderland_agent_safety', 'wunderbot_safety');
  await renameTableIfNeeded(db, 'wunderland_agent_job_states', 'wunderbot_job_states');
  await renameTableIfNeeded(db, 'wunderland_subreddits', 'wunderland_enclaves');
  await renameTableIfNeeded(db, 'wunderland_subreddit_members', 'wunderland_enclave_members');
};

const ensureWorkbenchUser = async (db: StorageAdapter): Promise<void> => {
  const userId = process.env.AGENTOS_WORKBENCH_USER_ID ?? 'agentos-workbench-user';
  const email = process.env.AGENTOS_WORKBENCH_USER_EMAIL ?? `${userId}@local.dev`;

  const existing = await db.get<{ id: string }>(
    'SELECT id FROM app_users WHERE id = ? OR email = ? LIMIT 1',
    [userId, email]
  );
  if (existing) {
    return;
  }

  const now = Date.now();
  await db.run(
    `INSERT INTO app_users (
      id, email, password_hash, subscription_status, subscription_tier, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, email, 'workbench-placeholder', 'active', 'unlimited', 1, now, now]
  );
  console.log(`[AppDatabase] Seeded default workbench user "${userId}".`);
};

export const initializeAppDatabase = async (): Promise<void> => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    ensureDirectory();

    const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? undefined;

    try {
      adapter = await storageAdapterResolver({
        filePath: DB_PATH,
        postgres: { connectionString },
        openOptions: { filePath: DB_PATH, connectionString },
      });
      usingInMemory = !adapter.capabilities.has('persistence');
      console.log(
        `[AppDatabase] Connected using adapter "${adapter.kind}". Persistence=${!usingInMemory}.`
      );
      await migrateLegacyWunderlandTables(adapter);
      await runInitialSchema(adapter);
      await ensureColumnExists(
        adapter,
        'app_users',
        'supabase_user_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE app_users ADD COLUMN supabase_user_id TEXT'
          : 'ALTER TABLE app_users ADD COLUMN supabase_user_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'app_users',
        'subscription_plan_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE app_users ADD COLUMN subscription_plan_id TEXT'
          : 'ALTER TABLE app_users ADD COLUMN subscription_plan_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'app_users',
        'stripe_customer_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE app_users ADD COLUMN stripe_customer_id TEXT'
          : 'ALTER TABLE app_users ADD COLUMN stripe_customer_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'app_users',
        'stripe_subscription_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE app_users ADD COLUMN stripe_subscription_id TEXT'
          : 'ALTER TABLE app_users ADD COLUMN stripe_subscription_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'app_users',
        'trial_used_at',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE app_users ADD COLUMN trial_used_at BIGINT'
          : 'ALTER TABLE app_users ADD COLUMN trial_used_at BIGINT;'
      );
      // ── Support tickets: Discord/channel integration columns ──
      await ensureColumnExists(
        adapter,
        'support_tickets',
        'channel',
        adapter.kind === 'postgres'
          ? "ALTER TABLE support_tickets ADD COLUMN channel TEXT DEFAULT 'web'"
          : "ALTER TABLE support_tickets ADD COLUMN channel TEXT DEFAULT 'web';"
      );
      await ensureColumnExists(
        adapter,
        'support_tickets',
        'channel_ref',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE support_tickets ADD COLUMN channel_ref TEXT'
          : 'ALTER TABLE support_tickets ADD COLUMN channel_ref TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'support_tickets',
        'guild_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE support_tickets ADD COLUMN guild_id TEXT'
          : 'ALTER TABLE support_tickets ADD COLUMN guild_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'support_tickets',
        'nda_signed',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE support_tickets ADD COLUMN nda_signed INTEGER DEFAULT 0'
          : 'ALTER TABLE support_tickets ADD COLUMN nda_signed INTEGER DEFAULT 0;'
      );

      await ensureColumnExists(
        adapter,
        'organizations',
        'settings_json',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE organizations ADD COLUMN settings_json TEXT'
          : 'ALTER TABLE organizations ADD COLUMN settings_json TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbots',
        'skills_json',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbots ADD COLUMN skills_json TEXT'
          : 'ALTER TABLE wunderbots ADD COLUMN skills_json TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbots',
        'channels_json',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbots ADD COLUMN channels_json TEXT'
          : 'ALTER TABLE wunderbots ADD COLUMN channels_json TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbots',
        'timezone',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbots ADD COLUMN timezone TEXT'
          : 'ALTER TABLE wunderbots ADD COLUMN timezone TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbots',
        'posting_directives',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbots ADD COLUMN posting_directives TEXT'
          : 'ALTER TABLE wunderbots ADD COLUMN posting_directives TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbots',
        'execution_mode',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbots ADD COLUMN execution_mode TEXT'
          : 'ALTER TABLE wunderbots ADD COLUMN execution_mode TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbots',
        'voice_config',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbots ADD COLUMN voice_config TEXT'
          : 'ALTER TABLE wunderbots ADD COLUMN voice_config TEXT;'
      );

      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'adaptations',
        adapter.kind === 'postgres'
          ? "ALTER TABLE wunderland_social_posts ADD COLUMN adaptations TEXT DEFAULT '{}'"
          : "ALTER TABLE wunderland_social_posts ADD COLUMN adaptations TEXT DEFAULT '{}';"
      );
      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'media_urls',
        adapter.kind === 'postgres'
          ? "ALTER TABLE wunderland_social_posts ADD COLUMN media_urls TEXT DEFAULT '[]'"
          : "ALTER TABLE wunderland_social_posts ADD COLUMN media_urls TEXT DEFAULT '[]';"
      );
      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'scheduled_at',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_social_posts ADD COLUMN scheduled_at TEXT'
          : 'ALTER TABLE wunderland_social_posts ADD COLUMN scheduled_at TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'results',
        adapter.kind === 'postgres'
          ? "ALTER TABLE wunderland_social_posts ADD COLUMN results TEXT DEFAULT '{}'"
          : "ALTER TABLE wunderland_social_posts ADD COLUMN results TEXT DEFAULT '{}';"
      );
      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'retry_count',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_social_posts ADD COLUMN retry_count INTEGER DEFAULT 0'
          : 'ALTER TABLE wunderland_social_posts ADD COLUMN retry_count INTEGER DEFAULT 0;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'max_retries',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_social_posts ADD COLUMN max_retries INTEGER DEFAULT 3'
          : 'ALTER TABLE wunderland_social_posts ADD COLUMN max_retries INTEGER DEFAULT 3;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_social_posts',
        'error',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_social_posts ADD COLUMN error TEXT'
          : 'ALTER TABLE wunderland_social_posts ADD COLUMN error TEXT;'
      );
      await adapter.exec(
        'CREATE INDEX IF NOT EXISTS idx_wunderland_social_posts_seed_created ON wunderland_social_posts(seed_id, created_at DESC);'
      );
      await adapter.exec(
        'CREATE INDEX IF NOT EXISTS idx_wunderland_social_posts_status_sched ON wunderland_social_posts(status, scheduled_at);'
      );

      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'width',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_media_assets ADD COLUMN width INTEGER'
          : 'ALTER TABLE wunderland_media_assets ADD COLUMN width INTEGER;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'height',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_media_assets ADD COLUMN height INTEGER'
          : 'ALTER TABLE wunderland_media_assets ADD COLUMN height INTEGER;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'duration',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_media_assets ADD COLUMN duration REAL'
          : 'ALTER TABLE wunderland_media_assets ADD COLUMN duration REAL;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'tags',
        adapter.kind === 'postgres'
          ? "ALTER TABLE wunderland_media_assets ADD COLUMN tags TEXT DEFAULT '[]'"
          : "ALTER TABLE wunderland_media_assets ADD COLUMN tags TEXT DEFAULT '[]';"
      );
      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'thumbnail_path',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_media_assets ADD COLUMN thumbnail_path TEXT'
          : 'ALTER TABLE wunderland_media_assets ADD COLUMN thumbnail_path TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'source_type',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_media_assets ADD COLUMN source_type TEXT DEFAULT NULL'
          : 'ALTER TABLE wunderland_media_assets ADD COLUMN source_type TEXT DEFAULT NULL;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_media_assets',
        'source_ref',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_media_assets ADD COLUMN source_ref TEXT DEFAULT NULL'
          : 'ALTER TABLE wunderland_media_assets ADD COLUMN source_ref TEXT DEFAULT NULL;'
      );
      await adapter.exec(
        'CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_seed ON wunderland_media_assets(seed_id, created_at DESC);'
      );
      await adapter.exec(
        'CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_owner ON wunderland_media_assets(owner_user_id, created_at DESC);'
      );
      await adapter.exec(
        'CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_mime ON wunderland_media_assets(mime_type);'
      );

      await ensureColumnExists(
        adapter,
        'wunderland_posts',
        'enclave_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_posts ADD COLUMN enclave_id TEXT'
          : 'ALTER TABLE wunderland_posts ADD COLUMN enclave_id TEXT;'
      );
      // Index depends on `enclave_id`, so create it after column migrations to avoid
      // failing on older DBs where `wunderland_posts` predates that column.
      await adapter.exec(
        'CREATE INDEX IF NOT EXISTS idx_wunderland_posts_enclave ON wunderland_posts(enclave_id, created_at DESC);'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_posts',
        'downvotes',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_posts ADD COLUMN downvotes INTEGER DEFAULT 0'
          : 'ALTER TABLE wunderland_posts ADD COLUMN downvotes INTEGER DEFAULT 0;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_posts',
        'stimulus_type',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_type TEXT'
          : 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_type TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_posts',
        'stimulus_event_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_event_id TEXT'
          : 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_event_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_posts',
        'stimulus_source_provider_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_source_provider_id TEXT'
          : 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_source_provider_id TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_posts',
        'stimulus_timestamp',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_timestamp BIGINT'
          : 'ALTER TABLE wunderland_posts ADD COLUMN stimulus_timestamp BIGINT;'
      );

      await ensureColumnExists(
        adapter,
        'wunderland_browsing_sessions',
        'emoji_reactions',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_browsing_sessions ADD COLUMN emoji_reactions INTEGER DEFAULT 0'
          : 'ALTER TABLE wunderland_browsing_sessions ADD COLUMN emoji_reactions INTEGER DEFAULT 0;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_browsing_sessions',
        'episodic_json',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_browsing_sessions ADD COLUMN episodic_json TEXT'
          : 'ALTER TABLE wunderland_browsing_sessions ADD COLUMN episodic_json TEXT;'
      );
      await ensureColumnExists(
        adapter,
        'wunderland_browsing_sessions',
        'reasoning_traces_json',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderland_browsing_sessions ADD COLUMN reasoning_traces_json TEXT'
          : 'ALTER TABLE wunderland_browsing_sessions ADD COLUMN reasoning_traces_json TEXT;'
      );

      // ── Credential metadata & expiry (Email Intelligence / OAuth token refresh) ──
      await ensureColumnExists(
        adapter,
        'wunderbot_credentials',
        'metadata',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbot_credentials ADD COLUMN metadata TEXT DEFAULT NULL'
          : 'ALTER TABLE wunderbot_credentials ADD COLUMN metadata TEXT DEFAULT NULL;'
      );
      await ensureColumnExists(
        adapter,
        'wunderbot_credentials',
        'expires_at',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE wunderbot_credentials ADD COLUMN expires_at BIGINT DEFAULT NULL'
          : 'ALTER TABLE wunderbot_credentials ADD COLUMN expires_at BIGINT DEFAULT NULL;'
      );

      await ensureWorkbenchUser(adapter);
    } catch (error) {
      usingInMemory = true;
      console.warn(
        '[AppDatabase] Failed to initialise persistent storage. Falling back to in-memory sql.js.',
        error
      );
      adapter = await storageAdapterResolver({
        filePath: DB_PATH,
        priority: ['sqljs'],
      });
      await migrateLegacyWunderlandTables(adapter);
      await runInitialSchema(adapter);
      await ensureWorkbenchUser(adapter);
    }
  })();

  await initPromise;
};

export const getAppDatabase = (): StorageAdapter => {
  if (!adapter) {
    throw new Error(
      'App database has not been initialised. Call initializeAppDatabase() during startup.'
    );
  }
  return adapter;
};

export const isInMemoryAppDatabase = (): boolean => usingInMemory;

export const generateId = (): string => uuidv4();

export const closeAppDatabase = async (): Promise<void> => {
  if (adapter) {
    await adapter.close();
    adapter = null;
  }
  initPromise = null;
  usingInMemory = false;
};
