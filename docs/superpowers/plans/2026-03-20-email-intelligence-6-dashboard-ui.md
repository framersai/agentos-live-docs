# Email Intelligence — Plan 6: Rabbithole Dashboard UI

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Rabbithole dashboard email UI with three views (inbox, projects, intelligence), a persistent AI chat widget, and email settings/OAuth page — all within the existing `/app/dashboard/[seedId]/email/` route.

**Architecture:** Next.js 16 pages in `apps/rabbithole/`. Expands the existing email page into a tabbed interface. Uses `wunderlandAPI` client for backend calls. Follows existing Rabbithole component patterns (OrnateToggle, post-card, badge, etc.) and demo mode convention.

**Tech Stack:** Next.js 16, React 19, TypeScript, existing Rabbithole CSS variables, `wunderland-api.ts`

**Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md` (Sections 8, 17)

**Prerequisite:** Plans 1-5 must be complete (backend + extension pack).

---

### Task 1: Add email intelligence API methods to wunderland-api.ts

**Files:**

- Modify: `apps/rabbithole/src/lib/wunderland-api.ts` (add emailIntelligence namespace)
- Test: Manual — verify types compile

Add a new `emailIntelligence` namespace on the `wunderlandAPI` object, following the existing pattern used by `email`, `channels`, `cron`, etc.

```typescript
emailIntelligence: {
  // Accounts
  listAccounts(seedId: string): Promise<any[]>,
  getAccountStatus(seedId: string, accountId: string): Promise<any>,
  deleteAccount(seedId: string, accountId: string): Promise<void>,
  updateAccount(seedId: string, accountId: string, updates: any): Promise<void>,
  triggerSync(seedId: string, accountId: string): Promise<void>,

  // Messages & Threads
  listMessages(seedId: string, params?: any): Promise<{ messages: any[]; total: number }>,
  getMessage(seedId: string, messageId: string): Promise<any>,
  listThreads(seedId: string, params?: any): Promise<{ threads: any[]; total: number }>,
  getThread(seedId: string, threadId: string, accountId: string): Promise<any>,
  getThreadTimeline(seedId: string, threadId: string, accountId: string): Promise<any[]>,

  // Projects
  listProjects(seedId: string, status?: string): Promise<any[]>,
  createProject(seedId: string, data: any): Promise<any>,
  getProject(seedId: string, projectId: string): Promise<any>,
  updateProject(seedId: string, projectId: string, updates: any): Promise<void>,
  deleteProject(seedId: string, projectId: string): Promise<void>,
  addThreadsToProject(seedId: string, projectId: string, threads: any[]): Promise<void>,
  removeThreadFromProject(seedId: string, projectId: string, threadId: string, accountId: string): Promise<void>,
  mergeProjects(seedId: string, projectIdA: string, projectIdB: string): Promise<any>,
  getProjectSummary(seedId: string, projectId: string): Promise<string>,
  getProjectTimeline(seedId: string, projectId: string): Promise<any[]>,
  detectProjects(seedId: string): Promise<any[]>,
  applyProposals(seedId: string, proposals: any[]): Promise<void>,

  // Intelligence
  query(seedId: string, params: { query: string; topK?: number; includeAttachments?: boolean }): Promise<any>,
  getStats(seedId: string): Promise<{ unread: number; awaitingReply: number; activeProjects: number }>,

  // Attachments
  listAttachments(seedId: string, params?: any): Promise<any[]>,
  getAttachment(seedId: string, attachmentId: string): Promise<any>,
  transcribeAttachment(seedId: string, attachmentId: string): Promise<void>,

  // Reports
  generateProjectReport(seedId: string, projectId: string, format: string): Promise<any>,
  generateThreadReport(seedId: string, threadId: string, accountId: string, format: string): Promise<any>,

  // Digests
  listDigests(seedId: string): Promise<any[]>,
  createDigest(seedId: string, config: any): Promise<any>,
  deleteDigest(seedId: string, digestId: string): Promise<void>,
  previewDigest(seedId: string, digestId: string): Promise<any>,
  sendDigestNow(seedId: string, digestId: string): Promise<void>,
}
```

Each method calls `apiFetch('/wunderland/email-intelligence/...?seedId=X')` following the existing `apiFetch` pattern in the file.

- [ ] Step 1: Read existing wunderland-api.ts to understand the pattern
- [ ] Step 2: Add emailIntelligence namespace with all methods
- [ ] Step 3: Verify TypeScript compiles
- [ ] Step 4: Commit

---

### Task 2: Add demo data for email intelligence

**Files:**

- Modify: `apps/rabbithole/src/lib/demo-data.ts` (add email demo data)

Following the existing demo mode pattern (`DEMO_AGENTS`, `DEMO_POSTS`, etc.), add:

```typescript
export const DEMO_EMAIL_ACCOUNTS = [
  {
    id: 'demo-acc-1',
    provider: 'gmail',
    emailAddress: 'work@example.com',
    displayName: 'Work Gmail',
    syncState: 'idle',
    totalMessagesSynced: 1247,
  },
  {
    id: 'demo-acc-2',
    provider: 'gmail',
    emailAddress: 'personal@example.com',
    displayName: 'Personal Gmail',
    syncState: 'idle',
    totalMessagesSynced: 834,
  },
];

export const DEMO_EMAIL_THREADS = [
  {
    threadId: 'demo-thread-1',
    subject: 'Re: Q2 Launch Timeline',
    from: 'Sarah Chen',
    snippet: 'Updated the timeline doc — see attached...',
    date: Date.now() - 7200000,
    messageCount: 8,
    participantCount: 4,
    isRead: false,
    projectName: 'Project Alpha',
    attachmentCount: 3,
  },
  {
    threadId: 'demo-thread-2',
    subject: 'API redesign proposal',
    from: 'Mike Torres',
    snippet: 'Here is the updated API spec for v3...',
    date: Date.now() - 18000000,
    messageCount: 5,
    participantCount: 3,
    isRead: true,
    projectName: 'Backend Rewrite',
    attachmentCount: 1,
  },
  {
    threadId: 'demo-thread-3',
    subject: 'Contract review — NDA v3',
    from: 'Legal Team',
    snippet: 'Please review the attached NDA...',
    date: Date.now() - 86400000,
    messageCount: 3,
    participantCount: 2,
    isRead: true,
    projectName: 'Vendor Eval',
    attachmentCount: 1,
  },
];

export const DEMO_EMAIL_PROJECTS = [
  {
    id: 'demo-proj-1',
    name: 'Project Alpha',
    status: 'active',
    threadCount: 12,
    messageCount: 47,
    attachmentCount: 8,
    participantCount: 6,
    lastActivityAt: Date.now() - 7200000,
    autoDetected: false,
  },
  {
    id: 'demo-proj-2',
    name: 'Backend Rewrite',
    status: 'active',
    threadCount: 5,
    messageCount: 22,
    attachmentCount: 2,
    participantCount: 3,
    lastActivityAt: Date.now() - 18000000,
    autoDetected: true,
    confidence: 0.87,
  },
];

export const DEMO_EMAIL_STATS = {
  unread: 47,
  awaitingReply: 5,
  activeProjects: 12,
};
```

- [ ] Step 1: Read existing demo-data.ts for patterns
- [ ] Step 2: Add email demo data
- [ ] Step 3: Commit

---

### Task 3: Rebuild email page with tabbed layout + settings

**Files:**

- Rewrite: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/page.tsx`
- Create: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/settings/page.tsx`

The main email page becomes a tabbed interface:

```
/app/dashboard/[seedId]/email/          → redirects to /inbox or shows tab container
/app/dashboard/[seedId]/email/inbox     → Inbox view (Task 4)
/app/dashboard/[seedId]/email/projects  → Projects view (Task 5)
/app/dashboard/[seedId]/email/intelligence → Intelligence dashboard (Task 6)
/app/dashboard/[seedId]/email/settings  → Account management + SMTP test (existing)
```

**Main email page** (`page.tsx`):

- Tab bar: Inbox | Projects | Intelligence | Settings
- Routes to sub-pages via Next.js routing or client-side tab state
- Shows "Connect Gmail" CTA if no accounts connected
- Demo mode: show demo data with banner, following `showDemo = isDemo || (ready && isAuthenticated && !isPaid)` pattern
- Account switcher dropdown (all accounts, or filter to one)

**Settings page** (`settings/page.tsx`):

- "Connect Gmail" button → calls `initiateGmailOAuth` endpoint → redirects to Google
- Connected accounts list with sync status, sync toggle, disconnect button
- SMTP configuration section (preserve existing SMTP test form from current email page)
- Digest configuration (create/manage scheduled digests)

Use existing Rabbithole styling: `IBM Plex Mono` for metadata, `post-card` class, `badge` components, `btn btn--primary` etc.

- [ ] Step 1: Read current email/page.tsx to understand what exists
- [ ] Step 2: Rewrite as tabbed container with routing
- [ ] Step 3: Create settings page (preserve SMTP + add OAuth + accounts)
- [ ] Step 4: Add demo mode pattern
- [ ] Step 5: Commit

---

### Task 4: Build Inbox view (thread-centric)

**Files:**

- Create: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/inbox/page.tsx`
- Create: `apps/rabbithole/src/components/email/EmailThreadCard.tsx`
- Create: `apps/rabbithole/src/components/email/EmailMessageBubble.tsx`
- Create: `apps/rabbithole/src/components/email/ThreadHierarchyTree.tsx`
- Create: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/thread/[threadId]/page.tsx`

**Inbox page** — two-panel layout:

- Left panel: Thread list (filterable by account, label, read/unread)
  - Each thread shows: sender, subject, snippet, date, project tag badges, attachment count, unread dot
  - Infinite scroll with pagination via `wunderlandAPI.emailIntelligence.listThreads()`
  - Search bar (submits to RAG query)
- Right panel: Selected thread detail
  - Thread subject + metadata (participant count, message count, date span)
  - AI thread summary card (green accent, collapsible)
  - Message list chronological with `EmailMessageBubble` components
  - Reply depth indentation via `ThreadHierarchyTree`

**Thread detail page** (`/email/thread/[threadId]`) — full-page thread view:

- Uses `EmailThreadService.reconstructThread()` via API
- Shows full hierarchy tree
- Inline attachment chips
- Project assignment dropdown

**Components:**

`EmailThreadCard`:

```tsx
// Thread preview in inbox list
// Props: threadId, subject, from, snippet, date, isRead, projectTags[], attachmentCount
// Matches existing post-card styling
```

`EmailMessageBubble`:

```tsx
// Single message in thread view
// Props: from, date, bodyText/bodyHtml, attachments[], depth
// Indentation based on depth
// Attachment chips at bottom
```

`ThreadHierarchyTree`:

```tsx
// ASCII-style tree of reply chain
// Props: rootMessages (ThreadNode[])
// Recursive rendering with depth indentation
```

- [ ] Step 1: Create EmailThreadCard, EmailMessageBubble, ThreadHierarchyTree components
- [ ] Step 2: Create inbox page with two-panel layout
- [ ] Step 3: Create thread detail page
- [ ] Step 4: Wire to API calls (with demo mode fallback)
- [ ] Step 5: Commit

---

### Task 5: Build Projects view (project-centric)

**Files:**

- Create: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/projects/page.tsx`
- Create: `apps/rabbithole/src/components/email/ProjectCard.tsx`
- Create: `apps/rabbithole/src/components/email/ProjectTimeline.tsx`
- Create: `apps/rabbithole/src/components/email/ProjectDetectionModal.tsx`
- Create: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/project/[projectId]/page.tsx`

**Projects list page:**

- Card grid of projects (active, archived)
- Each card: name, status badge, description, thread/message/attachment counts, last activity, auto-detected badge with confidence
- "+ Create Project" card (opens create form)
- "Detect Projects" button (triggers auto-detection → shows proposals in `ProjectDetectionModal`)
- Filter by status tabs

**Project detail page** (`/email/project/[projectId]`):

- Header: name (editable), description, status, participant list
- Tabs: Timeline | Threads | Attachments | Reports
- **Timeline tab**: `ProjectTimeline` component — vertical timeline of events
- **Threads tab**: Thread list with hierarchy previews
- **Attachments tab**: Grid of attachments with extracted text previews
- **Reports tab**: Generate on-demand (PDF/MD/JSON button), configure digest

**Components:**

`ProjectCard`: Card with name, stats, badges. Matches existing Rabbithole card patterns.

`ProjectTimeline`: Vertical timeline with date markers, sender, subject, snippet. Each event links to its message.

`ProjectDetectionModal`: Modal showing auto-detected project proposals. Each proposal shows: name, confidence, thread count, participants. Accept/reject buttons.

- [ ] Step 1: Create ProjectCard, ProjectTimeline, ProjectDetectionModal components
- [ ] Step 2: Create projects list page
- [ ] Step 3: Create project detail page with tabs
- [ ] Step 4: Wire to API (with demo mode)
- [ ] Step 5: Commit

---

### Task 6: Build Intelligence dashboard + AI chat widget

**Files:**

- Create: `apps/rabbithole/src/app/app/dashboard/[seedId]/email/intelligence/page.tsx`
- Create: `apps/rabbithole/src/components/email/EmailAIWidget.tsx`
- Create: `apps/rabbithole/src/components/email/EmailStatsBar.tsx`
- Create: `apps/rabbithole/src/components/email/SyncStatusBadge.tsx`

**Intelligence dashboard page:**

- `EmailStatsBar` — row of stat cards: Unread, Awaiting Reply, Active Projects, (Avg Response Time placeholder)
- Project activity overview (which projects had most recent activity)
- Stale threads list (threads with no reply >3 days)
- Sync health indicators per account (`SyncStatusBadge`)

**EmailAIWidget** — persistent chat panel (Gemini-style):

- Right sidebar, collapsible (toggle button)
- Chat input at bottom: "Ask about your emails..."
- Messages rendered as chat bubbles (user queries, AI responses)
- AI responses use `wunderlandAPI.emailIntelligence.query()` for RAG search
- Source citations with clickable links to threads/messages
- Context-aware: knows which view the user is on
- Available on ALL email sub-pages (inbox, projects, intelligence, settings)

**SyncStatusBadge** — small badge showing sync state:

- idle → green dot
- syncing → blue spinner
- error → red dot with tooltip

Mount `EmailAIWidget` in the main email page layout so it persists across tabs.

- [ ] Step 1: Create EmailStatsBar, SyncStatusBadge components
- [ ] Step 2: Create EmailAIWidget with chat interface
- [ ] Step 3: Create intelligence dashboard page
- [ ] Step 4: Mount AI widget in email page layout (persistent across tabs)
- [ ] Step 5: Wire to API (with demo mode)
- [ ] Step 6: Commit

---

### Task 7: Add report download + export UI

**Files:**

- Create: `apps/rabbithole/src/components/email/ReportGeneratorModal.tsx`
- Create: `apps/rabbithole/src/components/email/DigestConfigurator.tsx`
- Modify: project detail page (add report generation)
- Modify: settings page (add digest configuration)

**ReportGeneratorModal:**

- Format selector: PDF / Markdown / JSON
- Generate button → calls `wunderlandAPI.emailIntelligence.generateProjectReport()`
- For PDF: trigger browser download
- For Markdown/JSON: show in modal with copy button, or download

**DigestConfigurator:**

- Schedule: daily / weekly / custom cron
- Format: PDF / Markdown / JSON
- Delivery: dashboard / email / webhook
- Project filter (select which projects to include)
- Preview button → shows digest preview
- Create / Update / Delete buttons

Integrate into:

- Project detail → Reports tab → ReportGeneratorModal
- Settings page → Digest section → DigestConfigurator

- [ ] Step 1: Create ReportGeneratorModal
- [ ] Step 2: Create DigestConfigurator
- [ ] Step 3: Integrate into project detail and settings pages
- [ ] Step 4: Commit

---

## Scope

This plan covers **spec sections 8 (Dashboard UI) and 17 (Demo Mode)**. This completes the entire Email Intelligence feature.

| Component             | Status After Plan 6 |
| --------------------- | ------------------- |
| Schema migrations     | Done (Plan 1)       |
| Gmail provider + sync | Done (Plan 2)       |
| Intelligence layer    | Done (Plan 3)       |
| Reports + digests     | Done (Plan 4)       |
| Extension pack        | Done (Plan 5)       |
| Dashboard UI          | Done (Plan 6)       |
