---
title: 'Cognitive Memory System'
sidebar_position: 6
---

# Cognitive Memory System

> Personality-modulated, decay-aware memory grounded in cognitive science — replacing flat key-value memory with Ebbinghaus forgetting curves, Baddeley's working memory, spreading activation, and HEXACO-driven encoding biases.

## Overview

Traditional agent memory systems treat memory as a flat store: ingest text, embed it, retrieve by similarity. This ignores decades of cognitive science on how biological memory actually works.

The **Cognitive Memory System** models memory as a dynamic, personality-modulated process:

- **Encoding** is shaped by the agent's HEXACO personality traits and current emotional state (PAD model)
- **Forgetting** follows the Ebbinghaus exponential decay curve with spaced repetition reinforcement
- **Retrieval** combines six signals (strength, similarity, recency, emotional congruence, graph activation, importance)
- **Working memory** enforces Baddeley's slot-based capacity limits (7 ± 2, personality-modulated)
- **Consolidation** runs periodically to prune weak traces, merge clusters into schemas, and resolve conflicts

Core features (Batch 1) work with **zero LLM calls**. Advanced features (Batch 2 — observer, reflector, graph, consolidation) activate when configured and degrade gracefully when absent.

## Cognitive Science Foundations

| Model                            | Application in AgentOS                                        |
| -------------------------------- | ------------------------------------------------------------- |
| Atkinson-Shiffrin                | Sensory input → working memory → long-term memory pipeline    |
| Baddeley's working memory        | Slot-based capacity limits with activation levels             |
| Tulving's LTM taxonomy           | Episodic, semantic, procedural, prospective memory types      |
| Ebbinghaus forgetting curve      | Exponential strength decay over time                          |
| Yerkes-Dodson law                | Encoding quality peaks at moderate arousal (inverted U)       |
| Brown & Kulik flashbulb memories | High-emotion events create vivid, persistent traces           |
| Anderson's ACT-R                 | Spreading activation through associative memory graph         |
| HEXACO personality model         | Trait-driven attention weights and memory capacity modulation |

## Memory Types

Based on Tulving's long-term memory taxonomy:

| Type          | Description             | Example                                  |
| ------------- | ----------------------- | ---------------------------------------- |
| `episodic`    | Autobiographical events | "User asked about deployment on Tuesday" |
| `semantic`    | General knowledge/facts | "User prefers TypeScript over Python"    |
| `procedural`  | Skills and how-to       | "To deploy, run `wunderland deploy`"     |
| `prospective` | Future intentions       | "Remind user about the PR review"        |

## Memory Scopes

| Scope          | Visibility                    | Use Case                         |
| -------------- | ----------------------------- | -------------------------------- |
| `thread`       | Single conversation           | In-conversation working context  |
| `user`         | All conversations with a user | User preferences, facts, history |
| `persona`      | All users of a persona        | Persona's learned knowledge      |
| `organization` | All agents in an org          | Shared organizational knowledge  |

## Encoding

Encoding determines how strongly a new input is committed to memory. Four cognitive mechanisms combine:

### 1. HEXACO Personality → Encoding Weights

Each HEXACO trait modulates attention to specific content features:

| Trait             | Effect                                 |
| ----------------- | -------------------------------------- |
| Openness          | High O notices novel, creative content |
| Conscientiousness | High C notices procedures, structure   |
| Emotionality      | High E amplifies emotional content     |
| Extraversion      | High X notices social dynamics         |
| Agreeableness     | High A notices cooperation cues        |
| Honesty           | High H notices ethical/moral content   |

### 2. Yerkes-Dodson Arousal Curve

Encoding quality peaks at moderate arousal (inverted U). Very low (bored) and very high (panicked) arousal both impair encoding.

### 3. Mood-Congruent Encoding

Content whose emotional valence matches the current mood is encoded more strongly.

### 4. Flashbulb Memories

When emotional intensity exceeds a threshold (default: 0.8), the memory becomes a **flashbulb memory** with 2x strength and 5x stability.

### Composite Formula

```
S₀ = min(1.0, base × arousalBoost × emotionalBoost × attentionMultiplier × congruenceBoost × flashbulbBoost)
```

## Forgetting & Decay

Memory strength decays exponentially (Ebbinghaus curve):

```
S(t) = S₀ × e^(-dt / stability)
```

**Spaced repetition**: Each retrieval increases stability with diminishing returns, doubling the reinforcement interval.

**Interference**: New memories that overlap with existing ones cause retroactive interference (weakening old traces) and proactive interference (impairing new encoding).

**Pruning**: Traces below the pruning threshold (default: 0.05) are soft-deleted during consolidation, unless emotionally significant.

## Retrieval

Six signals combine into a composite priority score:

| Signal               | Weight | Description                          |
| -------------------- | ------ | ------------------------------------ |
| Strength             | 0.25   | Current decay-adjusted strength      |
| Similarity           | 0.35   | Cosine similarity from vector search |
| Recency              | 0.10   | Exponential recency boost            |
| Emotional congruence | 0.15   | Mood-matching bias                   |
| Graph activation     | 0.10   | Spreading activation score           |
| Importance           | 0.05   | Confidence-weighted importance       |

**Tip-of-the-tongue**: Traces with high similarity but low strength are returned as partially retrieved, with suggested cues to help recovery.

## Working Memory

Slot-based capacity following Miller's number (7 ± 2), modulated by personality:

- High openness: +1 slot (broader attention)
- High conscientiousness: -1 slot (deeper focus)
- Result clamped to [5, 9]

Slots track activation levels that decay each turn. Items below minimum activation are evicted (and may be encoded to long-term memory).

## Prospective Memory

Future intentions with three trigger types:

| Trigger         | Fires When                            | Example                         |
| --------------- | ------------------------------------- | ------------------------------- |
| `time_based`    | Current time ≥ trigger time           | "Remind me at 3pm"              |
| `event_based`   | Named event occurs                    | "When user mentions deployment" |
| `context_based` | Semantic similarity exceeds threshold | "When we discuss pricing"       |

## Memory Graph

An associative graph connects related memories with typed edges:

| Edge Type           | Meaning                               |
| ------------------- | ------------------------------------- |
| `SHARED_ENTITY`     | Same entity mentioned                 |
| `TEMPORAL_SEQUENCE` | Created within 5 minutes              |
| `SAME_TOPIC`        | Shared topic cluster                  |
| `CONTRADICTS`       | Conflicting information               |
| `CO_ACTIVATED`      | Retrieved together (Hebbian learning) |
| `SCHEMA_INSTANCE`   | Episodic instance of semantic schema  |

**Spreading activation** (Anderson's ACT-R): Given seed nodes, activation propagates through edges to surface associated memories.

## Consolidation Pipeline

Runs periodically (default: hourly) with five steps:

1. **Decay sweep** — Apply Ebbinghaus curve, soft-delete weak traces
2. **Co-activation replay** — Create SHARED_ENTITY and TEMPORAL_SEQUENCE edges
3. **Schema integration** — Cluster detection → LLM summarization into semantic schemas
4. **Conflict resolution** — Resolve CONTRADICTS edges (personality-driven)
5. **Spaced repetition** — Reinforce traces past their reinforcement interval

## Observer / Reflector

**Observer**: Monitors conversation tokens. When threshold is reached (default: 30K tokens), extracts observation notes via LLM, biased by personality traits.

**Reflector**: Consolidates accumulated observation notes into long-term memory traces. Merges redundant observations, detects conflicts, and resolves based on personality.

## Quick Start

```typescript
import { CognitiveMemoryManager } from '@framers/agentos/memory';

const memory = new CognitiveMemoryManager();

await memory.initialize({
  workingMemory: existingWorkingMemory,
  knowledgeGraph: existingKnowledgeGraph,
  vectorStore: existingVectorStore,
  embeddingManager: existingEmbeddingManager,
  agentId: 'my-agent',
  traits: { openness: 0.7, conscientiousness: 0.8, emotionality: 0.5 },
  moodProvider: () => ({ valence: 0, arousal: 0.3, dominance: 0 }),
  featureDetectionStrategy: 'keyword',
});

// Encode
const trace = await memory.encode('I prefer deploying with Docker Compose', mood, 'content', {
  type: 'semantic',
  scope: 'user',
  tags: ['deployment', 'docker'],
});

// Retrieve
const result = await memory.retrieve('How should I deploy?', mood, { topK: 5 });

// Assemble for prompt injection
const context = await memory.assembleForPrompt('How should I deploy?', 1000, mood);
```

## Prompt Assembly

Token-budgeted context assembly across six sections with overflow redistribution:

| Section            | Budget % | Content                              |
| ------------------ | -------- | ------------------------------------ |
| Working Memory     | 15%      | Active context from slot buffer      |
| Semantic Recall    | 45%      | Retrieved semantic/procedural traces |
| Recent Episodic    | 25%      | Retrieved episodic traces            |
| Prospective Alerts | 5%       | Triggered reminders                  |
| Graph Associations | 5%       | Spreading activation context         |
| Observation Notes  | 5%       | Recent observer notes                |

## Source Files

All source lives in `packages/agentos/src/memory/`. See the full technical specification in `packages/agentos/docs/COGNITIVE_MEMORY.md`.
