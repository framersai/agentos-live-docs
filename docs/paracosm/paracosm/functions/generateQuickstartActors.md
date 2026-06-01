# Function: generateQuickstartActors()

> **generateQuickstartActors**(`scenario`, `count`, `opts?`): `Promise`\<[`ActorConfig`](../interfaces/ActorConfig.md)[]\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:724](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L724)

**`Internal`**

Generate `count` archetypal HEXACO actors for `scenario` via a
structured-output LLM call. Exported so the server `/api/quickstart/generate-actors`
route can reuse the exact same prompt + schema.

## Parameters

### scenario

[`ScenarioPackage`](../interfaces/ScenarioPackage.md)

### count

`number`

### opts?

#### model?

`string`

#### provider?

`string`

## Returns

`Promise`\<[`ActorConfig`](../interfaces/ActorConfig.md)[]\>
