# Function: inferSchemaFromTestCases()

> **inferSchemaFromTestCases**(`req`): `void`

Defined in: [packages/agentos/src/emergent/ForgeSchemaInference.ts:55](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/ForgeSchemaInference.ts#L55)

Populate missing inputSchema / outputSchema properties from testCase
data. Mutates `req` in place. Fields are scanned as a union across
every testCase so a single incomplete case does not narrow the
inferred schema.

A schema that already has declared properties is left alone. Only
the missing-properties case is upgraded. `additionalProperties: false`
is added to the synthesized schema so the strict-schema discipline is
preserved for the generated shape.

## Parameters

### req

[`ForgeSchemaInferenceRequest`](../interfaces/ForgeSchemaInferenceRequest.md)

Forge request fragment. Mutated in place.

## Returns

`void`
