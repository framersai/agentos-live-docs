# Interface: GMIOutputChunk

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:277](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L277)

Represents a chunk of output streamed from the GMI during turn processing.

## Interface

GMIOutputChunk

## Properties

### chunkId?

> `optional` **chunkId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:280](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L280)

***

### content

> **content**: `any`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:279](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L279)

***

### errorDetails?

> `optional` **errorDetails**: `any`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:286](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L286)

***

### finishReason?

> `optional` **finishReason**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:284](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L284)

***

### interactionId

> **interactionId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:281](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L281)

***

### isFinal?

> `optional` **isFinal**: `boolean`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:283](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L283)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:287](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L287)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:282](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L282)

***

### type

> **type**: [`GMIOutputChunkType`](../enumerations/GMIOutputChunkType.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:278](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L278)

***

### usage?

> `optional` **usage**: `ModelUsage`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:285](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L285)
