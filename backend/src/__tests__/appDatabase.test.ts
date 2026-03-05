import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type {
  StorageAdapter,
  StorageParameters,
  StorageRunResult,
  StorageResolutionOptions,
  StorageCapability,
} from '@framers/sql-storage-adapter';

const loadAppDatabaseModule = async () => import('../core/database/appDatabase.js');

class MockAdapter implements StorageAdapter {
  public readonly execCalls: string[] = [];
  public readonly runCalls: Array<{ statement: string; parameters?: StorageParameters }> = [];
  public readonly allCalls: string[] = [];
  private readonly capabilitySet: ReadonlySet<StorageCapability>;
  private readonly columnsByTable: Record<string, Set<string>> = {};

  public constructor(
    public readonly kind: string,
    private readonly options: {
      persistent: boolean;
      wal?: boolean;
      columns?: Record<string, string[]>;
      enforceMissingColumnErrors?: boolean;
    } = {
      persistent: false,
    }
  ) {
    const flags: StorageCapability[] = [];
    if (this.options.persistent) {
      flags.push('persistence' as StorageCapability);
    }
    if (this.options.wal) {
      flags.push('wal' as StorageCapability);
    }
    this.capabilitySet = new Set(flags);

    for (const [table, cols] of Object.entries(this.options.columns ?? {})) {
      this.columnsByTable[table] = new Set(cols);
    }
  }

  public get capabilities(): ReadonlySet<StorageCapability> {
    return this.capabilitySet;
  }

  public async open(): Promise<void> {
    // no-op for tests
  }

  public async close(): Promise<void> {
    // no-op for tests
  }

  public async run(statement: string, parameters?: StorageParameters): Promise<StorageRunResult> {
    this.runCalls.push({ statement, parameters });
    return { changes: 0, lastInsertRowid: null };
  }

  public async get(): Promise<null> {
    return null;
  }

  public async all<T = unknown>(statement: string): Promise<T[]> {
    this.allCalls.push(statement);
    const pragmaMatch = statement.match(/PRAGMA\s+table_info\(([^)]+)\);?/i);
    if (pragmaMatch) {
      const table = pragmaMatch[1];
      const columns = Array.from(this.columnsByTable[table] ?? []);
      return columns.map((name) => ({ name })) as T[];
    }
    return [] as T[];
  }

  public async exec(script: string): Promise<void> {
    const trimmed = script.trim();

    // Simulate SQLite errors when indexes reference columns that don't exist yet.
    if (
      this.options.enforceMissingColumnErrors &&
      trimmed.includes('CREATE INDEX IF NOT EXISTS idx_wunderland_posts_enclave') &&
      !(this.columnsByTable.wunderland_posts?.has('enclave_id') ?? false)
    ) {
      throw new Error('SqliteError: no such column: enclave_id');
    }

    const alterMatch = trimmed.match(/^ALTER TABLE\s+(\w+)\s+ADD COLUMN\s+(\w+)\b/i);
    if (alterMatch) {
      const [, table, column] = alterMatch;
      if (!this.columnsByTable[table]) this.columnsByTable[table] = new Set();
      this.columnsByTable[table]!.add(column);
    }

    this.execCalls.push(trimmed);
  }

  public async transaction<T>(fn: (trx: StorageAdapter) => Promise<T>): Promise<T> {
    return fn(this);
  }
}

afterEach(async () => {
  const { closeAppDatabase, __setAppDatabaseAdapterResolverForTests } =
    await loadAppDatabaseModule();
  await closeAppDatabase();
  __setAppDatabaseAdapterResolverForTests();
});

test('getAppDatabase throws before initialization', async () => {
  const { getAppDatabase, closeAppDatabase } = await loadAppDatabaseModule();
  await closeAppDatabase();
  assert.throws(() => getAppDatabase(), /has not been initialised/i);
});

test('initializeAppDatabase uses persistent adapter when resolver succeeds', async () => {
  const adapter = new MockAdapter('better-sqlite3', {
    persistent: true,
    wal: true,
    columns: {
      app_users: ['id', 'email', 'password_hash', 'supabase_user_id', 'subscription_plan_id'],
    },
  });

  const {
    initializeAppDatabase,
    getAppDatabase,
    isInMemoryAppDatabase,
    __setAppDatabaseAdapterResolverForTests,
  } = await loadAppDatabaseModule();

  __setAppDatabaseAdapterResolverForTests(async (): Promise<StorageAdapter> => adapter);

  await initializeAppDatabase();

  assert.equal(isInMemoryAppDatabase(), false);
  assert.equal(getAppDatabase(), adapter);
  assert.ok(
    adapter.execCalls.some((statement) =>
      statement.includes('CREATE TABLE IF NOT EXISTS app_meta')
    ),
    'runs bootstrap schema statements'
  );
});

test('initializeAppDatabase creates enclave index after adding enclave_id column', async () => {
  const adapter = new MockAdapter('better-sqlite3', {
    persistent: true,
    wal: true,
    enforceMissingColumnErrors: true,
    columns: {
      // Existing DB that predates `enclave_id`
      wunderland_posts: ['post_id', 'seed_id', 'content', 'manifest', 'status', 'created_at'],
    },
  });

  const { initializeAppDatabase, isInMemoryAppDatabase, __setAppDatabaseAdapterResolverForTests } =
    await loadAppDatabaseModule();

  __setAppDatabaseAdapterResolverForTests(async (): Promise<StorageAdapter> => adapter);

  await initializeAppDatabase();

  assert.equal(isInMemoryAppDatabase(), false);

  const alterIdx = adapter.execCalls.findIndex((statement) =>
    statement.includes('ALTER TABLE wunderland_posts ADD COLUMN enclave_id')
  );
  const indexIdx = adapter.execCalls.findIndex((statement) =>
    statement.includes('CREATE INDEX IF NOT EXISTS idx_wunderland_posts_enclave')
  );

  assert.ok(alterIdx !== -1, 'expected enclave_id migration');
  assert.ok(indexIdx !== -1, 'expected enclave index creation');
  assert.ok(alterIdx < indexIdx, 'expected index creation after column migration');
});

test('initializeAppDatabase migrates social-posting and media-library columns', async () => {
  const adapter = new MockAdapter('better-sqlite3', {
    persistent: true,
    wal: true,
    columns: {
      // Legacy social-post schema missing newer JSON/result fields
      wunderland_social_posts: [
        'id',
        'seed_id',
        'base_content',
        'platforms',
        'created_at',
        'updated_at',
      ],
      // Legacy media schema missing dimensions/tags/thumb
      wunderland_media_assets: [
        'id',
        'seed_id',
        'owner_user_id',
        'filename',
        'original_name',
        'mime_type',
        'size',
        'storage_path',
        'created_at',
        'updated_at',
      ],
    },
  });

  const { initializeAppDatabase, __setAppDatabaseAdapterResolverForTests } =
    await loadAppDatabaseModule();

  __setAppDatabaseAdapterResolverForTests(async (): Promise<StorageAdapter> => adapter);
  await initializeAppDatabase();

  const statements = adapter.execCalls.join('\n');
  assert.match(
    statements,
    /ALTER TABLE wunderland_social_posts ADD COLUMN adaptations/i,
    'expected social posts adaptations migration'
  );
  assert.match(
    statements,
    /ALTER TABLE wunderland_social_posts ADD COLUMN media_urls/i,
    'expected social posts media_urls migration'
  );
  assert.match(
    statements,
    /ALTER TABLE wunderland_social_posts ADD COLUMN results/i,
    'expected social posts results migration'
  );
  assert.match(
    statements,
    /ALTER TABLE wunderland_media_assets ADD COLUMN width/i,
    'expected media assets width migration'
  );
  assert.match(
    statements,
    /ALTER TABLE wunderland_media_assets ADD COLUMN tags/i,
    'expected media assets tags migration'
  );
  assert.match(
    statements,
    /CREATE INDEX IF NOT EXISTS idx_wunderland_media_assets_mime/i,
    'expected media assets index creation'
  );
});

test('initializeAppDatabase falls back to in-memory adapter when resolver throws', async () => {
  const fallbackAdapter = new MockAdapter('sqljs', { persistent: false });
  let callCount = 0;

  const {
    initializeAppDatabase,
    getAppDatabase,
    isInMemoryAppDatabase,
    __setAppDatabaseAdapterResolverForTests,
  } = await loadAppDatabaseModule();

  __setAppDatabaseAdapterResolverForTests(
    async (options?: StorageResolutionOptions): Promise<StorageAdapter> => {
      callCount += 1;
      if (callCount === 1) {
        throw new Error('primary adapter unavailable');
      }
      assert.deepEqual(options?.priority, ['sqljs']);
      return fallbackAdapter;
    }
  );

  await initializeAppDatabase();

  assert.equal(callCount, 2, 'resolver called twice (primary + fallback)');
  assert.equal(isInMemoryAppDatabase(), true);
  assert.equal(getAppDatabase(), fallbackAdapter);
});
