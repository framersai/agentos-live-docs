import { describe, it, expect } from 'vitest';
import { MarkdownFormatter } from '../reports/markdown-formatter.js';
import { JsonFormatter } from '../reports/json-formatter.js';
import { PdfFormatter } from '../reports/pdf-formatter.js';
import { ReportData } from '../reports/report-types.js';

const sampleReport: ReportData = {
  type: 'project',
  title: 'Q1 Product Launch Report',
  generatedAt: Date.now(),
  summary: 'The Q1 product launch is on track with 3 key milestones completed.',
  overview: {
    name: 'Q1 Product Launch',
    status: 'active',
    participants: [
      { email: 'alice@example.com', name: 'Alice Chen', messageCount: 15 },
      { email: 'bob@example.com', name: 'Bob Smith', messageCount: 8 },
      { email: 'carol@example.com', name: null, messageCount: 3 },
    ],
    dateRange: {
      earliest: Date.now() - 30 * 24 * 60 * 60 * 1000,
      latest: Date.now(),
    },
    threadCount: 5,
    messageCount: 26,
    attachmentCount: 4,
  },
  timeline: [
    {
      date: Date.now() - 7 * 24 * 60 * 60 * 1000,
      from: 'Alice Chen',
      subject: 'Launch timeline update',
      snippet: 'We are on track for the March release.',
      action: 'sent',
    },
    {
      date: Date.now() - 3 * 24 * 60 * 60 * 1000,
      from: 'Bob Smith',
      subject: 'Re: Launch timeline update',
      snippet: 'Confirmed, QA is green.',
      action: 'replied',
    },
  ],
  threads: [
    {
      threadId: 'thread-001',
      subject: 'Launch timeline update',
      messageCount: 12,
      lastActivity: Date.now() - 1 * 24 * 60 * 60 * 1000,
      summary: 'Discussion about March release timeline',
    },
    {
      threadId: 'thread-002',
      subject: 'Budget approval',
      messageCount: 6,
      lastActivity: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
  ],
  attachments: [
    {
      filename: 'roadmap.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 245760,
      extractedPreview: 'Product roadmap for Q1 2026',
    },
    {
      filename: 'mockup.png',
      mimeType: 'image/png',
      sizeBytes: 1048576,
    },
  ],
  actionItems: [
    'Finalize pricing by March 25',
    'Send press release draft to marketing',
    'Schedule demo with enterprise clients',
  ],
};

const emptyReport: ReportData = {
  type: 'digest',
  title: 'Empty Digest',
  generatedAt: Date.now(),
  overview: {
    name: 'Empty Project',
    participants: [],
    dateRange: { earliest: Date.now(), latest: Date.now() },
    threadCount: 0,
    messageCount: 0,
    attachmentCount: 0,
  },
  timeline: [],
  threads: [],
  attachments: [],
};

describe('MarkdownFormatter', () => {
  const formatter = new MarkdownFormatter();

  it('returns string containing # headers and report title', async () => {
    const result = await formatter.format(sampleReport);
    expect(typeof result).toBe('string');
    expect(result).toContain('# Q1 Product Launch Report');
    expect(result).toContain('## Overview');
    expect(result).toContain('## Summary');
    expect(result).toContain('## Timeline');
    expect(result).toContain('## Threads');
    expect(result).toContain('## Attachments');
    expect(result).toContain('## Action Items');
  });

  it('includes timeline entries with dates and senders', async () => {
    const result = await formatter.format(sampleReport);
    expect(result).toContain('Alice Chen');
    expect(result).toContain('Launch timeline update');
    expect(result).toContain('Bob Smith');
    expect(result).toContain('*(sent)*');
    expect(result).toContain('*(replied)*');
  });

  it('includes action items as checklist', async () => {
    const result = await formatter.format(sampleReport);
    expect(result).toContain('- [ ] Finalize pricing by March 25');
    expect(result).toContain('- [ ] Send press release draft to marketing');
    expect(result).toContain('- [ ] Schedule demo with enterprise clients');
  });

  it('handles report with empty timeline/threads/attachments', async () => {
    const result = await formatter.format(emptyReport);
    expect(typeof result).toBe('string');
    expect(result).toContain('# Empty Digest');
    expect(result).toContain('## Overview');
    // Should NOT contain empty sections
    expect(result).not.toContain('## Timeline');
    expect(result).not.toContain('## Threads');
    expect(result).not.toContain('## Attachments');
    expect(result).not.toContain('## Action Items');
  });

  it('has correct mimeType and fileExtension', () => {
    expect(formatter.mimeType).toBe('text/markdown');
    expect(formatter.fileExtension).toBe('md');
  });
});

describe('JsonFormatter', () => {
  const formatter = new JsonFormatter();

  it('returns parseable JSON matching input structure', async () => {
    const result = await formatter.format(sampleReport);
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result as string);
    expect(parsed.type).toBe('project');
    expect(parsed.title).toBe('Q1 Product Launch Report');
    expect(parsed.overview.threadCount).toBe(5);
    expect(parsed.overview.messageCount).toBe(26);
    expect(parsed.timeline).toHaveLength(2);
    expect(parsed.threads).toHaveLength(2);
    expect(parsed.attachments).toHaveLength(2);
    expect(parsed.actionItems).toHaveLength(3);
  });

  it('handles report with empty arrays', async () => {
    const result = await formatter.format(emptyReport);
    const parsed = JSON.parse(result as string);
    expect(parsed.timeline).toHaveLength(0);
    expect(parsed.threads).toHaveLength(0);
    expect(parsed.attachments).toHaveLength(0);
    expect(parsed.actionItems).toBeUndefined();
  });

  it('has correct mimeType and fileExtension', () => {
    expect(formatter.mimeType).toBe('application/json');
    expect(formatter.fileExtension).toBe('json');
  });
});

describe('PdfFormatter', () => {
  const formatter = new PdfFormatter();

  it('returns Buffer starting with %PDF', async () => {
    const result = await formatter.format(sampleReport);
    expect(Buffer.isBuffer(result)).toBe(true);
    const header = (result as Buffer).subarray(0, 5).toString('ascii');
    expect(header).toBe('%PDF-');
  });

  it('handles report with empty timeline/threads/attachments', async () => {
    const result = await formatter.format(emptyReport);
    expect(Buffer.isBuffer(result)).toBe(true);
    const header = (result as Buffer).subarray(0, 5).toString('ascii');
    expect(header).toBe('%PDF-');
  });

  it('has correct mimeType and fileExtension', () => {
    expect(formatter.mimeType).toBe('application/pdf');
    expect(formatter.fileExtension).toBe('pdf');
  });
});
