# Topicality Guardrail Extension — Design Specification

**Date:** 2026-03-20
**Status:** Approved
**Author:** Claude (brainstorming session)
**Sub-project:** 3 of 5 (SOTA Guardrails Parity)

## Summary

An embedding-based topicality guardrail extension for AgentOS that enforces allowed/forbidden topic boundaries using semantic similarity and detects gradual conversation drift via per-session exponential moving average tracking. Topics are defined as structured descriptors with name, description, and example phrases — embedded as centroid vectors for broad semantic coverage.

Self-contained AgentOS extension pack. No Wunderland dependency.

## Goals

1. **Embedding-based topic matching** — compare message embeddings against pre-computed topic centroid vectors via cosine similarity, replacing keyword-only matching
2. **Allowed + forbidden topic enforcement** — configurable allowed topics (off-topic → FLAG/BLOCK) and forbidden topics (match → BLOCK)
3. **Session-aware drift detection** — exponential moving average of message embeddings per session, detects gradual off-topic steering over multiple turns
4. **Structured topic descriptors** — each topic has id, name, description, and example phrases for rich embeddings; preset libraries for common use cases
5. **Shared cosine similarity** — extract the duplicated `cosineSimilarity` function into `core/utils/text-utils.ts` (consolidates 6+ copies across the codebase)
6. **Injectable embedding function** — accepts custom `embeddingFn` or resolves `EmbeddingManager` via `ISharedServiceRegistry` for flexibility and testability
7. **Thorough TSDoc/JSDoc comments** and inline comments everywhere

## Non-Goals

- Declarative conversation flow engine / Colang-equivalent (deferred to Sub-project 3b)
- Multi-turn dialog state machines
- Training custom topic models
- Output evaluation (topicality checks user input, not agent response)
- Replacing the existing `SensitiveTopicGuardrail` in Wunderland (it can consume this pack if desired)

---

## Architecture

### 1. Shared Utility: cosineSimilarity

**Location:** `packages/agentos/src/core/utils/text-utils.ts` (MODIFY — add to existing file)

```typescript
/**
 * Compute cosine similarity between two numeric vectors.
 *
 * Returns a value between -1.0 (opposite) and 1.0 (identical).
 * Returns 0 if either vector is zero-length or vectors have different dimensions.
 *
 * Consolidates 6+ duplicate implementations across the codebase:
 * ProspectiveMemoryManager, KnowledgeGraph, InMemoryVectorStore,
 * SqlVectorStore, RetrievalAugmentor, StatisticalUtilityAI.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Cosine similarity score (-1.0 to 1.0)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
```

---

### 2. Core Types

**Location:** `packages/agentos/src/extensions/packs/topicality/types.ts`

````typescript
/**
 * Defines a topic for topicality guardrail evaluation.
 *
 * The embedding strategy uses the centroid (average vector) of
 * embeddings for [description, ...examples], giving broad
 * semantic coverage across different phrasings of the same topic.
 *
 * @example
 * ```typescript
 * const billingTopic: TopicDescriptor = {
 *   id: 'billing',
 *   name: 'Billing & Payments',
 *   description: 'Questions about charges, invoices, payments, refunds, and subscription management',
 *   examples: [
 *     'why was I charged twice?',
 *     'can I get a refund?',
 *     'how do I update my payment method?',
 *     'what does my invoice include?',
 *   ],
 * };
 * ```
 */
export interface TopicDescriptor {
  /** Machine-readable identifier (e.g., 'billing', 'tech-support') */
  id: string;
  /** Human-readable name (e.g., 'Billing & Payments') */
  name: string;
  /** What this topic covers (1-2 sentences) */
  description: string;
  /** 3-5 example messages that fall under this topic */
  examples: string[];
}

/**
 * Result of comparing a message against a topic.
 */
export interface TopicMatch {
  /** Topic descriptor ID */
  topicId: string;
  /** Topic display name */
  topicName: string;
  /**
   * Cosine similarity between message embedding and topic centroid.
   * Clamped to 0.0–1.0 via Math.max(0, cosineSimilarity(a, b))
   * since negative similarity definitionally means "not on topic."
   */
  similarity: number;
}

/**
 * Configuration for session-aware topic drift detection.
 */
export interface DriftConfig {
  /**
   * EMA smoothing factor. Higher = more weight on recent messages.
   * Range: 0.0 (ignore new messages) to 1.0 (only latest message).
   * @default 0.3
   */
  alpha: number;

  /**
   * Cosine similarity threshold below which a message's running
   * average is considered "drifting" from allowed topics.
   * @default 0.3
   */
  driftThreshold: number;

  /**
   * Number of consecutive drifting messages before triggering
   * the drift action (FLAG or BLOCK).
   * @default 3
   */
  driftStreakLimit: number;

  /**
   * Session state timeout in ms. Sessions with no new messages
   * beyond this duration are cleaned up to prevent memory leaks.
   * @default 3600000 (1 hour)
   */
  sessionTimeoutMs: number;

  /**
   * Maximum number of concurrent session states to track.
   * When exceeded, pruneStale() is called lazily on next update.
   * @default 100
   */
  maxSessions: number;
}

/**
 * Result of a drift detection update.
 */
export interface DriftResult {
  /** Whether the conversation is still on-topic */
  onTopic: boolean;
  /** Current similarity between running average and nearest allowed topic */
  currentSimilarity: number;
  /** Nearest allowed topic to the running average */
  nearestTopic: TopicMatch | null;
  /** Consecutive messages below the drift threshold */
  driftStreak: number;
  /** Whether the streak limit was exceeded (triggers action) */
  driftLimitExceeded: boolean;
}

/**
 * Per-session topic tracking state.
 */
export interface TopicState {
  /** Exponential moving average of message embeddings */
  runningEmbedding: number[];
  /** Number of messages that contributed to the average */
  messageCount: number;
  /** Last computed similarity to nearest allowed topic */
  lastTopicScore: number;
  /** Consecutive messages below the drift threshold */
  driftStreak: number;
  /** Timestamp of last update (for stale cleanup) */
  lastSeenAt: number;
}

/**
 * Configuration for the topicality guardrail extension pack.
 */
export interface TopicalityPackOptions {
  /**
   * Topics the agent IS allowed to discuss.
   * Messages are compared against these via embedding similarity.
   * If set, messages not matching any allowed topic above the threshold
   * are flagged or blocked (depending on offTopicAction).
   * If omitted, no allowed-topic filtering is performed.
   */
  allowedTopics?: TopicDescriptor[];

  /**
   * Topics the agent must NOT discuss.
   * Messages matching a forbidden topic above the threshold are
   * flagged or blocked (depending on forbiddenAction).
   */
  forbiddenTopics?: TopicDescriptor[];

  /**
   * Cosine similarity threshold for matching allowed topics.
   * Messages with similarity below this to ALL allowed topics
   * are considered off-topic.
   * @default 0.35
   */
  allowedThreshold?: number;

  /**
   * Cosine similarity threshold for matching forbidden topics.
   * Messages with similarity above this to ANY forbidden topic
   * are considered forbidden.
   * @default 0.65
   */
  forbiddenThreshold?: number;

  /**
   * Action when a message is off-topic (below allowed threshold).
   * @default 'flag'
   */
  offTopicAction?: 'flag' | 'block';

  /**
   * Action when a message matches a forbidden topic.
   * @default 'block'
   */
  forbiddenAction?: 'flag' | 'block';

  /**
   * Enable session-aware topic drift detection.
   * Tracks a running embedding average per session and detects
   * gradual off-topic drift over multiple turns.
   * @default true
   */
  enableDriftDetection?: boolean;

  /** Drift detection configuration overrides */
  drift?: Partial<DriftConfig>;

  /**
   * Custom embedding function. If omitted, resolves EmbeddingManager
   * from ISharedServiceRegistry (requires AIModelProviderManager
   * to be configured in the AgentOS instance).
   *
   * Injecting a custom function makes the pack testable without
   * a real embedding provider.
   *
   * @param texts - Array of strings to embed
   * @returns Array of embedding vectors (one per input text)
   */
  embeddingFn?: (texts: string[]) => Promise<number[][]>;

  /**
   * Guardrail scope.
   * Defaults to 'input' (unlike PII/ML classifiers which default to 'both')
   * because topicality checks USER messages for topic compliance.
   * Agent responses are constrained by the system prompt — if the input
   * is on-topic, the response should be too. Evaluating output would
   * add embedding API latency without meaningful safety benefit.
   * @default 'input'
   */
  guardrailScope?: 'input' | 'output' | 'both';
}

/**
 * Default drift detection configuration.
 */
export const DEFAULT_DRIFT_CONFIG: DriftConfig = {
  alpha: 0.3,
  driftThreshold: 0.3,
  driftStreakLimit: 3,
  sessionTimeoutMs: 3_600_000, // 1 hour
  maxSessions: 100,
};
````

### Preset topic libraries

````typescript
/**
 * Pre-built topic descriptor sets for common use cases.
 * Import and spread into allowedTopics or forbiddenTopics.
 *
 * @example
 * ```typescript
 * createTopicalityPack({
 *   allowedTopics: TOPIC_PRESETS.customerSupport,
 *   forbiddenTopics: TOPIC_PRESETS.commonUnsafe,
 * });
 * ```
 */
export const TOPIC_PRESETS = {
  /** Customer support: billing, tech support, account management, product info, shipping */
  customerSupport: [
    {
      id: 'billing',
      name: 'Billing & Payments',
      description:
        'Questions about charges, invoices, payments, refunds, and subscription management',
      examples: [
        'why was I charged twice?',
        'can I get a refund?',
        'how do I update my payment method?',
        'what does my invoice include?',
      ],
    },
    {
      id: 'tech-support',
      name: 'Technical Support',
      description: 'Help with bugs, errors, configuration, installation, and troubleshooting',
      examples: [
        'the app keeps crashing',
        'I cannot log in',
        'how do I reset my password?',
        'the page is loading slowly',
      ],
    },
    {
      id: 'account',
      name: 'Account Management',
      description: 'Account settings, profile updates, team management, and access control',
      examples: [
        'how do I change my email?',
        'delete my account',
        'add a team member',
        'update my notification preferences',
      ],
    },
    {
      id: 'product-info',
      name: 'Product Information',
      description: 'Questions about features, pricing, plans, capabilities, and limitations',
      examples: [
        'what features are in the pro plan?',
        'do you support SSO?',
        'what are the API rate limits?',
        'compare your plans',
      ],
    },
    {
      id: 'shipping',
      name: 'Shipping & Delivery',
      description: 'Order tracking, delivery estimates, shipping options, and returns',
      examples: [
        'where is my order?',
        'how long does shipping take?',
        'can I return this item?',
        'do you ship internationally?',
      ],
    },
  ] as TopicDescriptor[],

  /** Coding assistant: programming, debugging, architecture, devops */
  codingAssistant: [
    {
      id: 'programming',
      name: 'Programming',
      description: 'Writing code, algorithms, data structures, and language-specific questions',
      examples: [
        'write a function that sorts an array',
        'how do async/await work in TypeScript?',
        'explain the observer pattern',
        'convert this Python to JavaScript',
      ],
    },
    {
      id: 'debugging',
      name: 'Debugging',
      description: 'Finding and fixing bugs, error messages, stack traces, and troubleshooting',
      examples: [
        'why am I getting a null reference error?',
        'this test is failing intermittently',
        'memory leak in my React app',
        'CORS error when calling API',
      ],
    },
    {
      id: 'architecture',
      name: 'Software Architecture',
      description: 'System design, patterns, best practices, database schema, and infrastructure',
      examples: [
        'should I use microservices or monolith?',
        'design a rate limiter',
        'how to structure a Next.js project',
        'when to use Redis vs Postgres',
      ],
    },
    {
      id: 'devops',
      name: 'DevOps & Deployment',
      description: 'CI/CD, Docker, Kubernetes, cloud services, monitoring, and infrastructure',
      examples: [
        'set up GitHub Actions for my project',
        'Dockerfile best practices',
        'how to monitor Node.js in production',
        'configure nginx reverse proxy',
      ],
    },
  ] as TopicDescriptor[],

  /** Common unsafe topics to forbid */
  commonUnsafe: [
    {
      id: 'violence',
      name: 'Violence & Harm',
      description:
        'Instructions, encouragement, or glorification of physical violence or harm to others',
      examples: [
        'how to hurt someone',
        'weapons manufacturing instructions',
        'threats of violence against a person',
      ],
    },
    {
      id: 'illegal-activity',
      name: 'Illegal Activity',
      description:
        'Instructions or assistance with illegal actions, drug manufacturing, or evasion of law enforcement',
      examples: [
        'how to hack into a system illegally',
        'how to manufacture controlled substances',
        'how to evade law enforcement',
      ],
    },
    {
      id: 'self-harm',
      name: 'Self-Harm',
      description: 'Instructions or encouragement for self-harm or suicide',
      examples: ['how to hurt myself', 'methods of self-harm', 'I want to end my life'],
    },
  ] as TopicDescriptor[],
} as const;
````

---

### 3. TopicEmbeddingIndex

**Location:** `packages/agentos/src/extensions/packs/topicality/TopicEmbeddingIndex.ts`

```typescript
/**
 * Pre-computed embedding index for topic descriptors.
 *
 * Built lazily on first evaluation. For each TopicDescriptor:
 * 1. Embed [description, ...examples] as a batch
 * 2. Compute centroid (component-wise average) of all embeddings
 * 3. Store as { descriptor, centroid } for fast cosine comparison
 *
 * On query, the input text is embedded and compared against all
 * topic centroids via cosineSimilarity. Results are sorted by
 * similarity descending.
 *
 * The centroid approach gives better coverage than embedding a
 * single description string — the examples anchor different
 * phrasings and intents within the same topic.
 */
export class TopicEmbeddingIndex {
  /**
   * @param embeddingFn - Function to generate embeddings for text arrays.
   *                      Injected for testability — mock in tests,
   *                      EmbeddingManager.generateEmbeddings in production.
   */
  constructor(
    private readonly embeddingFn: (texts: string[]) => Promise<number[][]>,
  );

  /** Whether the index has been built */
  get isBuilt(): boolean;

  /**
   * Build the index from topic descriptors.
   * Embeds all descriptions and examples in a single batched call,
   * then computes centroids per topic.
   *
   * @param topics - Topic descriptors to index
   */
  async build(topics: TopicDescriptor[]): Promise<void>;

  /**
   * Find topics matching a text, sorted by similarity descending.
   *
   * @param text - Input text to match
   * @returns All topic matches with similarity scores
   */
  async match(text: string): Promise<TopicMatch[]>;

  /**
   * Check if text matches any topic above a threshold.
   *
   * @param text - Input text to check
   * @param threshold - Minimum cosine similarity to count as a match
   * @returns Whether on-topic, nearest match, and all scores
   */
  async isOnTopic(text: string, threshold: number): Promise<{
    onTopic: boolean;
    nearestTopic: TopicMatch | null;
    allScores: TopicMatch[];
  }>;

  /**
   * Match a pre-computed embedding vector against topic centroids.
   * Avoids re-embedding text that was already embedded by the caller.
   *
   * The TopicalityGuardrail embeds each message ONCE, then passes the
   * vector to both matchByVector (for topic checking) and
   * TopicDriftTracker.update (for drift tracking). This halves the
   * embedding API calls compared to embedding separately for each.
   *
   * @param embedding - Pre-computed embedding vector
   * @returns All topic matches sorted by similarity descending
   */
  matchByVector(embedding: number[]): TopicMatch[];

  /**
   * Check if a pre-computed embedding is on-topic.
   * Same as isOnTopic but skips the embedding step.
   */
  isOnTopicByVector(embedding: number[], threshold: number): {
    onTopic: boolean;
    nearestTopic: TopicMatch | null;
    allScores: TopicMatch[];
  };
}
```

---

### 4. TopicDriftTracker

**Location:** `packages/agentos/src/extensions/packs/topicality/TopicDriftTracker.ts`

```typescript
/**
 * Tracks topic drift across conversation sessions using exponential
 * moving average (EMA) of message embeddings.
 *
 * Per-session state:
 * - Running EMA embedding: new = alpha * current + (1 - alpha) * previous
 * - Drift streak counter: consecutive messages below driftThreshold
 * - When streak exceeds driftStreakLimit → drift detected
 *
 * This catches gradual off-topic steering where each individual
 * message might pass single-message topic checks but the conversation
 * trajectory is drifting away from allowed topics.
 *
 * State is keyed by sessionId and cleaned up lazily when the
 * session map exceeds 100 entries (same pattern as SlidingWindowBuffer).
 */
export class TopicDriftTracker {
  constructor(config?: Partial<DriftConfig>);

  /**
   * Update the running embedding for a session and assess drift.
   *
   * @param sessionId - Conversation session identifier
   * @param messageEmbedding - Embedding vector of the current message
   * @param allowedIndex - Pre-built topic index to compare against
   * @returns Drift assessment result
   */
  async update(
    sessionId: string,
    messageEmbedding: number[],
    allowedIndex: TopicEmbeddingIndex
  ): Promise<DriftResult>;

  /** Remove sessions inactive beyond sessionTimeoutMs */
  pruneStale(): void;

  /** Clear all session state */
  clear(): void;
}
```

EMA update formula:

```typescript
// First message: running embedding = message embedding
// Subsequent: running = alpha * message + (1 - alpha) * running
for (let i = 0; i < messageEmbedding.length; i++) {
  state.runningEmbedding[i] = alpha * messageEmbedding[i] + (1 - alpha) * state.runningEmbedding[i];
}

// Note: the running embedding's magnitude shrinks over iterations because
// the average of unit-normalized vectors is not unit-normalized. This is
// fine because cosineSimilarity normalizes by magnitude — only the
// direction matters for the comparison. No re-normalization needed.
```

---

### 5. TopicalityGuardrail

**Location:** `packages/agentos/src/extensions/packs/topicality/TopicalityGuardrail.ts`

```typescript
/**
 * IGuardrailService implementation for topic enforcement.
 *
 * Evaluation flow for each input message:
 *
 * 1. Embed the message text
 * 2. Check forbidden topics: if any forbidden topic similarity > forbiddenThreshold → BLOCK/FLAG
 * 3. Check allowed topics: if no allowed topic similarity > allowedThreshold → BLOCK/FLAG
 * 4. Update drift tracker: if drift streak exceeded → BLOCK/FLAG
 *
 * Steps 2-3 are stateless (per-message). Step 4 is stateful (per-session).
 * A message can pass 2-3 individually but fail 4 if the conversation
 * has been gradually drifting off-topic.
 *
 * The guardrail defaults to input-only scope since topicality
 * checks user messages, not agent responses.
 *
 * Does NOT set canSanitize — runs in Phase 2 (parallel) of the
 * ParallelGuardrailDispatcher alongside ML classifiers.
 */
export class TopicalityGuardrail implements IGuardrailService {
  readonly config: GuardrailConfig;

  /**
   * @param services - ISharedServiceRegistry for consistency with PII/ML classifier packs.
   *                   Currently used to resolve EmbeddingManager if embeddingFn not provided.
   * @param options - Pack configuration (topics, thresholds, drift config)
   * @param embeddingFn - Optional custom embedding function. If omitted, resolved from services.
   */
  constructor(
    services: ISharedServiceRegistry,
    options: TopicalityPackOptions,
    embeddingFn?: (texts: string[]) => Promise<number[][]>
  );

  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null>;

  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null>;
}
```

GuardrailEvaluationResult metadata includes:

```typescript
// Reason codes (machine-readable, for analytics):
reasonCode: 'TOPICALITY_FORBIDDEN' | 'TOPICALITY_OFF_TOPIC' | 'TOPICALITY_DRIFT',

metadata: {
  // For forbidden topic match (reasonCode: 'TOPICALITY_FORBIDDEN'):
  matchedTopic: { topicId, topicName, similarity },

  // For off-topic (reasonCode: 'TOPICALITY_OFF_TOPIC'):
  nearestTopic: { topicId, topicName, similarity },
  threshold: 0.35,

  // For drift (reasonCode: 'TOPICALITY_DRIFT'):
  driftStreak: 5,
  currentSimilarity: 0.22,
  nearestTopic: { topicId, topicName, similarity },
}
```

---

### 6. check_topic Tool

**Location:** `packages/agentos/src/extensions/packs/topicality/tools/CheckTopicTool.ts`

```typescript
/**
 * Agent-callable tool for on-demand topic matching.
 *
 * @example
 * → check_topic({ text: "how do I update my credit card?" })
 * ← {
 *     onTopic: true,
 *     nearestTopic: { topicId: 'billing', topicName: 'Billing & Payments', similarity: 0.82 },
 *     forbiddenMatch: null,
 *     allScores: [...],
 *     driftStatus: null
 *   }
 */
export class CheckTopicTool implements ITool<CheckTopicInput, CheckTopicResult> {
  readonly id = 'check_topic';
  readonly name = 'check_topic';
  readonly displayName = 'Topic Checker';
  readonly description =
    'Check if text matches allowed or forbidden topics using semantic similarity.';
  readonly category = 'security';
  readonly hasSideEffects = false;
  readonly inputSchema = {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Text to check against configured topics' },
    },
    required: ['text'],
  };
}
```

---

### 7. Pack Structure & Factory

**Location:** `packages/agentos/src/extensions/packs/topicality/`

```
topicality/
├── index.ts                    # createTopicalityPack() + createExtensionPack()
├── types.ts                    # TopicDescriptor, TopicalityPackOptions, DriftConfig, presets
├── TopicEmbeddingIndex.ts      # Centroid embedding index
├── TopicDriftTracker.ts        # Per-session EMA drift detection
├── TopicalityGuardrail.ts      # IGuardrailService impl
├── tools/
│   └── CheckTopicTool.ts       # ITool for on-demand topic check
└── topicality.skill.md         # SKILL.md for agent awareness
```

**Factory (explicit structure matching PII/ML classifier packs):**

```typescript
export function createTopicalityPack(options: TopicalityPackOptions): ExtensionPack {
  const opts = options;

  const state = {
    services: new SharedServiceRegistry() as ISharedServiceRegistry,
  };

  let guardrail: TopicalityGuardrail;
  let tool: CheckTopicTool;
  let driftTracker: TopicDriftTracker;

  /**
   * Resolve the embedding function from options or ISharedServiceRegistry.
   * If options.embeddingFn is provided, use it directly (testable).
   * Otherwise, resolve EmbeddingManager from the shared registry and
   * wrap its generateEmbeddings into the expected signature.
   */
  function resolveEmbeddingFn(): (texts: string[]) => Promise<number[][]> {
    if (opts.embeddingFn) return opts.embeddingFn;

    return async (texts: string[]) => {
      const embeddingManager = await state.services.getOrCreate(
        'agentos:topicality:embedding-manager',
        async () => {
          // EmbeddingManager is expected to be pre-registered by AgentOS.
          // If not available, throw to trigger fail-open in the guardrail.
          throw new Error('EmbeddingManager not available in ISharedServiceRegistry');
        }
      );
      return embeddingManager.generateEmbeddings(texts);
    };
  }

  function buildComponents() {
    const embeddingFn = resolveEmbeddingFn();
    driftTracker = new TopicDriftTracker(opts.drift);
    guardrail = new TopicalityGuardrail(state.services, opts, embeddingFn);
    tool = new CheckTopicTool(embeddingFn, opts);
  }

  buildComponents();

  return {
    name: 'topicality',
    version: '1.0.0',
    get descriptors(): ExtensionDescriptor[] {
      return [
        {
          id: 'topicality-guardrail',
          kind: EXTENSION_KIND_GUARDRAIL,
          priority: 3,
          payload: guardrail,
        },
        { id: 'check_topic', kind: EXTENSION_KIND_TOOL, priority: 0, payload: tool },
      ];
    },
    onActivate: (context: ExtensionLifecycleContext) => {
      if (context.services) state.services = context.services;
      // Rebuild with the shared registry (may now have EmbeddingManager)
      // Topic centroids are NOT re-embedded here — they are built lazily
      // on first evaluateInput call, so changing the registry is safe.
      buildComponents();
    },
    onDeactivate: async () => {
      driftTracker?.clear();
    },
  };
}

export function createExtensionPack(context: ExtensionPackContext): ExtensionPack {
  return createTopicalityPack(context.options as TopicalityPackOptions);
}
```

**Descriptors:**

| ID                     | Kind        | Priority | canSanitize | Purpose                     |
| ---------------------- | ----------- | -------- | ----------- | --------------------------- |
| `topicality-guardrail` | `guardrail` | 3        | false       | Automatic topic enforcement |
| `check_topic`          | `tool`      | 0        | —           | On-demand topic matching    |

---

### 8. Memory Impact

| Component                   | Memory                             | When Loaded                   |
| --------------------------- | ---------------------------------- | ----------------------------- |
| Topic centroid embeddings   | ~50KB per topic (1536-dim)         | First evaluation (lazy build) |
| TopicDriftTracker state     | ~12KB per active session           | First message per session     |
| EmbeddingManager            | Shared (already loaded by AgentOS) | —                             |
| **10 topics, 100 sessions** | **~1.7MB**                         | —                             |

---

### 9. Graceful Degradation

| Condition                                 | Behavior                                         |
| ----------------------------------------- | ------------------------------------------------ |
| No embedding provider configured          | Pack logs warning, all messages pass (fail-open) |
| Embedding API call fails                  | That evaluation skipped, message passes          |
| No allowed or forbidden topics configured | Guardrail is a no-op (returns null)              |
| Session map exceeds 100 entries           | `pruneStale()` cleans up lazily                  |
| `embeddingFn` throws                      | Logged, fail-open for that message               |

---

## Testing Strategy

1. **cosineSimilarity unit tests** — identical vectors → 1.0, orthogonal → 0.0, opposite → -1.0, different dimensions → 0
2. **TopicEmbeddingIndex tests** — build from descriptors, match returns sorted scores, isOnTopic threshold filtering, empty topics → no matches
3. **TopicDriftTracker tests** — EMA update, drift streak counting, streak limit triggers driftLimitExceeded, session cleanup, multiple concurrent sessions
4. **TopicalityGuardrail tests** — forbidden topic → BLOCK, off-topic → FLAG, on-topic → null, drift detection, scope filtering, graceful degradation
5. **CheckTopicTool tests** — tool schema, execute returns topic matches
6. **Pack factory tests** — descriptor IDs/kinds, preset loading, createExtensionPack bridge
7. **Integration** — topicality + PII + ML classifiers all running in parallel via dispatcher

---

## SKILL.md

```yaml
---
name: topicality
version: '1.0.0'
description: Enforce allowed and forbidden conversation topics using semantic embedding similarity with session-aware drift detection
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, topics, topicality, off-topic, embeddings, drift-detection]
requires_tools: [check_topic]
metadata:
  agentos:
    emoji: "\U0001F3AF"
---

# Topicality

A guardrail automatically enforces conversation topic boundaries. Messages
matching forbidden topics are blocked. Messages outside allowed topics are
flagged. Gradual off-topic drift across multiple turns is detected.

## When to Use check_topic

- To verify if RAG retrieval results are relevant to allowed topics
- Before presenting user-submitted content to the agent
- In content moderation workflows

## What It Enforces

- **Allowed topics**: messages must be semantically related to at least one allowed topic
- **Forbidden topics**: messages matching a forbidden topic are blocked
- **Drift detection**: gradual off-topic steering across multiple turns is caught

## Constraints

- Requires an embedding provider (OpenAI, etc.) to be configured
- Topic embeddings are computed lazily on first evaluation
- Drift detection tracks per-session state (cleaned up after 1 hour of inactivity)
```

---

## Open Questions (Deferred)

1. Should topic descriptors support **negative examples** (phrases that look similar but should NOT match)? Deferred — centroid approach handles most cases.
2. Should the drift tracker support **topic transitions** (detect when conversation legitimately shifts from topic A to topic B, both allowed)? Deferred — EMA naturally handles this since the running average will still be near an allowed topic.
3. Should there be a **topic analytics dashboard** showing topic distribution, drift frequency, and false positive rates? Deferred to Sub-project 2 (dispatcher observability).

---

## Recommended Implementation Sequence

1. **Shared utility** — add `cosineSimilarity` to `core/utils/text-utils.ts` + tests
2. **Types** — `types.ts` with all interfaces, configs, presets
3. **TopicEmbeddingIndex** — build + match + isOnTopic + tests
4. **TopicDriftTracker** — EMA update + drift detection + tests
5. **TopicalityGuardrail** — IGuardrailService impl + tests
6. **CheckTopicTool** — ITool impl + tests
7. **Pack factory** — `createTopicalityPack()`, barrel exports, package.json exports
8. **SKILL.md + registry + docs**
9. **Verification** — full test suite, push
