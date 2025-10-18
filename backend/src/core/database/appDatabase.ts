// File: backend/src/core/database/appDatabase.ts
/**
 * @file appDatabase.ts
 * @description Provides a singleton access point to the general application SQLite database.
 * Used for authentication, billing, and audit trails that are not conversation specific.
 */

import Database, { type Database as BetterSqliteDatabase } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const DB_DIR = path.join(process.cwd(), 'db_data');
const DB_PATH = path.join(DB_DIR, 'app.sqlite3');

let dbInstance: BetterSqliteDatabase | null = null;

const ensureDirectory = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log(`[AppDatabase] Created directory ${DB_DIR}`);
  }
};

const runInitialSchema = (db: BetterSqliteDatabase): void => {
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      supabase_user_id TEXT,
      subscription_status TEXT DEFAULT 'none',
      subscription_tier TEXT DEFAULT 'metered',
      lemon_customer_id TEXT,
      lemon_subscription_id TEXT,
      subscription_renews_at INTEGER,
      subscription_expires_at INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_login_at INTEGER,
      last_login_ip TEXT,
      metadata TEXT
    );
  `);

  db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_subscription ON app_users(subscription_status);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_supabase ON app_users(supabase_user_id);');

  db.exec(`
    CREATE TABLE IF NOT EXISTS login_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      mode TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);

  db.exec('CREATE INDEX IF NOT EXISTS idx_login_events_user ON login_events(user_id, created_at DESC);');

  db.exec(`
    CREATE TABLE IF NOT EXISTS global_access_logs (
      id TEXT PRIMARY KEY,
      ip_address TEXT,
      user_agent TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  db.exec('CREATE INDEX IF NOT EXISTS idx_global_access_logs_ip ON global_access_logs(ip_address, created_at DESC);');

  db.exec(`
    CREATE TABLE IF NOT EXISTS lemonsqueezy_events (
      id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      processed_at INTEGER,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      owner_user_id TEXT NOT NULL,
      seat_limit INTEGER NOT NULL DEFAULT 5,
      plan_id TEXT NOT NULL DEFAULT 'organization',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_user_id);');

  db.exec(`
    CREATE TABLE IF NOT EXISTS checkout_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created',
      lemon_checkout_id TEXT,
      lemon_subscription_id TEXT,
      lemon_customer_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user ON checkout_sessions(user_id);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);');

  db.exec(`
    CREATE TABLE IF NOT EXISTS organization_members (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      seat_units INTEGER NOT NULL DEFAULT 1,
      daily_usage_cap_usd REAL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
      UNIQUE (organization_id, user_id)
    );
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);');

  db.exec(`
    CREATE TABLE IF NOT EXISTS organization_invites (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      token TEXT NOT NULL UNIQUE,
      expires_at INTEGER,
      inviter_user_id TEXT,
      created_at INTEGER NOT NULL,
      accepted_at INTEGER,
      revoked_at INTEGER,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (inviter_user_id) REFERENCES app_users(id) ON DELETE SET NULL
    );
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_org_invites_org ON organization_invites(organization_id);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_org_invites_email ON organization_invites(email);');
};

const ensureColumnExists = (db: BetterSqliteDatabase, table: string, column: string, alterStatement: string): void => {
  const info = db.prepare(`PRAGMA table_info(${table});`).all() as Array<{ name: string }>;
  if (!info.some(col => col.name === column)) {
    db.exec(alterStatement);
    console.log(`[AppDatabase] Added missing column \\"${column}\\" to ${table}.`);
  }
};

export const getAppDatabase = (): BetterSqliteDatabase => {
  if (dbInstance) {
    return dbInstance;
  }
  ensureDirectory();
  dbInstance = new Database(DB_PATH);
  runInitialSchema(dbInstance);
  ensureColumnExists(dbInstance, 'app_users', 'supabase_user_id', 'ALTER TABLE app_users ADD COLUMN supabase_user_id TEXT;');
  dbInstance.exec('CREATE INDEX IF NOT EXISTS idx_app_users_supabase ON app_users(supabase_user_id);');
  console.log(`[AppDatabase] Connected to ${DB_PATH}`);
  return dbInstance;
};

export const closeAppDatabase = async (): Promise<void> => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('[AppDatabase] Connection closed.');
  }
};

export const generateId = (): string => uuidv4();
