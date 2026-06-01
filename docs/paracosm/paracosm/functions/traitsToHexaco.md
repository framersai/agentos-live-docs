# Function: traitsToHexaco()

> **traitsToHexaco**(`traits`): [`HexacoProfile`](../core/interfaces/HexacoProfile.md)

Defined in: [apps/paracosm/src/engine/traits/normalize-leader.ts:147](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/normalize-leader.ts#L147)

Inverse of `hexacoToTraits`: when an artifact carries a
non-HEXACO `traitProfile` but a consumer wants a HexacoProfile-
shaped snapshot for legacy display, project the traits down to the
HEXACO axes that exist on this model. Missing axes default to 0.5.

Used for back-compat dashboard sparkline rendering: the legacy
sparkline reads HEXACO axes; until the dashboard generalizes
(Phase 6), the resolver projects ai-agent profiles into HEXACO-
shaped neutral profiles for display.

## Parameters

### traits

`Record`\<`string`, `number`\>

## Returns

[`HexacoProfile`](../core/interfaces/HexacoProfile.md)
