# Class: HierarchicalStrategy

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts:37](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts#L37)

## Implements

- [`ICompactionStrategy`](../interfaces/ICompactionStrategy.md)

## Constructors

### Constructor

> **new HierarchicalStrategy**(`llmInvoker`): `HierarchicalStrategy`

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts#L41)

#### Parameters

##### llmInvoker

(`prompt`) => `Promise`\<`string`\>

#### Returns

`HierarchicalStrategy`

## Properties

### name

> `readonly` **name**: `"hierarchical"`

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts:38](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts#L38)

#### Implementation of

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md).[`name`](../interfaces/ICompactionStrategy.md#name)

## Methods

### compact()

> **compact**(`input`, `config`): `Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HierarchicalStrategy.ts#L45)

#### Parameters

##### input

[`CompactionInput`](../interfaces/CompactionInput.md)

##### config

[`InfiniteContextConfig`](../interfaces/InfiniteContextConfig.md)

#### Returns

`Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

#### Implementation of

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md).[`compact`](../interfaces/ICompactionStrategy.md#compact)
