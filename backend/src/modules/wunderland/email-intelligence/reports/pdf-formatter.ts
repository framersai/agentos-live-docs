import PDFDocument from 'pdfkit';
import { IReportFormatter, ReportData } from './report-types.js';

export class PdfFormatter implements IReportFormatter {
  readonly mimeType = 'application/pdf';
  readonly fileExtension = 'pdf';

  async format(report: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc.fontSize(24).text(report.title, { align: 'center' });
      doc
        .fontSize(10)
        .text(`Generated: ${new Date(report.generatedAt).toISOString()} | Type: ${report.type}`, {
          align: 'center',
        });
      doc.moveDown(2);

      // Overview
      this.sectionHeader(doc, 'Overview');
      doc.fontSize(10);
      doc.text(`Name: ${report.overview.name}`);
      doc.text(`Status: ${report.overview.status ?? 'N/A'}`);
      doc.text(
        `Threads: ${report.overview.threadCount} | Messages: ${report.overview.messageCount} | Attachments: ${report.overview.attachmentCount}`
      );
      doc.text(`Participants: ${report.overview.participants.length}`);
      doc.text(
        `Date Range: ${new Date(report.overview.dateRange.earliest).toLocaleDateString()} — ${new Date(report.overview.dateRange.latest).toLocaleDateString()}`
      );
      doc.moveDown();

      // Participants
      if (report.overview.participants.length > 0) {
        this.sectionHeader(doc, 'Participants');
        doc.fontSize(9);
        for (const p of report.overview.participants) {
          doc.text(`${p.name ?? 'Unknown'} <${p.email}> — ${p.messageCount} messages`);
        }
        doc.moveDown();
      }

      // Summary
      if (report.summary) {
        this.sectionHeader(doc, 'Summary');
        doc.fontSize(10).text(report.summary);
        doc.moveDown();
      }

      // Timeline (cap at 50 entries to avoid huge PDFs)
      if (report.timeline.length > 0) {
        this.sectionHeader(doc, 'Timeline');
        doc.fontSize(9);
        for (const event of report.timeline.slice(0, 50)) {
          doc.text(
            `${new Date(event.date).toLocaleDateString()} — ${event.from}: ${event.subject} (${event.action})`
          );
        }
        if (report.timeline.length > 50) {
          doc.text(`... and ${report.timeline.length - 50} more events`);
        }
        doc.moveDown();
      }

      // Threads
      if (report.threads.length > 0) {
        this.sectionHeader(doc, 'Threads');
        doc.fontSize(9);
        for (const t of report.threads) {
          const lastActivity = new Date(t.lastActivity).toLocaleDateString();
          doc.text(`${t.subject} — ${t.messageCount} messages, last activity: ${lastActivity}`);
          if (t.summary) {
            doc.text(`  Summary: ${t.summary}`, { indent: 20 });
          }
        }
        doc.moveDown();
      }

      // Attachments
      if (report.attachments.length > 0) {
        this.sectionHeader(doc, 'Attachments');
        doc.fontSize(9);
        for (const a of report.attachments) {
          const sizeKb = (a.sizeBytes / 1024).toFixed(1);
          doc.text(`${a.filename} (${a.mimeType}, ${sizeKb} KB)`);
          if (a.extractedPreview) {
            doc.text(`  Preview: ${a.extractedPreview}`, { indent: 20 });
          }
        }
        doc.moveDown();
      }

      // Action Items
      if (report.actionItems && report.actionItems.length > 0) {
        this.sectionHeader(doc, 'Action Items');
        doc.fontSize(10);
        for (const item of report.actionItems) {
          doc.text(`• ${item}`);
        }
        doc.moveDown();
      }

      doc.end();
    });
  }

  private sectionHeader(doc: PDFKit.PDFDocument, title: string): void {
    doc.fontSize(16).text(title);
    doc.moveDown(0.5);
  }
}
