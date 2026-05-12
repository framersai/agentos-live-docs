# Interface: ToJSONSchemaContext

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:72

## Properties

### counter

> **counter**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:83

***

### cycles

> **cycles**: `"throw"` \| `"ref"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:85

***

### external?

> `optional` **external**: `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:87

#### defs

> **defs**: `Record`\<`string`, [`BaseSchema`](../namespaces/JSONSchema/type-aliases/BaseSchema.md)\>

#### registry

> **registry**: [`$ZodRegistry`](../classes/$ZodRegistry.md)\<\{ `id?`: `string`; \}\>

#### uri()?

> `optional` **uri**: (`id`) => `string`

##### Parameters

###### id

`string`

##### Returns

`string`

***

### io

> **io**: `"input"` \| `"output"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:82

***

### metadataRegistry

> **metadataRegistry**: [`$ZodRegistry`](../classes/$ZodRegistry.md)\<`Record`\<`string`, `any`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:74

***

### override()

> **override**: (`ctx`) => `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:77

#### Parameters

##### ctx

###### jsonSchema

[`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

###### path

(`string` \| `number`)[]

###### zodSchema

[`$ZodType`]($ZodType-1.md)

#### Returns

`void`

***

### processors

> **processors**: `Record`\<`string`, [`Processor`](../type-aliases/Processor.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:73

***

### reused

> **reused**: `"ref"` \| `"inline"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:86

***

### seen

> **seen**: `Map`\<[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>, [`Seen`](Seen.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:84

***

### target

> **target**: `"draft-04"` \| `"draft-07"` \| `"draft-2020-12"` \| `"openapi-3.0"` \| `object` & `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:75

***

### unrepresentable

> **unrepresentable**: `"throw"` \| `"any"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:76
