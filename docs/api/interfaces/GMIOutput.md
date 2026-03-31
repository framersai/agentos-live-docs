# Interface: GMIOutput

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:330](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L330)

**`Export`**

Represents the complete, non-chunked output of a GMI turn or significant processing step.
This is typically the TReturn type of an AsyncGenerator yielding GMIOutputChunk.

## Interface

GMIOutput

## Properties

### audioOutput?

> `optional` **audioOutput**: [`AudioOutputConfig`](AudioOutputConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:335](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L335)

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:339](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L339)

#### code

> **code**: `string`

#### details?

> `optional` **details**: `any`

#### message

> **message**: `string`

***

### imageOutput?

> `optional` **imageOutput**: [`ImageOutputConfig`](ImageOutputConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:336](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L336)

***

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:331](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L331)

***

### reasoningTrace?

> `optional` **reasoningTrace**: [`ReasoningTraceEntry`](ReasoningTraceEntry.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:338](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L338)

***

### responseText?

> `optional` **responseText**: `string` \| `null`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:332](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L332)

***

### toolCalls?

> `optional` **toolCalls**: [`ToolCallRequest`](ToolCallRequest.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:333](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L333)

***

### uiCommands?

> `optional` **uiCommands**: [`UICommand`](UICommand.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:334](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L334)

***

### usage?

> `optional` **usage**: [`CostAggregator`](CostAggregator.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:337](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L337)
