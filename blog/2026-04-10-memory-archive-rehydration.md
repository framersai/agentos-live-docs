---
title: "Memory Archive: Lossless Cold Storage for Long-Running Agents"
description: "AgentOS cognitive memory now preserves verbatim content before temporal gist compression. On-demand rehydration lets agents recall exact details from months ago on a fixed context budget."
authors: [agentos-team]
tags: [memory, cognitive-science, architecture, long-running-agents]
keywords: [ai agent memory, temporal gist, memory archive, rehydration, long-running ai agents, memory compression, cold storage, sql-storage-adapter]
image: /img/blog/cognitive-memory.png
---

Temporal gist is one of the strongest features in AgentOS cognitive memory. Old, low-retrieval traces get compressed to 2-3 core assertions, mirroring how human episodic memory fades to semantic gist over time. But compression was destructive: the original verbatim content was overwritten with the summary, and only a SHA-256 hash remained for audit.

For agents that run across hundreds of sessions, this created a ceiling. After a few months, the agent's early memories were irreversibly compressed. Important details that happened to not be retrieved often enough were lost to the gist.

Today's release fixes this with `IMemoryArchive` and on-demand rehydration.

<!-- truncate -->

## The Problem

`TemporalGist` runs during consolidation and compresses old episodic/semantic traces:

```
Original: "The ancient dragon Vex attacked the village of Millhaven at dawn,
           destroying the granary and the blacksmith forge."
Gist:     "Dragon Vex attacked Millhaven. [anxious]"
```

The original is gone. If the agent later needs to know *which buildings* were destroyed, the gist doesn't say. The agent is forced to confabulate or say it doesn't remember.

`MemoryLifecycleManager` had the same problem: its `archive` action type was documented as "conceptual" and fell back to deletion.

## The Fix: Write-Ahead Archive

`TemporalGist` is now **write-ahead**: before overwriting `trace.content` with the gist, it writes the original verbatim content to an `IMemoryArchive`. If the archive write fails, the gist operation is aborted and retried on the next consolidation cycle.

```ts
import { SqlStorageMemoryArchive } from '@framers/agentos/memory/archive';

const brain = await SqliteBrain.open('./agent-brain.sqlite');
const archive = new SqlStorageMemoryArchive(brain.adapter, brain.features);
await archive.initialize();
```

The archive shares the brain's `StorageAdapter` connection, so both tables live in the same SQLite file. Soul exports, clones, and transfers bundle one file.

## On-Demand Rehydration

When the agent encounters a gisted memory and needs the full original text, it calls `rehydrate()`:

```ts
const verbatim = await manager.rehydrate('mt_trace_abc123');
// → "The ancient dragon Vex attacked the village of Millhaven at dawn,
//    destroying the granary and the blacksmith forge."
```

For LLM-driven agents, the `rehydrate_memory` tool is available as an opt-in:

```ts
MemoryToolsExtension({ includeRehydrate: true })
```

The LLM sees gisted summaries in its assembled context. When a summary lacks detail, it tool-calls `rehydrate_memory` with the trace ID to inflate the original.

## Usage-Aware Retention

Archives grow. To prevent unbounded growth, the `ConsolidationPipeline` now includes a step 7: `prune_archive`. It sweeps archived traces past their retention age (default: 365 days) — but with an access-log twist.

Every rehydration writes a row to `archive_access_log`. The retention sweep checks this log before dropping: if a trace has been rehydrated within the retention window, it's kept regardless of age. Traces the agent actively re-accesses stay alive. Traces nobody ever asks about get cleaned up.

## Cross-Platform

`SqlStorageMemoryArchive` wraps `@framers/sql-storage-adapter`'s `StorageAdapter` — the same contract used by `SqliteBrain` and every other AgentOS persistence layer. It works on every platform sql-storage-adapter supports: better-sqlite3 (Node), sql.js (browser/WASM), IndexedDB (browser fallback), Capacitor SQLite (mobile), and PostgreSQL (production).

## Configuration

```ts
const manager = new CognitiveMemoryManager();
await manager.initialize({
  // ... existing config ...
  archive, // IMemoryArchive instance
});
```

No other config changes needed. When `archive` is absent, everything behaves identically to before — the gist is still destructive, and `MemoryLifecycleManager` falls back to delete. The archive is fully opt-in and backward compatible.

## What This Enables

With the archive in place, two upcoming features become possible:

- **Perspective Observer**: multi-agent subjective memory encoding, where the objective verbatim is archived and each agent gets their own perspective-encoded trace
- **End-of-session consolidation**: batch summarization of sessions with lossless originals preserved for future reference

Both are designed and specced. This archive is the foundation they build on.
