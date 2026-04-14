# Class: RetrievalFeedbackSignal

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:112](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L112)

Detects which injected memory traces were used vs ignored by the LLM,
persists those signals to the `retrieval_feedback` table, and applies a
best-effort trace-strength update in `memory_traces`.

**Lifecycle:**
1. Before generation: retrieve relevant traces and inject them into the prompt.
2. After response delivery (non-blocking): call `detect(injectedTraces, response)`.
3. The signal is recorded immediately and the underlying trace is nudged
   toward reinforcement or decay.
4. The consolidation pipeline can still read `getStats(traceId)` later for
   broader aggregate decisions.

## Constructors

### Constructor

> **new RetrievalFeedbackSignal**(`brain`, `similarityFn?`): `RetrievalFeedbackSignal`

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:120](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L120)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's SQLite brain; used to persist and query feedback rows.

##### similarityFn?

(`a`, `b`) => `Promise`\<`number`\>

Optional semantic similarity function for higher-fidelity detection.
  Receives two strings and returns a promise of a similarity score in [0, 1].
  When provided, the score supplements the keyword heuristic, but the
  current implementation uses the keyword path only (reserved for future use).

#### Returns

`RetrievalFeedbackSignal`

## Methods

### detect()

> **detect**(`injectedTraces`, `response`, `context?`): `Promise`\<[`RetrievalFeedback`](../interfaces/RetrievalFeedback.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:148](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L148)

Detect which of the injected traces were referenced in `response`, persist
the signals to `retrieval_feedback`, update the corresponding
`memory_traces` rows, and return the full feedback array.

**Keyword heuristic:**
- Extract all words > 4 characters from each trace's `content` field,
  lowercased and stripped of non-alphanumeric characters.
- Compute `matchRatio = (words found in response) / (unique keywords)`.
- Signal = `'used'` if matchRatio > 0.30, else `'ignored'`.

When a trace has no qualifying keywords (all words ≤ 4 characters), it is
treated as `'ignored'` — there is nothing to match against.

#### Parameters

##### injectedTraces

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

Memory traces that were injected into the prompt.

##### response

`string`

The LLM's generated response text.

##### context?

`string`

Optional retrieval context, typically the original query.

#### Returns

`Promise`\<[`RetrievalFeedback`](../interfaces/RetrievalFeedback.md)[]\>

Array of `RetrievalFeedback` events, one per injected trace.

***

### getHistory()

> **getHistory**(`traceId`, `limit?`): `Promise`\<[`RetrievalFeedback`](../interfaces/RetrievalFeedback.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:255](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L255)

Retrieve the feedback history for a single trace, ordered by most-recent
first.

#### Parameters

##### traceId

`string`

The memory trace ID to look up.

##### limit?

`number` = `100`

Maximum number of rows to return.  Defaults to 100.

#### Returns

`Promise`\<[`RetrievalFeedback`](../interfaces/RetrievalFeedback.md)[]\>

Array of `RetrievalFeedback` events, most-recent first.

***

### getStats()

> **getStats**(`traceId`): `Promise`\<\{ `ignored`: `number`; `used`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:282](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L282)

Return aggregate counts of `'used'` and `'ignored'` signals for a trace.

Useful for the consolidation pipeline to decide whether to apply
`penalizeUnused` (many ignores) or `updateOnRetrieval` (many used).

#### Parameters

##### traceId

`string`

The memory trace ID to aggregate.

#### Returns

`Promise`\<\{ `ignored`: `number`; `used`: `number`; \}\>

`{ used, ignored }` counts.
