# Function: hexacoToTraits()

> **hexacoToTraits**(`hexaco`, `model`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/traits/normalize-leader.ts:121](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/normalize-leader.ts#L121)

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
