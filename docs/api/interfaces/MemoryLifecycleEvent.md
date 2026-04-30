# Interface: MemoryLifecycleEvent

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:415](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L415)

Represents an event related to memory lifecycle management that the GMI needs to be aware of or act upon.

## Interface

MemoryLifecycleEvent

## Properties

### category?

> `optional` **category**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:423](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L423)

***

### dataSourceId

> **dataSourceId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:422](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L422)

***

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:416](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L416)

***

### gmiId

> **gmiId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:419](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L419)

***

### itemId

> **itemId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:421](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L421)

***

### itemSummary

> **itemSummary**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:424](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L424)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:428](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L428)

***

### negotiable

> **negotiable**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:427](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L427)

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:420](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L420)

***

### proposedAction

> **proposedAction**: [`LifecycleAction`](../type-aliases/LifecycleAction.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:426](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L426)

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:425](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L425)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:417](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L417)

***

### type

> **type**: `"EVICTION_PROPOSED"` \| `"ARCHIVAL_PROPOSED"` \| `"DELETION_PROPOSED"` \| `"SUMMARY_PROPOSED"` \| `"RETENTION_REVIEW_PROPOSED"` \| `"NOTIFICATION"` \| `"EVALUATION_PROPOSED"`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:418](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L418)
