/** 
 * Concrete prompts for single persona conversations.
 * Designed to be specific, actionable, and grounded to minimize hallucination.
 */
export const EXAMPLE_PROMPTS: string[] = [
  "Write a TypeScript function that debounces async operations with exponential backoff",
  "Explain how IndexedDB transactions differ from SQLite transactions using code examples",
  "Convert this SQL schema to Prisma: CREATE TABLE users (id INT, email TEXT UNIQUE, created_at TIMESTAMP)",
  "Debug why this React component re-renders infinitely: useEffect(() => setCount(count + 1))",
  "Create a GitHub Actions workflow that runs tests on PR and deploys on merge to main",
  "Write a Dockerfile for a Node.js Express app with multi-stage builds and health checks",
  "Design a rate limiting strategy for an API with 3 tiers: free (10/min), pro (100/min), enterprise (1000/min)",
  "Compare IndexedDB vs localStorage vs sessionStorage: show a feature matrix with code samples",
  "Refactor this nested callback hell into async/await with proper error handling",
  "Write vitest tests for this function: export const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-')",
  "Create a minimal reproducible example for: React setState not updating inside setTimeout",
  "Design a database schema for a chat app with users, channels, messages, and reactions (no ORMs)",
  "Write a bash script that backs up PostgreSQL to S3 with rotation (keep 7 daily, 4 weekly)",
  "Implement a LRU cache in TypeScript with O(1) get/set using Map and doubly-linked list",
  "Convert this curl command to fetch(): curl -X POST https://api.example.com/data -H 'Auth: Bearer abc' -d '{\"key\":\"val\"}'",
  "Create a .gitignore for a monorepo with Node.js backend, React frontend, and Python ML service",
  "Write a SQL query to find the top 5 users by message count in the last 30 days",
  "Design an event-driven architecture for order processing: cart → payment → fulfillment → notification",
  "Create a tsconfig.json for a library that targets ES2020, generates .d.ts files, and uses path aliases",
  "Implement exponential backoff retry logic with jitter for HTTP requests (max 3 retries, 1s base delay)",
  "Write a custom React hook: useDebounce(value, delay) that returns debounced value",
  "Compare WebSockets vs Server-Sent Events vs Long Polling: show pros/cons with code examples",
  "Create a responsive CSS grid layout: 1 col mobile, 2 cols tablet, 3 cols desktop with gap",
  "Write a Node.js stream that reads a 10GB CSV, filters rows where status='active', outputs JSON",
  "Design API versioning strategy: URL path (/v1/), header (Accept: application/vnd.api+json;version=1), or query param?",
  "Implement a simple pub/sub system in TypeScript with type-safe events using generics",
  "Create a monorepo setup guide: pnpm workspaces, shared tsconfig, turborepo vs nx comparison",
  "Write a PostgreSQL migration: add 'deleted_at' column, create index, backfill with trigger",
  "Design a caching strategy for API responses: Redis with TTL, cache invalidation on mutations",
  "Implement a binary search tree in TypeScript with insert, delete, search, and in-order traversal",
];

/** 
 * Concrete prompts for multi-GMI agency coordination.
 * Designed to show clear role delegation and parallel work.
 * Note: True parallel execution requires workflow start endpoint (not yet wired).
 * Currently only first seat responds (limitation to be fixed).
 */
export const AGENCY_EXAMPLE_PROMPTS: string[] = [
  "[Lead] Review our API docs, [Researcher] check GitHub Issues for common pain points, [Writer] draft FAQ addressing top 5 issues",
  "[Architect] Design schema for multi-tenant SaaS (users, orgs, permissions), [Reviewer] identify security risks, [Writer] document migration plan",
  "[Researcher] Analyze Hacker News front page tech stack mentions (last 48h), [Analyst] find patterns, [Writer] create comparison table",
  "[Tester] Review test coverage in src/auth/*.ts, [Developer] write missing tests for edge cases, [Reviewer] verify tests pass locally",
  "[Monitor] Check our app's error logs (last 24h), [Debugger] identify root causes, [Planner] prioritize fixes with impact scores",
  "[Reviewer] Audit dependencies for security vulnerabilities (npm audit), [Researcher] find alternatives for flagged packages, [Writer] create upgrade plan",
  "[Architect] Design caching layer (Redis vs in-memory), [Analyst] estimate cache hit rates for our traffic, [Writer] document implementation steps",
  "[Analyst] Parse server logs for /api/users response times, [Optimizer] identify slow queries, [Writer] create performance improvement roadmap",
  "[Researcher] Review TypeScript 5.6 release notes, [Developer] identify breaking changes for our codebase, [Planner] create migration checklist",
  "[Tester] Run E2E tests on staging, [Logger] analyze failure patterns, [Developer] create reproducible test cases for 3 most common failures",
];


