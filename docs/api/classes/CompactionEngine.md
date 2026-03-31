# Class: CompactionEngine

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionEngine.ts:22](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/CompactionEngine.ts#L22)

## Constructors

### Constructor

> **new CompactionEngine**(`llmInvoker`, `observer?`, `reflector?`): `CompactionEngine`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionEngine.ts:25](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/CompactionEngine.ts#L25)

#### Parameters

##### llmInvoker

(`prompt`) => `Promise`\<`string`\>

##### observer?

[`MemoryObserver`](MemoryObserver.md)

##### reflector?

[`MemoryReflector`](MemoryReflector.md)

#### Returns

`CompactionEngine`

## Methods

### compact()

> **compact**(`input`, `config`): `Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionEngine.ts:42](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/CompactionEngine.ts#L42)

Run compaction using the configured strategy.

#### Parameters

##### input

[`CompactionInput`](../interfaces/CompactionInput.md)

##### config

[`InfiniteContextConfig`](../interfaces/InfiniteContextConfig.md)

#### Returns

`Promise`\<[`CompactionResult`](../interfaces/CompactionResult.md)\>

***

### getAvailableStrategies()

> **getAvailableStrategies**(): [`CompactionStrategy`](../type-aliases/CompactionStrategy.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionEngine.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/CompactionEngine.ts#L59)

List available strategy names.

#### Returns

[`CompactionStrategy`](../type-aliases/CompactionStrategy.md)[]

***

### getStrategy()

> **getStrategy**(`name`): [`ICompactionStrategy`](../interfaces/ICompactionStrategy.md) \| `undefined`

Defined in: [packages/agentos/src/memory/pipeline/context/CompactionEngine.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/pipeline/context/CompactionEngine.ts#L54)

Get a specific strategy instance.

#### Parameters

##### name

[`CompactionStrategy`](../type-aliases/CompactionStrategy.md)

#### Returns

[`ICompactionStrategy`](../interfaces/ICompactionStrategy.md) \| `undefined`
