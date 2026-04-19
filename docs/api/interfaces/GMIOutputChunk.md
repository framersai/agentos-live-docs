# Interface: GMIOutputChunk

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:270](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L270)

Represents a chunk of output streamed from the GMI during turn processing.

## Interface

GMIOutputChunk

## Properties

### chunkId?

> `optional` **chunkId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:273](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L273)

***

### content

> **content**: `any`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:272](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L272)

***

### errorDetails?

> `optional` **errorDetails**: `any`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:279](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L279)

***

### finishReason?

> `optional` **finishReason**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:277](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L277)

***

### interactionId

> **interactionId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:274](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L274)

***

### isFinal?

> `optional` **isFinal**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:276](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L276)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:280](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L280)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:275](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L275)

***

### type

> **type**: [`GMIOutputChunkType`](../enumerations/GMIOutputChunkType.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:271](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L271)

***

### usage?

> `optional` **usage**: `ModelUsage`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:278](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/cognitive_substrate/IGMI.ts#L278)
