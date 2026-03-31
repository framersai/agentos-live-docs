# Class: SlidingSummaryStrategy

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts:27](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts#L27)

## Implements

- [`ICompactionStrategy`](../interfaces/ICompactionStrategy.md)

## Constructors

### Constructor

> **new SlidingSummaryStrategy**(`llmInvoker`): `SlidingSummaryStrategy`

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts:31](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts#L31)

#### Parameters

##### llmInvoker

(`prompt`) => `Promise`\<`string`\>

#### Returns

`SlidingSummaryStrategy`

## Properties

### name

> `readonly` **name**: `"sliding"`

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts:28](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts#L28)

#### Implementation of

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md).[`name`](../interfaces/ICompactionStrategy.md#name)

## Methods

### compact()

> **compact**(`input`, `config`): `Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts:35](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/SlidingSummaryStrategy.ts#L35)

#### Parameters

##### input

[`CompactionInput`](../interfaces/CompactionInput.md)

##### config

[`InfiniteContextConfig`](../interfaces/InfiniteContextConfig.md)

#### Returns

`Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

#### Implementation of

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md).[`compact`](../interfaces/ICompactionStrategy.md#compact)
