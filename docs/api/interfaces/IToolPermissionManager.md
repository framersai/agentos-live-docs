# Interface: IToolPermissionManager

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:111](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L111)

## Interface

IToolPermissionManager

## Description

Defines the contract for a service responsible for managing and enforcing
permissions related to tool execution within the AgentOS ecosystem. Implementations of this
interface will centralize the logic for checking Persona capabilities, user subscription
features, and any other custom authorization rules before a tool is allowed to execute.

## Methods

### checkToolSubscriptionAccess()

> **checkToolSubscriptionAccess**(`userId`, `toolIdOrName`): `Promise`\<\{ `isAllowed`: `boolean`; `missingFeatures?`: [`FeatureFlag`](FeatureFlag.md)[]; `reason?`: `string`; \}\>

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:196](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L196)

**`Async`**

Performs a specific check to determine if a user's subscription plan includes the
necessary features or flags that are configured as prerequisites for using a particular tool.
This relies on the `ISubscriptionService` and the `toolToSubscriptionFeatures` mapping
in the `ToolPermissionManagerConfig`.

#### Parameters

##### userId

`string`

The ID of the user whose subscription is being checked.

##### toolIdOrName

`string`

The unique ID (`ITool.id`) or functional name (`ITool.name`) of the tool.

#### Returns

`Promise`\<\{ `isAllowed`: `boolean`; `missingFeatures?`: [`FeatureFlag`](FeatureFlag.md)[]; `reason?`: `string`; \}\>

An object indicating if access is allowed by subscription. If `isAllowed` is `false`,
`missingFeatures` (if applicable) will list the specific subscription features the user lacks,
and `reason` may provide additional context.

#### Throws

If the `ISubscriptionService` is not configured but this check is invoked
for a tool that has required features (`GMIErrorCode.CONFIGURATION_ERROR` or `EXTERNAL_SERVICE_ERROR`).

***

### getRequiredFeaturesForTool()

> **getRequiredFeaturesForTool**(`toolIdOrName`): [`FeatureFlag`](FeatureFlag.md)[] \| `undefined`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:210](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L210)

Retrieves the list of `FeatureFlag`s that are configured as being required for a specific tool.
This information is sourced from the `toolToSubscriptionFeatures` mapping in the manager's configuration.

#### Parameters

##### toolIdOrName

`string`

The ID or name of the tool.

#### Returns

[`FeatureFlag`](FeatureFlag.md)[] \| `undefined`

An array of `FeatureFlag` objects required for the tool,
or `undefined` if no specific features are mapped as required for this tool.

***

### hasRequiredCapabilities()

> **hasRequiredCapabilities**(`personaCapabilities`, `toolRequiredCapabilities`): `boolean`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:174](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L174)

Performs a specific check to determine if a Persona possesses all the capabilities
explicitly listed as required by a tool.

#### Parameters

##### personaCapabilities

`string`[]

An array of capability strings currently held by the Persona.

##### toolRequiredCapabilities

An array of capability strings defined as required by the tool.
If `undefined` or empty, this check inherently passes (tool requires no specific capabilities).

`string`[] | `undefined`

#### Returns

`boolean`

`true` if the Persona possesses all capabilities required by the tool, `false` otherwise.

***

### initialize()

> **initialize**(`config`, `authService?`, `subscriptionService?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:128](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L128)

**`Async`**

Initializes the ToolPermissionManager with its specific configuration and any
necessary service dependencies (like authentication or subscription services).
This method must be called successfully before the manager can process permission checks.

#### Parameters

##### config

[`ToolPermissionManagerConfig`](ToolPermissionManagerConfig.md)

The configuration object for the permission manager,
defining its operational parameters and rules.

##### authService?

`IAuthService`

Optional. An instance of the authentication service. This might be used
for more complex permission rules based on user roles, identity verification status, or other authentication attributes.

##### subscriptionService?

`ISubscriptionService`

Optional. An instance of the subscription service. This is
crucial if tool access is tied to user subscription tiers or specific feature flags defined in `ToolPermissionManagerConfig`.

#### Returns

`Promise`\<`void`\>

A promise that resolves upon successful initialization of the manager.

#### Throws

If initialization fails due to invalid configuration or issues with dependencies.

***

### isExecutionAllowed()

> **isExecutionAllowed**(`context`): `Promise`\<[`PermissionCheckResult`](PermissionCheckResult.md)\>

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:162](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L162)

**`Async`**

Checks if the execution of a given tool is permitted based on the comprehensive context provided.
This is the primary method for authorizing tool calls. It should consolidate all relevant checks, including:
- Persona capabilities against `tool.requiredCapabilities`.
- User subscription features against `config.toolToSubscriptionFeatures`.
- Any other custom rules or policies defined within the implementation.

#### Parameters

##### context

[`PermissionCheckContext`](PermissionCheckContext.md)

The context object containing all necessary information
for the permission decision (the tool instance, persona details, user context, etc.).

#### Returns

`Promise`\<[`PermissionCheckResult`](PermissionCheckResult.md)\>

A promise that resolves with a `PermissionCheckResult` object,
which includes a boolean `isAllowed` flag and an optional `reason` and `details` for the decision.

#### Example

```ts
const permissionContext = {
tool: myCalculatorTool,
personaId: "calculator-persona",
personaCapabilities: ["execute_basic_math"],
userContext: { userId: "user-test-123" }
};
const result = await permissionManager.isExecutionAllowed(permissionContext);
if (result.isAllowed) {
console.log("Calculator tool execution permitted.");
} else {
console.warn(`Calculator tool execution denied: ${result.reason}`, result.details);
}
```
