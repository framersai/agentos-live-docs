---
title: "The Complete AgentOS Cognitive Memory Architecture"
description: "A deep technical walkthrough of how AgentOS implements infinite agent memory — from Ebbinghaus decay curves and HEXACO personality encoding to write-ahead archives, subjective multi-agent perspective encoding, narrative thread tracking, and session-spanning scenario planning. How wilds.ai NPCs and companions use these systems to remember, forget, and remember differently."
authors: [agentos-team]
tags: [memory, cognitive-science, architecture, long-running-agents, multi-agent, rag, npc-memory]
keywords: [ai agent memory, cognitive memory architecture, temporal gist, memory archive, rehydration, perspective encoding, HEXACO personality, npc memory, companion memory, ebbinghaus decay, reconsolidation, retrieval-induced forgetting, narrative threads, session planning, knowledge graph, graphrag]
image: /img/blog/cognitive-memory.png
---

This is the complete technical reference for how AgentOS gives AI agents genuine memory — not RAG lookups, but a cognitive system grounded in published neuroscience research that encodes, decays, consolidates, archives, rehydrates, and perspective-encodes memories across hundreds of sessions.

We also cover how [wilds.ai](https://wilds.ai) uses this system to give game NPCs and AI companions distinct minds that remember the same events differently.

<!-- truncate -->

## The Three-Layer Architecture

AgentOS memory ships as three concentric API tiers:

```
┌─────────────────────────────────────────────────────────────┐
│  CLI / Host Layer                                            │
│  Memory.export(), Memory.consolidate(), Memory.health       │
└──┬──────────────────────────────────────────────────────────┘
   │
┌──▼──────────────────────────────────────────────────────────┐
│  CognitiveMemoryManager                                      │
│  HEXACO encoding, 9 mechanisms, observer/reflector pipeline  │
│  Working memory (Baddeley), prompt assembly, rehydration     │
└──┬──────────────────────────────────────────────────────────┘
   │
┌──▼──────────────────────────────────────────────────────────┐
│  SqliteBrain + StorageAdapter                                │
│  Single-file persistence, cross-platform (SQLite/Postgres)   │
│  FTS5 search, knowledge graph, memory archive                │
└─────────────────────────────────────────────────────────────┘
```

Every agent gets its own `brain.sqlite` file. The file contains:
- `memory_traces` — episodic, semantic, procedural, prospective, relational memories
- `knowledge_nodes` / `knowledge_edges` — semantic network (Collins & Quillian spreading activation)
- `archived_traces` — cold storage for verbatim content before compression
- `archive_access_log` — tracks which archived traces are still in use
- `consolidation_log`, `retrieval_feedback` — maintenance and Hebbian learning

All accessed through `@framers/sql-storage-adapter`, which supports better-sqlite3, sql.js (WASM), IndexedDB, Capacitor SQLite, and PostgreSQL behind one async interface.

## Encoding: How Memories Form

When an agent observes an event, `CognitiveMemoryManager.encode()` runs:

1. **Content feature detection** — keyword or LLM-based classification: novelty, emotion, social content, cooperation, contradiction, procedure, ethical content.

2. **Encoding strength** — base strength modulated by HEXACO personality:
   - High emotionality → emotional content encodes stronger
   - High conscientiousness → commitments and procedures encode stronger
   - High openness → novel ideas encode stronger
   - High agreeableness → social/cooperative content encodes stronger

3. **Flashbulb detection** — events with emotional intensity above 0.8 get encoding strength multiplied by 2x and stability multiplied by 5x. These are the "I'll never forget where I was when..." memories.

4. **Emotional context** — PAD (Pleasure-Arousal-Dominance) values snapshot at encoding time. These color how the memory feels, not just what it contains.

## The Nine Cognitive Mechanisms

Once encoded, traces are subject to nine mechanisms drawn from published cognitive science:

### Retrieval-Time Mechanisms

**Reconsolidation** (Nader, Schafe & Le Doux, 2000): Every time a memory is retrieved, it re-enters a labile state. The current mood bleeds into the memory's emotional context. A happy agent remembering a sad event will gradually shift that memory toward neutral. Drift rate: 5% of the PAD delta per retrieval. Cumulative cap: 0.4 total drift. Flashbulb memories are immune.

For perspective-encoded traces (traces that were already rewritten through a character's personality at encoding), the drift rate is halved. One layer of subjectivity is enough — compounding encoding drift with retrieval drift would distort memories beyond usefulness.

**Retrieval-Induced Forgetting** (Anderson, Bjork & Bjork, 1994): Retrieving one memory suppresses competing similar ones. When trace A is retrieved, traces with cosine similarity > 0.7 have their stability reduced by 12%. This naturally prunes redundant memories without explicit deletion.

**Involuntary Recall** (Berntsen, 2009): 8% chance per memory assembly of surfacing an old memory (14+ days) that wasn't explicitly queried. This is the "that reminds me of..." phenomenon — it makes agents feel alive rather than purely reactive.

**Metacognitive FOK** (Nelson & Narens, 1990): Feeling-of-knowing signals for partial memory activation. When a memory scores between 0.3-0.7 on retrieval, a "tip of tongue" signal is generated and injected into the prompt: *"I feel like I should know something about X but can't quite place it..."*

### Consolidation-Time Mechanisms (Background Maintenance)

**Temporal Gist** (Reyna & Brainerd, 1995): Old, low-retrieval traces (60+ days, fewer than 2 retrievals) have their content compressed to 2-3 core assertions via LLM. The original is preserved in the memory archive (see below). Encoding strength is reduced by 20% on compression.

**Schema Encoding** (Bartlett, 1932; Tse et al., 2007): Novel experiences (those that don't match any existing cluster in the knowledge graph) get a 30% encoding boost. Expected/schema-congruent experiences get a 15% discount. This means agents naturally remember surprising things better.

**Source Confidence Decay** (Johnson, Hashtroudi & Lindsay, 1993): Confidence in where a memory came from degrades over time. A memory from a direct user statement starts at confidence 1.0. After weeks of consolidation, it might drop to 0.6. The agent knows the fact but is less certain who told them.

**Emotion Regulation** (Gross, 1998, 2015): High-arousal memories (arousal > 0.8) have their emotional intensity dampened by 15% per consolidation cycle. This is the "time heals all wounds" mechanism — traumatic memories gradually lose their raw emotional punch.

**Persona Drift** (heuristic): Every 10 turns with an NPC, their HEXACO traits are re-evaluated based on relationship dynamics. A previously cold NPC who's had positive interactions may shift toward higher agreeableness.

## The Observer/Reflector Pipeline

Beyond the nine mechanisms, agents have a three-tier observation pipeline:

```
Raw conversation turns
    ↓ MemoryObserver (extract observation notes)
    ↓ ObservationCompressor (3-10x compression, personality-biased)
    ↓ ObservationReflector (cross-observation pattern extraction)
    ↓ Long-term reflections (preference, behavior, capability, relationship, goal)
```

The observer extracts typed notes (factual, emotional, commitment, preference, creative, correction) from raw conversation. The compressor merges related notes with HEXACO-biased triage. The reflector synthesizes long-lived insights that transcend individual conversations.

## Memory Archive: Write-Ahead Cold Storage

`TemporalGist` used to be destructive. The original content was overwritten with the gist, and only a SHA-256 hash remained. For agents running 500+ sessions, this created a hard ceiling — early memories were irreversibly compressed.

`IMemoryArchive` fixes this. Before `TemporalGist` overwrites `trace.content`, it writes the verbatim original to an `archived_traces` table in the same brain database:

```ts
// Write-ahead: archive MUST succeed before gist overwrites
const writeResult = await archive.store({
  traceId: trace.id,
  verbatimContent: trace.content,
  contentHash: await sha256(trace.content),
  archiveReason: 'temporal_gist',
  // ... emotional context, entities, tags preserved
});
if (!writeResult.success) {
  continue; // Abort gist, retry next cycle
}
trace.content = gist; // Safe to overwrite now
```

### On-Demand Rehydration

When the agent encounters a gisted memory and needs the full original:

```ts
const verbatim = await manager.rehydrate('mt_trace_abc123');
// → "The ancient dragon Vex attacked the village of Millhaven at dawn,
//    destroying the granary and the blacksmith forge."
```

For LLM-driven agents, the `rehydrate_memory` tool is available:

```json
{
  "name": "rehydrate_memory",
  "input": { "traceId": "mt_trace_abc123" },
  "output": {
    "verbatimContent": "The ancient dragon Vex attacked...",
    "archivedAt": 1712000000000
  }
}
```

### Usage-Aware Retention

Archives grow. The `ConsolidationPipeline` runs a step 7 (`prune_archive`) that sweeps archived traces past their retention age (default: 365 days). But it checks the access log first — if a trace has been rehydrated recently, it's kept regardless of age. This prevents dropping content the agent is actively re-accessing.

## PerspectiveObserver: NPCs With Distinct Minds

The most ambitious piece. `PerspectiveObserver` takes an objective event and an array of witnesses, and produces per-witness first-person memory traces via LLM rewriting.

```ts
const observer = new PerspectiveObserver({
  llmInvoker: (sys, usr) => callHaiku(sys, usr),
  importanceThreshold: 0.3,
});

const result = await observer.rewrite(
  [{ content: 'The dragon attacked the village.', importance: 0.8, entities: ['Vex', 'player'] }],
  [
    { agentId: 'lyra', agentName: 'Lyra', hexaco: { emotionality: 0.9 }, tier: 'important' },
    { agentId: 'holt', agentName: 'Holt', hexaco: { emotionality: 0.2 }, tier: 'important' },
  ],
);
```

Lyra (high emotionality) remembers: *"I watched in horror as flames consumed our village. The heat on my face, the screaming — I couldn't move."*

Holt (low emotionality, high conscientiousness) remembers: *"The beast attacked at dawn. Predictable timing — exploits the guard rotation gap. I assessed our defensive options and found them lacking."*

Same event. Different minds. The objective event goes to the archive. Each NPC gets their own subjective trace in their own brain.

### Gating

Not every event is worth an LLM call. PerspectiveObserver gates on three predicates:
- **Importance**: events below 0.3 get raw objective encoding
- **Tier**: only `important` NPCs get rewrites; combatants get objective encoding
- **Entity overlap**: if the NPC has no relationship to anyone in the event, they get objective encoding

Cost: ~$0.025 per session for 5 NPCs on Haiku 4.5.

## End-of-Session Pipeline: Narrative Momentum

When a game session ends, a 5-step async pipeline fires:

### Step 1: Objective Session Summary

LLM synthesizes the session's canonical events into a structured record: prose summary, key events with importance scores, and a final state snapshot (region, quests, NPCs met, inventory).

### Step 2: Per-NPC Perspective Blocks

Each important NPC present in the session gets a first-person recap:

*"The player came to me seeking passage through the Darkwood. I was wary at first — too many travelers have ulterior motives. But they helped clear the spider nests without asking for payment. I think... I might trust them."*

On next session start, the last 3 perspective blocks per NPC are injected into the narrator prompt under `## NPC Session Memories`. The narrator sees how each NPC feels and what they remember.

### Step 3: Narrative Thread Updates

First-class plot thread tracking replaces the flat `activeQuests` string array:

```sql
CREATE TABLE narrative_threads (
  thread_id, title, summary, status,
  participants, objectives, complications,
  progress, on_screen, last_session_id
);
```

The LLM creates new threads for storylines that emerged, updates progress on existing threads, and resolves threads whose objectives were met. Off-screen threads can get "what happened while you were away" updates.

### Step 4: Scenario File for Next Session

A planning document loaded into the next session's narrator prompt:

- Where the story left off
- Which threads are in play and what might happen next
- NPC attitudes and likely behavior
- 2-3 potential hooks the narrator can use
- Off-screen developments for stale threads

This is the "DM's prep notes" for the AI — it ensures continuity without the narrator having to reconstruct everything from raw message history.

### Step 5: KnowledgeScopeIndex Rebuild

A typed, token-budgeted enumeration of everything in the world knowledge graph. Injected into the narrator/director system prompt as `## World Scope Index`:

```markdown
## World Scope Index
### NPCs (12)
- Lyra — elven ranger, Silverveil faction, friendly
- Guard Captain Holt — human guard, Millhaven militia, hostile
### Factions (4)
- Silverveil Rangers — forest protectors, allied
### Active Threads (3)
- The Dragon's Demand — Vex demands tribute, 40% complete
```

The narrator sees what exists and can tool-call for detail. This kills a whole class of hallucinations — the LLM doesn't invent NPCs or locations because it knows what's actually in the world.

## How wilds.ai Uses All of This

### Companions

Every companion gets a `WildsMemoryFacade` wrapping `CognitiveMemoryManager` with all 9 mechanisms enabled. The facade creates a `SqlStorageMemoryArchive` sharing the brain's adapter — one SQLite file per companion, archive included. Soul exports bundle the entire brain.

The companion chat sidebar shows memory cards with status badges:
- Purple "gisted" badge for compressed memories (with "(archived)" if the original is preserved)
- Green "subjective" badge for perspective-encoded memories
- Lightning bolt for flashbulb memories
- Game origin badges for memories graduated from play sessions

Memory settings expose toggles for consolidation, decay, archive, and perspective encoding.

### Game NPCs

NPCs get tiered memory:
- **Important** tier: full `CognitiveMemoryManager` with PerspectiveObserver. Events are rewritten through their HEXACO personality. Reconsolidation drift is halved for perspective-encoded traces.
- **Combatant** tier: lightweight episodic-only facade. Raw objective encoding.
- **Background** tier: no memory.

NPCs are promoted from combatant to important when the Director marks them as narratively significant.

The `NpcMemoryBridge` manages all of this per-session. On each turn, `observeForNpc()` routes through the PerspectiveObserver for important NPCs and falls back to the Observer pipeline if unavailable.

### Session Continuity

When a session archives, the end-of-session pipeline runs asynchronously:
1. Session summary → `session_summaries` table
2. Per-NPC perspective blocks → `npc_session_perspectives` table
3. Narrative thread CRUD → `narrative_threads` table
4. Scenario file for next session → `session_scenarios` table
5. Scope index rebuild

When the next session starts, the narrator's system prompt loads:
- The scope index (typed world enumeration)
- The scenario file (breadcrumbs and reminders)
- The last 3 NPC perspective blocks per active NPC
- The world graph context (targeted GraphRAG query)

No cold starts. Every session picks up where the last one left off, with NPC attitudes, plot threads, and narrative momentum intact.

## The Full Data Flow

```
Player action
  → Director (plans NPC actions, spawns quests)
  → NpcMemoryBridge created with PerspectiveObserver
  → Witness info set per NPC (HEXACO, mood, disposition)
  → Judge (validates actions)
  → Kernel (engine state mutations)
  → Narrator (prose generation)
    ← Scope Index injected (what exists in the world)
    ← Scenario File injected (what happened last session)
    ← NPC Perspectives injected (what NPCs remember)
    ← World Graph Context injected (relevant entities)
  → Memory Step (persistence)
    → Session memory: encode user/assistant messages
    → NPC memory: PerspectiveObserver rewrites for important NPCs
    → NPC affinity merge: attitude + faction + mood
    → GraphRAG: ingest turn events into session overlay
    → Memory graduation: graduate to companion core memory

On session archive:
  → End-of-session pipeline (async)
    → Session summary
    → NPC perspective blocks
    → Narrative thread updates
    → Scenario file for next session
    → Scope index rebuild
```

## Getting Started

```ts
import { CognitiveMemoryManager, SqliteBrain } from '@framers/agentos/memory';
import { SqlStorageMemoryArchive } from '@framers/agentos/memory/archive';
import { PerspectiveObserver } from '@framers/agentos/memory/pipeline/observation/PerspectiveObserver';

// Open brain with archive
const brain = await SqliteBrain.open('./agent-brain.sqlite');
const archive = new SqlStorageMemoryArchive(brain.adapter, brain.features);
await archive.initialize();

// Initialize cognitive memory
const manager = new CognitiveMemoryManager();
await manager.initialize({
  agentId: 'my-agent',
  traits: { emotionality: 0.7, conscientiousness: 0.8 },
  moodProvider: () => ({ valence: 0.3, arousal: 0.5, dominance: 0 }),
  featureDetectionStrategy: 'keyword',
  brain,
  archive,
  cognitiveMechanisms: {}, // all 9 enabled with defaults
});

// Encode a memory
await manager.encode('The user prefers dark mode.', currentMood, 'neutral', {
  type: 'semantic',
  tags: ['preference'],
});

// Retrieve relevant memories
const result = await manager.retrieve('what does the user prefer?', currentMood);

// Rehydrate a gisted memory
const verbatim = await manager.rehydrate('mt_trace_abc');
```

Every piece described in this post is shipping in `@framers/agentos` on npm. The full source is at [github.com/framersai/agentos](https://github.com/framersai/agentos).
