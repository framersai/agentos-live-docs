import { IReportFormatter, ReportData } from './report-types.js';

export class MarkdownFormatter implements IReportFormatter {
  readonly mimeType = 'text/markdown';
  readonly fileExtension = 'md';

  async format(report: ReportData): Promise<string> {
    const lines: string[] = [];

    // Title
    lines.push(`# ${report.title}`);
    lines.push('');
    lines.push(`*Generated: ${new Date(report.generatedAt).toISOString()} | Type: ${report.type}*`);
    lines.push('');

    // Overview
    lines.push('## Overview');
    lines.push('');
    lines.push(`| Field | Value |`);
    lines.push(`| --- | --- |`);
    lines.push(`| Name | ${report.overview.name} |`);
    if (report.overview.status) {
      lines.push(`| Status | ${report.overview.status} |`);
    }
    lines.push(`| Threads | ${report.overview.threadCount} |`);
    lines.push(`| Messages | ${report.overview.messageCount} |`);
    lines.push(`| Attachments | ${report.overview.attachmentCount} |`);
    lines.push(`| Participants | ${report.overview.participants.length} |`);
    lines.push(
      `| Date Range | ${new Date(report.overview.dateRange.earliest).toLocaleDateString()} — ${new Date(report.overview.dateRange.latest).toLocaleDateString()} |`
    );
    lines.push('');

    // Participants
    if (report.overview.participants.length > 0) {
      lines.push('### Participants');
      lines.push('');
      lines.push('| Name | Email | Messages |');
      lines.push('| --- | --- | --- |');
      for (const p of report.overview.participants) {
        lines.push(`| ${p.name ?? 'Unknown'} | ${p.email} | ${p.messageCount} |`);
      }
      lines.push('');
    }

    // Summary
    if (report.summary) {
      lines.push('## Summary');
      lines.push('');
      lines.push(report.summary);
      lines.push('');
    }

    // Timeline
    if (report.timeline.length > 0) {
      lines.push('## Timeline');
      lines.push('');
      for (const event of report.timeline) {
        const date = new Date(event.date).toLocaleDateString();
        lines.push(`- **${date}** — ${event.from}: ${event.subject} *(${event.action})*`);
        if (event.snippet) {
          lines.push(`  > ${event.snippet}`);
        }
      }
      lines.push('');
    }

    // Threads
    if (report.threads.length > 0) {
      lines.push('## Threads');
      lines.push('');
      lines.push('| Subject | Messages | Last Activity | Summary |');
      lines.push('| --- | --- | --- | --- |');
      for (const t of report.threads) {
        const lastActivity = new Date(t.lastActivity).toLocaleDateString();
        lines.push(`| ${t.subject} | ${t.messageCount} | ${lastActivity} | ${t.summary ?? '—'} |`);
      }
      lines.push('');
    }

    // Attachments
    if (report.attachments.length > 0) {
      lines.push('## Attachments');
      lines.push('');
      lines.push('| Filename | Type | Size | Preview |');
      lines.push('| --- | --- | --- | --- |');
      for (const a of report.attachments) {
        const sizeKb = (a.sizeBytes / 1024).toFixed(1);
        lines.push(
          `| ${a.filename} | ${a.mimeType} | ${sizeKb} KB | ${a.extractedPreview ?? '—'} |`
        );
      }
      lines.push('');
    }

    // Action Items
    if (report.actionItems && report.actionItems.length > 0) {
      lines.push('## Action Items');
      lines.push('');
      for (const item of report.actionItems) {
        lines.push(`- [ ] ${item}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}
