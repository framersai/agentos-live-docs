# Function: withDefaults()

> **withDefaults**(`partial`, `model`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:272](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L272)

Fill a partial trait map with model defaults so every axis has a
value. Idempotent: existing keys are preserved.

## Parameters

### partial

`Record`\<`string`, `number`\>

### model

`TraitModel`

## Returns

`Record`\<`string`, `number`\>
