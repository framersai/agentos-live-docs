# Class: MemoryReflector

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:184](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L184)

## Constructors

### Constructor

> **new MemoryReflector**(`traits`, `config?`): `MemoryReflector`

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:190](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L190)

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

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:207](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L207)

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

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:268](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L268)

Clear all pending notes.

#### Returns

`void`

***

### getPendingNoteCount()

> **getPendingNoteCount**(): `number`

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:263](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L263)

Get pending note count.

#### Returns

`number`

***

### reflect()

> **reflect**(`existingMemoryContext?`): `Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:228](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L228)

Force reflection over all pending notes.

#### Parameters

##### existingMemoryContext?

`string`

#### Returns

`Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/cognition/memory/pipeline/observation/MemoryReflector.ts:217](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/pipeline/observation/MemoryReflector.ts#L217)

Whether accumulated notes exceed the reflection threshold.

#### Returns

`boolean`
