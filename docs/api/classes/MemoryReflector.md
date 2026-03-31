# Class: MemoryReflector

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:85](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L85)

## Constructors

### Constructor

> **new MemoryReflector**(`traits`, `config?`): `MemoryReflector`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:91](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L91)

#### Parameters

##### traits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

##### config?

`Partial`\<[`ReflectorConfig`](../interfaces/ReflectorConfig.md)\>

#### Returns

`MemoryReflector`

## Methods

### addNotes()

> **addNotes**(`notes`): `Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md) \| `null`\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L108)

Add observation notes for future reflection.
Returns a MemoryReflectionResult if the note threshold is reached.

#### Parameters

##### notes

[`ObservationNote`](../interfaces/ObservationNote.md)[]

#### Returns

`Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md) \| `null`\>

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:169](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L169)

Clear all pending notes.

#### Returns

`void`

***

### getPendingNoteCount()

> **getPendingNoteCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:164](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L164)

Get pending note count.

#### Returns

`number`

***

### reflect()

> **reflect**(`existingMemoryContext?`): `Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:129](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L129)

Force reflection over all pending notes.

#### Parameters

##### existingMemoryContext?

`string`

#### Returns

`Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:118](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/observation/MemoryReflector.ts#L118)

Whether accumulated notes exceed the reflection threshold.

#### Returns

`boolean`
