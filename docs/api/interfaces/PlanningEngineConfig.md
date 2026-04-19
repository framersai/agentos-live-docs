# Interface: PlanningEngineConfig

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/PlanningEngine.ts#L59)

Configuration for the PlanningEngine.

## Properties

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:63](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/PlanningEngine.ts#L63)

Default model ID for planning

***

### defaultOptions?

> `optional` **defaultOptions**: `Partial`\<[`PlanningOptions`](PlanningOptions.md)\>

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:69](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/PlanningEngine.ts#L69)

Default planning options

***

### defaultProviderId?

> `optional` **defaultProviderId**: `string`

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:65](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/PlanningEngine.ts#L65)

Default provider ID

***

### llmProvider

> **llmProvider**: [`AIModelProviderManager`](../classes/AIModelProviderManager.md)

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:61](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/PlanningEngine.ts#L61)

LLM provider manager for generating plans

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [packages/agentos/src/orchestration/planner/PlanningEngine.ts:67](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planner/PlanningEngine.ts#L67)

Logger instance
