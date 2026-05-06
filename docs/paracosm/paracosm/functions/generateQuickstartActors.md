# Function: generateQuickstartActors()

> **generateQuickstartActors**(`scenario`, `count`, `opts?`): `Promise`\<[`ActorConfig`](../interfaces/ActorConfig.md)[]\>

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:724](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/world-model/index.ts#L724)

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
