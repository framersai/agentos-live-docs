# Function: validateForgeShape()

> **validateForgeShape**(`req`): `string`[]

Defined in: [packages/agentos/src/emergent/ForgeShapeValidator.ts:42](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/ForgeShapeValidator.ts#L42)

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
