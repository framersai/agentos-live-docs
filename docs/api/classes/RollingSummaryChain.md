# Class: RollingSummaryChain

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:27](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L27)

## Constructors

### Constructor

> **new RollingSummaryChain**(`maxBudgetTokens?`, `llmInvoker?`): `RollingSummaryChain`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L32)

#### Parameters

##### maxBudgetTokens?

`number` = `2000`

##### llmInvoker?

(`prompt`) => `Promise`\<`string`\>

#### Returns

`RollingSummaryChain`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:133](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L133)

##### Returns

`number`

## Methods

### addNodes()

> **addNodes**(`nodes`): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:43](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L43)

Add new leaf nodes from a compaction.

#### Parameters

##### nodes

[`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:229](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L229)

Reset the chain.

#### Returns

`void`

***

### collapse()

> **collapse**(): `Promise`\<[`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]\>

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:54](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L54)

Collapse the chain if it exceeds the token budget.
Merges the oldest leaf nodes into a higher-level summary.
Returns any newly created parent nodes.

#### Returns

`Promise`\<[`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]\>

***

### formatForPrompt()

> **formatForPrompt**(): `string`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:88](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L88)

Format the chain for inclusion in a prompt.

#### Returns

`string`

***

### getActiveChain()

> **getActiveChain**(): [`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:83](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L83)

Get the active chain — top-level nodes without parents, sorted by turn range.

#### Returns

[`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

***

### getAllNodes()

> **getAllNodes**(): [`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:120](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L120)

Get all nodes (including absorbed children, for audit/UI).

#### Returns

[`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

***

### getCoveredRange()

> **getCoveredRange**(): \[`number`, `number`\] \| `null`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L127)

Get the full turn range covered by the chain.

#### Returns

\[`number`, `number`\] \| `null`

***

### getTotalTokens()

> **getTotalTokens**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/context/RollingSummaryChain.ts:112](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/context/RollingSummaryChain.ts#L112)

Total tokens across all active (non-absorbed) nodes.

#### Returns

`number`
