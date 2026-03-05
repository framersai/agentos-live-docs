import test from 'node:test';
import assert from 'node:assert/strict';

import { ChannelTokenRefreshService } from '../modules/wunderland/channels/channel-token-refresh.service.js';

/* ------------------------------------------------------------------ */
/*  Mock DatabaseService                                               */
/* ------------------------------------------------------------------ */

interface MockRow extends Record<string, unknown> {}

function createMockDb(initialRows: MockRow[] = []) {
  const rows: MockRow[] = [...initialRows];
  const calls: { method: string; sql: string; params?: unknown[] }[] = [];

  return {
    _rows: rows,
    _calls: calls,

    async exec(sql: string): Promise<void> {
      calls.push({ method: 'exec', sql });
    },

    async run(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid: number }> {
      calls.push({ method: 'run', sql, params: params as unknown[] });

      // Handle UPDATE — apply metadata changes
      if (sql.trim().toUpperCase().startsWith('UPDATE') && sql.includes('metadata = ?')) {
        const credId = (params as unknown[])?.[(params as unknown[]).length - 1];
        const target = rows.find((r) => r.credential_id === credId);
        if (target) {
          target.metadata = params![0];
          if (sql.includes('credential_value = ?')) {
            target.credential_value = params![0];
            target.metadata = params![1];
            target.expires_at = params![2];
          }
        }
      }

      return { changes: 1, lastInsertRowid: rows.length };
    },

    async get<T>(sql: string, params?: unknown[]): Promise<T | undefined> {
      calls.push({ method: 'get', sql, params: params as unknown[] });
      const credId = (params as unknown[])?.[0];
      const found = rows.find((r) => r.credential_id === credId);
      return (found as T) ?? undefined;
    },

    async all<T>(sql: string, params?: unknown[]): Promise<T[]> {
      calls.push({ method: 'all', sql, params: params as unknown[] });
      // Return all rows — the service does in-code filtering
      return rows as T[];
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeCredentialRow(overrides: Partial<MockRow> = {}): MockRow {
  const now = Date.now();
  return {
    credential_id: 'cred_1',
    owner_user_id: 'user_1',
    seed_id: 'seed_1',
    credential_type: 'meta_oauth_token',
    credential_value: 'access_token_old',
    metadata: JSON.stringify({
      refreshToken: 'refresh_token_123',
      expiresAt: now + 10 * 60 * 1000, // Expires in 10 minutes (within 30-min window)
    }),
    expires_at: null,
    ...overrides,
  };
}

function makeService(initialRows: MockRow[] = []) {
  const db = createMockDb(initialRows);
  const svc = new ChannelTokenRefreshService(db as any);
  return { svc, db };
}

/* ------------------------------------------------------------------ */
/*  Tests: refreshExpiringTokens                                       */
/* ------------------------------------------------------------------ */

test('ChannelTokenRefreshService.refreshExpiringTokens queries for refreshable credential types', async () => {
  const { svc, db } = makeService([]);

  // Stub refreshToken to avoid actual HTTP calls
  (svc as any).refreshToken = async () => true;

  await svc.refreshExpiringTokens();

  const allCall = db._calls.find((c) => c.method === 'all');
  assert.ok(allCall, 'Expected a query for refreshable credentials');
  assert.ok(
    allCall.sql.includes('credential_type IN'),
    'Query should filter by credential_type IN clause'
  );

  // Verify all refreshable types are passed as params
  const params = allCall.params as string[];
  assert.ok(params.includes('meta_oauth_token'));
  assert.ok(params.includes('linkedin_oauth_token'));
  assert.ok(params.includes('google_oauth_token'));
  assert.ok(params.includes('youtube_oauth_token'));
  assert.ok(params.includes('facebook_oauth_token'));
  assert.ok(params.includes('instagram_oauth_token'));
  assert.ok(params.includes('threads_oauth_token'));
});

test('ChannelTokenRefreshService.refreshExpiringTokens skips credentials that are not expiring soon', async () => {
  const farFuture = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now

  const row = makeCredentialRow({
    credential_id: 'cred_1',
    metadata: JSON.stringify({
      refreshToken: 'refresh_123',
      expiresAt: farFuture,
    }),
  });
  const { svc, db } = makeService([row]);

  let refreshCalled = false;
  (svc as any).refreshToken = async () => {
    refreshCalled = true;
    return true;
  };

  await svc.refreshExpiringTokens();

  assert.equal(refreshCalled, false, 'Should not attempt refresh for tokens expiring far in the future');
});

test('ChannelTokenRefreshService.refreshExpiringTokens skips credentials already marked refreshNeeded', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_1',
    metadata: JSON.stringify({
      refreshToken: 'refresh_123',
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min from now
      refreshNeeded: true,
    }),
  });
  const { svc } = makeService([row]);

  let refreshCalled = false;
  (svc as any).refreshToken = async () => {
    refreshCalled = true;
    return true;
  };

  await svc.refreshExpiringTokens();

  assert.equal(refreshCalled, false, 'Should skip credentials already marked as refreshNeeded');
});

test('ChannelTokenRefreshService.refreshExpiringTokens marks already-expired tokens as needing re-auth', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_expired',
    metadata: JSON.stringify({
      refreshToken: 'refresh_123',
      expiresAt: Date.now() - 60_000, // Expired 1 minute ago
    }),
  });
  const { svc, db } = makeService([row]);

  let markRefreshCalled = false;
  const originalMark = (svc as any).markRefreshNeeded.bind(svc);
  (svc as any).markRefreshNeeded = async (credId: string) => {
    markRefreshCalled = true;
    assert.equal(credId, 'cred_expired');
    return originalMark(credId);
  };

  await svc.refreshExpiringTokens();

  assert.equal(markRefreshCalled, true, 'Should mark expired token as needing re-auth');
});

test('ChannelTokenRefreshService.refreshExpiringTokens calls refreshToken for tokens expiring within window', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_expiring',
    metadata: JSON.stringify({
      refreshToken: 'refresh_123',
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 min from now (within 30-min window)
    }),
  });
  const { svc } = makeService([row]);

  let refreshCalledWith: string | null = null;
  (svc as any).refreshToken = async (credId: string) => {
    refreshCalledWith = credId;
    return true;
  };

  await svc.refreshExpiringTokens();

  assert.equal(refreshCalledWith, 'cred_expiring', 'Should call refreshToken for expiring credential');
});

/* ------------------------------------------------------------------ */
/*  Tests: refreshToken                                                */
/* ------------------------------------------------------------------ */

test('ChannelTokenRefreshService.refreshToken returns false when credential not found', async () => {
  const { svc } = makeService([]);

  const result = await svc.refreshToken('nonexistent_cred');

  assert.equal(result, false);
});

test('ChannelTokenRefreshService.refreshToken marks refreshNeeded when no refreshToken in metadata', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_no_refresh',
    metadata: JSON.stringify({}), // No refreshToken
  });
  const { svc, db } = makeService([row]);

  let markCalled = false;
  (svc as any).markRefreshNeeded = async (credId: string) => {
    markCalled = true;
    assert.equal(credId, 'cred_no_refresh');
  };

  const result = await svc.refreshToken('cred_no_refresh');

  assert.equal(result, false);
  assert.equal(markCalled, true, 'Should call markRefreshNeeded when no refresh token available');
});

test('ChannelTokenRefreshService.refreshToken dispatches to refreshMetaToken for meta_oauth_token', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_meta',
    credential_type: 'meta_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'meta_refresh_tok' }),
  });
  const { svc, db } = makeService([row]);

  let metaRefreshCalled = false;
  (svc as any).refreshMetaToken = async (rt: string) => {
    metaRefreshCalled = true;
    assert.equal(rt, 'meta_refresh_tok');
    return { accessToken: 'new_access', expiresIn: 3600 };
  };

  const result = await svc.refreshToken('cred_meta');

  assert.equal(result, true);
  assert.equal(metaRefreshCalled, true);

  // Verify UPDATE was called with new access token
  const updateCall = db._calls.find(
    (c) => c.method === 'run' && c.sql.includes('UPDATE') && c.sql.includes('credential_value')
  );
  assert.ok(updateCall, 'Should update credential with new access token');
  assert.equal((updateCall.params as unknown[])[0], 'new_access');
});

test('ChannelTokenRefreshService.refreshToken dispatches to refreshLinkedInToken for linkedin type', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_li',
    credential_type: 'linkedin_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'li_refresh_tok' }),
  });
  const { svc } = makeService([row]);

  let linkedinRefreshCalled = false;
  (svc as any).refreshLinkedInToken = async (rt: string) => {
    linkedinRefreshCalled = true;
    assert.equal(rt, 'li_refresh_tok');
    return { accessToken: 'li_new_access', expiresIn: 7200, refreshToken: 'li_new_refresh' };
  };

  const result = await svc.refreshToken('cred_li');

  assert.equal(result, true);
  assert.equal(linkedinRefreshCalled, true);
});

test('ChannelTokenRefreshService.refreshToken dispatches to refreshGoogleToken for google type', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_google',
    credential_type: 'google_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'g_refresh_tok' }),
  });
  const { svc } = makeService([row]);

  let googleRefreshCalled = false;
  (svc as any).refreshGoogleToken = async (rt: string) => {
    googleRefreshCalled = true;
    assert.equal(rt, 'g_refresh_tok');
    return { accessToken: 'g_new_access', expiresIn: 3600 };
  };

  const result = await svc.refreshToken('cred_google');

  assert.equal(result, true);
  assert.equal(googleRefreshCalled, true);
});

test('ChannelTokenRefreshService.refreshToken dispatches to refreshGoogleToken for youtube type', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_yt',
    credential_type: 'youtube_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'yt_refresh_tok' }),
  });
  const { svc } = makeService([row]);

  let googleRefreshCalled = false;
  (svc as any).refreshGoogleToken = async (rt: string) => {
    googleRefreshCalled = true;
    return { accessToken: 'yt_new_access', expiresIn: 3600 };
  };

  const result = await svc.refreshToken('cred_yt');

  assert.equal(result, true);
  assert.equal(googleRefreshCalled, true);
});

test('ChannelTokenRefreshService.refreshToken preserves existing refreshToken when platform does not return new one', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_meta2',
    credential_type: 'meta_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'original_refresh' }),
  });
  const { svc, db } = makeService([row]);

  (svc as any).refreshMetaToken = async () => {
    // Meta refresh typically doesn't return a new refresh token
    return { accessToken: 'new_access', expiresIn: 5184000 };
  };

  const result = await svc.refreshToken('cred_meta2');
  assert.equal(result, true);

  // Verify the stored metadata still has the original refreshToken
  const updateCall = db._calls.find(
    (c) => c.method === 'run' && c.sql.includes('credential_value')
  );
  assert.ok(updateCall);
  const storedMetadata = JSON.parse(String((updateCall.params as unknown[])[1]));
  assert.equal(storedMetadata.refreshToken, 'original_refresh');
});

test('ChannelTokenRefreshService.refreshToken updates refreshToken when platform returns new one', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_li2',
    credential_type: 'linkedin_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'old_refresh' }),
  });
  const { svc, db } = makeService([row]);

  (svc as any).refreshLinkedInToken = async () => {
    return { accessToken: 'new_access', expiresIn: 7200, refreshToken: 'brand_new_refresh' };
  };

  const result = await svc.refreshToken('cred_li2');
  assert.equal(result, true);

  const updateCall = db._calls.find(
    (c) => c.method === 'run' && c.sql.includes('credential_value')
  );
  assert.ok(updateCall);
  const storedMetadata = JSON.parse(String((updateCall.params as unknown[])[1]));
  assert.equal(storedMetadata.refreshToken, 'brand_new_refresh');
});

/* ------------------------------------------------------------------ */
/*  Tests: handleRefreshError / markRefreshNeeded                      */
/* ------------------------------------------------------------------ */

test('ChannelTokenRefreshService.markRefreshNeeded sets refreshNeeded=true in metadata', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_mark',
    metadata: JSON.stringify({ refreshToken: 'tok_123' }),
  });
  const { svc, db } = makeService([row]);

  await svc.markRefreshNeeded('cred_mark');

  const updateCall = db._calls.find(
    (c) => c.method === 'run' && c.sql.includes('UPDATE') && c.sql.includes('metadata')
  );
  assert.ok(updateCall, 'Expected UPDATE call to set metadata');

  const storedMetadata = JSON.parse(String((updateCall.params as unknown[])[0]));
  assert.equal(storedMetadata.refreshNeeded, true);
  assert.ok(storedMetadata.lastRefreshAttempt, 'Should record lastRefreshAttempt timestamp');
});

test('ChannelTokenRefreshService.markRefreshNeeded handles missing credential gracefully', async () => {
  const { svc } = makeService([]);

  // Should not throw — the service handles errors internally
  await svc.markRefreshNeeded('nonexistent_cred');
});

test('ChannelTokenRefreshService.refreshToken records error in metadata on failure', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_fail',
    credential_type: 'google_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'g_refresh' }),
  });
  const { svc, db } = makeService([row]);

  (svc as any).refreshGoogleToken = async () => {
    throw new Error('Network timeout');
  };

  const result = await svc.refreshToken('cred_fail');
  assert.equal(result, false);

  // Verify error was recorded in metadata
  const metadataUpdates = db._calls.filter(
    (c) => c.method === 'run' && c.sql.includes('metadata')
  );
  assert.ok(metadataUpdates.length > 0, 'Should update metadata with error info');

  const lastUpdate = metadataUpdates[metadataUpdates.length - 1];
  const storedMetadata = JSON.parse(String((lastUpdate.params as unknown[])[0]));
  assert.ok(storedMetadata.lastRefreshError, 'Should store the error message');
  assert.ok(storedMetadata.lastRefreshError.includes('Network timeout'));
  assert.ok(storedMetadata.lastRefreshAttempt, 'Should record attempt timestamp');
});

test('ChannelTokenRefreshService.refreshToken returns false for unsupported credential types', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_unsupported',
    credential_type: 'telegram_bot_token',
    metadata: JSON.stringify({ refreshToken: 'tok_123' }),
  });
  const { svc } = makeService([row]);

  const result = await svc.refreshToken('cred_unsupported');
  assert.equal(result, false);
});

/* ------------------------------------------------------------------ */
/*  Tests: refreshToken marks refreshNeeded when platform returns null */
/* ------------------------------------------------------------------ */

test('ChannelTokenRefreshService.refreshToken marks refreshNeeded when platform handler returns null', async () => {
  const row = makeCredentialRow({
    credential_id: 'cred_null_result',
    credential_type: 'meta_oauth_token',
    metadata: JSON.stringify({ refreshToken: 'meta_tok' }),
  });
  const { svc } = makeService([row]);

  (svc as any).refreshMetaToken = async () => null;

  let markCalled = false;
  (svc as any).markRefreshNeeded = async (credId: string) => {
    markCalled = true;
    assert.equal(credId, 'cred_null_result');
  };

  const result = await svc.refreshToken('cred_null_result');
  assert.equal(result, false);
  assert.equal(markCalled, true, 'Should mark as needing re-auth when platform returns null');
});

/* ------------------------------------------------------------------ */
/*  Tests: parseMetadata                                               */
/* ------------------------------------------------------------------ */

test('ChannelTokenRefreshService.parseMetadata returns empty object for null input', async () => {
  const { svc } = makeService([]);
  const result = (svc as any).parseMetadata(null);
  assert.deepEqual(result, {});
});

test('ChannelTokenRefreshService.parseMetadata returns empty object for invalid JSON', async () => {
  const { svc } = makeService([]);
  const result = (svc as any).parseMetadata('not-valid-json{{{');
  assert.deepEqual(result, {});
});

test('ChannelTokenRefreshService.parseMetadata parses valid JSON correctly', async () => {
  const { svc } = makeService([]);
  const metadata = { refreshToken: 'tok_123', expiresAt: 12345, refreshNeeded: false };
  const result = (svc as any).parseMetadata(JSON.stringify(metadata));
  assert.deepEqual(result, metadata);
});

/* ------------------------------------------------------------------ */
/*  Tests: expires_at fallback                                         */
/* ------------------------------------------------------------------ */

test('ChannelTokenRefreshService.refreshExpiringTokens uses row expires_at when metadata.expiresAt is absent', async () => {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min from now

  const row = makeCredentialRow({
    credential_id: 'cred_expires_col',
    metadata: JSON.stringify({ refreshToken: 'tok_123' }), // No expiresAt in metadata
    expires_at: expiresAt,
  });
  const { svc } = makeService([row]);

  let refreshCalledWith: string | null = null;
  (svc as any).refreshToken = async (credId: string) => {
    refreshCalledWith = credId;
    return true;
  };

  await svc.refreshExpiringTokens();

  assert.equal(refreshCalledWith, 'cred_expires_col', 'Should use column expires_at as fallback');
});
