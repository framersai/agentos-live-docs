import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

import {
  initializeAppDatabase,
  closeAppDatabase,
  __setAppDatabaseAdapterResolverForTests,
  getAppDatabase,
} from '../core/database/appDatabase.js';
import { DatabaseService } from '../database/database.service.js';
import { VaultService } from '../modules/wunderland/vault/vault.service.js';
import { TunnelService } from '../modules/tunnel/tunnel.service.js';

async function setupDb(): Promise<void> {
  await closeAppDatabase();
  __setAppDatabaseAdapterResolverForTests(async () => {
    const { resolveStorageAdapter } = await import('@framers/sql-storage-adapter');
    return await resolveStorageAdapter({
      priority: ['sqljs'],
      openOptions: { filePath: '' },
    } as any);
  });
  await initializeAppDatabase();
}

async function seedUser(options: { userId: string; planId: string; status?: string }) {
  const adapter = getAppDatabase();
  const now = Date.now();
  await adapter.run(
    `INSERT INTO app_users
      (id, email, password_hash, subscription_status, subscription_tier, subscription_plan_id, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      options.userId,
      `${options.userId}@test.local`,
      'hash',
      options.status ?? 'active',
      'metered',
      options.planId,
      1,
      now,
      now,
    ]
  );
}

function makeNewFormatToken(userId: string): string {
  const encoded = Buffer.from(userId, 'utf8').toString('base64url');
  return `rht.${encoded}.${randomBytes(32).toString('hex')}`;
}

test('TunnelService resolves new-format tokens and stores heartbeats', async () => {
  await setupDb();

  const userId = `user_${Date.now()}`;
  await seedUser({ userId, planId: 'pro' });

  const dbService = new DatabaseService();
  const vault = new VaultService(dbService);
  const tunnel = new TunnelService(dbService, vault);

  const token = makeNewFormatToken(userId);
  const { key } = await vault.createKey(userId, {
    credentialType: 'tunnel_token',
    label: 'Ollama Tunnel',
    value: token,
  });

  const resolution = await tunnel.resolveTunnelToken(token);
  assert.ok(resolution, 'expected token to resolve');
  assert.equal(resolution?.userId, userId);
  assert.equal(resolution?.keyId, key.id);

  const hb = await tunnel.upsertHeartbeat({
    tunnelToken: token,
    ollamaUrl: 'https://abc123.trycloudflare.com',
    models: ['llama3.1:8b', 'nomic-embed-text'],
    version: '2.1.0',
  });
  assert.equal(hb.ok, true);
  assert.equal(hb.ok && hb.status.connected, true);
  assert.equal(hb.ok && hb.status.ollamaUrl, 'https://abc123.trycloudflare.com');
  assert.deepEqual(hb.ok && hb.status.models, ['llama3.1:8b', 'nomic-embed-text']);

  const status = await tunnel.getStatusForUser(userId);
  assert.equal(status.connected, true);
  assert.equal(status.ollamaUrl, 'https://abc123.trycloudflare.com');
  assert.deepEqual(status.models, ['llama3.1:8b', 'nomic-embed-text']);
  assert.ok(typeof status.lastHeartbeat === 'number');
});

test('TunnelService rejects non-Cloudflare hosts by default', async () => {
  await setupDb();

  const userId = `user_${Date.now()}`;
  await seedUser({ userId, planId: 'pro' });

  const dbService = new DatabaseService();
  const vault = new VaultService(dbService);
  const tunnel = new TunnelService(dbService, vault);

  const token = makeNewFormatToken(userId);
  await vault.createKey(userId, {
    credentialType: 'tunnel_token',
    label: 'Ollama Tunnel',
    value: token,
  });

  const hb = await tunnel.upsertHeartbeat({
    tunnelToken: token,
    ollamaUrl: 'https://example.com',
    models: ['llama3.1:8b'],
    version: '2.1.0',
  });
  assert.equal(hb.ok, false);
  assert.equal(!hb.ok && hb.status, 400);
});

test('TunnelService disconnecting heartbeat removes registration', async () => {
  await setupDb();

  const userId = `user_${Date.now()}`;
  await seedUser({ userId, planId: 'pro' });

  const dbService = new DatabaseService();
  const vault = new VaultService(dbService);
  const tunnel = new TunnelService(dbService, vault);

  const token = makeNewFormatToken(userId);
  await vault.createKey(userId, {
    credentialType: 'tunnel_token',
    label: 'Ollama Tunnel',
    value: token,
  });

  await tunnel.upsertHeartbeat({
    tunnelToken: token,
    ollamaUrl: 'https://abc123.trycloudflare.com',
    models: ['llama3.1:8b'],
    version: '2.1.0',
  });

  const disconnect = await tunnel.upsertHeartbeat({
    tunnelToken: token,
    ollamaUrl: null,
    models: [],
    version: '2.1.0',
    disconnecting: true,
  });
  assert.equal(disconnect.ok, true);
  assert.equal(disconnect.ok && disconnect.status.connected, false);

  const status = await tunnel.getStatusForUser(userId);
  assert.equal(status.connected, false);
});

test('TunnelService enforces plan eligibility on heartbeat', async () => {
  await setupDb();

  const userId = `user_${Date.now()}`;
  await seedUser({ userId, planId: 'starter' });

  const dbService = new DatabaseService();
  const vault = new VaultService(dbService);
  const tunnel = new TunnelService(dbService, vault);

  const token = makeNewFormatToken(userId);
  await vault.createKey(userId, {
    credentialType: 'tunnel_token',
    label: 'Ollama Tunnel',
    value: token,
  });

  const hb = await tunnel.upsertHeartbeat({
    tunnelToken: token,
    ollamaUrl: 'https://abc123.trycloudflare.com',
    models: ['llama3.1:8b'],
    version: '2.1.0',
  });
  assert.equal(hb.ok, false);
  assert.equal(!hb.ok && hb.status, 403);
});
