# Class: CognitiveWorkingMemory

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:74](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L74)

Cognitive working memory with Baddeley-inspired slot management.

Also implements IWorkingMemory for backward compatibility —
`get/set/delete/clear/has/size/getAll` delegate to the backing store,
while slot management is layered on top.

## Implements

- `IWorkingMemory`

## Constructors

### Constructor

> **new CognitiveWorkingMemory**(`backing`, `config?`): `CognitiveWorkingMemory`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:83](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L83)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:75](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L75)

A unique identifier for this specific working memory instance.
This ID may be correlated with a GMI instance or a user session.

#### Implementation of

`IWorkingMemory.id`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:114](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L114)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:127](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L127)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:206](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L206)

Apply per-turn activation decay to all slots.
Slots that drop below minActivation become eviction candidates.

#### Returns

`Promise`\<`string`[]\>

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:106](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L106)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:161](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L161)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:235](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L235)

Serialise current slots as a formatted string for prompt injection.

#### Returns

`string`

***

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:102](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L102)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:110](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L110)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:141](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L141)

Maximum slot capacity (personality-modulated).

#### Returns

`number`

***

### getSlot()

> **getSlot**(`slotId`): [`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md) \| `undefined`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:151](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L151)

Get a specific slot by ID.

#### Parameters

##### slotId

`string`

#### Returns

[`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md) \| `undefined`

***

### getSlotCount()

> **getSlotCount**(): `number`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:136](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L136)

Current number of occupied slots.

#### Returns

`number`

***

### getSlots()

> **getSlots**(): [`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md)[]

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:146](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L146)

Get all active slots.

#### Returns

[`WorkingMemorySlot`](../interfaces/WorkingMemorySlot.md)[]

***

### getUtilization()

> **getUtilization**(): `number`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:228](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L228)

Get working memory utilisation (0-1).

#### Returns

`number`

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:123](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L123)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L94)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:195](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L195)

Rehearse a slot (maintenance rehearsal), bumping its activation.

#### Parameters

##### slotId

`string`

#### Returns

`void`

***

### set()

> **set**\<`T`\>(`key`, `value`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L98)

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

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:119](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/working/CognitiveWorkingMemory.ts#L119)

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
