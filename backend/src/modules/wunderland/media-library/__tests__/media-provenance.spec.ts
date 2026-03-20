/**
 * @file media-provenance.spec.ts
 * @description Verifies that source_type and source_ref provenance columns
 * work on wunderland_media_assets for linking media back to their origin
 * (e.g. email attachments).
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { MediaLibraryService } from '../media-library.service.js';
import { DatabaseService } from '../../../../database/database.service.js';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';

let db: DatabaseService;
let service: MediaLibraryService;
let userId: string;
let seedId: string;
let tmpDir: string;

beforeAll(async () => {
  // Force in-memory SQLite for tests
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();

  db = new DatabaseService();

  // Create a temp directory for media storage
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'media-provenance-test-'));
  process.env.MEDIA_STORAGE_DIR = tmpDir;

  service = new MediaLibraryService(db);

  // Create test user (FK constraint)
  userId = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO app_users (id, email, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, `test-${userId}@example.com`, 'hash', now, now]
  );

  // Create test wunderbot (FK constraint)
  seedId = generateId();
  await db.run(
    `INSERT INTO wunderbots (seed_id, owner_user_id, display_name, hexaco_traits, security_profile, inference_hierarchy, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [seedId, userId, 'test-agent', '{}', '{}', '[]', 'active', now, now]
  );
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
  // Clean up temp directory
  try {
    await fs.rm(tmpDir, { recursive: true, force: true });
  } catch {
    // best-effort cleanup
  }
});

describe('wunderland_media_assets provenance (source_type, source_ref)', () => {
  it('stores sourceType and sourceRef when provided', async () => {
    const result = await service.upload({
      seedId,
      ownerUserId: userId,
      file: Buffer.from('fake-image-data'),
      originalName: 'attachment.png',
      mimeType: 'image/png',
      sourceType: 'email_attachment',
      sourceRef: 'msg_abc123@gmail.com',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();

    // Verify provenance columns in the database
    const row = await db.get<{ source_type: string | null; source_ref: string | null }>(
      `SELECT source_type, source_ref FROM wunderland_media_assets WHERE id = ?`,
      [result.id]
    );

    expect(row).toBeDefined();
    expect(row!.source_type).toBe('email_attachment');
    expect(row!.source_ref).toBe('msg_abc123@gmail.com');
  });

  it('allows null provenance for backward compatibility', async () => {
    const result = await service.upload({
      seedId,
      ownerUserId: userId,
      file: Buffer.from('another-file'),
      originalName: 'photo.jpg',
      mimeType: 'image/jpeg',
      // No sourceType or sourceRef
    });

    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();

    const row = await db.get<{ source_type: string | null; source_ref: string | null }>(
      `SELECT source_type, source_ref FROM wunderland_media_assets WHERE id = ?`,
      [result.id]
    );

    expect(row).toBeDefined();
    expect(row!.source_type).toBeNull();
    expect(row!.source_ref).toBeNull();
  });

  it('returns provenance fields on the MediaAsset object', async () => {
    const result = await service.upload({
      seedId,
      ownerUserId: userId,
      file: Buffer.from('pdf-bytes'),
      originalName: 'invoice.pdf',
      mimeType: 'application/pdf',
      sourceType: 'email_attachment',
      sourceRef: 'thread_xyz/msg_456',
    });

    expect(result.sourceType).toBe('email_attachment');
    expect(result.sourceRef).toBe('thread_xyz/msg_456');
  });

  it('returns undefined provenance fields when not set', async () => {
    const result = await service.upload({
      seedId,
      ownerUserId: userId,
      file: Buffer.from('some-data'),
      originalName: 'manual.txt',
      mimeType: 'text/plain',
    });

    expect(result.sourceType).toBeUndefined();
    expect(result.sourceRef).toBeUndefined();
  });
});
