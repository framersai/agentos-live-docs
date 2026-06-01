# Interface: IModelRouter

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:117](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L117)

Interface for the Model Router.
Implementations are responsible for selecting an appropriate AI model and provider
based on the given parameters and context.

## Properties

### routerId

> `readonly` **routerId**: `string`

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L119)

A unique identifier for this specific router implementation.

## Methods

### initialize()

> **initialize**(`config`, `providerManager`, `promptEngine?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L133)

**`Async`**

Initializes the model router with its configuration and necessary dependencies,
such as the AIModelProviderManager for accessing information about available models and providers.

#### Parameters

##### config

`Record`\<`string`, `any`\>

Router-specific configuration (e.g., rules, model preferences).

##### providerManager

`any`

An instance of AIModelProviderManager or a similar service
that provides access to available models and providers.

##### promptEngine?

`any`

Optional: An instance of PromptEngine, if the router uses LLM-based routing decisions.

#### Returns

`Promise`\<`void`\>

A promise that resolves upon successful initialization.

#### Throws

If initialization fails (e.g., invalid configuration).

***

### selectModel()

> **selectModel**(`params`, `availableModels?`): `Promise`\<[`ModelRouteResult`](ModelRouteResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/llm/routing/IModelRouter.ts:150](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/IModelRouter.ts#L150)

**`Async`**

Selects an AI model and provider based on the provided parameters and the router's internal logic.

#### Parameters

##### params

[`ModelRouteParams`](ModelRouteParams.md)

The parameters and context for the routing decision.

##### availableModels?

`ModelInfo`[]

Optional: A pre-fetched list of available models. If not provided,
the router may need to fetch this list from its `providerManager`.

#### Returns

`Promise`\<[`ModelRouteResult`](ModelRouteResult.md) \| `null`\>

A promise that resolves with the routing decision,
or null if no suitable model/provider could be found that meets the criteria.

#### Throws

If a critical error occurs during the selection process.
