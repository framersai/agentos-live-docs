// File: backend/src/features/auth/user.repository.ts
/**
 * @file user.repository.ts
 * @description Persistence helper for authentication and subscription related data.
 */

import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
import { getAppDatabase, generateId } from '../../core/database/appDatabase.js';

export interface AppUser {
  id: string;
  email: string;
  password_hash: string;
  supabase_user_id?: string | null;
  subscription_status: string;
  subscription_tier: string;
  lemon_customer_id?: string | null;
  lemon_subscription_id?: string | null;
  subscription_renews_at?: number | null;
  subscription_expires_at?: number | null;
  is_active: number;
  created_at: number;
  updated_at: number;
  last_login_at?: number | null;
  last_login_ip?: string | null;
  metadata?: string | null;
}

const db: BetterSqliteDatabase = getAppDatabase();

export const findUserByEmail = (email: string): AppUser | null => {
  return db.prepare<AppUser>('SELECT * FROM app_users WHERE email = ? LIMIT 1').get(email) ?? null;
};

export const findUserById = (id: string): AppUser | null => {
  return db.prepare<AppUser>('SELECT * FROM app_users WHERE id = ? LIMIT 1').get(id) ?? null;
};

export const createUser = (data: {
  email: string;
  passwordHash: string;
  subscriptionStatus?: string;
  subscriptionTier?: string;
  lemonCustomerId?: string;
  lemonSubscriptionId?: string;
  supabaseUserId?: string | null;
  metadata?: Record<string, unknown>;
}): AppUser => {
  const id = generateId();
  const now = Date.now();
  db.prepare(`
    INSERT INTO app_users (
      id, email, password_hash, supabase_user_id, subscription_status, subscription_tier, lemon_customer_id,
      lemon_subscription_id, is_active, created_at, updated_at, metadata
    ) VALUES (@id, @email, @password_hash, @supabase_user_id, @subscription_status, @subscription_tier, @lemon_customer_id,
             @lemon_subscription_id, 1, @created_at, @updated_at, @metadata)
  `).run({
    id,
    email: data.email,
    password_hash: data.passwordHash,
    supabase_user_id: data.supabaseUserId ?? null,
    subscription_status: data.subscriptionStatus ?? 'active',
    subscription_tier: data.subscriptionTier ?? 'unlimited',
    lemon_customer_id: data.lemonCustomerId ?? null,
    lemon_subscription_id: data.lemonSubscriptionId ?? null,
    created_at: now,
    updated_at: now,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
  });

  return findUserById(id) as AppUser;
};

export const findUserBySupabaseId = (supabaseUserId: string): AppUser | null => {
  if (!supabaseUserId) return null;
  return db.prepare<AppUser>('SELECT * FROM app_users WHERE supabase_user_id = ? LIMIT 1').get(supabaseUserId) ?? null;
};

export const updateUserSupabaseLink = (userId: string, supabaseUserId: string | null): void => {
  db.prepare(`
    UPDATE app_users
       SET supabase_user_id = @supabase_user_id,
           updated_at = @updated_at
     WHERE id = @user_id
  `).run({ user_id: userId, supabase_user_id: supabaseUserId ?? null, updated_at: Date.now() });
};

export const updateUserProfile = (userId: string, data: {
  email?: string;
  subscriptionStatus?: string | null;
  subscriptionTier?: string | null;
  lemonCustomerId?: string | null;
  lemonSubscriptionId?: string | null;
  metadata?: Record<string, unknown> | null;
}): void => {
  db.prepare(`
    UPDATE app_users
       SET email = COALESCE(@email, email),
           subscription_status = COALESCE(@subscription_status, subscription_status),
           subscription_tier = COALESCE(@subscription_tier, subscription_tier),
           lemon_customer_id = COALESCE(@lemon_customer_id, lemon_customer_id),
           lemon_subscription_id = COALESCE(@lemon_subscription_id, lemon_subscription_id),
           metadata = COALESCE(@metadata, metadata),
           updated_at = @updated_at
     WHERE id = @user_id
  `).run({
    user_id: userId,
    email: data.email ?? null,
    subscription_status: data.subscriptionStatus ?? null,
    subscription_tier: data.subscriptionTier ?? null,
    lemon_customer_id: data.lemonCustomerId ?? null,
    lemon_subscription_id: data.lemonSubscriptionId ?? null,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    updated_at: Date.now(),
  });
};

export const updateUserSubscription = (userId: string, updates: {
  status?: string;
  tier?: string;
  lemonCustomerId?: string | null;
  lemonSubscriptionId?: string | null;
  renewsAt?: number | null;
  expiresAt?: number | null;
}): void => {
  const now = Date.now();
  db.prepare(`
    UPDATE app_users
       SET subscription_status = COALESCE(@status, subscription_status),
           subscription_tier = COALESCE(@tier, subscription_tier),
           lemon_customer_id = COALESCE(@lemonCustomerId, lemon_customer_id),
           lemon_subscription_id = COALESCE(@lemonSubscriptionId, lemon_subscription_id),
           subscription_renews_at = @renewsAt,
           subscription_expires_at = @expiresAt,
           updated_at = @updated_at
     WHERE id = @userId
  `).run({
    userId,
    status: updates.status ?? null,
    tier: updates.tier ?? null,
    lemonCustomerId: updates.lemonCustomerId ?? null,
    lemonSubscriptionId: updates.lemonSubscriptionId ?? null,
    renewsAt: updates.renewsAt ?? null,
    expiresAt: updates.expiresAt ?? null,
    updated_at: now,
  });
};

export const recordLoginEvent = (data: { userId?: string; mode: string; ip?: string | null; userAgent?: string | null }): void => {
  const id = generateId();
  const now = Date.now();
  db.prepare(`
    INSERT INTO login_events (id, user_id, mode, ip_address, user_agent, created_at)
    VALUES (@id, @user_id, @mode, @ip_address, @user_agent, @created_at)
  `).run({
    id,
    user_id: data.userId ?? null,
    mode: data.mode,
    ip_address: data.ip ?? null,
    user_agent: data.userAgent ?? null,
    created_at: now,
  });
};

export const updateLastLogin = (userId: string, ip?: string | null): void => {
  db.prepare(`
    UPDATE app_users
       SET last_login_at = @last_login_at,
           last_login_ip = COALESCE(@last_login_ip, last_login_ip),
           updated_at = @updated_at
     WHERE id = @user_id
  `).run({
    user_id: userId,
    last_login_at: Date.now(),
    last_login_ip: ip ?? null,
    updated_at: Date.now(),
  });
};

export const logGlobalAccess = (data: { ip?: string | null; userAgent?: string | null }): void => {
  const id = generateId();
  const now = Date.now();
  db.prepare(`
    INSERT INTO global_access_logs (id, ip_address, user_agent, created_at)
    VALUES (@id, @ip_address, @user_agent, @created_at)
  `).run({
    id,
    ip_address: data.ip ?? null,
    user_agent: data.userAgent ?? null,
    created_at: now,
  });
};

export const countGlobalAccessAttempts = (ip: string, sinceEpochMs: number): number => {
  if (!ip) return 0;
  return (
    db.prepare<{ count: number }>(
      "SELECT COUNT(1) as count FROM login_events WHERE ip_address = ? AND created_at >= ? AND mode LIKE 'global%'"
    ).get(ip, sinceEpochMs)?.count ?? 0
  );
};

export const storeLemonSqueezyEvent = (data: { id: string; eventName: string; payload: string; processed?: boolean }): void => {
  db.prepare(`
    INSERT OR REPLACE INTO lemonsqueezy_events (id, event_name, payload, processed_at, created_at)
    VALUES (@id, @event_name, @payload, @processed_at, @created_at)
  `).run({
    id: data.id,
    event_name: data.eventName,
    payload: data.payload,
    processed_at: data.processed ? Date.now() : null,
    created_at: Date.now(),
  });
};


