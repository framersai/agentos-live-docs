import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock Gmail API
// ---------------------------------------------------------------------------

const mockLabelsListFn = vi.fn();
const mockLabelsGetFn = vi.fn();
const mockMessagesListFn = vi.fn();
const mockMessagesGetFn = vi.fn();
const mockMessagesSendFn = vi.fn();
const mockMessagesModifyFn = vi.fn();
const mockMessagesTrashFn = vi.fn();
const mockAttachmentsGetFn = vi.fn();
const mockThreadsGetFn = vi.fn();
const mockHistoryListFn = vi.fn();
const mockGetProfileFn = vi.fn();

const mockGmailApi = {
  users: {
    labels: { list: mockLabelsListFn, get: mockLabelsGetFn },
    messages: {
      list: mockMessagesListFn,
      get: mockMessagesGetFn,
      send: mockMessagesSendFn,
      modify: mockMessagesModifyFn,
      trash: mockMessagesTrashFn,
      attachments: { get: mockAttachmentsGetFn },
    },
    threads: { get: mockThreadsGetFn },
    history: { list: mockHistoryListFn },
    getProfile: mockGetProfileFn,
  },
};

const mockSetCredentials = vi.fn();

vi.mock('googleapis', () => ({
  google: {
    gmail: vi.fn(() => mockGmailApi),
  },
}));

vi.mock('google-auth-library', () => ({
  OAuth2Client: vi.fn().mockImplementation(() => ({
    setCredentials: mockSetCredentials,
  })),
}));

import {
  GmailProvider,
  parseEmailAddress,
  parseAddressList,
  parseGmailMessage,
} from '../providers/gmail-provider';
import type { gmail_v1 } from 'googleapis';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGmailMessage(
  overrides: Partial<gmail_v1.Schema$Message> = {}
): gmail_v1.Schema$Message {
  return {
    id: 'msg-1',
    threadId: 'thread-1',
    internalDate: '1700000000000',
    sizeEstimate: 4096,
    snippet: 'Hello world',
    labelIds: ['INBOX', 'UNREAD'],
    payload: {
      mimeType: 'text/plain',
      headers: [
        { name: 'From', value: 'Alice <alice@example.com>' },
        { name: 'To', value: 'Bob <bob@example.com>' },
        { name: 'Subject', value: 'Test email' },
        { name: 'Date', value: 'Wed, 15 Nov 2023 12:00:00 +0000' },
        { name: 'Message-ID', value: '<msg-id-123@example.com>' },
      ],
      body: {
        data: Buffer.from('Hello, world!', 'utf-8').toString('base64url'),
      },
    },
    ...overrides,
  };
}

function makeMultipartAlternative(): gmail_v1.Schema$Message {
  return {
    id: 'msg-2',
    threadId: 'thread-2',
    internalDate: '1700000000000',
    sizeEstimate: 8192,
    snippet: 'Multipart message',
    labelIds: ['INBOX'],
    payload: {
      mimeType: 'multipart/alternative',
      headers: [
        { name: 'From', value: 'Alice <alice@example.com>' },
        { name: 'To', value: 'Bob <bob@example.com>' },
        { name: 'Subject', value: 'Rich email' },
        { name: 'Date', value: 'Wed, 15 Nov 2023 12:00:00 +0000' },
        { name: 'Message-ID', value: '<msg-id-456@example.com>' },
      ],
      parts: [
        {
          mimeType: 'text/plain',
          body: {
            data: Buffer.from('Plain text body', 'utf-8').toString('base64url'),
          },
        },
        {
          mimeType: 'text/html',
          body: {
            data: Buffer.from('<p>HTML body</p>', 'utf-8').toString('base64url'),
          },
        },
      ],
    },
  };
}

function makeMultipartMixed(): gmail_v1.Schema$Message {
  return {
    id: 'msg-3',
    threadId: 'thread-3',
    internalDate: '1700000000000',
    sizeEstimate: 16384,
    snippet: 'With attachment',
    labelIds: ['INBOX', 'UNREAD'],
    payload: {
      mimeType: 'multipart/mixed',
      headers: [
        { name: 'From', value: 'Alice <alice@example.com>' },
        { name: 'To', value: 'Bob <bob@example.com>' },
        { name: 'Subject', value: 'Email with attachment' },
        { name: 'Date', value: 'Wed, 15 Nov 2023 12:00:00 +0000' },
        { name: 'Message-ID', value: '<msg-id-789@example.com>' },
      ],
      parts: [
        {
          mimeType: 'text/plain',
          body: {
            data: Buffer.from('See attached', 'utf-8').toString('base64url'),
          },
        },
        {
          mimeType: 'application/pdf',
          filename: 'report.pdf',
          body: {
            attachmentId: 'att-1',
            size: 12345,
          },
          headers: [{ name: 'Content-Disposition', value: 'attachment; filename="report.pdf"' }],
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GmailProvider', () => {
  let provider: GmailProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new GmailProvider();
  });

  // 1. providerId
  it('has providerId of "gmail"', () => {
    expect(provider.providerId).toBe('gmail');
    expect(provider.displayName).toBe('Gmail');
  });

  // 2. initialize()
  it('initialize() creates OAuth client and Gmail instance', async () => {
    const { OAuth2Client } = await import('google-auth-library');
    const { google } = await import('googleapis');

    await provider.initialize({
      accessToken: 'at-123',
      refreshToken: 'rt-456',
      clientId: 'cid',
      clientSecret: 'csecret',
    });

    expect(OAuth2Client).toHaveBeenCalledWith('cid', 'csecret');
    expect(mockSetCredentials).toHaveBeenCalledWith({
      access_token: 'at-123',
      refresh_token: 'rt-456',
    });
    expect(google.gmail).toHaveBeenCalledWith(expect.objectContaining({ version: 'v1' }));
  });

  // 3. parseMessage — simple text/plain
  it('parseGmailMessage() handles simple text/plain message', () => {
    const msg = makeGmailMessage();
    const parsed = parseGmailMessage(msg);

    expect(parsed.id).toBe('msg-1');
    expect(parsed.threadId).toBe('thread-1');
    expect(parsed.subject).toBe('Test email');
    expect(parsed.from).toEqual({ email: 'alice@example.com', name: 'Alice' });
    expect(parsed.to).toEqual([{ email: 'bob@example.com', name: 'Bob' }]);
    expect(parsed.bodyText).toBe('Hello, world!');
    expect(parsed.bodyHtml).toBeNull();
    expect(parsed.isRead).toBe(false); // UNREAD label present
    expect(parsed.isStarred).toBe(false);
    expect(parsed.isDraft).toBe(false);
    expect(parsed.messageIdHeader).toBe('<msg-id-123@example.com>');
    expect(parsed.snippet).toBe('Hello world');
  });

  // 4. parseMessage — multipart/alternative (text + HTML)
  it('parseGmailMessage() handles multipart/alternative', () => {
    const msg = makeMultipartAlternative();
    const parsed = parseGmailMessage(msg);

    expect(parsed.bodyText).toBe('Plain text body');
    expect(parsed.bodyHtml).toBe('<p>HTML body</p>');
    expect(parsed.isRead).toBe(true); // no UNREAD label
    expect(parsed.attachments).toHaveLength(0);
  });

  // 5. parseMessage — multipart/mixed with attachment
  it('parseGmailMessage() extracts attachment metadata from multipart/mixed', () => {
    const msg = makeMultipartMixed();
    const parsed = parseGmailMessage(msg);

    expect(parsed.bodyText).toBe('See attached');
    expect(parsed.attachments).toHaveLength(1);
    expect(parsed.attachments[0]).toEqual({
      attachmentId: 'att-1',
      filename: 'report.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 12345,
      contentId: null,
      isInline: false,
    });
  });

  // 6. parseEmailAddress — "Name <email>" format
  it('parseEmailAddress() handles "Name <email>" format', () => {
    expect(parseEmailAddress('Alice Smith <alice@example.com>')).toEqual({
      email: 'alice@example.com',
      name: 'Alice Smith',
    });
    expect(parseEmailAddress('"Smith, Alice" <alice@example.com>')).toEqual({
      email: 'alice@example.com',
      name: 'Smith, Alice',
    });
  });

  // 7. parseEmailAddress — bare email format
  it('parseEmailAddress() handles bare email format', () => {
    expect(parseEmailAddress('alice@example.com')).toEqual({
      email: 'alice@example.com',
      name: null,
    });
  });

  // 8. getCurrentCursor()
  it('getCurrentCursor() returns JSON with historyId', async () => {
    await provider.initialize({
      accessToken: 'at',
      refreshToken: 'rt',
      clientId: 'cid',
      clientSecret: 'cs',
    });

    mockGetProfileFn.mockResolvedValueOnce({
      data: { historyId: '98765' },
    });

    const cursor = await provider.getCurrentCursor();
    expect(JSON.parse(cursor)).toEqual({ historyId: '98765' });
  });

  // 9. testConnection()
  it('testConnection() returns ok:true on success', async () => {
    await provider.initialize({
      accessToken: 'at',
      refreshToken: 'rt',
      clientId: 'cid',
      clientSecret: 'cs',
    });

    mockLabelsListFn.mockResolvedValueOnce({ data: { labels: [] } });

    const result = await provider.testConnection();
    expect(result).toEqual({ ok: true });
  });

  it('testConnection() returns ok:false on failure', async () => {
    await provider.initialize({
      accessToken: 'at',
      refreshToken: 'rt',
      clientId: 'cid',
      clientSecret: 'cs',
    });

    mockLabelsListFn.mockRejectedValueOnce(new Error('Invalid credentials'));

    const result = await provider.testConnection();
    expect(result).toEqual({ ok: false, error: 'Invalid credentials' });
  });

  // 10. fullSync() yields message batches with pagination
  it('fullSync() yields message batches with pagination', async () => {
    await provider.initialize({
      accessToken: 'at',
      refreshToken: 'rt',
      clientId: 'cid',
      clientSecret: 'cs',
    });

    // Page 1: two messages + nextPageToken
    mockMessagesListFn.mockResolvedValueOnce({
      data: {
        messages: [{ id: 'msg-a' }, { id: 'msg-b' }],
        nextPageToken: 'page2',
      },
    });
    mockMessagesGetFn.mockResolvedValueOnce({ data: makeGmailMessage({ id: 'msg-a' }) });
    mockMessagesGetFn.mockResolvedValueOnce({ data: makeGmailMessage({ id: 'msg-b' }) });

    // Page 2: one message, no nextPageToken
    mockMessagesListFn.mockResolvedValueOnce({
      data: {
        messages: [{ id: 'msg-c' }],
        nextPageToken: null,
      },
    });
    mockMessagesGetFn.mockResolvedValueOnce({ data: makeGmailMessage({ id: 'msg-c' }) });

    const batches: Array<Array<{ id: string }>> = [];
    for await (const batch of provider.fullSync({ batchSize: 2 })) {
      batches.push(batch);
    }

    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(2);
    expect(batches[0][0].id).toBe('msg-a');
    expect(batches[0][1].id).toBe('msg-b');
    expect(batches[1]).toHaveLength(1);
    expect(batches[1][0].id).toBe('msg-c');
  });

  // parseAddressList with quoted commas
  it('parseAddressList() handles quoted names with commas', () => {
    const result = parseAddressList('"Last, First" <a@b.com>, Bob <bob@c.com>');
    expect(result).toEqual([
      { email: 'a@b.com', name: 'Last, First' },
      { email: 'bob@c.com', name: 'Bob' },
    ]);
  });

  // Label flags
  it('parseGmailMessage() sets isStarred and isDraft from labels', () => {
    const msg = makeGmailMessage({ labelIds: ['STARRED', 'DRAFT'] });
    const parsed = parseGmailMessage(msg);

    expect(parsed.isStarred).toBe(true);
    expect(parsed.isDraft).toBe(true);
    expect(parsed.isRead).toBe(true); // no UNREAD
  });

  // Throws if not initialized (getMessage doesn't catch)
  it('throws if methods called before initialize()', async () => {
    await expect(provider.getMessage('any-id')).rejects.toThrow('not initialized');
  });
});
