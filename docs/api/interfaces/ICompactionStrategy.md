# Interface: ICompactionStrategy

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:145](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L145)

## Properties

### name

> `readonly` **name**: [`CompactionStrategy`](../type-aliases/CompactionStrategy.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:146](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L146)

## Methods

### compact()

> **compact**(`input`, `config`): `Promise`\<[`CompactionResult`](CompactionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:147](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L147)

#### Parameters

##### input

[`CompactionInput`](CompactionInput.md)

##### config

[`InfiniteContextConfig`](InfiniteContextConfig.md)

#### Returns

`Promise`\<[`CompactionResult`](CompactionResult.md)\>
