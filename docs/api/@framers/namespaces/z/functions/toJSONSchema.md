# Function: toJSONSchema()

## Call Signature

> **toJSONSchema**\<`T`\>(`schema`, `params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-processors.d.cts:44

### Type Parameters

#### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

### Parameters

#### schema

`T`

#### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`T`\>

## Call Signature

> **toJSONSchema**(`registry`, `params?`): `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-processors.d.cts:45

### Parameters

#### registry

[`$ZodRegistry`](../namespaces/core/classes/$ZodRegistry.md)\<\{ `id?`: `string`; \}\>

#### params?

[`RegistryToJSONSchemaParams`](../namespaces/core/interfaces/RegistryToJSONSchemaParams.md)

### Returns

`object`

#### schemas

> **schemas**: `Record`\<`string`, [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<[`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\>\>
