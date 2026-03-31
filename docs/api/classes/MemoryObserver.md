# Class: MemoryObserver

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:106](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L106)

## Constructors

### Constructor

> **new MemoryObserver**(`traits`, `config?`): `MemoryObserver`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:120](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L120)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:276](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L276)

Reset the observer.

#### Returns

`void`

***

### compressIfNeeded()

> **compressIfNeeded**(): `Promise`\<[`CompressedObservation`](../interfaces/CompressedObservation.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:201](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L201)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:166](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L166)

Force extraction of observation notes from buffered messages.

#### Parameters

##### mood?

[`PADState`](../interfaces/PADState.md)

#### Returns

`Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[]\>

***

### getAccumulatedCompressed()

> **getAccumulatedCompressed**(): readonly [`CompressedObservation`](../interfaces/CompressedObservation.md)[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:261](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L261)

Get the accumulated compressed observations (read-only snapshot).

#### Returns

readonly [`CompressedObservation`](../interfaces/CompressedObservation.md)[]

***

### getAccumulatedCompressedCount()

> **getAccumulatedCompressedCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:256](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L256)

Get the count of accumulated compressed observations awaiting reflection.

#### Returns

`number`

***

### getAccumulatedNoteCount()

> **getAccumulatedNoteCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:251](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L251)

Get the count of accumulated raw notes awaiting compression.

#### Returns

`number`

***

### getBuffer()

> **getBuffer**(): [`ObservationBuffer`](ObservationBuffer.md)

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:241](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L241)

Get the underlying buffer for inspection.

#### Returns

[`ObservationBuffer`](ObservationBuffer.md)

***

### observe()

> **observe**(`role`, `content`, `mood?`): `Promise`\<[`ObservationNote`](../interfaces/ObservationNote.md)[] \| `null`\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:150](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L150)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:223](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L223)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:266](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L266)

Set the compression threshold (number of notes before compression triggers).

#### Parameters

##### threshold

`number`

#### Returns

`void`

***

### setReflectionThresholdTokens()

> **setReflectionThresholdTokens**(`threshold`): `void`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:271](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L271)

Set the reflection token threshold (estimated tokens before reflection triggers).

#### Parameters

##### threshold

`number`

#### Returns

`void`

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:246](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/observation/MemoryObserver.ts#L246)

Check if observation should be triggered.

#### Returns

`boolean`
