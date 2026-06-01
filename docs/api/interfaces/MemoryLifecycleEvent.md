# Interface: MemoryLifecycleEvent

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:429](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L429)

Represents an event related to memory lifecycle management that the GMI needs to be aware of or act upon.

## Interface

MemoryLifecycleEvent

## Properties

### category?

> `optional` **category**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:437](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L437)

***

### dataSourceId

> **dataSourceId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:436](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L436)

***

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:430](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L430)

***

### gmiId

> **gmiId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:433](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L433)

***

### itemId

> **itemId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:435](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L435)

***

### itemSummary

> **itemSummary**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:438](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L438)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:442](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L442)

***

### negotiable

> **negotiable**: `boolean`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:441](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L441)

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:434](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L434)

***

### proposedAction

> **proposedAction**: [`LifecycleAction`](../type-aliases/LifecycleAction.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:440](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L440)

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:439](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L439)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:431](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L431)

***

### type

> **type**: `"EVICTION_PROPOSED"` \| `"ARCHIVAL_PROPOSED"` \| `"DELETION_PROPOSED"` \| `"SUMMARY_PROPOSED"` \| `"RETENTION_REVIEW_PROPOSED"` \| `"NOTIFICATION"` \| `"EVALUATION_PROPOSED"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:432](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L432)
