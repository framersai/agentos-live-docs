# Function: resolveMechanismsConfig()

> **resolveMechanismsConfig**(`partial`): [`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)

Defined in: [packages/agentos/src/memory/mechanisms/defaults.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/mechanisms/defaults.ts#L79)

Deep-merge partial user config with defaults.

Each mechanism's partial fields are spread over the default,
preserving any user overrides while filling in missing values.

## Parameters

### partial

[`CognitiveMechanismsConfig`](../interfaces/CognitiveMechanismsConfig.md)

## Returns

[`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)
