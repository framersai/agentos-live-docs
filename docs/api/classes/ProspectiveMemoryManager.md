# Class: ProspectiveMemoryManager

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L60)

## Constructors

### Constructor

> **new ProspectiveMemoryManager**(`embeddingManager?`): `ProspectiveMemoryManager`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L64)

#### Parameters

##### embeddingManager?

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

#### Returns

`ProspectiveMemoryManager`

## Methods

### check()

> **check**(`context`): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:98](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L98)

Check all prospective memories against the current context.
Returns items that should fire this turn.

#### Parameters

##### context

###### events?

`string`[]

###### now?

`number`

###### queryEmbedding?

`number`[]

###### queryText?

`string`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]\>

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:172](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L172)

Clear all items.

#### Returns

`void`

***

### getActive()

> **getActive**(): [`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:156](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L156)

Get all active (non-triggered or recurring) items.

#### Returns

[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)[]

***

### getCount()

> **getCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:165](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L165)

Get total item count.

#### Returns

`number`

***

### register()

> **register**(`input`): `Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)\>

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L71)

Register a new prospective memory item.

#### Parameters

##### input

`Omit`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md), `"id"` \| `"createdAt"` \| `"triggered"` \| `"cueEmbedding"`\> & `object`

#### Returns

`Promise`\<[`ProspectiveMemoryItem`](../interfaces/ProspectiveMemoryItem.md)\>

***

### remove()

> **remove**(`id`): `boolean`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:149](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L149)

Remove a prospective memory item.

#### Parameters

##### id

`string`

#### Returns

`boolean`
