# Class: MemoryObserver

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:101](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L101)

## Constructors

### Constructor

> **new MemoryObserver**(`traits`, `config?`): `MemoryObserver`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:115](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L115)

#### Parameters

##### traits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

##### config?

`Partial`\<[`ObserverConfig`](../interfaces/ObserverConfig.md)\>

#### Returns

`MemoryObserver`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:271](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L271)

Reset the observer.

#### Returns

`void`

***

### compressIfNeeded()

> **compressIfNeeded**(): `Promise`\<[`CompressedObservation`](../interfaces/CompressedObservation.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:196](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L196)

Run compression if accumulated notes exceed the compression threshold.

When the number of accumulated raw notes exceeds the configured threshold
(default: 50), the ObservationCompressor is invoked to produce denser
compressed observations. The raw notes are then cleared.

#### Returns

`Promise`\<[`CompressedObservation`](../interfaces/CompressedObservation.md)[] \| `null`\>

Compressed observations if threshold was met, null otherwise.

***

### extractNotes()

> **extractNotes**(`mood?`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[]\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:161](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L161)

Force extraction of observation notes from buffered messages.

#### Parameters

##### mood?

[`PADState`](../interfaces/PADState.md)

#### Returns

`Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[]\>

***

### getAccumulatedCompressed()

> **getAccumulatedCompressed**(): readonly [`CompressedObservation`](../interfaces/CompressedObservation.md)[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:256](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L256)

Get the accumulated compressed observations (read-only snapshot).

#### Returns

readonly [`CompressedObservation`](../interfaces/CompressedObservation.md)[]

***

### getAccumulatedCompressedCount()

> **getAccumulatedCompressedCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:251](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L251)

Get the count of accumulated compressed observations awaiting reflection.

#### Returns

`number`

***

### getAccumulatedNoteCount()

> **getAccumulatedNoteCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:246](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L246)

Get the count of accumulated raw notes awaiting compression.

#### Returns

`number`

***

### getBuffer()

> **getBuffer**(): [`ObservationBuffer`](ObservationBuffer.md)

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:236](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L236)

Get the underlying buffer for inspection.

#### Returns

[`ObservationBuffer`](ObservationBuffer.md)

***

### observe()

> **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:145](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L145)

Feed a message into the observation buffer.
Returns observation notes if the buffer has reached activation threshold.

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

##### mood?

[`PADState`](../interfaces/PADState.md)

#### Returns

`Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

***

### reflectIfNeeded()

> **reflectIfNeeded**(): `Promise`\<[`Reflection`](../interfaces/Reflection.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:218](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L218)

Run reflection if accumulated compressed observations exceed the token threshold.

When the total estimated tokens of accumulated compressed observations
exceeds the configured threshold (default: 40,000 tokens), the
ObservationReflector is invoked to extract higher-level patterns.

#### Returns

`Promise`\<[`Reflection`](../interfaces/Reflection.md)[] \| `null`\>

Reflections if threshold was met, null otherwise.

***

### setCompressionThreshold()

> **setCompressionThreshold**(`threshold`): `void`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:261](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L261)

Set the compression threshold (number of notes before compression triggers).

#### Parameters

##### threshold

`number`

#### Returns

`void`

***

### setReflectionThresholdTokens()

> **setReflectionThresholdTokens**(`threshold`): `void`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:266](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L266)

Set the reflection token threshold (estimated tokens before reflection triggers).

#### Parameters

##### threshold

`number`

#### Returns

`void`

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:241](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/MemoryObserver.ts#L241)

Check if observation should be triggered.

#### Returns

`boolean`
