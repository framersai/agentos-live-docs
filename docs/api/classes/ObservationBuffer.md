# Class: ObservationBuffer

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L41)

## Constructors

### Constructor

> **new ObservationBuffer**(`config?`): `ObservationBuffer`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L48)

#### Parameters

##### config?

`Partial`\<[`ObservationBufferConfig`](../interfaces/ObservationBufferConfig.md)\>

#### Returns

`ObservationBuffer`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:105](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L105)

Clear the buffer entirely.

#### Returns

`void`

***

### drain()

> **drain**(): [`BufferedMessage`](../interfaces/BufferedMessage.md)[]

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:79](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L79)

Drain messages since last drain for observation processing.
Returns the messages and marks them as consumed.

#### Returns

[`BufferedMessage`](../interfaces/BufferedMessage.md)[]

***

### getMessageCount()

> **getMessageCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:100](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L100)

Total message count.

#### Returns

`number`

***

### getPendingTokens()

> **getPendingTokens**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:95](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L95)

Unprocessed tokens since last drain.

#### Returns

`number`

***

### getTotalTokens()

> **getTotalTokens**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:90](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L90)

Total accumulated tokens.

#### Returns

`number`

***

### push()

> **push**(`role`, `content`): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:58](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L58)

Add a message to the buffer.
Returns true if the buffer has reached activation threshold.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

#### Returns

`boolean`

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:71](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/pipeline/observation/ObservationBuffer.ts#L71)

Whether accumulated tokens since last drain exceed the threshold.

#### Returns

`boolean`
