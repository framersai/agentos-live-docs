# Class: AIModelProviderManager

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L58)

## Description

Manages and provides access to various configured AI model provider instances (`IProvider`).

## Constructors

### Constructor

> **new AIModelProviderManager**(): `AIModelProviderManager`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L65)

#### Returns

`AIModelProviderManager`

## Properties

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:63](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L63)

## Methods

### checkOverallHealth()

> **checkOverallHealth**(): `Promise`\<\{ `isOverallHealthy`: `boolean`; `providerDetails`: `object`[]; \}\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:301](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L301)

#### Returns

`Promise`\<\{ `isOverallHealthy`: `boolean`; `providerDetails`: `object`[]; \}\>

***

### getDefaultProvider()

> **getDefaultProvider**(): `IProvider` \| `undefined`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:210](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L210)

#### Returns

`IProvider` \| `undefined`

***

### getModelInfo()

> **getModelInfo**(`modelId`, `providerId?`): `Promise`\<`ModelInfo` \| `undefined`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:278](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L278)

#### Parameters

##### modelId

`string`

##### providerId?

`string`

#### Returns

`Promise`\<`ModelInfo` \| `undefined`\>

***

### getProvider()

> **getProvider**(`providerId`): `IProvider` \| `undefined`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:204](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L204)

#### Parameters

##### providerId

`string`

#### Returns

`IProvider` \| `undefined`

***

### getProviderForModel()

> **getProviderForModel**(`modelId`): `IProvider` \| `undefined`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:215](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L215)

#### Parameters

##### modelId

`string`

#### Returns

`IProvider` \| `undefined`

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:84](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L84)

#### Parameters

##### config

[`AIModelProviderManagerConfig`](../interfaces/AIModelProviderManagerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listAllAvailableModels()

> **listAllAvailableModels**(): `Promise`\<`ModelInfo`[]\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:239](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L239)

#### Returns

`Promise`\<`ModelInfo`[]\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:333](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/providers/AIModelProviderManager.ts#L333)

#### Returns

`Promise`\<`void`\>
