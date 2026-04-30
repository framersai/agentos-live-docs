# Class: MemoryReflector

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L173)

## Constructors

### Constructor

> **new MemoryReflector**(`traits`, `config?`): `MemoryReflector`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:179](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L179)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:196](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L196)

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

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:257](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L257)

Clear all pending notes.

#### Returns

`void`

***

### getPendingNoteCount()

> **getPendingNoteCount**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:252](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L252)

Get pending note count.

#### Returns

`number`

***

### reflect()

> **reflect**(`existingMemoryContext?`): `Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:217](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L217)

Force reflection over all pending notes.

#### Parameters

##### existingMemoryContext?

`string`

#### Returns

`Promise`\<[`MemoryReflectionResult`](../interfaces/MemoryReflectionResult.md)\>

***

### shouldActivate()

> **shouldActivate**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryReflector.ts:206](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/MemoryReflector.ts#L206)

Whether accumulated notes exceed the reflection threshold.

#### Returns

`boolean`
