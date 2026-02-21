import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../../../database/database.service.js';
import { CredentialsService } from '../credentials/credentials.service.js';
import { sendSmtpMail } from './smtp-client.js';

export interface EmailMessage {
  id: string;
  userId: string;
  seedId: string;
  folder: 'sent' | 'drafts';
  fromAddress: string;
  toAddress: string;
  subject: string;
  body: string;
  status: 'sent' | 'draft' | 'failed';
  createdAt: number;
  updatedAt: number | null;
}

export type EmailIntegrationStatus = {
  configured: boolean;
  required: string[];
  present: string[];
  missing: string[];
};

@Injectable()
export class EmailIntegrationService {
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(CredentialsService) private readonly credentials: CredentialsService
  ) {}

  private async requireOwnedAgent(userId: string, seedId: string): Promise<void> {
    const row = await this.db.get<{ seed_id: string }>(
      `SELECT seed_id FROM wunderbots WHERE seed_id = ? AND owner_user_id = ? AND status != 'archived' LIMIT 1`,
      [seedId, userId]
    );
    if (!row) {
      throw new NotFoundException(`Agent "${seedId}" not found or not owned by current user.`);
    }
  }

  private validateEmail(value: string, field: string): string {
    const trimmed = value.trim();
    if (!trimmed) throw new BadRequestException(`${field} is required.`);
    // Lightweight validation; SMTP will be the ultimate authority.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new BadRequestException(`${field} must be a valid email address.`);
    }
    return trimmed;
  }

  async getStatus(userId: string, seedId: string): Promise<EmailIntegrationStatus> {
    const normalizedSeedId = seedId.trim();
    await this.requireOwnedAgent(userId, normalizedSeedId);

    const required = ['smtp_host', 'smtp_user', 'smtp_password'] as const;

    const rows = await this.db.all<{ credential_type: string }>(
      `
        SELECT credential_type
          FROM wunderbot_credentials
         WHERE owner_user_id = ?
           AND seed_id = ?
           AND credential_type IN (${required.map(() => '?').join(',')})
      `,
      [userId, normalizedSeedId, ...required]
    );

    const presentSet = new Set(rows.map((r) => String(r.credential_type)));
    const present = required.filter((t) => presentSet.has(t));
    const missing = required.filter((t) => !presentSet.has(t));

    return {
      configured: missing.length === 0,
      required: [...required],
      present: [...present],
      missing: [...missing],
    };
  }

  async sendTestEmail(
    userId: string,
    payload: {
      seedId: string;
      to: string;
      subject?: string;
      text?: string;
      from?: string;
    }
  ): Promise<{ ok: true; serverResponse: string }> {
    const seedId = payload.seedId.trim();
    await this.requireOwnedAgent(userId, seedId);

    const to = this.validateEmail(payload.to, 'to');
    const fromOverride = payload.from?.trim();
    const subject = (payload.subject?.trim() || 'Wunderland SMTP Test').slice(0, 160);
    const text =
      (payload.text?.trim() ||
        `SMTP integration is live.\n\nseedId: ${seedId}\n\nIf you received this email, your Wunderbot can send outbound email.`) +
      '\n';

    const creds = await this.credentials.getDecryptedValuesByType(userId, seedId, [
      'smtp_host',
      'smtp_user',
      'smtp_password',
      'smtp_from',
    ]);

    const smtpHost = creds.smtp_host?.trim() ?? '';
    const smtpUser = creds.smtp_user?.trim() ?? '';
    const smtpPass = creds.smtp_password ?? '';
    const smtpFrom = creds.smtp_from?.trim() ?? '';

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new BadRequestException(
        'Email integration is not configured. Add smtp_host, smtp_user, and smtp_password in Credential Vault.'
      );
    }

    const from = this.validateEmail(fromOverride || smtpFrom || smtpUser, 'from');

    const result = await sendSmtpMail({
      host: smtpHost,
      user: smtpUser,
      pass: smtpPass,
      from,
      to,
      subject,
      text,
      requireTLS: true,
    });

    return { ok: true, serverResponse: result.serverResponse };
  }

  async sendEmail(
    userId: string,
    payload: {
      seedId: string;
      to: string;
      from?: string;
      subject: string;
      text: string;
    }
  ): Promise<{ ok: true; serverResponse: string }> {
    const seedId = payload.seedId.trim();
    await this.requireOwnedAgent(userId, seedId);

    const to = this.validateEmail(payload.to, 'to');
    const fromOverride = payload.from?.trim();
    const subject = (payload.subject || '').trim();
    const text = (payload.text || '').trim();

    if (!subject) throw new BadRequestException('subject is required.');
    if (!text) throw new BadRequestException('text is required.');

    const creds = await this.credentials.getDecryptedValuesByType(userId, seedId, [
      'smtp_host',
      'smtp_user',
      'smtp_password',
      'smtp_from',
    ]);

    const smtpHost = creds.smtp_host?.trim() ?? '';
    const smtpUser = creds.smtp_user?.trim() ?? '';
    const smtpPass = creds.smtp_password ?? '';
    const smtpFrom = creds.smtp_from?.trim() ?? '';

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new BadRequestException(
        'Email integration is not configured. Add smtp_host, smtp_user, and smtp_password in Credential Vault.'
      );
    }

    const from = this.validateEmail(fromOverride || smtpFrom || smtpUser, 'from');

    const result = await sendSmtpMail({
      host: smtpHost,
      user: smtpUser,
      pass: smtpPass,
      from,
      to,
      subject: subject.slice(0, 160),
      text: text + '\n',
      requireTLS: true,
    });

    // Store sent message
    await this.storeMessage(userId, seedId, 'sent', from, to, subject.slice(0, 160), text, 'sent');

    return { ok: true, serverResponse: result.serverResponse };
  }

  // ---------------------------------------------------------------------------
  // Message storage (sent / drafts)
  // ---------------------------------------------------------------------------

  private async storeMessage(
    userId: string,
    seedId: string,
    folder: 'sent' | 'drafts',
    fromAddress: string,
    toAddress: string,
    subject: string,
    body: string,
    status: 'sent' | 'draft' | 'failed'
  ): Promise<EmailMessage> {
    const id = randomUUID();
    const now = Date.now();
    await this.db.run(
      `INSERT INTO wunderland_email_messages
       (id, user_id, seed_id, folder, from_address, to_address, subject, body, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, seedId, folder, fromAddress, toAddress, subject, body, status, now, now]
    );
    return {
      id,
      userId,
      seedId,
      folder,
      fromAddress,
      toAddress,
      subject,
      body,
      status,
      createdAt: now,
      updatedAt: now,
    };
  }

  private rowToMessage(row: any): EmailMessage {
    return {
      id: row.id,
      userId: row.user_id,
      seedId: row.seed_id,
      folder: row.folder,
      fromAddress: row.from_address,
      toAddress: row.to_address,
      subject: row.subject,
      body: row.body,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async listMessages(
    userId: string,
    filters?: { folder?: string; seedId?: string; limit?: number; offset?: number }
  ): Promise<{ messages: EmailMessage[]; count: number }> {
    const limit = filters?.limit ?? 50;
    const offset = filters?.offset ?? 0;
    const conditions = ['user_id = ?'];
    const params: any[] = [userId];

    if (filters?.folder) {
      conditions.push('folder = ?');
      params.push(filters.folder);
    }
    if (filters?.seedId) {
      conditions.push('seed_id = ?');
      params.push(filters.seedId);
    }

    const where = conditions.join(' AND ');
    const countRow = await this.db.get<{ c: number }>(
      `SELECT COUNT(1) as c FROM wunderland_email_messages WHERE ${where}`,
      params
    );
    const rows = await this.db.all(
      `SELECT * FROM wunderland_email_messages WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      messages: rows.map((r: any) => this.rowToMessage(r)),
      count: countRow?.c ?? 0,
    };
  }

  async getMessage(userId: string, messageId: string): Promise<EmailMessage | null> {
    const row = await this.db.get(
      'SELECT * FROM wunderland_email_messages WHERE id = ? AND user_id = ? LIMIT 1',
      [messageId, userId]
    );
    return row ? this.rowToMessage(row) : null;
  }

  async saveDraft(
    userId: string,
    data: {
      seedId: string;
      to?: string;
      from?: string;
      subject?: string;
      body?: string;
      draftId?: string;
    }
  ): Promise<EmailMessage> {
    const seedId = data.seedId.trim();
    await this.requireOwnedAgent(userId, seedId);

    if (data.draftId) {
      // Update existing draft
      const existing = await this.db.get(
        "SELECT * FROM wunderland_email_messages WHERE id = ? AND user_id = ? AND folder = 'drafts' LIMIT 1",
        [data.draftId, userId]
      );
      if (existing) {
        const now = Date.now();
        await this.db.run(
          `UPDATE wunderland_email_messages
           SET to_address = ?, from_address = ?, subject = ?, body = ?, updated_at = ?
           WHERE id = ?`,
          [data.to || '', data.from || '', data.subject || '', data.body || '', now, data.draftId]
        );
        return this.rowToMessage({
          ...existing,
          to_address: data.to || '',
          from_address: data.from || '',
          subject: data.subject || '',
          body: data.body || '',
          updated_at: now,
        });
      }
    }

    return this.storeMessage(
      userId,
      seedId,
      'drafts',
      data.from || '',
      data.to || '',
      data.subject || '',
      data.body || '',
      'draft'
    );
  }

  async deleteMessage(userId: string, messageId: string): Promise<boolean> {
    const result = await this.db.run(
      'DELETE FROM wunderland_email_messages WHERE id = ? AND user_id = ?',
      [messageId, userId]
    );
    return (result as any)?.changes > 0;
  }
}
