# Interface: PlannerConfig

Defined in: [packages/agentos/src/orchestration/planning/types.ts:110](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L110)

Configuration for the MissionPlanner.

## Properties

### autonomy

> **autonomy**: [`AutonomyMode`](../type-aliases/AutonomyMode.md)

Defined in: [packages/agentos/src/orchestration/planning/types.ts:113](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L113)

***

### branchCount

> **branchCount**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:112](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L112)

Number of Tree of Thought branches to explore.

***

### costCap

> **costCap**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:116](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L116)

***

### executionModel?

> `optional` **executionModel**: `string`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:144](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L144)

Human-readable label for the default execution model (for logging/events).

***

### llmCaller()

> **llmCaller**: (`system`, `user`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/planning/types.ts:128](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L128)

LLM caller used by agent nodes during execution.
Falls back to `plannerLlmCaller` if not provided separately.

#### Parameters

##### system

`string`

##### user

`string`

#### Returns

`Promise`\<`string`\>

***

### maxAgents

> **maxAgents**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:117](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L117)

***

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:120](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L120)

***

### maxExpansions

> **maxExpansions**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:119](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L119)

***

### maxToolForges

> **maxToolForges**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:118](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L118)

***

### plannerLlmCaller()?

> `optional` **plannerLlmCaller**: (`system`, `user`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/planning/types.ts:139](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L139)

LLM caller used specifically for the Tree of Thought planning phases
(decomposition, evaluation, refinement, expansion).

Use a stronger model here (e.g., Opus 4.6) for better plan quality,
while execution agents can use a different model (e.g., GPT-5.4).

Defaults to `llmCaller` if not provided.

#### Parameters

##### system

`string`

##### user

`string`

#### Returns

`Promise`\<`string`\>

***

### plannerModel?

> `optional` **plannerModel**: `string`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:142](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L142)

Human-readable label for the planner model (for logging/events).

***

### providerStrategy

> **providerStrategy**: [`ProviderStrategyConfig`](ProviderStrategyConfig.md)

Defined in: [packages/agentos/src/orchestration/planning/types.ts:114](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L114)

***

### reevalInterval

> **reevalInterval**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:122](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L122)

Re-evaluate graph every N completed nodes.

***

### thresholds

> **thresholds**: [`GuardrailThresholds`](GuardrailThresholds.md)

Defined in: [packages/agentos/src/orchestration/planning/types.ts:115](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planning/types.ts#L115)
