# Interface: Seen

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:56

## Properties

### count

> **count**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:63

Number of times this schema was encountered during traversal

***

### cycle?

> `optional` **cycle**: (`string` \| `number`)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:65

Cycle path

***

### def?

> `optional` **def**: [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:60

A cached version of the schema that doesn't get overwritten during ref resolution

***

### defId?

> `optional` **defId**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:61

***

### isParent?

> `optional` **isParent**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:66

***

### path?

> `optional` **path**: (`string` \| `number`)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:70

JSON Schema property path for this schema

***

### ref?

> `optional` **ref**: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:68

Schema to inherit JSON Schema properties from (set by processor for wrappers)

***

### schema

> **schema**: [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:58

JSON Schema result for this Zod schema
