# Interface: IndexSessionInput

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:65](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L65)

Input for [SessionSummaryStore.indexSession](../classes/SessionSummaryStore.md#indexsession).

## Properties

### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:66](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L66)

***

### scopeId

> **scopeId**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L67)

***

### sessionDate?

> `optional` **sessionDate**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L72)

Optional ISO date for the session. Stored for future temporal filtering.

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L68)

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/session/SessionSummaryStore.ts:70](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/session/SessionSummaryStore.ts#L70)

The summary text produced by `SessionSummarizer`. Must be non-empty.
