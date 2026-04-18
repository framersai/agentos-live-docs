# Interface: IGMI

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:511](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L511)

## Interface

IGMI

## Description

Defines the contract for a Generalized Mind Instance (GMI).

## Properties

### creationTimestamp

> `readonly` **creationTimestamp**: `Date`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:513](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L513)

***

### gmiId

> `readonly` **gmiId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:512](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L512)

## Methods

### \_triggerAndProcessSelfReflection()

> **\_triggerAndProcessSelfReflection**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:552](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L552)

#### Returns

`Promise`\<`void`\>

***

### analyzeAndReportMemoryHealth()

> **analyzeAndReportMemoryHealth**(): `Promise`\<\{ `issues?`: `object`[]; `lifecycleManagerStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `overallStatus`: `"DEGRADED"` \| `"ERROR"` \| `"OPERATIONAL"` \| `"LIMITED"`; `ragSystemStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `workingMemoryStats?`: \{\[`key`: `string`\]: `any`; `itemCount`: `number`; \}; \} \| `undefined`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:554](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L554)

#### Returns

`Promise`\<\{ `issues?`: `object`[]; `lifecycleManagerStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `overallStatus`: `"DEGRADED"` \| `"ERROR"` \| `"OPERATIONAL"` \| `"LIMITED"`; `ragSystemStats?`: \{ `details?`: `any`; `isHealthy`: `boolean`; \}; `workingMemoryStats?`: \{\[`key`: `string`\]: `any`; `itemCount`: `number`; \}; \} \| `undefined`\>

***

### getCognitiveMemoryManager()

> **getCognitiveMemoryManager**(): [`ICognitiveMemoryManager`](ICognitiveMemoryManager.md) \| `undefined`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:551](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L551)

#### Returns

[`ICognitiveMemoryManager`](ICognitiveMemoryManager.md) \| `undefined`

***

### getCurrentPrimaryPersonaId()

> **getCurrentPrimaryPersonaId**(): `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:517](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L517)

#### Returns

`string`

***

### getCurrentState()

> **getCurrentState**(): [`GMIPrimeState`](../enumerations/GMIPrimeState.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:519](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L519)

#### Returns

[`GMIPrimeState`](../enumerations/GMIPrimeState.md)

***

### getGMIId()

> **getGMIId**(): `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:518](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L518)

#### Returns

`string`

***

### getOverallHealth()

> **getOverallHealth**(): `Promise`\<[`GMIHealthReport`](GMIHealthReport.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:555](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L555)

#### Returns

`Promise`\<[`GMIHealthReport`](GMIHealthReport.md)\>

***

### getPersona()

> **getPersona**(): [`IPersonaDefinition`](IPersonaDefinition.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:516](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L516)

#### Returns

[`IPersonaDefinition`](IPersonaDefinition.md)

***

### getReasoningTrace()

> **getReasoningTrace**(): `Readonly`\<[`ReasoningTrace`](ReasoningTrace.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:549](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L549)

#### Returns

`Readonly`\<[`ReasoningTrace`](ReasoningTrace.md)\>

***

### getWorkingMemorySnapshot()

> **getWorkingMemorySnapshot**(): `Promise`\<`Record`\<`string`, `any`\>\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:550](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L550)

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### handleToolResult()

> **handleToolResult**(`toolCallId`, `toolName`, `resultPayload`, `userId`, `userApiKeys?`): `Promise`\<[`GMIOutput`](GMIOutput.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:522](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L522)

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

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:530](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L530)

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

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:536](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L536)

#### Parameters

##### conversationHistory

`ConversationMessage`[]

#### Returns

`void`

***

### hydrateTurnContext()?

> `optional` **hydrateTurnContext**(`context`): `void`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:540](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L540)

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

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:515](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L515)

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

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:553](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L553)

#### Parameters

##### event

[`MemoryLifecycleEvent`](MemoryLifecycleEvent.md)

#### Returns

`Promise`\<[`LifecycleActionResponse`](LifecycleActionResponse.md)\>

***

### processTurnStream()

> **processTurnStream**(`turnInput`): `AsyncGenerator`\<[`GMIOutputChunk`](GMIOutputChunk.md), [`GMIOutput`](GMIOutput.md), `undefined`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:520](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L520)

#### Parameters

##### turnInput

[`GMITurnInput`](GMITurnInput.md)

#### Returns

`AsyncGenerator`\<[`GMIOutputChunk`](GMIOutputChunk.md), [`GMIOutput`](GMIOutput.md), `undefined`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:556](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L556)

#### Returns

`Promise`\<`void`\>
