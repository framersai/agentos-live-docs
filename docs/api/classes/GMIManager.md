# Class: GMIManager

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L92)

Manages the lifecycle of Generalized Mind Instances (GMIs).

## Constructors

### Constructor

> **new GMIManager**(`config`, `subscriptionService`, `authService`, `conversationManager`, `promptEngine`, `llmProviderManager`, `utilityAI`, `toolOrchestrator`, `retrievalAugmentor?`, `personaLoader?`): `GMIManager`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:116](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L116)

#### Parameters

##### config

[`GMIManagerConfig`](../interfaces/GMIManagerConfig.md)

##### subscriptionService

`ISubscriptionService` | `undefined`

##### authService

`IAuthService` | `undefined`

##### conversationManager

[`ConversationManager`](ConversationManager.md)

##### promptEngine

[`IPromptEngine`](../interfaces/IPromptEngine.md)

##### llmProviderManager

[`AIModelProviderManager`](AIModelProviderManager.md)

##### utilityAI

[`IUtilityAI`](../interfaces/IUtilityAI.md)

##### toolOrchestrator

`IToolOrchestrator`

##### retrievalAugmentor?

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md)

##### personaLoader?

`IPersonaLoader`

#### Returns

`GMIManager`

## Properties

### activeGMIs

> **activeGMIs**: `Map`\<`string`, [`IGMI`](../interfaces/IGMI.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L98)

***

### gmiSessionMap

> **gmiSessionMap**: `Map`\<`string`, `string`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:99](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L99)

***

### managerId

> `readonly` **managerId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:114](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L114)

## Methods

### cleanupInactiveGMIs()

> **cleanupInactiveGMIs**(`inactivityThresholdMinutes?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:648](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L648)

#### Parameters

##### inactivityThresholdMinutes?

`number`

#### Returns

`Promise`\<`number`\>

***

### clearAgencyPersonaOverlay()

> **clearAgencyPersonaOverlay**(`agencyId`, `roleId`): `void`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:176](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L176)

#### Parameters

##### agencyId

`string`

##### roleId

`string`

#### Returns

`void`

***

### deactivateGMIForSession()

> **deactivateGMIForSession**(`sessionId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:620](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L620)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getAgencyPersonaOverlay()

> **getAgencyPersonaOverlay**(`agencyId`, `roleId`): [`PersonaStateOverlay`](../interfaces/PersonaStateOverlay.md) \| `undefined`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:181](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L181)

#### Parameters

##### agencyId

`string`

##### roleId

`string`

#### Returns

[`PersonaStateOverlay`](../interfaces/PersonaStateOverlay.md) \| `undefined`

***

### getGMIByInstanceId()

> **getGMIByInstanceId**(`gmiInstanceId`): [`IGMI`](../interfaces/IGMI.md) \| `undefined`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:615](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L615)

#### Parameters

##### gmiInstanceId

`string`

#### Returns

[`IGMI`](../interfaces/IGMI.md) \| `undefined`

***

### getOrCreateGMIForSession()

> **getOrCreateGMIForSession**(`userId`, `sessionId`, `requestedPersonaId`, `conversationIdInput?`, `preferredModelId?`, `preferredProviderId?`, `userApiKeys?`, `agencyOptions?`): `Promise`\<\{ `conversationContext`: `ConversationContext`; `gmi`: [`IGMI`](../interfaces/IGMI.md); \}\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:502](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L502)

#### Parameters

##### userId

`string`

##### sessionId

`string`

##### requestedPersonaId

`string`

##### conversationIdInput?

`string`

##### preferredModelId?

`string`

##### preferredProviderId?

`string`

##### userApiKeys?

`Record`\<`string`, `string`\>

##### agencyOptions?

[`GMIAgencyContextOptions`](../interfaces/GMIAgencyContextOptions.md)

#### Returns

`Promise`\<\{ `conversationContext`: `ConversationContext`; `gmi`: [`IGMI`](../interfaces/IGMI.md); \}\>

***

### getPersonaDefinition()

> **getPersonaDefinition**(`personaId`): [`IPersonaDefinition`](../interfaces/IPersonaDefinition.md) \| `undefined`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:388](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L388)

#### Parameters

##### personaId

`string`

#### Returns

[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md) \| `undefined`

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:270](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L270)

#### Returns

`Promise`\<`void`\>

***

### listAvailablePersonas()

> **listAvailablePersonas**(`userId?`): `Promise`\<`Partial`\<[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)\>[]\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:393](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L393)

#### Parameters

##### userId?

`string`

#### Returns

`Promise`\<`Partial`\<[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)\>[]\>

***

### loadAllPersonaDefinitions()

> **loadAllPersonaDefinitions**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:291](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L291)

#### Returns

`Promise`\<`void`\>

***

### processUserFeedback()

> **processUserFeedback**(`userId`, `sessionId`, `personaId`, `feedbackData`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:719](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L719)

#### Parameters

##### userId

`string`

##### sessionId

`string`

##### personaId

`string`

##### feedbackData

`any`

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:700](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/GMIManager.ts#L700)

#### Returns

`Promise`\<`void`\>
