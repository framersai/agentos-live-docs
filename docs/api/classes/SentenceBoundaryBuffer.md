# Class: SentenceBoundaryBuffer

Defined in: [packages/agentos/src/safety/guardrails/SentenceBoundaryBuffer.ts:5](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/SentenceBoundaryBuffer.ts#L5)

Buffers streaming TEXT_DELTA chunks and flushes at sentence boundaries.
Includes the previous sentence as overlap context for safety evaluation.

## Constructors

### Constructor

> **new SentenceBoundaryBuffer**(): `SentenceBoundaryBuffer`

#### Returns

`SentenceBoundaryBuffer`

## Methods

### flush()

> **flush**(): `string` \| `null`

Defined in: [packages/agentos/src/safety/guardrails/SentenceBoundaryBuffer.ts:24](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/SentenceBoundaryBuffer.ts#L24)

Flush remaining buffer content (call on stream end).

#### Returns

`string` \| `null`

***

### push()

> **push**(`chunk`): `string` \| `null`

Defined in: [packages/agentos/src/safety/guardrails/SentenceBoundaryBuffer.ts:10](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/SentenceBoundaryBuffer.ts#L10)

Push a chunk. Returns evaluation payload if sentence boundary detected, null otherwise.

#### Parameters

##### chunk

`string`

#### Returns

`string` \| `null`

***

### reset()

> **reset**(): `void`

Defined in: [packages/agentos/src/safety/guardrails/SentenceBoundaryBuffer.ts:35](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/SentenceBoundaryBuffer.ts#L35)

Reset all state.

#### Returns

`void`
