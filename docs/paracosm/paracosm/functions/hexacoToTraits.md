# Function: hexacoToTraits()

> **hexacoToTraits**(`hexaco`, `model`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/normalize-leader.ts:121](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/normalize-leader.ts#L121)

Translate a HexacoProfile into the trait map the registered hexaco
model expects. Field names match (camelCase axis ids on the model;
camelCase field names on the legacy interface), so this is a
straight copy with `withDefaults` filling any extra axes a future
hexaco-extended model might define.

## Parameters

### hexaco

[`HexacoProfile`](../core/interfaces/HexacoProfile.md)

### model

`TraitModel`

## Returns

`Record`\<`string`, `number`\>
