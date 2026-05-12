# Interface: JSONSchemaGeneratorParams

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:7

## Properties

### cycles?

> `optional` **cycles**: `"throw"` \| `"ref"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:32

***

### external?

> `optional` **external**: `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:34

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

### io?

> `optional` **io**: `"input"` \| `"output"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:31

Whether to extract the `"input"` or `"output"` type. Relevant to transforms, defaults, coerced primitives, etc.
- `"output"` — Default. Convert the output schema.
- `"input"` — Convert the input schema.

***

### metadata?

> `optional` **metadata**: [`$ZodRegistry`](../classes/$ZodRegistry.md)\<`Record`\<`string`, `any`\>, [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:11

A registry used to look up metadata for each schema. Any schema with an `id` property will be extracted as a $def.

#### Default

```ts
globalRegistry
```

***

### override()?

> `optional` **override**: (`ctx`) => `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:23

Arbitrary custom logic that can be used to modify the generated JSON Schema.

#### Parameters

##### ctx

###### jsonSchema

[`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

###### path

(`string` \| `number`)[]

###### zodSchema

[`$ZodTypes`](../type-aliases/$ZodTypes.md)

#### Returns

`void`

***

### processors

> **processors**: `Record`\<`string`, [`Processor`](../type-aliases/Processor.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:8

***

### reused?

> `optional` **reused**: `"ref"` \| `"inline"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:33

***

### target?

> `optional` **target**: `"draft-04"` \| `"draft-07"` \| `"draft-2020-12"` \| `"openapi-3.0"` \| `object` & `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:17

The JSON Schema version to target.
- `"draft-2020-12"` — Default. JSON Schema Draft 2020-12
- `"draft-07"` — JSON Schema Draft 7
- `"draft-04"` — JSON Schema Draft 4
- `"openapi-3.0"` — OpenAPI 3.0 Schema Object

***

### unrepresentable?

> `optional` **unrepresentable**: `"throw"` \| `"any"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:21

How to handle unrepresentable types.
- `"throw"` — Default. Unrepresentable types throw an error
- `"any"` — Unrepresentable types become `{}`
