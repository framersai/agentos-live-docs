/**
 * @file gmail-oauth.spec.ts
 * @description Tests for Gmail OAuth initiation and callback flows.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { ChannelOAuthService } from '../../channels/channel-oauth.service.js';
import { CredentialsService } from '../../credentials/credentials.service.js';
import { ChannelsService } from '../../channels/channels.service.js';

let db: DatabaseService;
let service: ChannelOAuthService;

const userId = 'test-user-gmail';
const seedId = 'test-seed-gmail';

// Mock fetch globally
const mockFetch = vi.fn();

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();

  // Seed agent ownership row
  const now = Date.now();
  await db.run(
    `INSERT OR IGNORE INTO wunderbots
      (seed_id, owner_user_id, display_name, hexaco_traits, security_profile, inference_hierarchy, status, created_at, updated_at)
     VALUES (?, ?, ?, '{}', '{}', '{}', 'active', ?, ?)`,
    [seedId, userId, 'Gmail Test Agent', now, now]
  );

  // Construct service with real DB and real CredentialsService, stub ChannelsService
  const credentialsService = new CredentialsService(db);
  const channelsService = { createBinding: vi.fn(), deleteBinding: vi.fn() } as any;
  service = new ChannelOAuthService(db, credentialsService, channelsService);

  // Stub global fetch
  vi.stubGlobal('fetch', mockFetch);
});

afterAll(async () => {
  vi.restoreAllMocks();
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

beforeEach(() => {
  mockFetch.mockReset();
  // Set env vars for tests
  process.env.GOOGLE_CLIENT_ID = 'test-client-id';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
  process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/api/channels/oauth/gmail/callback';
});

describe('initiateGmailOAuth', () => {
  it('generates a consent URL with correct scopes and stores state', async () => {
    const result = await service.initiateGmailOAuth(userId, seedId);

    expect(result.url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(result.url).toContain('client_id=test-client-id');
    expect(result.url).toContain(
      encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')
    );
    expect(result.url).toContain(encodeURIComponent('https://www.googleapis.com/auth/gmail.send'));
    expect(result.url).toContain(
      encodeURIComponent('https://www.googleapis.com/auth/gmail.modify')
    );
    expect(result.url).toContain(
      encodeURIComponent('https://www.googleapis.com/auth/gmail.labels')
    );
    expect(result.url).toContain(
      encodeURIComponent('https://www.googleapis.com/auth/userinfo.email')
    );
    expect(result.stateId).toBeTruthy();

    // Verify state was stored in DB
    const row = await db.get<{ state_id: string; platform: string }>(
      `SELECT state_id, platform FROM wunderland_channel_oauth_states WHERE state_id = ?`,
      [result.stateId]
    );
    expect(row).toBeDefined();
    expect(row!.platform).toBe('gmail');
  });

  it('includes access_type=offline and prompt=consent', async () => {
    const result = await service.initiateGmailOAuth(userId, seedId);

    expect(result.url).toContain('access_type=offline');
    expect(result.url).toContain('prompt=consent');
  });

  it('throws when GOOGLE_CLIENT_ID is missing', async () => {
    delete process.env.GOOGLE_CLIENT_ID;

    await expect(service.initiateGmailOAuth(userId, seedId)).rejects.toThrow(
      /GOOGLE_CLIENT_ID missing/
    );
  });
});

describe('handleGmailCallback', () => {
  async function createTestState(): Promise<string> {
    // Restore env for state creation
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    const result = await service.initiateGmailOAuth(userId, seedId);
    return result.stateId;
  }

  it('validates state, exchanges code for tokens, creates credential and account', async () => {
    const stateId = await createTestState();

    // Mock token exchange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'ya29.test-access-token',
        refresh_token: 'rt_test-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
      }),
    });

    // Mock userinfo
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        email: 'test@gmail.com',
        name: 'Test User',
      }),
    });

    const result = await service.handleGmailCallback('auth-code-123', stateId);

    expect(result.accountId).toBeTruthy();
    expect(result.emailAddress).toBe('test@gmail.com');
    expect(result.credentialId).toBeTruthy();
    expect(result.seedId).toBe(seedId);

    // Verify credential was stored
    const cred = await db.get<{ credential_type: string; label: string; metadata: string }>(
      `SELECT credential_type, label, metadata FROM wunderbot_credentials WHERE credential_id = ?`,
      [result.credentialId]
    );
    expect(cred).toBeDefined();
    expect(cred!.credential_type).toBe('google_oauth_token');
    expect(cred!.label).toBe('Gmail: test@gmail.com');

    // Verify email account was created
    const account = await db.get<{ provider: string; email_address: string; sync_state: string }>(
      `SELECT provider, email_address, sync_state FROM wunderland_email_accounts WHERE id = ?`,
      [result.accountId]
    );
    expect(account).toBeDefined();
    expect(account!.provider).toBe('gmail');
    expect(account!.email_address).toBe('test@gmail.com');
    expect(account!.sync_state).toBe('idle');
  });

  it('stores metadata with refreshToken pattern', async () => {
    const stateId = await createTestState();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'ya29.another-token',
        refresh_token: 'rt_meta-refresh',
        expires_in: 7200,
        token_type: 'Bearer',
      }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        email: 'meta-test@gmail.com',
      }),
    });

    const result = await service.handleGmailCallback('auth-code-meta', stateId);

    const cred = await db.get<{ metadata: string; expires_at: number }>(
      `SELECT metadata, expires_at FROM wunderbot_credentials WHERE credential_id = ?`,
      [result.credentialId]
    );
    expect(cred).toBeDefined();

    const meta = JSON.parse(cred!.metadata);
    expect(meta.refreshToken).toBe('rt_meta-refresh');
    expect(meta.email).toBe('meta-test@gmail.com');
    expect(meta.expiresAt).toBeGreaterThan(Date.now());
    expect(cred!.expires_at).toBeGreaterThan(Date.now());
  });

  it('rejects expired state', async () => {
    // Create state and manually expire it
    const stateId = await createTestState();
    await db.run(`UPDATE wunderland_channel_oauth_states SET expires_at = ? WHERE state_id = ?`, [
      Date.now() - 1000,
      stateId,
    ]);

    await expect(service.handleGmailCallback('some-code', stateId)).rejects.toThrow(/expired/i);
  });

  it('rejects unknown state', async () => {
    await expect(service.handleGmailCallback('some-code', 'nonexistent-state-id')).rejects.toThrow(
      /Invalid or expired/i
    );
  });
});
