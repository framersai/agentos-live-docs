export interface EmailAddress {
  email: string;
  name: string | null;
}

export interface EmailAttachmentMeta {
  attachmentId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  contentId: string | null;
  isInline: boolean;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  messageIdHeader: string;
  inReplyTo: string | null;
  referencesHeader: string[];
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  bodyText: string | null;
  bodyHtml: string | null;
  snippet: string;
  internalDate: number;
  receivedDate: number | null;
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  sizeBytes: number;
  attachments: EmailAttachmentMeta[];
}

export interface EmailDraft {
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  attachments?: Array<{ filename: string; mimeType: string; content: Buffer }>;
  inReplyTo?: string;
  references?: string[];
}

export interface EmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageCount: number;
  unreadCount: number;
}

export interface FullSyncOptions {
  maxMessages?: number;
  afterDate?: Date;
  labelFilter?: string[];
  batchSize?: number;
}

export interface IncrementalSyncResult {
  newMessages: EmailMessage[];
  modifiedMessageIds: string[];
  deletedMessageIds: string[];
  newCursor: string;
}

export interface DecryptedCredentials {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

export interface IEmailProvider {
  readonly providerId: string;
  readonly displayName: string;

  initialize(credentials: DecryptedCredentials): Promise<void>;
  shutdown(): Promise<void>;
  testConnection(): Promise<{ ok: boolean; error?: string }>;

  fullSync(options: FullSyncOptions): AsyncGenerator<EmailMessage[]>;
  incrementalSync(cursor: string): Promise<IncrementalSyncResult>;
  getCurrentCursor(): Promise<string>;

  getMessage(messageId: string): Promise<EmailMessage>;
  getThread(threadId: string): Promise<EmailMessage[]>;
  getAttachmentContent(messageId: string, attachmentId: string): Promise<Buffer>;

  sendMessage(draft: EmailDraft): Promise<{ messageId: string; threadId: string }>;
  replyToMessage(messageId: string, draft: EmailDraft): Promise<{ messageId: string }>;
  modifyLabels(messageId: string, add: string[], remove: string[]): Promise<void>;
  markAsRead(messageId: string): Promise<void>;
  archiveMessage(messageId: string): Promise<void>;
  trashMessage(messageId: string): Promise<void>;

  search(query: string, maxResults?: number): Promise<EmailMessage[]>;
  listLabels(): Promise<EmailLabel[]>;
}
