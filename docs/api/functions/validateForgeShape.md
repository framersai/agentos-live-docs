# Function: validateForgeShape()

> **validateForgeShape**(`req`): `string`[]

Defined in: [packages/agentos/src/cognition/emergent/ForgeShapeValidator.ts:42](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeShapeValidator.ts#L42)

Validate a forge request's shape against the rules that dominate
cheap-tier failures. Every violation is reported at once (no
short-circuit) so the caller can build one comprehensive error
message to show the LLM.

Rules enforced:
- `inputSchema.properties` must declare at least one field.
- `outputSchema.properties` must declare at least one field.
- `testCases` must have at least 2 entries.
- Every testCase must have a non-empty `input` object.

## Parameters

### req

[`ForgeShapeRequest`](../interfaces/ForgeShapeRequest.md)

Request fragment. Only the three fields are inspected;
  other fields on the forge request are ignored.

## Returns

`string`[]

Array of human-readable error strings. Empty means the
  request's shape is well-formed enough to forward to the judge.
