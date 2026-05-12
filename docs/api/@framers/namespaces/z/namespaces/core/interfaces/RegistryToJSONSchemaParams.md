# Interface: RegistryToJSONSchemaParams

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:49

Parameters for the toJSONSchema function when passing a registry.

## Extends

- [`ToJSONSchemaParams`](../type-aliases/ToJSONSchemaParams.md)

## Properties

### cycles?

> `optional` **cycles**: `"throw"` \| `"ref"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:32

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`cycles`](JSONSchemaGeneratorParams.md#cycles)

***

### io?

> `optional` **io**: `"input"` \| `"output"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:31

Whether to extract the `"input"` or `"output"` type. Relevant to transforms, defaults, coerced primitives, etc.
- `"output"` — Default. Convert the output schema.
- `"input"` — Convert the input schema.

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`io`](JSONSchemaGeneratorParams.md#io)

***

### metadata?

> `optional` **metadata**: [`$ZodRegistry`](../classes/$ZodRegistry.md)\<`Record`\<`string`, `any`\>, [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:11

A registry used to look up metadata for each schema. Any schema with an `id` property will be extracted as a $def.

#### Default

```ts
globalRegistry
```

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`metadata`](JSONSchemaGeneratorParams.md#metadata)

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

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`override`](JSONSchemaGeneratorParams.md#override)

***

### reused?

> `optional` **reused**: `"ref"` \| `"inline"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:33

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`reused`](JSONSchemaGeneratorParams.md#reused)

***

### target?

> `optional` **target**: `"draft-04"` \| `"draft-07"` \| `"draft-2020-12"` \| `"openapi-3.0"` \| `object` & `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:17

The JSON Schema version to target.
- `"draft-2020-12"` — Default. JSON Schema Draft 2020-12
- `"draft-07"` — JSON Schema Draft 7
- `"draft-04"` — JSON Schema Draft 4
- `"openapi-3.0"` — OpenAPI 3.0 Schema Object

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`target`](JSONSchemaGeneratorParams.md#target)

***

### unrepresentable?

> `optional` **unrepresentable**: `"throw"` \| `"any"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:21

How to handle unrepresentable types.
- `"throw"` — Default. Unrepresentable types throw an error
- `"any"` — Unrepresentable types become `{}`

#### Inherited from

[`JSONSchemaGeneratorParams`](JSONSchemaGeneratorParams.md).[`unrepresentable`](JSONSchemaGeneratorParams.md#unrepresentable)

***

### uri()?

> `optional` **uri**: (`id`) => `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:50

#### Parameters

##### id

`string`

#### Returns

`string`
