# Function: resolveMechanismsConfig()

> **resolveMechanismsConfig**(`partial`): [`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)

Defined in: [packages/agentos/src/memory/mechanisms/defaults.ts:79](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/defaults.ts#L79)

Deep-merge partial user config with defaults.

Each mechanism's partial fields are spread over the default,
preserving any user overrides while filling in missing values.

## Parameters

### partial

[`CognitiveMechanismsConfig`](../interfaces/CognitiveMechanismsConfig.md)

## Returns

[`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)
