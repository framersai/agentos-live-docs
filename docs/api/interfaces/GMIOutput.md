# Interface: GMIOutput

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:337](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L337)

**`Export`**

Represents the complete, non-chunked output of a GMI turn or significant processing step.
This is typically the TReturn type of an AsyncGenerator yielding GMIOutputChunk.

## Interface

GMIOutput

## Properties

### audioOutput?

> `optional` **audioOutput**: [`AudioOutputConfig`](AudioOutputConfig.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:342](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L342)

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:346](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L346)

#### code

> **code**: `string`

#### details?

> `optional` **details**: `any`

#### message

> **message**: `string`

***

### imageOutput?

> `optional` **imageOutput**: [`ImageOutputConfig`](ImageOutputConfig.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:343](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L343)

***

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:338](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L338)

***

### ragSources?

> `optional` **ragSources**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:353](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L353)

Retrieved RAG chunks for the turn, populated when the GMI performed a
RAG retrieval. Threaded into the FINAL_RESPONSE chunk so client code and
the output-guardrail layer (Grounding Guard, Citation Verifier) can
verify generated claims against the same sources the model saw.

***

### reasoningTrace?

> `optional` **reasoningTrace**: [`ReasoningTraceEntry`](ReasoningTraceEntry.md)[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:345](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L345)

***

### responseText?

> `optional` **responseText**: `string` \| `null`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:339](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L339)

***

### toolCalls?

> `optional` **toolCalls**: [`ToolCallRequest`](ToolCallRequest.md)[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:340](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L340)

***

### uiCommands?

> `optional` **uiCommands**: [`UICommand`](UICommand.md)[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:341](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L341)

***

### usage?

> `optional` **usage**: [`CostAggregator`](CostAggregator.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:344](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L344)
