# Interface: IGMI

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:525](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L525)

## Interface

IGMI

## Description

Defines the contract for a Generalized Mind Instance (GMI).

## Properties

### creationTimestamp

> `readonly` **creationTimestamp**: `Date`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:527](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L527)

***

### gmiId

> `readonly` **gmiId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:526](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L526)

## Methods

### \_triggerAndProcessSelfReflection()

> **\_triggerAndProcessSelfReflection**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:566](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L566)

#### Returns

`Promise`\<`void`\>

***

### analyzeAndReportMemoryHealth()

> **analyzeAndReportMemoryHealth**(): `Promise`\<\{ `issues?`: `object`[]; `lifecycleManagerStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `overallStatus`: `"DEGRADED"` \| `"ERROR"` \| `"OPERATIONAL"` \| `"LIMITED"`; `ragSystemStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `workingMemoryStats?`: \{\[`key`: `string`\]: `any`; `itemCount`: `number`; \}; \} \| `undefined`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:568](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L568)

#### Returns

`Promise`\<\{ `issues?`: `object`[]; `lifecycleManagerStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `overallStatus`: `"DEGRADED"` \| `"ERROR"` \| `"OPERATIONAL"` \| `"LIMITED"`; `ragSystemStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `workingMemoryStats?`: \{\[`key`: `string`\]: `any`; `itemCount`: `number`; \}; \} \| `undefined`\>

***

### getCognitiveMemoryManager()

> **getCognitiveMemoryManager**(): [`ICognitiveMemoryManager`](ICognitiveMemoryManager.md) \| `undefined`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:565](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L565)

#### Returns

[`ICognitiveMemoryManager`](ICognitiveMemoryManager.md) \| `undefined`

***

### getCurrentPrimaryPersonaId()

> **getCurrentPrimaryPersonaId**(): `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:531](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L531)

#### Returns

`string`

***

### getCurrentState()

> **getCurrentState**(): [`GMIPrimeState`](../enumerations/GMIPrimeState.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:533](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L533)

#### Returns

[`GMIPrimeState`](../enumerations/GMIPrimeState.md)

***

### getGMIId()

> **getGMIId**(): `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:532](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L532)

#### Returns

`string`

***

### getOverallHealth()

> **getOverallHealth**(): `Promise`\<[`GMIHealthReport`](GMIHealthReport.md)\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:569](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L569)

#### Returns

`Promise`\<[`GMIHealthReport`](GMIHealthReport.md)\>

***

### getPersona()

> **getPersona**(): [`IPersonaDefinition`](IPersonaDefinition.md)

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:530](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L530)

#### Returns

[`IPersonaDefinition`](IPersonaDefinition.md)

***

### getReasoningTrace()

> **getReasoningTrace**(): `Readonly`\<[`ReasoningTrace`](ReasoningTrace.md)\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:563](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L563)

#### Returns

`Readonly`\<[`ReasoningTrace`](ReasoningTrace.md)\>

***

### getWorkingMemorySnapshot()

> **getWorkingMemorySnapshot**(): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:564](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L564)

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### handleToolResult()

> **handleToolResult**(`toolCallId`, `toolName`, `resultPayload`, `userId`, `userApiKeys?`): `Promise`\<[`GMIOutput`](GMIOutput.md)\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:536](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L536)

#### Parameters

##### toolCallId

`string`

##### toolName

`string`

##### resultPayload

[`ToolResultPayload`](../type-aliases/ToolResultPayload.md)

##### userId

`string`

##### userApiKeys?

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`GMIOutput`](GMIOutput.md)\>

***

### handleToolResults()?

> `optional` **handleToolResults**(`toolResults`, `userId`, `userApiKeys?`): `Promise`\<[`GMIOutput`](GMIOutput.md)\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:544](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L544)

#### Parameters

##### toolResults

[`ToolCallResult`](ToolCallResult.md)[]

##### userId

`string`

##### userApiKeys?

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`GMIOutput`](GMIOutput.md)\>

***

### hydrateConversationHistory()?

> `optional` **hydrateConversationHistory**(`conversationHistory`): `void`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:550](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L550)

#### Parameters

##### conversationHistory

`ConversationMessage`[]

#### Returns

`void`

***

### hydrateTurnContext()?

> `optional` **hydrateTurnContext**(`context`): `void`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:554](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L554)

#### Parameters

##### context

###### conversationId?

`string`

###### organizationId?

`string`

###### sessionId?

`string`

#### Returns

`void`

***

### initialize()

> **initialize**(`persona`, `config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:529](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L529)

#### Parameters

##### persona

[`IPersonaDefinition`](IPersonaDefinition.md)

##### config

[`GMIBaseConfig`](GMIBaseConfig.md)

#### Returns

`Promise`\<`void`\>

***

### onMemoryLifecycleEvent()

> **onMemoryLifecycleEvent**(`event`): `Promise`\<[`LifecycleActionResponse`](LifecycleActionResponse.md)\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:567](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L567)

#### Parameters

##### event

[`MemoryLifecycleEvent`](MemoryLifecycleEvent.md)

#### Returns

`Promise`\<[`LifecycleActionResponse`](LifecycleActionResponse.md)\>

***

### processTurnStream()

> **processTurnStream**(`turnInput`): `AsyncGenerator`\<[`GMIOutputChunk`](GMIOutputChunk.md), [`GMIOutput`](GMIOutput.md), `undefined`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:534](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L534)

#### Parameters

##### turnInput

[`GMITurnInput`](GMITurnInput.md)

#### Returns

`AsyncGenerator`\<[`GMIOutputChunk`](GMIOutputChunk.md), [`GMIOutput`](GMIOutput.md), `undefined`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:570](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L570)

#### Returns

`Promise`\<`void`\>
