import { describe, it, expect } from 'vitest';
import type {
  EmailAddress,
  EmailAttachmentMeta,
  EmailMessage,
  EmailDraft,
  IncrementalSyncResult,
  DecryptedCredentials,
} from '../providers/email-provider.interface';

describe('Email Provider Types', () => {
  it('should construct a full EmailMessage with all required fields', () => {
    const from: EmailAddress = { email: 'sender@example.com', name: 'Sender' };
    const to: EmailAddress = { email: 'recipient@example.com', name: null };

    const attachment: EmailAttachmentMeta = {
      attachmentId: 'att-1',
      filename: 'report.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 102400,
      contentId: null,
      isInline: false,
    };

    const message: EmailMessage = {
      id: 'msg-001',
      threadId: 'thread-001',
      messageIdHeader: '<abc123@mail.example.com>',
      inReplyTo: null,
      referencesHeader: [],
      subject: 'Test Subject',
      from,
      to: [to],
      cc: [],
      bcc: [],
      bodyText: 'Hello world',
      bodyHtml: '<p>Hello world</p>',
      snippet: 'Hello world',
      internalDate: Date.now(),
      receivedDate: null,
      labels: ['INBOX', 'UNREAD'],
      isRead: false,
      isStarred: false,
      isDraft: false,
      sizeBytes: 2048,
      attachments: [attachment],
    };

    expect(message.id).toBe('msg-001');
    expect(message.threadId).toBe('thread-001');
    expect(message.from.email).toBe('sender@example.com');
    expect(message.to).toHaveLength(1);
    expect(message.to[0].name).toBeNull();
    expect(message.attachments).toHaveLength(1);
    expect(message.attachments[0].filename).toBe('report.pdf');
    expect(message.labels).toContain('INBOX');
    expect(message.isRead).toBe(false);
    expect(message.inReplyTo).toBeNull();
    expect(message.referencesHeader).toEqual([]);
    expect(message.receivedDate).toBeNull();
  });

  it('should parse IncrementalSyncResult.newCursor as opaque JSON string', () => {
    const cursorPayload = { historyId: '98765', timestamp: 1711929600000 };
    const cursor = JSON.stringify(cursorPayload);

    const result: IncrementalSyncResult = {
      newMessages: [],
      modifiedMessageIds: ['msg-modified-1'],
      deletedMessageIds: ['msg-deleted-1'],
      newCursor: cursor,
    };

    expect(result.newCursor).toBe(cursor);
    const parsed = JSON.parse(result.newCursor);
    expect(parsed.historyId).toBe('98765');
    expect(parsed.timestamp).toBe(1711929600000);
    expect(result.modifiedMessageIds).toHaveLength(1);
    expect(result.deletedMessageIds).toHaveLength(1);
  });

  it('should allow EmailDraft with only required fields', () => {
    const minimalDraft: EmailDraft = {
      to: [{ email: 'someone@example.com', name: 'Someone' }],
      subject: 'Minimal draft',
    };

    expect(minimalDraft.to).toHaveLength(1);
    expect(minimalDraft.subject).toBe('Minimal draft');
    expect(minimalDraft.cc).toBeUndefined();
    expect(minimalDraft.bcc).toBeUndefined();
    expect(minimalDraft.bodyText).toBeUndefined();
    expect(minimalDraft.bodyHtml).toBeUndefined();
    expect(minimalDraft.attachments).toBeUndefined();
    expect(minimalDraft.inReplyTo).toBeUndefined();
    expect(minimalDraft.references).toBeUndefined();
  });

  it('should require all 4 fields on DecryptedCredentials', () => {
    const creds: DecryptedCredentials = {
      accessToken: 'ya29.access-token',
      refreshToken: '1//refresh-token',
      clientId: 'client-id.apps.googleusercontent.com',
      clientSecret: 'GOCSPX-secret',
    };

    const keys = Object.keys(creds);
    expect(keys).toHaveLength(4);
    expect(keys).toContain('accessToken');
    expect(keys).toContain('refreshToken');
    expect(keys).toContain('clientId');
    expect(keys).toContain('clientSecret');
    expect(Object.values(creds).every((v) => typeof v === 'string' && v.length > 0)).toBe(true);
  });
});
