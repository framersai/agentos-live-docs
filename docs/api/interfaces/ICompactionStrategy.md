# Interface: ICompactionStrategy

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:145](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/types.ts#L145)

## Properties

### name

> `readonly` **name**: [`CompactionStrategy`](../type-aliases/CompactionStrategy.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:146](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/types.ts#L146)

## Methods

### compact()

> **compact**(`input`, `config`): `Promise`\<[`CompactionResult`](CompactionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:147](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/types.ts#L147)

#### Parameters

##### input

[`CompactionInput`](CompactionInput.md)

##### config

[`InfiniteContextConfig`](InfiniteContextConfig.md)

#### Returns

`Promise`\<[`CompactionResult`](CompactionResult.md)\>
