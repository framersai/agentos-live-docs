# Interface: GMIBaseConfig

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:162](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L162)

Base configuration required to initialize a GMI instance.

## Interface

GMIBaseConfig

## Properties

### cognitiveMemory?

> `optional` **cognitiveMemory**: [`ICognitiveMemoryManager`](ICognitiveMemoryManager.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:170](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L170)

Cognitive memory system (personality-affected encoding/retrieval with Ebbinghaus decay).

***

### customSettings?

> `optional` **customSettings**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:178](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L178)

***

### defaultLlmModelId?

> `optional` **defaultLlmModelId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:172](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L172)

***

### defaultLlmProviderId?

> `optional` **defaultLlmProviderId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L171)

***

### llmProviderManager

> **llmProviderManager**: [`AIModelProviderManager`](../classes/AIModelProviderManager.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:165](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L165)

***

### maxToolLoopIterations?

> `optional` **maxToolLoopIterations**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:177](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L177)

Maximum number of tool-loop iterations before the safety break engages.
Prevents runaway tool loops in `processTurnStream()`. Defaults to `5`.

***

### promptEngine

> **promptEngine**: [`IPromptEngine`](IPromptEngine.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:164](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L164)

***

### retrievalAugmentor?

> `optional` **retrievalAugmentor**: [`IRetrievalAugmentor`](IRetrievalAugmentor.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:168](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L168)

***

### toolOrchestrator

> **toolOrchestrator**: `IToolOrchestrator`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:167](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L167)

***

### utilityAI

> **utilityAI**: [`IUtilityAI`](IUtilityAI.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:166](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L166)

***

### workingMemory

> **workingMemory**: `IWorkingMemory`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:163](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L163)
