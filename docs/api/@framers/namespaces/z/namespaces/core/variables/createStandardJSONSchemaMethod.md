# Variable: createStandardJSONSchemaMethod()

> `const` **createStandardJSONSchemaMethod**: \<`T`\>(`schema`, `io`, `processors?`) => (`params?`) => [`BaseSchema`](../namespaces/JSONSchema/type-aliases/BaseSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:113

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)

## Parameters

### schema

`T`

### io

`"input"` | `"output"`

### processors?

`Record`\<`string`, [`Processor`](../type-aliases/Processor.md)\>

## Returns

> (`params?`): [`BaseSchema`](../namespaces/JSONSchema/type-aliases/BaseSchema.md)

### Parameters

#### params?

`StandardJSONSchemaMethodParams`

### Returns

[`BaseSchema`](../namespaces/JSONSchema/type-aliases/BaseSchema.md)
