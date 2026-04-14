# Class: MemoryReflector

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:146](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L146)

## Constructors

### Constructor

> **new MemoryReflector**(`traits`, `config?`): `MemoryReflector`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:152](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L152)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:169](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L169)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:230](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L230)

Clear all pending notes.

#### Returns

`void`

***

### getPendingNoteCount()

> **getPendingNoteCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:225](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L225)

Get pending note count.

#### Returns

`number`

***

### reflect()

> **reflect**(`existingMemoryContext?`): `Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:190](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L190)

Force reflection over all pending notes.

#### Parameters

##### existingMemoryContext?

`string`

#### Returns

`Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:179](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryReflector.ts#L179)

Whether accumulated notes exceed the reflection threshold.

#### Returns

`boolean`
