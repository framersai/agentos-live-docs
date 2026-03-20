/**
 * @fileoverview Gmail implementation of IEmailProvider.
 * Uses googleapis + google-auth-library for OAuth2-based Gmail API access.
 *
 * @module email-intelligence/providers/gmail-provider
 */

import { google, type gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import type {
  IEmailProvider,
  DecryptedCredentials,
  EmailMessage,
  EmailAddress,
  EmailAttachmentMeta,
  EmailDraft,
  EmailLabel,
  FullSyncOptions,
  IncrementalSyncResult,
} from './email-provider.interface';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extracts a header value from a Gmail message payload by name (case-insensitive).
 */
function getHeader(headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string {
  if (!headers) return '';
  const h = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
  return h?.value ?? '';
}

/**
 * Parses a single email address string like `"Alice Smith <alice@example.com>"`
 * or bare `alice@example.com` into an EmailAddress.
 */
function parseEmailAddress(raw: string): EmailAddress {
  const trimmed = raw.trim();
  // Match: "Name" <email> or Name <email>
  const angleMatch = trimmed.match(/^(?:"?([^"<]*?)"?\s*)?<([^>]+)>$/);
  if (angleMatch) {
    const name = angleMatch[1]?.trim() || null;
    return { email: angleMatch[2].trim(), name };
  }
  // Bare email
  return { email: trimmed, name: null };
}

/**
 * Parses a comma-separated address list, handling quoted names that may
 * contain commas (e.g., `"Last, First" <email@example.com>`).
 */
function parseAddressList(header: string): EmailAddress[] {
  if (!header || !header.trim()) return [];

  const addresses: string[] = [];
  let current = '';
  let inQuotes = false;
  let inAngleBracket = false;

  for (let i = 0; i < header.length; i++) {
    const ch = header[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === '<' && !inQuotes) {
      inAngleBracket = true;
      current += ch;
    } else if (ch === '>' && !inQuotes) {
      inAngleBracket = false;
      current += ch;
    } else if (ch === ',' && !inQuotes && !inAngleBracket) {
      if (current.trim()) addresses.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) addresses.push(current.trim());

  return addresses.map(parseEmailAddress);
}

// ---------------------------------------------------------------------------
// MIME body + attachment extraction
// ---------------------------------------------------------------------------

interface ExtractedBody {
  text: string | null;
  html: string | null;
  attachments: EmailAttachmentMeta[];
}

/**
 * Recursively walks a Gmail message payload to extract text body, HTML body,
 * and attachment metadata.
 */
function extractBodyAndAttachments(
  payload: gmail_v1.Schema$MessagePart | undefined
): ExtractedBody {
  const result: ExtractedBody = { text: null, html: null, attachments: [] };
  if (!payload) return result;

  // Simple (non-multipart) message
  if (!payload.parts || payload.parts.length === 0) {
    if (payload.body?.data) {
      const decoded = Buffer.from(payload.body.data, 'base64url').toString('utf-8');
      if (payload.mimeType === 'text/plain') {
        result.text = decoded;
      } else if (payload.mimeType === 'text/html') {
        result.html = decoded;
      }
    }
    // Check if this single part is an attachment
    if (payload.filename && payload.filename.length > 0) {
      result.attachments.push(partToAttachmentMeta(payload));
    }
    return result;
  }

  // Multipart: recurse into parts
  for (const part of payload.parts) {
    // Attachment: any part with a filename
    if (part.filename && part.filename.length > 0) {
      result.attachments.push(partToAttachmentMeta(part));
      continue;
    }

    if (part.mimeType?.startsWith('multipart/')) {
      // Nested multipart — recurse
      const nested = extractBodyAndAttachments(part);
      if (!result.text && nested.text) result.text = nested.text;
      if (!result.html && nested.html) result.html = nested.html;
      result.attachments.push(...nested.attachments);
    } else if (part.mimeType === 'text/plain' && part.body?.data && !result.text) {
      result.text = Buffer.from(part.body.data, 'base64url').toString('utf-8');
    } else if (part.mimeType === 'text/html' && part.body?.data && !result.html) {
      result.html = Buffer.from(part.body.data, 'base64url').toString('utf-8');
    }
  }

  return result;
}

function partToAttachmentMeta(part: gmail_v1.Schema$MessagePart): EmailAttachmentMeta {
  const contentDisposition = getHeader(part.headers, 'Content-Disposition');
  const isInline =
    contentDisposition.toLowerCase().startsWith('inline') ||
    (part.headers?.some((h) => h.name?.toLowerCase() === 'content-id' && !!h.value) ?? false);

  return {
    attachmentId: part.body?.attachmentId ?? '',
    filename: part.filename ?? 'unnamed',
    mimeType: part.mimeType ?? 'application/octet-stream',
    sizeBytes: part.body?.size ?? 0,
    contentId: getHeader(part.headers, 'Content-ID') || null,
    isInline,
  };
}

// ---------------------------------------------------------------------------
// Message parsing
// ---------------------------------------------------------------------------

function parseGmailMessage(msg: gmail_v1.Schema$Message): EmailMessage {
  const headers = msg.payload?.headers;
  const labelIds = msg.labelIds ?? [];
  const { text, html, attachments } = extractBodyAndAttachments(msg.payload);

  const dateHeader = getHeader(headers, 'Date');
  const receivedDate = dateHeader ? new Date(dateHeader).getTime() : null;

  return {
    id: msg.id ?? '',
    threadId: msg.threadId ?? '',
    messageIdHeader: getHeader(headers, 'Message-ID') || getHeader(headers, 'Message-Id'),
    inReplyTo: getHeader(headers, 'In-Reply-To') || null,
    referencesHeader: parseReferencesHeader(getHeader(headers, 'References')),
    subject: getHeader(headers, 'Subject'),
    from: parseEmailAddress(getHeader(headers, 'From') || 'unknown@unknown'),
    to: parseAddressList(getHeader(headers, 'To')),
    cc: parseAddressList(getHeader(headers, 'Cc')),
    bcc: parseAddressList(getHeader(headers, 'Bcc')),
    bodyText: text,
    bodyHtml: html,
    snippet: msg.snippet ?? '',
    internalDate: Number(msg.internalDate ?? 0),
    receivedDate: Number.isNaN(receivedDate) ? null : receivedDate,
    labels: labelIds,
    isRead: !labelIds.includes('UNREAD'),
    isStarred: labelIds.includes('STARRED'),
    isDraft: labelIds.includes('DRAFT'),
    sizeBytes: msg.sizeEstimate ?? 0,
    attachments,
  };
}

function parseReferencesHeader(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  // References header is whitespace-separated list of Message-IDs
  return raw.trim().split(/\s+/).filter(Boolean);
}

// ---------------------------------------------------------------------------
// RFC 2822 message builder
// ---------------------------------------------------------------------------

function formatAddress(addr: EmailAddress): string {
  if (addr.name) return `${addr.name} <${addr.email}>`;
  return addr.email;
}

function formatAddressList(addresses: EmailAddress[]): string {
  return addresses.map(formatAddress).join(', ');
}

function buildRawRfc2822(draft: EmailDraft, extraHeaders?: Record<string, string>): string {
  const lines: string[] = [];

  lines.push(`To: ${formatAddressList(draft.to)}`);
  if (draft.cc?.length) lines.push(`Cc: ${formatAddressList(draft.cc)}`);
  if (draft.bcc?.length) lines.push(`Bcc: ${formatAddressList(draft.bcc)}`);
  lines.push(`Subject: ${draft.subject}`);
  if (draft.inReplyTo) lines.push(`In-Reply-To: ${draft.inReplyTo}`);
  if (draft.references?.length) lines.push(`References: ${draft.references.join(' ')}`);

  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      lines.push(`${k}: ${v}`);
    }
  }

  lines.push('MIME-Version: 1.0');

  if (draft.bodyHtml) {
    // Send as multipart/alternative with text + HTML
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push('');
    if (draft.bodyText) {
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/plain; charset="UTF-8"');
      lines.push('');
      lines.push(draft.bodyText);
    }
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/html; charset="UTF-8"');
    lines.push('');
    lines.push(draft.bodyHtml);
    lines.push(`--${boundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push('');
    lines.push(draft.bodyText ?? '');
  }

  return Buffer.from(lines.join('\r\n'), 'utf-8').toString('base64url');
}

// ---------------------------------------------------------------------------
// GmailProvider
// ---------------------------------------------------------------------------

export class GmailProvider implements IEmailProvider {
  readonly providerId = 'gmail' as const;
  readonly displayName = 'Gmail';

  private oauthClient: OAuth2Client | null = null;
  private gmail: gmail_v1.Gmail | null = null;
  private initialized = false;

  // ---- Lifecycle ----------------------------------------------------------

  async initialize(credentials: DecryptedCredentials): Promise<void> {
    if (this.initialized) return;

    this.oauthClient = new OAuth2Client(credentials.clientId, credentials.clientSecret);
    this.oauthClient.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    });

    this.gmail = google.gmail({ version: 'v1', auth: this.oauthClient });
    this.initialized = true;
  }

  async shutdown(): Promise<void> {
    this.gmail = null;
    this.oauthClient = null;
    this.initialized = false;
  }

  private get api(): gmail_v1.Gmail {
    if (!this.gmail) {
      throw new Error('GmailProvider not initialized. Call initialize() first.');
    }
    return this.gmail;
  }

  // ---- Connection test ----------------------------------------------------

  async testConnection(): Promise<{ ok: boolean; error?: string }> {
    try {
      await this.api.users.labels.list({ userId: 'me' });
      return { ok: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  }

  // ---- Sync ---------------------------------------------------------------

  async *fullSync(options: FullSyncOptions): AsyncGenerator<EmailMessage[]> {
    const batchSize = options.batchSize ?? 100;
    let yielded = 0;
    let pageToken: string | undefined = undefined;

    // Build Gmail query
    const queryParts: string[] = [];
    if (options.afterDate) {
      const y = options.afterDate.getFullYear();
      const m = String(options.afterDate.getMonth() + 1).padStart(2, '0');
      const d = String(options.afterDate.getDate()).padStart(2, '0');
      queryParts.push(`after:${y}/${m}/${d}`);
    }
    if (options.labelFilter?.length) {
      for (const label of options.labelFilter) {
        queryParts.push(`label:${label}`);
      }
    }
    const q = queryParts.length > 0 ? queryParts.join(' ') : undefined;

    do {
      const remaining = options.maxMessages ? options.maxMessages - yielded : undefined;
      const maxResults = remaining ? Math.min(batchSize, remaining) : batchSize;
      if (maxResults <= 0) break;

      const listRes = await this.api.users.messages.list({
        userId: 'me',
        maxResults,
        pageToken,
        q,
      });

      const stubs = listRes.data.messages ?? [];
      if (stubs.length === 0) break;

      const messages = await Promise.all(
        stubs.map(async (stub) => {
          const full = await this.api.users.messages.get({
            userId: 'me',
            id: stub.id!,
            format: 'full',
          });
          return parseGmailMessage(full.data);
        })
      );

      yield messages;
      yielded += messages.length;

      pageToken = listRes.data.nextPageToken ?? undefined;
    } while (pageToken && (!options.maxMessages || yielded < options.maxMessages));
  }

  async incrementalSync(cursor: string): Promise<IncrementalSyncResult> {
    const { historyId: startHistoryId } = JSON.parse(cursor) as { historyId: string };

    const newMessages: EmailMessage[] = [];
    const modifiedMessageIds = new Set<string>();
    const deletedMessageIds = new Set<string>();
    let latestHistoryId = startHistoryId;
    let pageToken: string | undefined = undefined;

    do {
      const res = await this.api.users.history.list({
        userId: 'me',
        startHistoryId,
        pageToken,
      });

      latestHistoryId = res.data.historyId ?? latestHistoryId;

      for (const record of res.data.history ?? []) {
        // New messages
        if (record.messagesAdded) {
          for (const added of record.messagesAdded) {
            if (added.message?.id) {
              try {
                const full = await this.api.users.messages.get({
                  userId: 'me',
                  id: added.message.id,
                  format: 'full',
                });
                newMessages.push(parseGmailMessage(full.data));
              } catch {
                // Message may have been deleted since the history event
              }
            }
          }
        }

        // Label changes
        if (record.labelsAdded) {
          for (const lbl of record.labelsAdded) {
            if (lbl.message?.id) modifiedMessageIds.add(lbl.message.id);
          }
        }
        if (record.labelsRemoved) {
          for (const lbl of record.labelsRemoved) {
            if (lbl.message?.id) modifiedMessageIds.add(lbl.message.id);
          }
        }

        // Deleted
        if (record.messagesDeleted) {
          for (const del of record.messagesDeleted) {
            if (del.message?.id) deletedMessageIds.add(del.message.id);
          }
        }
      }

      pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);

    return {
      newMessages,
      modifiedMessageIds: [...modifiedMessageIds],
      deletedMessageIds: [...deletedMessageIds],
      newCursor: JSON.stringify({ historyId: latestHistoryId }),
    };
  }

  async getCurrentCursor(): Promise<string> {
    const res = await this.api.users.getProfile({ userId: 'me' });
    return JSON.stringify({ historyId: String(res.data.historyId) });
  }

  // ---- Read ---------------------------------------------------------------

  async getMessage(messageId: string): Promise<EmailMessage> {
    const res = await this.api.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
    return parseGmailMessage(res.data);
  }

  async getThread(threadId: string): Promise<EmailMessage[]> {
    const res = await this.api.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'full',
    });
    return (res.data.messages ?? []).map(parseGmailMessage);
  }

  async getAttachmentContent(messageId: string, attachmentId: string): Promise<Buffer> {
    const res = await this.api.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId,
    });
    return Buffer.from(res.data.data ?? '', 'base64url');
  }

  // ---- Write --------------------------------------------------------------

  async sendMessage(draft: EmailDraft): Promise<{ messageId: string; threadId: string }> {
    const raw = buildRawRfc2822(draft);
    const res = await this.api.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });
    return {
      messageId: res.data.id ?? '',
      threadId: res.data.threadId ?? '',
    };
  }

  async replyToMessage(messageId: string, draft: EmailDraft): Promise<{ messageId: string }> {
    // Fetch original for threading context
    const original = await this.api.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const headers = original.data.payload?.headers;
    const origMessageId = getHeader(headers, 'Message-ID') || getHeader(headers, 'Message-Id');
    const origSubject = getHeader(headers, 'Subject');

    // Ensure draft has threading headers
    const replyDraft: EmailDraft = {
      ...draft,
      subject:
        draft.subject || (origSubject.startsWith('Re:') ? origSubject : `Re: ${origSubject}`),
      inReplyTo: draft.inReplyTo ?? origMessageId,
      references: draft.references ?? (origMessageId ? [origMessageId] : []),
    };

    const raw = buildRawRfc2822(replyDraft);
    const res = await this.api.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        threadId: original.data.threadId ?? undefined,
      },
    });

    return { messageId: res.data.id ?? '' };
  }

  // ---- Labels & actions ---------------------------------------------------

  async modifyLabels(messageId: string, add: string[], remove: string[]): Promise<void> {
    await this.api.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds: add,
        removeLabelIds: remove,
      },
    });
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.modifyLabels(messageId, [], ['UNREAD']);
  }

  async archiveMessage(messageId: string): Promise<void> {
    await this.modifyLabels(messageId, [], ['INBOX']);
  }

  async trashMessage(messageId: string): Promise<void> {
    await this.api.users.messages.trash({
      userId: 'me',
      id: messageId,
    });
  }

  // ---- Search & labels ----------------------------------------------------

  async search(query: string, maxResults = 20): Promise<EmailMessage[]> {
    const listRes = await this.api.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const stubs = listRes.data.messages ?? [];
    if (stubs.length === 0) return [];

    return Promise.all(
      stubs.map(async (stub) => {
        const full = await this.api.users.messages.get({
          userId: 'me',
          id: stub.id!,
          format: 'full',
        });
        return parseGmailMessage(full.data);
      })
    );
  }

  async listLabels(): Promise<EmailLabel[]> {
    const res = await this.api.users.labels.list({ userId: 'me' });
    const labels = res.data.labels ?? [];

    return Promise.all(
      labels.map(async (label) => {
        try {
          const detail = await this.api.users.labels.get({
            userId: 'me',
            id: label.id!,
          });
          return {
            id: detail.data.id ?? '',
            name: detail.data.name ?? '',
            type: (detail.data.type?.toLowerCase() === 'system' ? 'system' : 'user') as
              | 'system'
              | 'user',
            messageCount: detail.data.messagesTotal ?? 0,
            unreadCount: detail.data.messagesUnread ?? 0,
          };
        } catch {
          return {
            id: label.id ?? '',
            name: label.name ?? '',
            type: (label.type?.toLowerCase() === 'system' ? 'system' : 'user') as 'system' | 'user',
            messageCount: 0,
            unreadCount: 0,
          };
        }
      })
    );
  }
}

// Export helpers for testing
export { parseEmailAddress, parseAddressList, parseGmailMessage, getHeader };
