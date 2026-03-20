import { IReportFormatter, ReportData } from './report-types.js';

export class JsonFormatter implements IReportFormatter {
  readonly mimeType = 'application/json';
  readonly fileExtension = 'json';

  async format(report: ReportData): Promise<string> {
    return JSON.stringify(report, null, 2);
  }
}
