# Class: AIModelProviderManager

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:58](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L58)

## Description

Manages and provides access to various configured AI model provider instances (`IProvider`).

## Constructors

### Constructor

> **new AIModelProviderManager**(): `AIModelProviderManager`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L65)

#### Returns

`AIModelProviderManager`

## Properties

### isInitialized

> **isInitialized**: `boolean` = `false`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L63)

## Methods

### checkOverallHealth()

> **checkOverallHealth**(): `Promise`\<\{ `isOverallHealthy`: `boolean`; `providerDetails`: `object`[]; \}\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:322](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L322)

#### Returns

`Promise`\<\{ `isOverallHealthy`: `boolean`; `providerDetails`: `object`[]; \}\>

***

### getDefaultProvider()

> **getDefaultProvider**(): `IProvider` \| `undefined`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:231](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L231)

#### Returns

`IProvider` \| `undefined`

***

### getModelInfo()

> **getModelInfo**(`modelId`, `providerId?`): `Promise`\<`ModelInfo` \| `undefined`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:299](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L299)

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

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:225](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L225)

#### Parameters

##### providerId

`string`

#### Returns

`IProvider` \| `undefined`

***

### getProviderForModel()

> **getProviderForModel**(`modelId`): `IProvider` \| `undefined`

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L236)

#### Parameters

##### modelId

`string`

#### Returns

`IProvider` \| `undefined`

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L99)

#### Parameters

##### config

[`AIModelProviderManagerConfig`](../interfaces/AIModelProviderManagerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### listAllAvailableModels()

> **listAllAvailableModels**(): `Promise`\<`ModelInfo`[]\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:260](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L260)

#### Returns

`Promise`\<`ModelInfo`[]\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/providers/AIModelProviderManager.ts:354](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/providers/AIModelProviderManager.ts#L354)

#### Returns

`Promise`\<`void`\>
