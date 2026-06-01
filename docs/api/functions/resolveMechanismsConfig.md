# Function: resolveMechanismsConfig()

> **resolveMechanismsConfig**(`partial`): [`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)

Defined in: [packages/agentos/src/cognition/memory/mechanisms/defaults.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/mechanisms/defaults.ts#L102)

Deep-merge partial user config with defaults.

Each mechanism's partial fields are spread over the default,
preserving any user overrides while filling in missing values.

## Parameters

### partial

[`CognitiveMechanismsConfig`](../interfaces/CognitiveMechanismsConfig.md)

## Returns

[`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)
