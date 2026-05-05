# Function: withDefaults()

> **withDefaults**(`partial`, `model`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:272](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L272)

Fill a partial trait map with model defaults so every axis has a
value. Idempotent: existing keys are preserved.

## Parameters

### partial

`Record`\<`string`, `number`\>

### model

[`TraitModel`](../interfaces/TraitModel.md)

## Returns

`Record`\<`string`, `number`\>
