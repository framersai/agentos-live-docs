# Interface: ToolPermissionManagerConfig

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:97](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/tools/permissions/IToolPermissionManager.ts#L97)

Configuration options for the `ToolPermissionManager`.
This allows administrators to fine-tune how tool permissions are evaluated and enforced.

## Interface

ToolPermissionManagerConfig

## Example

```ts
// Example: Only users with "AdvancedAnalysisTools" and "PremiumSupport" features can use "financial_data_analyzer_v2"
const config: ToolPermissionManagerConfig = {
strictCapabilityChecking: true,
logToolCalls: true,
toolToSubscriptionFeatures: {
"financial_data_analyzer_v2": [
{ flag: "FEATURE_ADVANCED_ANALYSIS", description: "Access to advanced analysis tools" },
{ flag: "FEATURE_PREMIUM_SUPPORT_TOOLS", description: "Access to tools included with premium support" }
]
}
};
```

## Properties

### logToolCalls?

> `optional` **logToolCalls**: `boolean`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:100](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/tools/permissions/IToolPermissionManager.ts#L100)

If true, detailed information about permission checks for tool calls will be logged. Defaults to false.

***

### strictCapabilityChecking?

> `optional` **strictCapabilityChecking**: `boolean`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:98](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/tools/permissions/IToolPermissionManager.ts#L98)

If `true` (default), the Persona must possess *all*
capabilities listed in the `tool.requiredCapabilities` array. If `false`, this check might be bypassed
or handled with more leniency (though generally not recommended for tools accessing sensitive resources).

***

### toolToSubscriptionFeatures?

> `optional` **toolToSubscriptionFeatures**: `Record`\<`string`, [`FeatureFlag`](FeatureFlag.md)[]\>

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:99](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/tools/permissions/IToolPermissionManager.ts#L99)

Optional. A mapping where keys are
tool IDs (`ITool.id`) or tool names (`ITool.name`), and values are arrays of `FeatureFlag` objects (or their string identifiers).
This allows linking specific tools to subscription features, meaning a user must have the corresponding
features enabled via their subscription tier to use the tool.
