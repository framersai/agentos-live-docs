# Class: ActionDeduplicator

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:27](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L27)

## Constructors

### Constructor

> **new ActionDeduplicator**(`config?`): `ActionDeduplicator`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L31)

#### Parameters

##### config?

`Partial`\<[`ActionDeduplicatorConfig`](../interfaces/ActionDeduplicatorConfig.md)\>

#### Returns

`ActionDeduplicator`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:92](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L92)

##### Returns

`number`

## Methods

### checkAndRecord()

> **checkAndRecord**(`key`): `object`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:70](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L70)

#### Parameters

##### key

`string`

#### Returns

`object`

##### entry

> **entry**: [`DeduplicatorEntry`](../interfaces/DeduplicatorEntry.md)

##### isDuplicate

> **isDuplicate**: `boolean`

***

### cleanup()

> **cleanup**(): `number`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:76](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L76)

#### Returns

`number`

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:88](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L88)

#### Returns

`void`

***

### isDuplicate()

> **isDuplicate**(`key`): `boolean`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:35](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L35)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### record()

> **record**(`key`): [`DeduplicatorEntry`](../interfaces/DeduplicatorEntry.md)

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:42](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/ActionDeduplicator.ts#L42)

#### Parameters

##### key

`string`

#### Returns

[`DeduplicatorEntry`](../interfaces/DeduplicatorEntry.md)
