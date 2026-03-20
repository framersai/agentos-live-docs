/**
 * @file media-library.service.ts
 * @description Persistent media asset library for agent integrations.
 * Stores files to disk and metadata to the application SQLite database.
 * Follows the same DatabaseService / StorageAdapter patterns as CredentialsService.
 */

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import * as path from 'path';
import * as fs from 'fs/promises';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MediaAsset {
  id: string;
  seedId: string;
  ownerUserId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // for video/audio, in seconds
  tags: string[];
  storagePath: string;
  thumbnailPath?: string;
  sourceType?: string;
  sourceRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadMediaInput {
  seedId: string;
  ownerUserId: string;
  file: Buffer;
  originalName: string;
  mimeType: string;
  tags?: string[];
  /** Provenance: type of source (e.g. 'email_attachment', 'manual_upload') */
  sourceType?: string;
  /** Provenance: reference identifier (e.g. email message ID, thread ID) */
  sourceRef?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toIso(value: number | null | undefined): string | null {
  return typeof value === 'number' && Number.isFinite(value) ? new Date(value).toISOString() : null;
}

function toEpochMs(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  MIME -> extension mapping                                          */
/* ------------------------------------------------------------------ */

const MIME_EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/ogg': '.ogg',
  'application/pdf': '.pdf',
};

/* ------------------------------------------------------------------ */
/*  Service                                                            */
/* ------------------------------------------------------------------ */

@Injectable()
export class MediaLibraryService {
  private readonly logger = new Logger(MediaLibraryService.name);
  private readonly storageDir: string;
  private tableEnsured = false;

  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {
    this.storageDir = process.env.MEDIA_STORAGE_DIR ?? path.join(process.cwd(), 'data', 'media');
  }

  /* -------------------------------------------------------------- */
  /*  Schema migration                                               */
  /* -------------------------------------------------------------- */

  async ensureTable(): Promise<void> {
    if (this.tableEnsured) return;

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS wunderland_media_assets (
        id            TEXT PRIMARY KEY,
        seed_id       TEXT NOT NULL,
        owner_user_id TEXT NOT NULL,
        filename      TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type     TEXT NOT NULL,
        size          INTEGER NOT NULL DEFAULT 0,
        width         INTEGER,
        height        INTEGER,
        duration      REAL,
        tags          TEXT NOT NULL DEFAULT '[]',
        storage_path  TEXT NOT NULL,
        thumbnail_path TEXT,
        source_type   TEXT DEFAULT NULL,
        source_ref    TEXT DEFAULT NULL,
        created_at    BIGINT NOT NULL,
        updated_at    BIGINT NOT NULL
      );
    `);

    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_media_seed_id ON wunderland_media_assets(seed_id);
    `);

    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_media_owner ON wunderland_media_assets(owner_user_id);
    `);

    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_media_mime ON wunderland_media_assets(mime_type);
    `);

    this.tableEnsured = true;
    this.logger.log('Media library table ensured');
  }

  /* -------------------------------------------------------------- */
  /*  Row mapping                                                    */
  /* -------------------------------------------------------------- */

  private mapRow(row: any): MediaAsset {
    let tags: string[] = [];
    try {
      tags = JSON.parse(String(row.tags ?? '[]'));
    } catch {
      tags = [];
    }

    return {
      id: String(row.id),
      seedId: String(row.seed_id),
      ownerUserId: String(row.owner_user_id),
      filename: String(row.filename),
      originalName: String(row.original_name),
      mimeType: String(row.mime_type),
      size: Number(row.size ?? 0),
      width: row.width != null ? Number(row.width) : undefined,
      height: row.height != null ? Number(row.height) : undefined,
      duration: row.duration != null ? Number(row.duration) : undefined,
      tags,
      storagePath: String(row.storage_path),
      thumbnailPath: row.thumbnail_path ? String(row.thumbnail_path) : undefined,
      sourceType: row.source_type ? String(row.source_type) : undefined,
      sourceRef: row.source_ref ? String(row.source_ref) : undefined,
      createdAt: toIso(toEpochMs(row.created_at)) ?? new Date().toISOString(),
      updatedAt: toIso(toEpochMs(row.updated_at)) ?? new Date().toISOString(),
    };
  }

  /* -------------------------------------------------------------- */
  /*  Upload                                                         */
  /* -------------------------------------------------------------- */

  async upload(input: UploadMediaInput): Promise<MediaAsset> {
    await this.ensureTable();

    const id = this.db.generateId();
    const ext = path.extname(input.originalName) || this.getExtFromMime(input.mimeType);
    const filename = `${id}${ext}`;
    const seedDir = path.join(this.storageDir, input.seedId);
    const storagePath = path.join(seedDir, filename);

    // Ensure storage directory exists
    await fs.mkdir(seedDir, { recursive: true });

    // Write file to disk
    await fs.writeFile(storagePath, input.file);

    const now = Date.now();
    const tags = input.tags ?? [];

    await this.db.run(
      `
        INSERT INTO wunderland_media_assets (
          id, seed_id, owner_user_id, filename, original_name,
          mime_type, size, tags, storage_path, source_type, source_ref,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        input.seedId,
        input.ownerUserId,
        filename,
        input.originalName,
        input.mimeType,
        input.file.length,
        JSON.stringify(tags),
        storagePath,
        input.sourceType ?? null,
        input.sourceRef ?? null,
        now,
        now,
      ]
    );

    this.logger.log(
      `Uploaded media asset ${id}: ${input.originalName} (${input.mimeType}, ${input.file.length} bytes)`
    );

    const row = await this.db.get<any>(
      `SELECT * FROM wunderland_media_assets WHERE id = ? LIMIT 1`,
      [id]
    );

    return row
      ? this.mapRow(row)
      : this.mapRow({
          id,
          seed_id: input.seedId,
          owner_user_id: input.ownerUserId,
          filename,
          original_name: input.originalName,
          mime_type: input.mimeType,
          size: input.file.length,
          tags: JSON.stringify(tags),
          storage_path: storagePath,
          source_type: input.sourceType ?? null,
          source_ref: input.sourceRef ?? null,
          created_at: now,
          updated_at: now,
        });
  }

  /* -------------------------------------------------------------- */
  /*  Get single asset                                               */
  /* -------------------------------------------------------------- */

  async getAsset(id: string): Promise<MediaAsset | null> {
    await this.ensureTable();

    const row = await this.db.get<any>(
      `SELECT * FROM wunderland_media_assets WHERE id = ? LIMIT 1`,
      [id]
    );

    return row ? this.mapRow(row) : null;
  }

  /* -------------------------------------------------------------- */
  /*  List assets with filters                                       */
  /* -------------------------------------------------------------- */

  async listAssets(
    ownerUserId: string,
    seedId?: string,
    tags?: string[],
    mimeType?: string,
    limit = 50,
    offset = 0
  ): Promise<{ items: MediaAsset[]; total: number }> {
    await this.ensureTable();

    const where: string[] = ['owner_user_id = ?'];
    const params: Array<string | number> = [ownerUserId];

    if (seedId) {
      where.push('seed_id = ?');
      params.push(seedId);
    }

    if (mimeType) {
      where.push('mime_type LIKE ?');
      params.push(mimeType.includes('/') ? mimeType : `${mimeType}/%`);
    }

    // Tag filtering — JSON array stored as TEXT, use LIKE for each tag
    if (tags?.length) {
      for (const tag of tags) {
        where.push(`tags LIKE ?`);
        params.push(`%"${tag}"%`);
      }
    }

    const whereClause = where.join(' AND ');

    const countRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_media_assets WHERE ${whereClause}`,
      params
    );
    const total = Number(countRow?.cnt ?? 0);

    const rows = await this.db.all<any>(
      `
        SELECT * FROM wunderland_media_assets
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return {
      items: rows.map((row) => this.mapRow(row)),
      total,
    };
  }

  /* -------------------------------------------------------------- */
  /*  Delete asset                                                   */
  /* -------------------------------------------------------------- */

  async deleteAsset(id: string, ownerUserId: string): Promise<boolean> {
    await this.ensureTable();

    const row = await this.db.get<any>(
      `SELECT * FROM wunderland_media_assets WHERE id = ? AND owner_user_id = ? LIMIT 1`,
      [id, ownerUserId]
    );

    if (!row) return false;

    // Remove file from disk
    try {
      await fs.unlink(String(row.storage_path));
    } catch {
      this.logger.warn(`Could not delete file at ${row.storage_path} — may already be removed`);
    }

    // Remove thumbnail if present
    if (row.thumbnail_path) {
      try {
        await fs.unlink(String(row.thumbnail_path));
      } catch {
        // Thumbnail deletion is best-effort
      }
    }

    await this.db.run(`DELETE FROM wunderland_media_assets WHERE id = ? AND owner_user_id = ?`, [
      id,
      ownerUserId,
    ]);

    this.logger.log(`Deleted media asset ${id}`);
    return true;
  }

  /* -------------------------------------------------------------- */
  /*  Tag management                                                 */
  /* -------------------------------------------------------------- */

  async tagAsset(id: string, ownerUserId: string, tags: string[]): Promise<MediaAsset | null> {
    await this.ensureTable();

    const existing = await this.db.get<any>(
      `SELECT * FROM wunderland_media_assets WHERE id = ? AND owner_user_id = ? LIMIT 1`,
      [id, ownerUserId]
    );

    if (!existing) return null;

    const now = Date.now();
    await this.db.run(`UPDATE wunderland_media_assets SET tags = ?, updated_at = ? WHERE id = ?`, [
      JSON.stringify(tags),
      now,
      id,
    ]);

    const updated = await this.db.get<any>(
      `SELECT * FROM wunderland_media_assets WHERE id = ? LIMIT 1`,
      [id]
    );

    return updated ? this.mapRow(updated) : null;
  }

  /* -------------------------------------------------------------- */
  /*  Read asset file from disk                                      */
  /* -------------------------------------------------------------- */

  async getAssetFile(
    id: string,
    ownerUserId: string
  ): Promise<{ buffer: Buffer; mimeType: string; filename: string } | null> {
    await this.ensureTable();

    const row = await this.db.get<any>(
      `SELECT * FROM wunderland_media_assets WHERE id = ? AND owner_user_id = ? LIMIT 1`,
      [id, ownerUserId]
    );

    if (!row) return null;

    try {
      const buffer = await fs.readFile(String(row.storage_path));
      return {
        buffer,
        mimeType: String(row.mime_type),
        filename: String(row.original_name),
      };
    } catch {
      this.logger.warn(`Could not read file for asset ${id} at ${row.storage_path}`);
      return null;
    }
  }

  /* -------------------------------------------------------------- */
  /*  Utility                                                        */
  /* -------------------------------------------------------------- */

  private getExtFromMime(mimeType: string): string {
    return MIME_EXT_MAP[mimeType] ?? '';
  }
}
