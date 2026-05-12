# Interface: ModelRouteResult

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:92](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L92)

The result of a model routing decision.
It specifies the selected provider, model, and provides reasoning for the choice.

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:105](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L105)

A confidence score (0.0 to 1.0) indicating the router's certainty in this selection.
Higher values mean higher confidence.

***

### estimatedCostTier?

> `optional` **estimatedCostTier**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:107](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L107)

An optional classification of the estimated cost tier for this model (e.g., "low", "medium", "high").

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:109](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L109)

Any additional metadata related to the routing decision (e.g., matched rule ID, performance estimates).

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:96](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L96)

The ID of the selected model on the chosen provider.

***

### modelInfo

> **modelInfo**: `ModelInfo`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:98](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L98)

Detailed information about the selected model.

***

### provider

> **provider**: `IProvider`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:94](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L94)

The selected AI model provider instance.

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:100](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/routing/IModelRouter.ts#L100)

A human-readable explanation of why this model and provider were chosen.
