---
title: "Cognitive Memory for AI Agents: Beyond RAG"
description: "RAG retrieves documents, it does not remember. AgentOS implements 9 cognitive mechanisms from published neuroscience: Ebbinghaus decay, reconsolidation, retrieval-induced forgetting, emotion regulation, and more. Each mechanism is independently configurable and grounded in primary literature."
authors: [agentos-team]
tags: [memory, cognitive-science, rag, architecture]
keywords: [ai agent memory, cognitive memory ai, rag alternatives, ebbinghaus decay ai, ai agent long term memory, reconsolidation, retrieval-induced forgetting, coala framework, memgpt]
image: /img/blog/cognitive-memory.png
---

RAG retrieves documents. It does not remember.

A RAG system stores chunks in a vector database and fetches the most similar ones at query time. That is search, not memory. Human memory is fundamentally different: it decays, drifts emotionally, gets suppressed by competing memories, and consolidates during sleep. None of that happens in a vector DB.

AgentOS implements 9 cognitive mechanisms from published cognitive science research to give agents something closer to actual memory. The architecture follows the **CoALA framework** ([Sumers et al., arXiv:2309.02427](https://arxiv.org/abs/2309.02427)), which formalizes how language agents should partition memory into working / episodic / semantic / procedural stores with explicit decision modules. This post explains each mechanism, why it matters, and how to use it.

<!-- truncate -->

## The problem with RAG-as-memory

Consider a customer support agent that has been running for three months. With RAG:

- Every interaction is stored with equal weight, regardless of importance
- A complaint from day 1 has the same retrieval probability as one from yesterday
- There is no concept of "forgetting" irrelevant details
- The agent cannot distinguish between what it observed directly and what it inferred

With cognitive memory:

- Unimportant interactions naturally fade (Ebbinghaus decay)
- Critical moments are locked in permanently (flashbulb memory)
- Retrieving one memory suppresses similar competing ones (retrieval-induced forgetting)
- Each memory tracks its source type and confidence level (source monitoring)

Comparable architectures in the published record include [MemGPT](https://arxiv.org/pdf/2310.08560) (Packer et al., 2023; now part of [Letta](https://www.letta.com/blog/memgpt-and-letta)), which models the LLM as a virtual operating system with paged memory; and [Generative Agents](https://arxiv.org/abs/2304.03442) (Park et al., 2023), which adds memory streams with importance scoring and reflection. AgentOS layers explicit cognitive mechanisms on top of those primitives.

## The 9 mechanisms

### 1. Ebbinghaus decay (Ebbinghaus, 1885)

Memories decay over time following a forgetting curve:

```
strength(t) = (importance / 10) × e^(-t/stability)
```

Where `t` is age in days and `stability` starts at 3.0 days. Each retrieval increases stability through spaced repetition (Cepeda et al., 2006):

```
stability' = min(stability × 1.8^n, 180)
```

Frequently-accessed memories persist while unused ones naturally fade: the same mechanism that makes flashcards work. Modern replication of the original 1885 forgetting curve is in [Murre & Dros (2015) PLOS ONE](https://doi.org/10.1371/journal.pone.0120644).

**Reference:** Ebbinghaus, H. (1885). *Über das Gedächtnis.* Duncker & Humblot.

### 2. Reconsolidation (Nader, Schafe & LeDoux, 2000)

Every time a memory is retrieved, its emotional context drifts 5% toward the agent's current mood:

```typescript
trace.valence += 0.05 × (currentMood.valence - trace.valence);
trace.arousal += 0.05 × (currentMood.arousal - trace.arousal);
```

A negative memory recalled during a positive mood gradually becomes less negative. This models the established finding that memory reconsolidation is influenced by the retrieval context: memories are not static records, they are reconstructed each time they are accessed.

**Reference:** Nader, K., Schafe, G. E., & LeDoux, J. E. (2000). Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval. *Nature*, 406(6797), 722-726. [doi:10.1038/35021052](https://doi.org/10.1038/35021052).

### 3. Retrieval-induced forgetting (Anderson, Bjork & Bjork, 1994)

Retrieving memory A actively suppresses competing memories B and C (those with high content overlap). Competitors receive a 0.12 stability penalty:

```typescript
competitor.stability *= (1 - 0.12);
```

This sharpens recall by inhibiting similar alternatives. Without it, an agent with thousands of memories about "customer complaints" would retrieve a random mix. With RIF, the most-retrieved complaint memories dominate while others fade.

**Reference:** Anderson, M. C., Bjork, R. A., & Bjork, E. L. (1994). Remembering can cause forgetting. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 20(5), 1063-1087. [doi:10.1037/0278-7393.20.5.1063](https://doi.org/10.1037/0278-7393.20.5.1063).

### 4. Involuntary recall (Berntsen, 2009)

On 8% of retrieval calls, a random old memory surfaces unprompted, weighted by emotional intensity (`|valence| × arousal`). The memory must be older than 14 days and have strength above 0.15.

Unexpected connections that pure relevance-based retrieval cannot produce. An agent discussing project deadlines might spontaneously recall a similar situation from months ago, adding conversational depth.

**Reference:** Berntsen, D. (2009). *Involuntary Autobiographical Memories: An Introduction to the Unbidden Past.* Cambridge University Press.

### 5. Temporal gist extraction (Reyna & Brainerd, 1995)

Memories older than 60 days with low retrieval counts are compressed to their core assertions. The full content is replaced with a gist; the emotional context and entities are preserved, but verbatim detail is lost.

This models Fuzzy Trace Theory: verbatim traces decay faster than gist traces. An agent remembers "that was a frustrating conversation with Alex about the API" without retaining every word.

**Reference:** Reyna, V. F., & Brainerd, C. J. (1995). Fuzzy-trace theory: An interim synthesis. *Learning and Individual Differences*, 7(1), 1-75.

### 6. Source confidence decay (Johnson, Hashtroudi & Lindsay, 1993)

Each memory's stability is multiplied by a source-type factor during consolidation:

| Source Type | Multiplier | Rationale |
|---|---|---|
| `user_statement` | 1.0 | Directly observed |
| `tool_result` | 1.0 | Externally verified |
| `observation` | 0.95 | Perceived but grounded |
| `agent_inference` | 0.80 | Self-generated |
| `reflection` | 0.75 | Meta-cognitive |

After 10 consolidation cycles, an `agent_inference` retains ~10.7% of its original stability while a `user_statement` retains 100%. This prevents the agent from confusing its own guesses with observed facts.

**Reference:** Johnson, M. K., Hashtroudi, S., & Lindsay, D. S. (1993). Source monitoring. *Psychological Bulletin*, 114(1), 3-28.

### 7. Schema encoding (Bartlett, 1932; Ghosh & Gilboa, 2014)

New memories are compared against existing memory cluster centroids:

- **Schema-congruent** (cosine > 0.75): encoded with 0.85x strength (efficient but less distinctive)
- **Schema-violating** (below threshold): encoded with 1.3x strength (novel = attention-worthy)

Schema-congruent traces also get a 1.1x stability boost during consolidation, modeling the finding that schema-matching information integrates faster (Tse et al., 2007, *Science*).

**References:**
- Bartlett, F. C. (1932). *Remembering.* Cambridge University Press.
- Ghosh, V. E., & Gilboa, A. (2014). What is a memory schema? *Neuropsychologia*, 53, 104-114.

### 8. Metacognitive FOK (Nelson & Narens, 1990; Hart, 1965)

When a query activates memories below the retrieval threshold but above noise level (partial activation zone), the system generates a "feeling of knowing" signal:

```typescript
interface MetacognitiveSignal {
  type: 'tip_of_tongue' | 'low_confidence' | 'high_confidence';
  feelingOfKnowing: number;  // 0-1
  partialInfo?: string;      // entities, approximate time
}
```

This lets the agent say "I have a vague memory about this but cannot fully recall the details," more honest than either hallucinating or saying nothing.

**Reference:** Nelson, T. O., & Narens, L. (1990). Metamemory: A theoretical framework and new findings. *Psychology of Learning and Motivation*, 26, 125-173.

### 9. Emotion regulation (Gross, 2002)

High-arousal memories get dampened during consolidation cycles via cognitive reappraisal. Traces with arousal above the suppression threshold (0.8) have their emotional intensity gradually reduced:

```typescript
if (trace.arousal > 0.8) {
  trace.arousal *= (1 - reappraisalRate); // default 0.15
}
```

Models the well-documented finding that emotional memories lose their acute intensity over time while retaining their factual content. An agent recalling a heated argument from weeks ago remembers what happened without re-experiencing the full emotional intensity.

**Reference:** Gross, J. J. (2002). Emotion regulation: Affective, cognitive, and social consequences. *Psychophysiology*, 39(3), 281-291.

## Observer → Reflector pipeline

Raw conversation does not enter memory directly. A three-stage pipeline decomposes exchanges into typed traces:

1. **Observer.** Buffers conversation tokens until a threshold (30K tokens), then extracts dense observation notes (factual, emotional, commitment, preference, creative, correction) via chain-of-thought reasoning.
2. **Compressor.** Batches 50+ notes into compressed observations.
3. **Reflector.** Consolidates observations into typed long-term traces with personality-biased conflict resolution.

The pipeline produces all 5 memory types automatically:

| Type | What it stores | Example |
|---|---|---|
| `episodic` | Autobiographical events | "Had a tense conversation about deadline changes" |
| `semantic` | Factual knowledge | "User is a TypeScript developer in Portland" |
| `procedural` | Skills and patterns | "User prefers concise answers with code examples" |
| `prospective` | Future intentions | "User needs to submit the report by Friday" |
| `relational` | Trust signals and bonds | "User shared vulnerability about work stress, trust-building moment" |

The `relational` type is the newest addition, capturing trust ledger events, boundary moments, and emotional bond signals. These traces are personality-modulated: agents with high emotionality and agreeableness capture more relational nuance.

The episodic / semantic / procedural / prospective partition matches the standard cognitive psychology taxonomy ([Tulving, 1972](https://psycnet.apa.org/record/1973-08477-000) for episodic-vs-semantic; [Squire & Zola, 1996](https://doi.org/10.1073/pnas.93.24.13515) for declarative-vs-procedural). The CoALA paper formalizes this taxonomy as the recommended decomposition for language agents.

## Durable persistence

Cognitive memory persists across process restarts via SqliteBrain, a write-through persistence layer backed by [sql-storage-adapter](https://github.com/framersai/sql-storage-adapter):

- In-memory vector index is the hot read path (fast similarity search)
- SqliteBrain is the durable backing store (traces, graph edges, prospective items, observer state)
- On restart, traces are rehydrated from SQL, re-embedded into the vector index, and graph nodes/edges reconstructed
- Cross-platform: Node.js (better-sqlite3), browser (IndexedDB/sql.js), mobile (Capacitor), cloud (PostgreSQL)

## Neural reranking for memory retrieval

Memory retrieval supports an optional neural reranking pass using Cohere rerank-v3.5 (primary) or an LLM-as-Judge fallback. After the cognitive scoring pipeline runs (vector similarity + Ebbinghaus strength + recency + emotional congruence + graph activation + importance), the reranker provides a second-pass cross-encoder score:

```
finalScore = 0.7 × cognitiveComposite + 0.3 × neuralRerankerScore
```

The 0.7/0.3 weighting preserves the cognitive signals (decay, mood congruence, graph activation) while letting the neural reranker boost semantically relevant results that bi-encoder embedding similarity alone might rank lower.

## HEXACO modulation

All 9 mechanisms are modulated by the agent's [HEXACO personality traits](https://hexaco.org/hexaco-online):

| Trait | Mechanism Effect |
|---|---|
| Emotionality | Controls reconsolidation drift rate |
| Conscientiousness | Influences retrieval-induced forgetting strength |
| Openness | Affects involuntary recall probability and novelty boost |
| Honesty-Humility | Modulates source confidence skepticism |
| Agreeableness | Shapes emotion regulation strategy |
| Extraversion | Influences FOK threshold (extraverts report higher FOK) |

A high-conscientiousness agent has stronger RIF (sharper recall, more suppression). A high-openness agent has more involuntary recalls (more creative connections). These mappings are grounded in personality psychology research: Lee & Ashton's [HEXACO model](https://hexaco.org/hexaco-inventory) (2004 onward) and the trait-activation literature.

## Using cognitive memory

### Enable in config

```json
{
  "memory": {
    "enabled": true,
    "cognitiveMechanisms": {
      "reconsolidation": { "enabled": true, "driftRate": 0.05 },
      "retrievalInducedForgetting": { "enabled": true },
      "involuntaryRecall": { "enabled": true, "probability": 0.08 },
      "metacognitiveFOK": { "enabled": true },
      "temporalGist": { "enabled": true, "ageThresholdDays": 60 },
      "schemaEncoding": { "enabled": true },
      "sourceConfidenceDecay": { "enabled": true },
      "emotionRegulation": { "enabled": true }
    }
  }
}
```

### Programmatic API

```typescript
import { agent } from '@framers/agentos';

const assistant = agent({
  provider: 'anthropic',
  memory: {
    enabled: true,
    decay: 'ebbinghaus',
    cognitiveMechanisms: {},  // all mechanisms with defaults
  },
  personality: {
    openness: 0.85,
    conscientiousness: 0.9,
  },
});
```

All 9 mechanisms are optional and independently configurable. When `cognitiveMechanisms` is `undefined`, the memory system works without cognitive mechanisms: standard encoding and retrieval with Ebbinghaus decay only.

## Why this matters

RAG gives agents access to information. Cognitive memory gives them the ability to selectively remember, naturally forget, and honestly report when they are unsure. For agents that run for days, weeks, or months, the difference between "retrieves everything equally" and "remembers what matters, forgets what does not" determines whether the agent remains useful or drowns in noise.

The benchmark numbers backing this claim are at [70.2% on LongMemEval-M](2026-04-29-longmemeval-m-70-with-topk5.md) and [85.6% on LongMemEval-S](2026-04-28-reader-router-pareto-win.md), both with full methodology disclosure (bootstrap CIs, per-case run JSONs, MIT-licensed code).

## References

1. Anderson, M. C., Bjork, R. A., & Bjork, E. L. (1994). Remembering can cause forgetting. *JEPLMC*, 20(5), 1063-1087.
2. Bartlett, F. C. (1932). *Remembering.* Cambridge University Press.
3. Berntsen, D. (2009). *Involuntary Autobiographical Memories.* Cambridge University Press.
4. Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks. *Review of Educational Research*, 76(3), 354-380.
5. Ebbinghaus, H. (1885). *Über das Gedächtnis.* Duncker & Humblot.
6. Ghosh, V. E., & Gilboa, A. (2014). What is a memory schema? *Neuropsychologia*, 53, 104-114.
7. Gross, J. J. (2002). Emotion regulation: Affective, cognitive, and social consequences. *Psychophysiology*, 39(3), 281-291.
8. Hart, J. T. (1965). Memory and the feeling-of-knowing experience. *JEPLMC*, 56(3), 208-216.
9. Johnson, M. K., Hashtroudi, S., & Lindsay, D. S. (1993). Source monitoring. *Psychological Bulletin*, 114(1), 3-28.
10. Murre, J. M. J., & Dros, J. (2015). Replication and analysis of Ebbinghaus' forgetting curve. *PLOS ONE* 10(7).
11. Nader, K., Schafe, G. E., & LeDoux, J. E. (2000). Fear memories require protein synthesis. *Nature*, 406, 722-726.
12. Nelson, T. O., & Narens, L. (1990). Metamemory: A theoretical framework. *Psychology of Learning and Motivation*, 26, 125-173.
13. Packer, C., et al. (2023). MemGPT: Towards LLMs as Operating Systems. [arXiv:2310.08560](https://arxiv.org/abs/2310.08560).
14. Park, J. S., et al. (2023). Generative Agents: Interactive Simulacra of Human Behavior. [arXiv:2304.03442](https://arxiv.org/abs/2304.03442).
15. Reyna, V. F., & Brainerd, C. J. (1995). Fuzzy-trace theory. *Learning and Individual Differences*, 7(1), 1-75.
16. Sumers, T. R., et al. (2023). Cognitive Architectures for Language Agents. [arXiv:2309.02427](https://arxiv.org/abs/2309.02427).
17. Tse, D., et al. (2007). Schemas and memory consolidation. *Science*, 316(5821), 76-82.
18. Tulving, E. (1972). Episodic and semantic memory. In *Organization of Memory*.

---

*AgentOS cognitive memory is open-source (Apache 2.0). [GitHub](https://github.com/framersai/agentos) · [Documentation](https://docs.agentos.sh/features/cognitive-memory) · [npm](https://www.npmjs.com/package/@framers/agentos)*
