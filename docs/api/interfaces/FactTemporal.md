# Interface: FactTemporal

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:75](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L75)

Temporal envelope per Hindsight Eq. 1 fields τs, τe, τm. ISO 8601
strings; missing `start` / `end` indicates an instant rather than an
interval. `mention` is always populated — it's the timestamp at
which the fact was authored.

## Properties

### end?

> `optional` **end**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:79](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L79)

Interval end (inclusive). ISO 8601. Optional for instant facts.

***

### mention

> **mention**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:81](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L81)

Mention timestamp — when the fact was first authored. ISO 8601.

***

### start?

> `optional` **start**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L77)

Interval start (inclusive). ISO 8601. Optional for instant facts.
