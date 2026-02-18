// File: backend/src/features/auth/va-admin.service.ts
/**
 * @file va-admin.service.ts
 * @description Loads VA admin/assistant entries from a multi-column CSV file,
 * caches them in memory, and exposes helpers for auth & directory checks.
 *
 * CSV format (multi-column):
 *   email,role,display_name,public
 *   team@manic.agency,super_admin,Manic Agency,false
 *   johnnyddunn@gmail.com,va,Johnny,true
 *
 * Backward compat: single-column CSVs (header "email") still work —
 * entries default to role=va, public=true.
 */

import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VaRole = 'super_admin' | 'va';

export interface VaAdminEntry {
  email: string;
  role: VaRole;
  displayName: string;
  public: boolean;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let vaAdminMap: Map<string, VaAdminEntry> = new Map();
let loaded = false;

// ---------------------------------------------------------------------------
// CSV Loading
// ---------------------------------------------------------------------------

export const loadVaAdminCsv = (): void => {
  const csvPath = process.env.VA_ADMIN_CSV_PATH;
  if (!csvPath) {
    console.info('[VaAdmin] VA_ADMIN_CSV_PATH not set. VA admin system disabled.');
    loaded = true;
    return;
  }

  const resolved = path.isAbsolute(csvPath) ? csvPath : path.resolve(process.cwd(), csvPath);

  if (!fs.existsSync(resolved)) {
    console.warn(`[VaAdmin] CSV file not found at ${resolved}. No VA admins loaded.`);
    loaded = true;
    return;
  }

  try {
    const content = fs.readFileSync(resolved, 'utf-8');
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      vaAdminMap = new Map();
      loaded = true;
      return;
    }

    // Detect format from header row
    const header = lines[0].toLowerCase();
    const isMultiColumn = header.includes(',');
    const startIndex = header.startsWith('email') ? 1 : 0;

    const entries = new Map<string, VaAdminEntry>();

    for (let i = startIndex; i < lines.length; i++) {
      if (isMultiColumn) {
        const cols = lines[i].split(',').map((c) => c.trim());
        const email = (cols[0] || '').toLowerCase();
        if (!email || !email.includes('@')) continue;

        const role: VaRole = cols[1] === 'super_admin' ? 'super_admin' : 'va';
        const displayName = cols[2] || email.split('@')[0];
        const isPublic = cols[3] ? cols[3].toLowerCase() === 'true' : role === 'va';

        entries.set(email, { email, role, displayName, public: isPublic });
      } else {
        // Legacy single-column format
        const email = lines[i].toLowerCase().trim();
        if (!email || !email.includes('@')) continue;
        entries.set(email, {
          email,
          role: 'va',
          displayName: email.split('@')[0],
          public: true,
        });
      }
    }

    vaAdminMap = entries;
    loaded = true;

    const superCount = Array.from(entries.values()).filter((e) => e.role === 'super_admin').length;
    const vaCount = entries.size - superCount;
    console.info(
      `[VaAdmin] Loaded ${entries.size} entry/entries from ${resolved} (${superCount} super_admin, ${vaCount} va)`
    );
  } catch (error) {
    console.error(`[VaAdmin] Failed to load CSV from ${resolved}:`, error);
    loaded = true;
  }
};

/**
 * Hot-reload CSV without restart.
 */
export const reloadCsv = (): { count: number } => {
  loaded = false;
  loadVaAdminCsv();
  return { count: vaAdminMap.size };
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const ensureLoaded = () => {
  if (!loaded) loadVaAdminCsv();
};

/**
 * Check if the given email belongs to any VA admin (super_admin or va).
 * Backward-compatible — returns true for both roles.
 */
export const isVaAdmin = (email: string | undefined | null): boolean => {
  ensureLoaded();
  if (!email) return false;
  return vaAdminMap.has(email.toLowerCase().trim());
};

/**
 * Check if the given email is a super admin.
 */
export const isSuperAdmin = (email: string | undefined | null): boolean => {
  ensureLoaded();
  if (!email) return false;
  const entry = vaAdminMap.get(email.toLowerCase().trim());
  return entry?.role === 'super_admin';
};

/**
 * Get the VA role for a given email, or null if not in the roster.
 */
export const getVaRole = (email: string | undefined | null): VaRole | null => {
  ensureLoaded();
  if (!email) return null;
  return vaAdminMap.get(email.toLowerCase().trim())?.role ?? null;
};

/**
 * Get all VA admin emails. Backward-compatible.
 */
export const getVaAdminEmails = (): string[] => {
  ensureLoaded();
  return Array.from(vaAdminMap.keys());
};

/**
 * Get entries marked as public (for the consumer-facing VA directory).
 */
export const getPublicVaEntries = (): VaAdminEntry[] => {
  ensureLoaded();
  return Array.from(vaAdminMap.values()).filter((e) => e.public);
};

/**
 * Get all entries (for admin management views).
 */
export const getAllEntries = (): VaAdminEntry[] => {
  ensureLoaded();
  return Array.from(vaAdminMap.values());
};
