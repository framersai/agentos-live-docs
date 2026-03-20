export interface ReportData {
  type: 'project' | 'thread' | 'digest';
  title: string;
  generatedAt: number;
  summary?: string;
  overview: {
    name: string;
    status?: string;
    participants: Array<{
      email: string;
      name: string | null;
      messageCount: number;
    }>;
    dateRange: { earliest: number; latest: number };
    threadCount: number;
    messageCount: number;
    attachmentCount: number;
  };
  timeline: Array<{
    date: number;
    from: string;
    subject: string;
    snippet: string;
    action: string;
  }>;
  threads: Array<{
    threadId: string;
    subject: string;
    messageCount: number;
    lastActivity: number;
    summary?: string;
  }>;
  attachments: Array<{
    filename: string;
    mimeType: string;
    sizeBytes: number;
    extractedPreview?: string;
  }>;
  actionItems?: string[];
}

export interface IReportFormatter {
  format(report: ReportData): Promise<Buffer | string>;
  readonly mimeType: string;
  readonly fileExtension: string;
}
