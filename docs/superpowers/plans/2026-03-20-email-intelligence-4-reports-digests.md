# Email Intelligence — Plan 4: Reports & Digests

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build report generation (PDF/Markdown/JSON) and scheduled digest delivery so users can export project intelligence and receive periodic email summaries.

**Architecture:** `EmailReportService` assembles report data and delegates to format-specific `IReportFormatter` implementations. `EmailDigestService` manages digest configuration and delivery via the existing CronJobService. Both exposed through new REST endpoints.

**Tech Stack:** TypeScript, NestJS, pdfkit (PDF generation), Vitest

**Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md` (Sections 5.6, 5.7, 7.1 report/digest endpoints, 19 data retention)

**Prerequisite:** Plans 1-3 must be complete.

---

### Task 1: Implement report formatters (Markdown, JSON, PDF)

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/reports/report-types.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/reports/markdown-formatter.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/reports/json-formatter.ts`
- Create: `backend/src/modules/wunderland/email-intelligence/reports/pdf-formatter.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/report-formatters.spec.ts`

**report-types.ts** — shared types:

```typescript
export interface ReportData {
  type: 'project' | 'thread' | 'digest';
  title: string;
  generatedAt: number;
  summary?: string; // AI-generated
  overview: {
    name: string;
    status?: string;
    participants: Array<{ email: string; name: string | null; messageCount: number }>;
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
    extractedPreview?: string; // first 200 chars of extracted text
  }>;
  actionItems?: string[];
}

export interface IReportFormatter {
  format(report: ReportData): Promise<Buffer | string>;
  readonly mimeType: string;
  readonly fileExtension: string;
}
```

**MarkdownFormatter:** Structured markdown with headers, tables, bullet lists. Returns string.

**JsonFormatter:** Returns `JSON.stringify(report, null, 2)` as string.

**PdfFormatter:** Uses `pdfkit` to generate a styled PDF document. Sections: title page, overview stats, timeline, thread list, attachment inventory. Returns Buffer.

Install: `cd backend && pnpm add pdfkit` (and `@types/pdfkit` if needed)

**Tests:**

1. MarkdownFormatter produces valid markdown with headers and sections
2. JsonFormatter produces parseable JSON matching ReportData structure
3. PdfFormatter produces Buffer starting with `%PDF`
4. All formatters handle empty report data gracefully

- [ ] Step 1: Install pdfkit dependency
- [ ] Step 2: Write tests
- [ ] Step 3: Create report-types.ts
- [ ] Step 4: Implement MarkdownFormatter, JsonFormatter, PdfFormatter
- [ ] Step 5: Run tests, verify pass
- [ ] Step 6: Commit

---

### Task 2: Implement EmailReportService

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-report.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-report.service.spec.ts`

```typescript
@Injectable()
export class EmailReportService {
  constructor(
    private readonly db: DatabaseService,
    private readonly projectService: EmailProjectService,
    private readonly threadService: EmailThreadService,
  ) {}

  // Generate project report
  async generateProjectReport(projectId: string, format: 'markdown' | 'json' | 'pdf'): Promise<{
    content: Buffer | string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }> {
    // 1. Load project via projectService.getProject()
    // 2. Load all threads and messages across project
    // 3. Get timeline via projectService.getProjectTimeline()
    // 4. Get summary via projectService.getProjectSummary()
    // 5. Load attachment metadata
    // 6. Build ReportData
    // 7. Format via appropriate IReportFormatter
    // 8. Return with metadata
  }

  // Generate thread report
  async generateThreadReport(threadId: string, accountId: string, format: 'markdown' | 'json' | 'pdf'): Promise<{...}> {
    // Similar but for a single thread
  }

  // Generate digest report (for EmailDigestService)
  async generateDigestReport(seedId: string, sinceDate: number, format: 'markdown' | 'json' | 'pdf', options?: {
    filterProjects?: string[];
    filterAccounts?: string[];
    includeAttachments?: boolean;
    includeTimeline?: boolean;
  }): Promise<{...}> {
    // 1. Load new messages since sinceDate
    // 2. Group by project
    // 3. Get project summaries
    // 4. Build digest ReportData
    // 5. Format and return
  }

  private getFormatter(format: string): IReportFormatter { ... }
}
```

**Tests:**

1. generateProjectReport returns markdown with correct sections
2. generateProjectReport returns valid PDF buffer
3. generateProjectReport returns parseable JSON
4. generateThreadReport includes thread hierarchy
5. generateDigestReport filters by date range
6. generateDigestReport respects project/account filters

- [ ] Step 1: Write tests
- [ ] Step 2: Implement EmailReportService
- [ ] Step 3: Run tests, verify pass
- [ ] Step 4: Commit

---

### Task 3: Implement EmailDigestService

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-digest.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-digest.service.spec.ts`

```typescript
@Injectable()
export class EmailDigestService {
  constructor(
    private readonly db: DatabaseService,
    private readonly reportService: EmailReportService,
    private readonly cronService: CronJobService,
  ) {}

  // CRUD for digest configurations
  async createDigest(seedId: string, userId: string, config: CreateDigestDto): Promise<any> {
    // 1. Insert into wunderland_email_digests
    // 2. Create cron job via CronJobService with payload_kind='email_digest'
    // 3. Store cron_job_id on digest row
    // 4. Return digest record
  }

  async listDigests(seedId: string): Promise<any[]> { ... }
  async getDigest(digestId: string): Promise<any> { ... }
  async updateDigest(digestId: string, updates: Partial<CreateDigestDto>): Promise<void> { ... }
  async deleteDigest(digestId: string, userId: string): Promise<void> {
    // Delete cron job, then delete digest row
  }

  // Generate and deliver a digest
  async generateAndDeliver(digestId: string): Promise<void> {
    // 1. Load digest config
    // 2. Compute sinceDate from last_sent_at (or 24h ago if first run)
    // 3. Generate report via reportService.generateDigestReport()
    // 4. Deliver based on delivery_channel:
    //    - 'dashboard': store report content in a new wunderland_email_digest_deliveries table or just update last_sent_at
    //    - 'email': send via existing EmailIntegrationService (SMTP)
    //    - 'webhook': POST to delivery_target URL
    //    - 'telegram'/'discord'/'slack': log as "channel delivery not yet implemented" (Plan 5 will wire channel adapters)
    // 5. Update last_sent_at
  }

  // Preview what a digest would contain
  async previewDigest(digestId: string): Promise<any> {
    // Same as generateAndDeliver but don't send, just return content
  }

  // Send immediately (bypass schedule)
  async sendNow(digestId: string): Promise<void> {
    return this.generateAndDeliver(digestId);
  }
}
```

**Schedule mapping:**

- `'daily'` → `schedule_kind: 'every'`, `schedule_config: { intervalMs: 86400000 }`
- `'weekly'` → `schedule_kind: 'every'`, `schedule_config: { intervalMs: 604800000 }`
- Cron expression → `schedule_kind: 'cron'`, `schedule_config: { expression: '...' }`

**Tests:**

1. createDigest inserts row and creates cron job
2. deleteDigest removes cron job and digest row
3. generateAndDeliver calls reportService with correct sinceDate
4. generateAndDeliver updates last_sent_at
5. generateAndDeliver sends email for delivery_channel='email'
6. previewDigest returns content without sending
7. listDigests returns digests for seedId

- [ ] Step 1: Write tests
- [ ] Step 2: Implement EmailDigestService
- [ ] Step 3: Run tests, verify pass
- [ ] Step 4: Commit

---

### Task 4: Add report and digest REST endpoints

**Files:**

- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.controller.ts`
- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.dto.ts`
- Modify: `backend/src/modules/wunderland/email-intelligence/email-intelligence.module.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-report-endpoints.spec.ts`

**New endpoints:**

Reports:

```
POST /reports/project/:projectId?seedId=X  (body: { format: 'pdf'|'markdown'|'json' })
  → reportService.generateProjectReport() → return file download
POST /reports/thread/:threadId?seedId=X&accountId=Y  (body: { format })
  → reportService.generateThreadReport() → return file download
```

Digests:

```
GET    /digests?seedId=X                        → digestService.listDigests()
POST   /digests?seedId=X (body: CreateDigestDto)→ digestService.createDigest()
GET    /digests/:digestId?seedId=X              → digestService.getDigest()
PATCH  /digests/:digestId?seedId=X              → digestService.updateDigest()
DELETE /digests/:digestId?seedId=X              → digestService.deleteDigest()
POST   /digests/:digestId/preview?seedId=X      → digestService.previewDigest()
POST   /digests/:digestId/send-now?seedId=X     → digestService.sendNow()
```

**DTOs:**

```typescript
export class GenerateReportDto {
  @IsString() @IsIn(['pdf', 'markdown', 'json']) format!: string;
}

export class CreateDigestDto {
  @IsOptional() @IsString() name?: string;
  @IsString() schedule!: string; // 'daily', 'weekly', or cron expression
  @IsOptional() @IsString() @IsIn(['pdf', 'markdown', 'json']) format?: string;
  @IsString() deliveryChannel!: string; // 'dashboard', 'email', 'telegram', etc
  @IsString() deliveryTarget!: string;
  @IsOptional() filterProjects?: string[];
  @IsOptional() filterAccounts?: string[];
  @IsOptional() includeAttachments?: boolean;
  @IsOptional() includeTimeline?: boolean;
}
```

**Rate limits:**

- `POST /reports/*`: 5/hour
- `POST /digests/:id/send-now`: 3/hour

**Register services:** Add EmailReportService, EmailDigestService, formatters to module providers.

**Report download response:** For PDF, set `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="..."`. For markdown/JSON, return as text with appropriate content type.

**Tests:**

1. POST /reports/project returns markdown content
2. POST /reports/project returns PDF buffer
3. GET /digests lists digests
4. POST /digests creates digest with cron job
5. DELETE /digests removes digest and cron job
6. POST /digests/:id/send-now triggers delivery
7. Rate limiting on report endpoints

- [ ] Step 1: Add DTOs
- [ ] Step 2: Write tests
- [ ] Step 3: Implement endpoints
- [ ] Step 4: Register services in module
- [ ] Step 5: Run tests, verify pass
- [ ] Step 6: Commit

---

### Task 5: Implement data retention cleanup

**Files:**

- Create: `backend/src/modules/wunderland/email-intelligence/services/email-retention.service.ts`
- Test: `backend/src/modules/wunderland/email-intelligence/__tests__/email-retention.spec.ts`

```typescript
@Injectable()
export class EmailRetentionService {
  constructor(
    private readonly db: DatabaseService,
    private readonly vectorMemory: EmailVectorMemoryService
  ) {}

  // Clean up expired data for a seed
  async cleanupExpiredData(
    seedId: string,
    retentionDays: number = 365
  ): Promise<{
    messagesDeleted: number;
    attachmentsDeleted: number;
    rateLimitsDeleted: number;
  }> {
    const cutoff = Date.now() - retentionDays * 86400000;

    // 1. Find messages older than cutoff
    // 2. Remove their FTS index entries via vectorMemory.removeDocuments()
    // 3. Delete attachment rows and their FTS entries
    // 4. Delete message rows
    // 5. Clean up rate limit windows older than 2 hours
    // 6. Return counts
  }

  // Schedule weekly cleanup job
  async scheduleCleanup(seedId: string, userId: string): Promise<void> {
    // Create cron job with payload_kind='email_retention'
  }
}
```

**Tests:**

1. Messages older than retention period are deleted
2. Associated attachments are deleted
3. FTS entries are removed
4. Messages within retention period are kept
5. Rate limit cleanup removes old windows
6. Empty cleanup (nothing to delete) succeeds

- [ ] Step 1: Write tests
- [ ] Step 2: Implement EmailRetentionService
- [ ] Step 3: Register in module
- [ ] Step 4: Run tests, verify pass
- [ ] Step 5: Commit

---

## Scope

This plan covers **spec sections 5.6, 5.7, 7.1 (report/digest endpoints), and 19 (data retention)**. Deferred:

| Spec Section                               | Covered In |
| ------------------------------------------ | ---------- |
| 2.3 Extension Pack (ITool implementations) | Plan 5     |
| 8 Dashboard UI                             | Plan 6     |
| 10.3 Skill Registration                    | Plan 5     |
| 17 Demo Mode                               | Plan 6     |
