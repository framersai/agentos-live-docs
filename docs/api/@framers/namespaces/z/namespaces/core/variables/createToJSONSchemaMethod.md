# Variable: createToJSONSchemaMethod()

> `const` **createToJSONSchemaMethod**: \<`T`\>(`schema`, `processors?`) => (`params?`) => [`ZodStandardJSONSchemaPayload`](../interfaces/ZodStandardJSONSchemaPayload.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:107

Creates a toJSONSchema method for a schema instance.
This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)

## Parameters

### schema

`T`

### processors?

`Record`\<`string`, [`Processor`](../type-aliases/Processor.md)\>

## Returns

> (`params?`): [`ZodStandardJSONSchemaPayload`](../interfaces/ZodStandardJSONSchemaPayload.md)\<`T`\>

### Parameters

#### params?

[`ToJSONSchemaParams`](../type-aliases/ToJSONSchemaParams.md)

### Returns

[`ZodStandardJSONSchemaPayload`](../interfaces/ZodStandardJSONSchemaPayload.md)\<`T`\>
