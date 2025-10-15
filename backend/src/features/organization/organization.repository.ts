// File: backend/src/features/organization/organization.repository.ts
/**
 * @file organization.repository.ts
 * @description Low-level persistence helpers for organization, member, and invite data.
 */

import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
import { getAppDatabase, generateId } from '../../core/database/appDatabase.js';

const db: BetterSqliteDatabase = getAppDatabase();

export type OrganizationRole = 'admin' | 'builder' | 'viewer';
export type OrganizationMemberStatus = 'active' | 'invited' | 'suspended';
export type OrganizationInviteStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

interface OrganizationRow {
  id: string;
  name: string;
  slug: string | null;
  owner_user_id: string;
  seat_limit: number;
  plan_id: string;
  created_at: number;
  updated_at: number;
}

interface OrganizationMemberRow {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  status: string;
  seat_units: number | null;
  daily_usage_cap_usd: number | null;
  created_at: number;
  updated_at: number;
  user_email?: string | null;
}

interface OrganizationInviteRow {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expires_at: number | null;
  inviter_user_id: string | null;
  created_at: number;
  accepted_at: number | null;
  revoked_at: number | null;
}

type OrganizationWithMemberRow = OrganizationRow &
  OrganizationMemberRow & {
    member_id: string;
    member_role: string;
    member_status: string;
    member_seat_units: number | null;
    member_daily_usage_cap_usd: number | null;
    member_created_at: number;
    member_updated_at: number;
  };

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string | null;
  ownerUserId: string;
  seatLimit: number;
  planId: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrganizationMemberRecord {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  status: OrganizationMemberStatus;
  seatUnits: number;
  dailyUsageCapUsd: number | null;
  createdAt: number;
  updatedAt: number;
  userEmail?: string | null;
}

export interface OrganizationInviteRecord {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  status: OrganizationInviteStatus;
  token: string;
  expiresAt: number | null;
  inviterUserId: string | null;
  createdAt: number;
  acceptedAt: number | null;
  revokedAt: number | null;
}

const mapOrganization = (row: OrganizationRow): OrganizationRecord => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  ownerUserId: row.owner_user_id,
  seatLimit: row.seat_limit,
  planId: row.plan_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapMember = (row: OrganizationMemberRow): OrganizationMemberRecord => ({
  id: row.id,
  organizationId: row.organization_id,
  userId: row.user_id,
  role: (row.role as OrganizationRole) ?? 'builder',
  status: (row.status as OrganizationMemberStatus) ?? 'active',
  seatUnits: row.seat_units ?? 1,
  dailyUsageCapUsd: row.daily_usage_cap_usd ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  userEmail: row.user_email ?? null,
});

const mapInvite = (row: OrganizationInviteRow): OrganizationInviteRecord => ({
  id: row.id,
  organizationId: row.organization_id,
  email: row.email,
  role: (row.role as OrganizationRole) ?? 'builder',
  status: (row.status as OrganizationInviteStatus) ?? 'pending',
  token: row.token,
  expiresAt: row.expires_at ?? null,
  inviterUserId: row.inviter_user_id ?? null,
  createdAt: row.created_at,
  acceptedAt: row.accepted_at ?? null,
  revokedAt: row.revoked_at ?? null,
});

export const createOrganization = (data: {
  name: string;
  ownerUserId: string;
  seatLimit?: number;
  planId?: string;
  slug?: string | null;
}): OrganizationRecord => {
  const id = generateId();
  const now = Date.now();
  db.prepare(
    `
    INSERT INTO organizations (id, name, slug, owner_user_id, seat_limit, plan_id, created_at, updated_at)
    VALUES (@id, @name, @slug, @owner_user_id, @seat_limit, @plan_id, @created_at, @updated_at)
  `,
  ).run({
    id,
    name: data.name,
    slug: data.slug ?? null,
    owner_user_id: data.ownerUserId,
    seat_limit: data.seatLimit ?? 5,
    plan_id: data.planId ?? 'organization',
    created_at: now,
    updated_at: now,
  });

  return findOrganizationById(id) as OrganizationRecord;
};

export const findOrganizationById = (organizationId: string): OrganizationRecord | null => {
  const row = db
    .prepare(
      `
      SELECT * FROM organizations
      WHERE id = ?
      LIMIT 1
    `,
    )
    .get(organizationId) as OrganizationRow | undefined;
  return row ? mapOrganization(row) : null;
};

export interface OrganizationWithMembershipRecord extends OrganizationRecord {
  membership: OrganizationMemberRecord;
}

export const listOrganizationsForUser = (userId: string): OrganizationWithMembershipRecord[] => {
  const rows = db
    .prepare(
      `
      SELECT
        o.*,
        m.id as member_id,
        m.role as member_role,
        m.status as member_status,
        m.seat_units as member_seat_units,
        m.daily_usage_cap_usd as member_daily_usage_cap_usd,
        m.created_at as member_created_at,
        m.updated_at as member_updated_at
      FROM organizations o
      INNER JOIN organization_members m ON m.organization_id = o.id
      WHERE m.user_id = ?
      ORDER BY o.created_at DESC
    `,
    )
    .all(userId) as OrganizationWithMemberRow[];

  return rows.map((row) => ({
    ...mapOrganization(row),
    membership: {
      id: row.member_id,
      organizationId: row.id,
      userId,
      role: (row.member_role as OrganizationRole) ?? 'builder',
      status: (row.member_status as OrganizationMemberStatus) ?? 'active',
      seatUnits: row.member_seat_units ?? 1,
      dailyUsageCapUsd: row.member_daily_usage_cap_usd ?? null,
      createdAt: row.member_created_at,
      updatedAt: row.member_updated_at,
    },
  }));
};

export const updateOrganization = (
  organizationId: string,
  updates: { name?: string; slug?: string | null; seatLimit?: number; planId?: string | null },
): OrganizationRecord | null => {
  const now = Date.now();
  db.prepare(
    `
    UPDATE organizations
       SET name = COALESCE(@name, name),
           slug = COALESCE(@slug, slug),
           seat_limit = COALESCE(@seat_limit, seat_limit),
           plan_id = COALESCE(@plan_id, plan_id),
           updated_at = @updated_at
     WHERE id = @id
  `,
  ).run({
    id: organizationId,
    name: updates.name ?? null,
    slug: updates.slug ?? null,
    seat_limit: updates.seatLimit ?? null,
    plan_id: updates.planId ?? null,
    updated_at: now,
  });

  return findOrganizationById(organizationId);
};

export const addMember = (data: {
  organizationId: string;
  userId: string;
  role?: OrganizationRole;
  status?: OrganizationMemberStatus;
  seatUnits?: number;
  dailyUsageCapUsd?: number | null;
}): OrganizationMemberRecord => {
  const id = generateId();
  const now = Date.now();
  db.prepare(
    `
    INSERT INTO organization_members (
      id, organization_id, user_id, role, status, seat_units, daily_usage_cap_usd, created_at, updated_at
    )
    VALUES (@id, @organization_id, @user_id, @role, @status, @seat_units, @daily_usage_cap_usd, @created_at, @updated_at)
  `,
  ).run({
    id,
    organization_id: data.organizationId,
    user_id: data.userId,
    role: data.role ?? 'builder',
    status: data.status ?? 'active',
    seat_units: data.seatUnits ?? 1,
    daily_usage_cap_usd: data.dailyUsageCapUsd ?? null,
    created_at: now,
    updated_at: now,
  });

  return findMemberById(id) as OrganizationMemberRecord;
};

export const findMemberById = (memberId: string): OrganizationMemberRecord | null => {
  const row = db
    .prepare(
      `
      SELECT m.*, u.email as user_email
      FROM organization_members m
      LEFT JOIN app_users u ON u.id = m.user_id
      WHERE m.id = ?
      LIMIT 1
    `,
    )
    .get(memberId) as OrganizationMemberRow | undefined;
  return row ? mapMember(row) : null;
};

export const findMemberByUser = (organizationId: string, userId: string): OrganizationMemberRecord | null => {
  const row = db
    .prepare(
      `
      SELECT m.*, u.email as user_email
      FROM organization_members m
      LEFT JOIN app_users u ON u.id = m.user_id
      WHERE m.organization_id = ? AND m.user_id = ?
      LIMIT 1
    `,
    )
    .get(organizationId, userId) as OrganizationMemberRow | undefined;
  return row ? mapMember(row) : null;
};

export const listOrganizationMembers = (organizationId: string): OrganizationMemberRecord[] => {
  const rows = db
    .prepare(
      `
      SELECT m.*, u.email as user_email
      FROM organization_members m
      LEFT JOIN app_users u ON u.id = m.user_id
      WHERE m.organization_id = ?
      ORDER BY m.created_at ASC
    `,
    )
    .all(organizationId) as OrganizationMemberRow[];
  return rows.map(mapMember);
};

export const updateMember = (
  memberId: string,
  updates: {
    role?: OrganizationRole;
    status?: OrganizationMemberStatus;
    seatUnits?: number;
    dailyUsageCapUsd?: number | null;
  },
): OrganizationMemberRecord | null => {
  const now = Date.now();
  db.prepare(
    `
    UPDATE organization_members
       SET role = COALESCE(@role, role),
           status = COALESCE(@status, status),
           seat_units = COALESCE(@seat_units, seat_units),
           daily_usage_cap_usd = CASE WHEN @has_daily_cap = 1 THEN @daily_usage_cap_usd ELSE daily_usage_cap_usd END,
           updated_at = @updated_at
     WHERE id = @id
  `,
  ).run({
    id: memberId,
    role: updates.role ?? null,
    status: updates.status ?? null,
    seat_units: updates.seatUnits ?? null,
    daily_usage_cap_usd: updates.dailyUsageCapUsd ?? null,
    has_daily_cap: updates.dailyUsageCapUsd !== undefined ? 1 : 0,
    updated_at: now,
  });

  return findMemberById(memberId);
};

export const removeMember = (memberId: string): void => {
  db.prepare(`DELETE FROM organization_members WHERE id = ?`).run(memberId);
};

export const countActiveSeatUnits = (organizationId: string): number => {
  const row = db
    .prepare(
      `
      SELECT COALESCE(SUM(seat_units), 0) as total
      FROM organization_members
      WHERE organization_id = ? AND status = 'active'
    `,
    )
    .get(organizationId) as { total: number | null } | undefined;
  return row?.total ?? 0;
};

export const countActiveAdmins = (organizationId: string): number => {
  const row = db
    .prepare(
      `
      SELECT COUNT(1) as total
      FROM organization_members
      WHERE organization_id = ? AND status = 'active' AND role = 'admin'
    `,
    )
    .get(organizationId) as { total: number | null } | undefined;
  return row?.total ?? 0;
};

export const createInvite = (data: {
  organizationId: string;
  email: string;
  role?: OrganizationRole;
  inviterUserId: string;
  expiresAt?: number | null;
}): OrganizationInviteRecord => {
  const id = generateId();
  const now = Date.now();
  const token = generateId();
  db.prepare(
    `
    INSERT INTO organization_invites (
      id, organization_id, email, role, status, token, expires_at, inviter_user_id, created_at
    )
    VALUES (@id, @organization_id, @email, @role, 'pending', @token, @expires_at, @inviter_user_id, @created_at)
  `,
  ).run({
    id,
    organization_id: data.organizationId,
    email: data.email,
    role: data.role ?? 'builder',
    token,
    expires_at: data.expiresAt ?? null,
    inviter_user_id: data.inviterUserId,
    created_at: now,
  });

  return findInviteById(id) as OrganizationInviteRecord;
};

export const findInviteById = (inviteId: string): OrganizationInviteRecord | null => {
  const row = db
    .prepare(
      `
      SELECT * FROM organization_invites
      WHERE id = ?
      LIMIT 1
    `,
    )
    .get(inviteId) as OrganizationInviteRow | undefined;
  return row ? mapInvite(row) : null;
};

export const findInviteByToken = (token: string): OrganizationInviteRecord | null => {
  const row = db
    .prepare(
      `
      SELECT * FROM organization_invites
      WHERE token = ?
      LIMIT 1
    `,
    )
    .get(token) as OrganizationInviteRow | undefined;
  return row ? mapInvite(row) : null;
};

export const findPendingInviteByEmail = (organizationId: string, email: string): OrganizationInviteRecord | null => {
  const row = db
    .prepare(
      `
      SELECT * FROM organization_invites
      WHERE organization_id = ? AND lower(email) = lower(?) AND status = 'pending'
      LIMIT 1
    `,
    )
    .get(organizationId, email) as OrganizationInviteRow | undefined;
  return row ? mapInvite(row) : null;
};

export const listOrganizationInvites = (organizationId: string): OrganizationInviteRecord[] => {
  const rows = db
    .prepare(
      `
      SELECT * FROM organization_invites
      WHERE organization_id = ?
      ORDER BY created_at DESC
    `,
    )
    .all(organizationId) as OrganizationInviteRow[];
  return rows.map(mapInvite);
};

export const updateInvite = (
  inviteId: string,
  updates: {
    status?: OrganizationInviteStatus;
    expiresAt?: number | null;
    acceptedAt?: number | null;
    revokedAt?: number | null;
  },
): OrganizationInviteRecord | null => {
  db.prepare(
    `
    UPDATE organization_invites
       SET status = COALESCE(@status, status),
           expires_at = COALESCE(@expires_at, expires_at),
           accepted_at = COALESCE(@accepted_at, accepted_at),
           revoked_at = COALESCE(@revoked_at, revoked_at)
     WHERE id = @id
  `,
  ).run({
    id: inviteId,
    status: updates.status ?? null,
    expires_at: updates.expiresAt ?? null,
    accepted_at: updates.acceptedAt ?? null,
    revoked_at: updates.revokedAt ?? null,
  });

  return findInviteById(inviteId);
};

export const countPendingInvites = (organizationId: string): number => {
  const row = db
    .prepare(
      `
      SELECT COUNT(1) as total
      FROM organization_invites
      WHERE organization_id = ? AND status = 'pending'
    `,
    )
    .get(organizationId) as { total: number | null } | undefined;
  return row?.total ?? 0;
};
