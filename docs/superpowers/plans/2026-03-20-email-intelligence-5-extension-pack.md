# Email Intelligence — Plan 5: Extension Pack (ITool Implementations)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `@framers/agentos-ext-email-intelligence` extension pack with 12 ITool implementations so Wunderbots can access email intelligence via channel bots (Telegram/Discord/Slack) and CLI/TUI.

**Architecture:** Extension pack at `packages/agentos-extensions/registry/curated/productivity/email-intelligence/`. Each tool is a thin HTTP client that calls the backend `EmailIntelligenceController` REST API via `X-Internal-Secret` auth. Tools implement the `ITool` interface from `@framers/agentos`.

**Tech Stack:** TypeScript, `@framers/agentos` ITool interface, fetch API

**Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md` (Sections 2.3, 3.0.5, 10.2, 10.3)

**Prerequisite:** Plans 1-4 must be complete.

---

### Task 1: Create extension pack scaffold + EmailIntelligenceClient

**Files:**

- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/package.json`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/manifest.json`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/CAPABILITY.yaml`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/SKILL.md`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/index.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/EmailIntelligenceClient.ts`
- Test: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/test/index.spec.ts`

**package.json:**

```json
{
  "name": "@framers/agentos-ext-email-intelligence",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "dependencies": {}
}
```

**manifest.json** — follow pattern from existing gmail extension manifest.

**CAPABILITY.yaml** — for CapabilityDiscoveryEngine:

```yaml
name: email-intelligence
displayName: Email Intelligence
description: Query email threads, projects, attachments and generate reports via natural language
category: productivity
tags: [email, gmail, intelligence, rag, projects, reports]
requiredSecrets:
  - id: internal.apiSecret
    description: Backend API internal secret
    envVar: INTERNAL_API_SECRET
```

**SKILL.md** — LLM instructions for email intelligence:

```markdown
---
metadata:
  agentos:
    primaryEnv: INTERNAL_API_SECRET
    requires_tools: [searchAcrossThreads, getProjectSummary, getThreadHierarchy]
    categories: [productivity, email, intelligence]
---

You have access to email intelligence tools. Use them to help the user with email-related queries.

When the user asks about emails, projects, or threads:

- Use `searchAcrossThreads` for natural language queries about email content
- Use `getProjectSummary` for project status updates
- Use `getThreadHierarchy` to show reply chains
- Use `generateReport` to create exportable reports
- Use `listProjects` to show all detected projects

Format responses conversationally by default. Use structured output when the user requests `/email` commands.
```

**EmailIntelligenceClient.ts:**

```typescript
export class EmailIntelligenceClient {
  constructor(
    private readonly backendUrl: string,
    private readonly seedId: string,
    private readonly internalSecret: string
  ) {}

  async request<T = any>(
    path: string,
    options?: { method?: string; body?: any; query?: Record<string, string> }
  ): Promise<T> {
    const url = new URL(`${this.backendUrl}/wunderland/email-intelligence/${path}`);
    url.searchParams.set('seedId', this.seedId);
    if (options?.query) {
      for (const [k, v] of Object.entries(options.query)) url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), {
      method: options?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': this.internalSecret,
        'X-Seed-Id': this.seedId,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) throw new Error(`Email API error ${res.status}: ${await res.text()}`);
    return res.json();
  }
}
```

**index.ts** — extension pack factory:

```typescript
import { EmailIntelligenceClient } from './EmailIntelligenceClient';

export function createExtensionPack(options?: {
  seedId?: string;
  backendUrl?: string;
  secrets?: Record<string, string>;
}) {
  const seedId = options?.seedId ?? process.env.WUNDERLAND_SEED_ID ?? '';
  const backendUrl =
    options?.backendUrl ?? process.env.WUNDERLAND_BACKEND_URL ?? 'http://localhost:3000';
  const secret = options?.secrets?.['internal.apiSecret'] ?? process.env.INTERNAL_API_SECRET ?? '';

  const client = new EmailIntelligenceClient(backendUrl, seedId, secret);

  return {
    name: '@framers/agentos-ext-email-intelligence',
    version: '0.1.0',
    descriptors: [
      // Tools will be added in Tasks 2-3
    ],
  };
}
```

**Tests:**

1. createExtensionPack returns pack with correct name and version
2. EmailIntelligenceClient builds correct URL with seedId
3. EmailIntelligenceClient sets X-Internal-Secret header

- [ ] Step 1: Create all scaffold files
- [ ] Step 2: Write tests
- [ ] Step 3: Run tests, verify pass
- [ ] Step 4: Commit

---

### Task 2: Implement core ITool implementations (6 tools)

**Files:**

- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/searchAcrossThreads.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/getThreadHierarchy.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/listProjects.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/getProjectSummary.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/getProjectTimeline.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/listAccounts.ts`
- Modify: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/index.ts` (register tools)
- Test: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/test/tools.spec.ts`

Each tool follows the ITool pattern from the existing gmail extension. Key fields: `id, name, displayName, description, inputSchema (JSON Schema), category, hasSideEffects, execute(args, context)`.

**searchAcrossThreads:**

- Input: `{ query: string, topK?: number, includeAttachments?: boolean }`
- Calls: `POST /query` with body
- Returns: search results with message snippets and sources

**getThreadHierarchy:**

- Input: `{ threadId: string, accountId: string }`
- Calls: `GET /threads/${threadId}?accountId=${accountId}`
- Returns: thread tree structure

**listProjects:**

- Input: `{ status?: string }`
- Calls: `GET /projects`
- Returns: project list

**getProjectSummary:**

- Input: `{ projectId: string }`
- Calls: `GET /projects/${projectId}/summary`
- Returns: AI-generated summary text

**getProjectTimeline:**

- Input: `{ projectId: string }`
- Calls: `GET /projects/${projectId}/timeline`
- Returns: timeline events

**listAccounts:**

- Input: `{}`
- Calls: `GET /accounts`
- Returns: connected email accounts

**Tests:** Mock fetch. Verify each tool:

1. Has correct id/name/description
2. Calls correct endpoint
3. Passes input args correctly
4. Returns parsed response

- [ ] Step 1: Write tests
- [ ] Step 2: Implement 6 tools
- [ ] Step 3: Register in index.ts descriptors
- [ ] Step 4: Run tests, verify pass
- [ ] Step 5: Commit

---

### Task 3: Implement remaining ITool implementations (6 tools)

**Files:**

- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/getAttachment.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/createProject.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/addThreadToProject.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/generateReport.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/getDigestPreview.ts`
- Create: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/tools/syncStatus.ts`
- Modify: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/src/index.ts`
- Test: `packages/agentos-extensions/registry/curated/productivity/email-intelligence/test/tools-extended.spec.ts`

**getAttachment:**

- Input: `{ attachmentId: string }`
- Calls: `GET /attachments/${attachmentId}`
- Returns: attachment detail with extracted text

**createProject:**

- Input: `{ name: string, description?: string, threads?: Array<{threadId, accountId}> }`
- Calls: `POST /projects`
- hasSideEffects: true

**addThreadToProject:**

- Input: `{ projectId: string, threadId: string, accountId: string }`
- Calls: `POST /projects/${projectId}/threads`
- hasSideEffects: true

**generateReport:**

- Input: `{ projectId: string, format: 'pdf'|'markdown'|'json' }`
- Calls: `POST /reports/project/${projectId}`
- Returns: report content or download URL

**getDigestPreview:**

- Input: `{ digestId: string }`
- Calls: `POST /digests/${digestId}/preview`
- Returns: preview content

**syncStatus:**

- Input: `{ accountId?: string }`
- If accountId: `GET /accounts/${accountId}/status`
- Else: `GET /accounts` and return all statuses

**Register all 12 tools as descriptors in index.ts.**

**Tests:** Same pattern as Task 2.

- [ ] Step 1: Write tests
- [ ] Step 2: Implement 6 tools
- [ ] Step 3: Register all 12 tools in index.ts
- [ ] Step 4: Run tests, verify pass
- [ ] Step 5: Commit

---

### Task 4: Register extension in extensions registry

**Files:**

- Modify: `packages/agentos-extensions-registry/src/tool-registry.ts` (add email-intelligence entry)
- Modify: `packages/agentos-extensions-registry/src/manifest-builder.ts` (include in default manifest if needed)

Add the email-intelligence extension to the tool registry catalog:

```typescript
{
  id: 'com.framers.productivity.email-intelligence',
  name: 'Email Intelligence',
  package: '@framers/agentos-ext-email-intelligence',
  version: '0.1.0',
  category: 'productivity',
  description: 'Query email threads, projects, and generate reports via natural language',
  tools: 12,
  verified: true,
}
```

Also register the skill in `packages/agentos-skills-registry/registry/curated/` if the skill registry supports adding new entries.

**Tests:** Verify the entry exists in the registry.

- [ ] Step 1: Add to tool-registry.ts
- [ ] Step 2: Verify registry includes new entry
- [ ] Step 3: Commit

---

## Scope

This plan covers **spec sections 2.3, 3.0.5, 10.2, and 10.3**. Deferred:

| Spec Section                 | Covered In                                   |
| ---------------------------- | -------------------------------------------- |
| 8 Dashboard UI               | Plan 6                                       |
| 9 Channel Bot CLI formatting | Handled by SKILL.md (tool output formatting) |
| 17 Demo Mode                 | Plan 6                                       |
