# Class: HybridStrategy

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HybridStrategy.ts:34](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HybridStrategy.ts#L34)

## Implements

- [`ICompactionStrategy`](../interfaces/ICompactionStrategy.md)

## Constructors

### Constructor

> **new HybridStrategy**(`llmInvoker`, `observer?`, `reflector?`): `HybridStrategy`

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HybridStrategy.ts:40](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HybridStrategy.ts#L40)

#### Parameters

##### llmInvoker

(`prompt`) => `Promise`\<`string`\>

##### observer?

[`MemoryObserver`](MemoryObserver.md)

##### reflector?

[`MemoryReflector`](MemoryReflector.md)

#### Returns

`HybridStrategy`

## Properties

### name

> `readonly` **name**: `"hybrid"`

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HybridStrategy.ts:35](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HybridStrategy.ts#L35)

#### Implementation of

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md).[`name`](../interfaces/ICompactionStrategy.md#name)

## Methods

### compact()

> **compact**(`input`, `config`): `Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/strategies/HybridStrategy.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/strategies/HybridStrategy.ts#L50)

#### Parameters

##### input

[`CompactionInput`](../interfaces/CompactionInput.md)

##### config

[`InfiniteContextConfig`](../interfaces/InfiniteContextConfig.md)

#### Returns

`Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

#### Implementation of

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md).[`compact`](../interfaces/ICompactionStrategy.md#compact)
