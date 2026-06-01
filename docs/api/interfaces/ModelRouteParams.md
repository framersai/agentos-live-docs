# Interface: ModelRouteParams

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:22](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L22)

Parameters provided to the model router to aid in its selection process.
This context allows the router to make informed decisions.

## Properties

### activePersona?

> `optional` **activePersona**: [`IPersonaDefinition`](IPersonaDefinition.md)

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:30](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L30)

The full active persona definition.

***

### contentIntent?

> `optional` **contentIntent**: `"general"` \| `"romantic"` \| `"erotic"` \| `"violent"` \| `"horror"`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:85](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L85)

Finer-grained content intent hint. A mature session doing combat narration
vs. romance has different model preferences.

***

### customContext?

> `optional` **customContext**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L72)

Additional custom parameters or context to aid routing decisions.

***

### excludedModelIds?

> `optional` **excludedModelIds**: `string`[]

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:60](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L60)

A list of model IDs that should be excluded from consideration.

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:38](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L38)

The target language for the model's output (e.g., "en", "es", "ja").

***

### maxCostPerKInputTokens?

> `optional` **maxCostPerKInputTokens**: `number`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:64](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L64)

Maximum acceptable cost per 1000 input tokens (in USD), if cost is a critical factor.

***

### maxCostPerKOutputTokens?

> `optional` **maxCostPerKOutputTokens**: `number`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L68)

Maximum acceptable cost per 1000 output tokens (in USD).

***

### optimizationPreference?

> `optional` **optimizationPreference**: `"balanced"` \| `"cost"` \| `"speed"` \| `"quality"`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:43](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L43)

A preference for optimizing model selection (e.g., for speed, cost, or quality).
This can guide the router if multiple suitable models are found.

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:28](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L28)

The ID of the active persona guiding the interaction.

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:79](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L79)

Content policy tier governing this request. Drives model selection:
safe/standard use default censored models, mature/private-adult route
to uncensored models via PolicyAwareRouter.

***

### preferredModelIds?

> `optional` **preferredModelIds**: `string`[]

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:52](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L52)

A list of preferred model IDs, if any. The router should try to use one of these if suitable.

***

### preferredProviderIds?

> `optional` **preferredProviderIds**: `string`[]

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L56)

A list of preferred provider IDs, if any.

***

### query?

> `optional` **query**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:36](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L36)

The user's query or the primary input text for the task.

***

### requestingAgentId?

> `optional` **requestingAgentId**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:26](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L26)

The ID of the GMI or agent instance making the request.

***

### requiredCapabilities?

> `optional` **requiredCapabilities**: `string`[]

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:48](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L48)

Explicitly required capabilities for the model (e.g., "tool_use", "vision_input", "json_mode").
The router must ensure the selected model supports all listed capabilities.

***

### taskHint

> **taskHint**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:24](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L24)

A hint or classification of the current task (e.g., "code_generation", "summarization", "general_chat").

***

### userApiKeys?

> `optional` **userApiKeys**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:70](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L70)

User-provided API keys for specific providers, which might enable access to certain models.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L32)

The ID of the user initiating the request.

***

### userSubscriptionTier?

> `optional` **userSubscriptionTier**: `ISubscriptionTier`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L34)

The subscription tier of the user, which might affect model availability or preference.
