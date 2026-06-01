# Class: ModelRouter

Defined in: [packages/agentos/src/core/llm/routing/ModelRouter.ts:151](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/ModelRouter.ts#L151)

## Implements

A rule-based implementation of `IModelRouter`. It selects an AI model by evaluating
a configured set of rules in order of priority. This router is designed to be
flexible and extensible through declarative rules and custom condition evaluators.

## Implements

- [`IModelRouter`](../interfaces/IModelRouter.md)

## Constructors

### Constructor

> **new ModelRouter**(): `ModelRouter`

Defined in: [packages/agentos/src/core/llm/routing/ModelRouter.ts:162](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/ModelRouter.ts#L162)

Constructs a ModelRouter instance.
The router must be initialized via `initialize()` before use.

#### Returns

`ModelRouter`

## Properties

### routerId

> `readonly` **routerId**: `"rule_based_router_v1.1"` = `'rule_based_router_v1.1'`

Defined in: [packages/agentos/src/core/llm/routing/ModelRouter.ts:153](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/ModelRouter.ts#L153)

A unique identifier for this specific router implementation.

#### Implementation of

[`IModelRouter`](../interfaces/IModelRouter.md).[`routerId`](../interfaces/IModelRouter.md#routerid)

## Methods

### initialize()

> **initialize**(`config`, `providerManager`, `_promptEngine?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/routing/ModelRouter.ts:179](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/ModelRouter.ts#L179)

**`Async`**

Initializes the model router with its configuration and necessary dependencies,
such as the AIModelProviderManager for accessing information about available models and providers.

#### Parameters

##### config

`ModelRouterConfig`

Router-specific configuration (e.g., rules, model preferences).

##### providerManager

[`AIModelProviderManager`](AIModelProviderManager.md)

An instance of AIModelProviderManager or a similar service
that provides access to available models and providers.

##### \_promptEngine?

`any`

Optional: An instance of PromptEngine, if the router uses LLM-based routing decisions.

#### Returns

`Promise`\<`void`\>

A promise that resolves upon successful initialization.

#### Throws

If initialization fails (e.g., invalid configuration).

#### Implementation of

[`IModelRouter`](../interfaces/IModelRouter.md).[`initialize`](../interfaces/IModelRouter.md#initialize)

***

### selectModel()

> **selectModel**(`params`, `availableModels?`): `Promise`\<[`ModelRouteResult`](../interfaces/ModelRouteResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/llm/routing/ModelRouter.ts:216](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/routing/ModelRouter.ts#L216)

**`Async`**

Selects an AI model and provider based on the provided parameters and the router's internal logic.

#### Parameters

##### params

[`ModelRouteParams`](../interfaces/ModelRouteParams.md)

The parameters and context for the routing decision.

##### availableModels?

`ModelInfo`[]

Optional: A pre-fetched list of available models. If not provided,
the router may need to fetch this list from its `providerManager`.

#### Returns

`Promise`\<[`ModelRouteResult`](../interfaces/ModelRouteResult.md) \| `null`\>

A promise that resolves with the routing decision,
or null if no suitable model/provider could be found that meets the criteria.

#### Throws

If a critical error occurs during the selection process.

#### Implementation of

[`IModelRouter`](../interfaces/IModelRouter.md).[`selectModel`](../interfaces/IModelRouter.md#selectmodel)
