# Interface: RetrievalFeedback

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L55)

A single retrieval feedback event for one memory trace.

`signal`:
- `'used'`    — the LLM's response contained enough keywords from this trace
                to be considered referenced (matchRatio > 0.30).
- `'ignored'` — the LLM did not appear to use this trace in its response.

`context` carries the query or situational description that was active at
feedback time.  Stored in the `query` column of `retrieval_feedback`.

## Properties

### context?

> `optional` **context**: `string`

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L61)

Optional contextual string (e.g. the original user query).

***

### signal

> **signal**: `"used"` \| `"ignored"`

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:59](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L59)

Whether the trace was referenced by the LLM response.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L63)

Unix ms timestamp when the feedback was recorded.

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/feedback/RetrievalFeedbackSignal.ts#L57)

The ID of the memory trace this feedback relates to.
