# Class: CognitiveWorkingMemory

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:75](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L75)

Cognitive working memory with Baddeley-inspired slot management.

Implements `IWorkingMemory` for the basic key-value surface
(`get/set/delete/clear/has/size/getAll`), with slot management
(phonological loop, visuospatial sketchpad, episodic buffer)
layered on top.

## Implements

- `IWorkingMemory`

## Constructors

### Constructor

> **new CognitiveWorkingMemory**(`backing`, `config?`): `CognitiveWorkingMemory`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:84](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L84)

#### Parameters

##### backing

`IWorkingMemory`

##### config?

`Partial`\<[`CognitiveWorkingMemoryConfig`](../interfaces/CognitiveWorkingMemoryConfig.md)\>

#### Returns

`CognitiveWorkingMemory`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:76](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L76)

A unique identifier for this specific working memory instance.
This ID may be correlated with a GMI instance or a user session.

#### Implementation of

`IWorkingMemory.id`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L115)

**`Async`**

Clears all data from the working memory, effectively resetting it to an empty state.
This is often used when a session ends or a persona is switched, and session-specific
adaptations should not persist.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the memory has been cleared.

#### Throws

If clearing fails (e.g., storage errors).

#### Example

```ts
await workingMemory.clear(); // Session ended, wipe working memory.
```

#### Implementation of

`IWorkingMemory.clear`

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:128](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L128)

**`Async`**

Closes any open resources associated with this working memory instance,
such as database connections or file handles. This should be called when
the GMI instance is being shut down to ensure graceful resource release.

#### Returns

`Promise`\<`void`\>

A promise that resolves when resources are released.

#### Throws

If closing fails.

#### Implementation of

`IWorkingMemory.close`

***

### decayActivations()

> **decayActivations**(): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:207](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L207)

Apply per-turn activation decay to all slots.
Slots that drop below minActivation become eviction candidates.

#### Returns

`Promise`\<`string`[]\>

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:107](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L107)

**`Async`**

Removes a key-value pair from the working memory.
If the key does not exist, the operation should complete without error.

#### Parameters

##### key

`string`

The key of the value to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the value has been deleted or if the key was not found.

#### Throws

If deletion fails for other reasons (e.g., storage errors).

#### Example

```ts
await workingMemory.delete('temporary_calculation_result');
```

#### Implementation of

`IWorkingMemory.delete`

***

### focus()

> **focus**(`traceId`, `initialActivation?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:162](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L162)

Focus attention on a trace, adding it to working memory.
If at capacity, the lowest-activation slot is evicted first.

#### Parameters

##### traceId

`string`

##### initialActivation?

`number` = `0.8`

#### Returns

`Promise`\<`string`\>

The slot ID assigned to this trace.

***

### formatForPrompt()

> **formatForPrompt**(): `string`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:236](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L236)

Serialise current slots as a formatted string for prompt injection.

#### Returns

`string`

***

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:103](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L103)

**`Async`**

Retrieves a value from the working memory based on its key.

#### Type Parameters

##### T

`T` = `any`

The expected type of the retrieved value.

#### Parameters

##### key

`string`

The key of the value to retrieve.

#### Returns

`Promise`\<`T` \| `undefined`\>

A promise that resolves with the retrieved value,
or `undefined` if the key is not found in the memory.

#### Throws

If retrieval fails for reasons other than the key not being found (e.g., deserialization issues).

#### Example

```ts
const currentMood = await workingMemory.get<string>('current_mood');
if (currentMood) {
console.log(`Current mood is: ${currentMood}`);
}
```

#### Implementation of

`IWorkingMemory.get`

***

### getAll()

> **getAll**(): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L111)

**`Async`**

Retrieves all key-value pairs currently stored in the working memory.
This is useful for snapshotting, debugging, or transferring memory state.

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

A promise that resolves with an object
containing all key-value pairs in the memory.
Returns an empty object if the memory is empty.

#### Throws

If there's an issue retrieving all data.

#### Example

```ts
const allMemoryContents = await workingMemory.getAll();
console.log('Full working memory:', allMemoryContents);
```

#### Implementation of

`IWorkingMemory.getAll`

***

### getCapacity()

> **getCapacity**(): `number`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:142](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L142)

Maximum slot capacity (personality-modulated).

#### Returns

`number`

***

### getSlot()

> **getSlot**(`slotId`): [`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md) \| `undefined`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:152](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L152)

Get a specific slot by ID.

#### Parameters

##### slotId

`string`

#### Returns

[`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md) \| `undefined`

***

### getSlotCount()

> **getSlotCount**(): `number`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:137](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L137)

Current number of occupied slots.

#### Returns

`number`

***

### getSlots()

> **getSlots**(): [`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md)[]

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:147](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L147)

Get all active slots.

#### Returns

[`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md)[]

***

### getUtilization()

> **getUtilization**(): `number`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:229](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L229)

Get working memory utilisation (0-1).

#### Returns

`number`

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:124](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L124)

**`Async`**

Checks if a specific key exists in the working memory.

#### Parameters

##### key

`string`

The key to check for existence.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the key exists, `false` otherwise.

#### Throws

If the check fails for reasons other than key presence.

#### Example

```ts
if (await workingMemory.has('user_id')) {
// User ID is present in working memory
}
```

#### Implementation of

`IWorkingMemory.has`

***

### initialize()

> **initialize**(`gmiInstanceId`, `config?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L95)

**`Async`**

Initializes the working memory instance. This method should be called before
any other operations are performed. It can be used to set up connections,
load initial data, or apply configuration.

#### Parameters

##### gmiInstanceId

`string`

The ID of the GMI instance this working memory is associated with.
This allows the memory to be scoped or namespaced if needed.

##### config?

`Record`\<`string`, `any`\>

Optional memory-specific configuration data.
The structure of this config is implementation-dependent.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.

#### Throws

If initialization fails (e.g., cannot connect to a backing store).

#### Implementation of

`IWorkingMemory.initialize`

***

### rehearse()

> **rehearse**(`slotId`): `void`

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:196](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L196)

Rehearse a slot (maintenance rehearsal), bumping its activation.

#### Parameters

##### slotId

`string`

#### Returns

`void`

***

### set()

> **set**\<`T`\>(`key`, `value`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L99)

**`Async`**

Stores a value in the working memory associated with a specific key.
If the key already exists, its value will be overwritten.
Values can be of any serializable type.

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### key

`string`

The key under which to store the value. Keys should be unique within this memory instance.

##### value

`T`

The value to store. For complex objects, ensure they are serializable if persistence is involved.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the value has been successfully set.

#### Throws

If the value cannot be set (e.g., serialization issues, storage errors).

#### Example

```ts
await workingMemory.set('current_mood', 'empathetic');
await workingMemory.set('user_preferences', { theme: 'dark', notifications: false });
```

#### Implementation of

`IWorkingMemory.set`

***

### size()

> **size**(): `Promise`\<`number`\>

Defined in: [packages/agentos/src/cognition/memory/core/working/CognitiveWorkingMemory.ts:120](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/working/CognitiveWorkingMemory.ts#L120)

**`Async`**

Returns the number of key-value pairs currently stored in the working memory.

#### Returns

`Promise`\<`number`\>

A promise that resolves with the count of items in the memory.

#### Throws

If the size cannot be determined.

#### Example

```ts
const itemCount = await workingMemory.size();
console.log(`Working memory contains ${itemCount} items.`);
```

#### Implementation of

`IWorkingMemory.size`
