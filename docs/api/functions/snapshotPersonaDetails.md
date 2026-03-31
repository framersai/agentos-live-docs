# Function: snapshotPersonaDetails()

> **snapshotPersonaDetails**(`persona?`): `Partial`\<[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)\> \| `undefined`

Defined in: [packages/agentos/src/orchestration/turn-planner/helpers.ts:25](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/helpers.ts#L25)

Produces a lightweight persona snapshot suitable for metadata streaming.
Falls back to label/name display hints if the persona definition omits them.

## Parameters

### persona?

[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)

## Returns

`Partial`\<[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)\> \| `undefined`
