# Interface: Fact

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:16](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L16)

A single extracted fact tuple. `object` MUST be a literal span from
the source turn (never paraphrased); this contract is the design
delta from Steps 5/7/8 whose summary-based approaches erased
specific-value tokens.

## Properties

### object

> **object**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:22](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L22)

Literal object span from the source turn — NEVER paraphrased.

***

### predicate

> **predicate**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:20](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L20)

Predicate from the closed schema (see [PREDICATE\_SCHEMA](../variables/PREDICATE_SCHEMA.md)).

***

### sourceSpan

> **sourceSpan**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:28](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L28)

The full sentence the fact came from (for audit, not retrieval).

***

### sourceTraceIds

> **sourceTraceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:26](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L26)

Trace or session IDs this fact was extracted from.

***

### subject

> **subject**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:18](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L18)

Canonical subject ("user" for first-person, lowercase otherwise).

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/types.ts:24](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/types.ts#L24)

ms since epoch.
