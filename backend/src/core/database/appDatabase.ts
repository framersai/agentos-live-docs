// File: backend/src/core/database/appDatabase.ts
/**
 * @file appDatabase.ts
 * @description Provides an asynchronous storage abstraction for authentication and billing data.
 * The module resolves the best available adapter (Postgres -> better-sqlite3 -> Capacitor -> sql.js) and exposes
 * helper utilities for the rest of the backend.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  resolveStorageAdapter,
  type StorageAdapter
} from '@framers/sql-storage-adapter';

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

  await db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_subscription ON app_users(subscription_status);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_app_users_supabase ON app_users(supabase_user_id);');

  await db.exec(`
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
  await db.exec('CREATE INDEX IF NOT EXISTS idx_login_events_user ON login_events(user_id, created_at DESC);');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS global_access_logs (
      id TEXT PRIMARY KEY,
      ip_address TEXT,
      user_agent TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_global_access_logs_ip ON global_access_logs(ip_address, created_at DESC);');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS lemonsqueezy_events (
      id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      processed_at INTEGER,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL
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
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );
  `);
  await db.exec('CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_user_id);');

  await db.exec(`
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
  await db.exec('CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user ON checkout_sessions(user_id);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);');

  await db.exec(`
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
  await db.exec('CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);');

  await db.exec(`
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
  await db.exec('CREATE INDEX IF NOT EXISTS idx_org_invites_org ON organization_invites(organization_id);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_org_invites_email ON organization_invites(email);');
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

export const initializeAppDatabase = async (): Promise<void> => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    ensureDirectory();

    const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? undefined;

    try {
      adapter = await resolveStorageAdapter({
        filePath: DB_PATH,
        postgres: { connectionString },
        openOptions: { filePath: DB_PATH, connectionString }
      });
      usingInMemory = !adapter.capabilities.has('persistence');
      console.log(`[AppDatabase] Connected using adapter "${adapter.kind}". Persistence=${!usingInMemory}.`);
      await runInitialSchema(adapter);
      await ensureColumnExists(
        adapter,
        'app_users',
        'supabase_user_id',
        adapter.kind === 'postgres'
          ? 'ALTER TABLE app_users ADD COLUMN supabase_user_id TEXT'
          : 'ALTER TABLE app_users ADD COLUMN supabase_user_id TEXT;'
      );
    } catch (error) {
      usingInMemory = true;
      console.warn('[AppDatabase] Failed to initialise persistent storage. Falling back to in-memory sql.js.', error);
      adapter = await resolveStorageAdapter({
        filePath: DB_PATH,
        priority: ['sqljs']
      });
      await runInitialSchema(adapter);
    }
  })();

  await initPromise;
};

export const getAppDatabase = (): StorageAdapter => {
  if (!adapter) {
    throw new Error('App database has not been initialised. Call initializeAppDatabase() during startup.');
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
