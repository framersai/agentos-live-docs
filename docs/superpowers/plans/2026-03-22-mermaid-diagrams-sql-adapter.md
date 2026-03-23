# Mermaid Diagrams + SQL Storage Adapter Docs

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all remaining ASCII box-drawing diagrams in wunderland-live-docs to Mermaid, and properly document sql-storage-adapter as the persistence layer in the agentos README.

**Architecture:** 12 doc files contain ~15 ASCII diagrams. The wunderland-live-docs Docusaurus site already has `@docusaurus/theme-mermaid` enabled with `markdown.mermaid: true`. Each diagram converts to a ` ```mermaid ` fenced block. The sql-storage-adapter needs a proper mention in the agentos README RAG/memory sections.

**Tech Stack:** Mermaid (graph/flowchart/stateDiagram syntax), Docusaurus v3

---

### Task 1: Use-Case Diagrams (4 files, 4 diagrams)

**Files:**

- Modify: `apps/wunderland-live-docs/docs/use-cases/lead-generation-pipeline.md:20-44`
- Modify: `apps/wunderland-live-docs/docs/use-cases/social-media-automation.md:52-65`
- Modify: `apps/wunderland-live-docs/docs/use-cases/autonomous-web-agent.md:46-60`
- Modify: `apps/wunderland-live-docs/docs/use-cases/competitive-intelligence.md:50-63`

- [ ] **Step 1: Convert lead-generation-pipeline diagram**
      Replace ASCII 3-agent hierarchy (Prospector → Enricher → Outreach) with Mermaid graph showing agents, skills, extensions, and communication bus.

- [ ] **Step 2: Convert social-media-automation diagram**
      Replace ASCII pipeline (SOURCE → CREATE → ADAPT → PUBLISH → ENGAGE → ANALYZE) with Mermaid flowchart.

- [ ] **Step 3: Convert autonomous-web-agent diagram**
      Replace ASCII ReAct loop (SEARCH → EXTRACT → CONTACT → TRACK → REPORT → LOOP) with Mermaid flowchart with loop-back edge.

- [ ] **Step 4: Convert competitive-intelligence diagram**
      Replace ASCII pipeline (MONITOR → DETECT → RESEARCH → ANALYZE → ALERT → REPORT) with Mermaid flowchart.

- [ ] **Step 5: Commit**
      `git commit -m "docs: convert use-case ASCII diagrams to Mermaid"`

---

### Task 2: Memory System Diagrams (2 files, 3 diagrams)

**Files:**

- Modify: `apps/wunderland-live-docs/docs/guides/memory-system.md:13-42`
- Modify: `apps/wunderland-live-docs/docs/guides/memory-architecture.md:98-104,323-369`

- [ ] **Step 1: Convert memory-system architecture diagram**
      Replace ASCII flow (User → Working Memory → Encoding → Memory Store → Decay → Activation → Prompt) with Mermaid graph.

- [ ] **Step 2: Convert memory-architecture tier diagram (lines 98-104)**
      Replace ASCII three-tier hierarchy with Mermaid.

- [ ] **Step 3: Convert memory-architecture full pipeline (lines 323-369)**
      Replace ASCII multi-level architecture with Mermaid graph.

- [ ] **Step 4: Commit**
      `git commit -m "docs: convert memory system ASCII diagrams to Mermaid"`

---

### Task 3: Blockchain/Security Diagrams (3 files, 4 diagrams)

**Files:**

- Modify: `apps/wunderland-live-docs/docs/guides/agent-signer.md:40-46,83-90`
- Modify: `apps/wunderland-live-docs/docs/guides/immutability.md:27-40,60-72`
- Modify: `apps/wunderland-live-docs/docs/guides/ipfs-storage.md:11-53`

- [ ] **Step 1: Convert agent-signer on-chain registration flow**
      Replace ASCII wallet → PDA creation diagram with Mermaid flowchart.

- [ ] **Step 2: Convert agent-signer recovery process**
      Replace ASCII 3-step timelocked recovery with Mermaid sequence.

- [ ] **Step 3: Convert immutability lifecycle diagram**
      Replace ASCII Setup → Seal → Sealed state machine with Mermaid stateDiagram.

- [ ] **Step 4: Convert IPFS 4-layer storage flow**
      Replace ASCII CLIENT → API → IPFS → SOLANA vertical flow with Mermaid flowchart.

- [ ] **Step 5: Commit**
      `git commit -m "docs: convert blockchain/security ASCII diagrams to Mermaid"`

---

### Task 4: Pipeline Diagrams (2 files, 2 diagrams)

**Files:**

- Modify: `apps/wunderland-live-docs/docs/guides/deep-research.md:43-66`
- Modify: `apps/wunderland-live-docs/docs/_media/GUARDRAILS.md:28-40`

- [ ] **Step 1: Convert deep-research three-phase pipeline**
      Replace ASCII DECOMPOSE → SEARCH → SYNTHESIZE with Mermaid flowchart including feedback loop.

- [ ] **Step 2: Convert guardrails validation flow**
      Replace ASCII decision tree (input → guardrails → permission checks) with Mermaid flowchart with decision diamonds.

- [ ] **Step 3: Commit**
      `git commit -m "docs: convert pipeline ASCII diagrams to Mermaid"`

---

### Task 5: SQL Storage Adapter in AgentOS README

**Files:**

- Modify: `packages/agentos/README.md` (RAG section, ~line 640-660)
- Verify: `packages/sql-storage-adapter/README.md`
- Verify: `packages/sql-storage-adapter/package.json`

- [ ] **Step 1: Add sql-storage-adapter section to agentos README**
      After the RAG vector store table, add a clear callout:
  - Link to `@framers/sql-storage-adapter`
  - Explain it powers SqlVectorStore, conversation persistence, and all SQL-backed storage
  - List the 7 adapters (better-sqlite3, pg, sql.js, capacitor, electron, indexeddb, memory)
  - Note auto-detection and cross-platform support

- [ ] **Step 2: Verify sql-storage-adapter README accuracy**
      Read the README, confirm adapter list matches code, check for stale info.

- [ ] **Step 3: Commit**
      `git commit -m "docs: add sql-storage-adapter as persistence layer in README"`

---

### Task 6: Push all submodule changes

- [ ] **Step 1: Push wunderland-live-docs changes**
- [ ] **Step 2: Push agentos README changes**
- [ ] **Step 3: Update parent repo submodule pointers and push**
