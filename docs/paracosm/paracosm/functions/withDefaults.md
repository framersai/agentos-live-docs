# Function: withDefaults()

> **withDefaults**(`partial`, `model`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/traits/index.ts:272](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L272)

Fill a partial trait map with model defaults so every axis has a
value. Idempotent: existing keys are preserved.

## Parameters

### partial

`Record`\<`string`, `number`\>

### model

`TraitModel`

## Returns

`Record`\<`string`, `number`\>
