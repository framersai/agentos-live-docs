# Interface: ZodStandardJSONSchemaPayload\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:100

## Extends

- [`BaseSchema`](../namespaces/JSONSchema/type-aliases/BaseSchema.md)

## Type Parameters

### T

`T`

## Indexable

\[`k`: `string`\]: `unknown`

## Properties

### \_prefault?

> `optional` **\_prefault**: `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:65

#### Inherited from

`JSONSchema.BaseSchema._prefault`

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/to-json-schema.d.cts:101

***

### $anchor?

> `optional` **$anchor**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:7

#### Inherited from

`JSONSchema.BaseSchema.$anchor`

***

### $comment?

> `optional` **$comment**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:12

#### Inherited from

`JSONSchema.BaseSchema.$comment`

***

### $defs?

> `optional` **$defs**: `Record`\<`string`, [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:13

#### Inherited from

`JSONSchema.BaseSchema.$defs`

***

### $dynamicAnchor?

> `optional` **$dynamicAnchor**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:10

#### Inherited from

`JSONSchema.BaseSchema.$dynamicAnchor`

***

### $dynamicRef?

> `optional` **$dynamicRef**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:9

#### Inherited from

`JSONSchema.BaseSchema.$dynamicRef`

***

### $id?

> `optional` **$id**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:6

#### Inherited from

`JSONSchema.BaseSchema.$id`

***

### $ref?

> `optional` **$ref**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:8

#### Inherited from

`JSONSchema.BaseSchema.$ref`

***

### $schema?

> `optional` **$schema**: `"https://json-schema.org/draft/2020-12/schema"` \| `"http://json-schema.org/draft-07/schema#"` \| `"http://json-schema.org/draft-04/schema#"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:5

#### Inherited from

`JSONSchema.BaseSchema.$schema`

***

### $vocabulary?

> `optional` **$vocabulary**: `Record`\<`string`, `boolean`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:11

#### Inherited from

`JSONSchema.BaseSchema.$vocabulary`

***

### additionalItems?

> `optional` **additionalItems**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:15

#### Inherited from

`JSONSchema.BaseSchema.additionalItems`

***

### additionalProperties?

> `optional` **additionalProperties**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:20

#### Inherited from

`JSONSchema.BaseSchema.additionalProperties`

***

### allOf?

> `optional` **allOf**: [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:29

#### Inherited from

`JSONSchema.BaseSchema.allOf`

***

### anyOf?

> `optional` **anyOf**: [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:30

#### Inherited from

`JSONSchema.BaseSchema.anyOf`

***

### const?

> `optional` **const**: `string` \| `number` \| `boolean` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:51

#### Inherited from

`JSONSchema.BaseSchema.const`

***

### contains?

> `optional` **contains**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:19

#### Inherited from

`JSONSchema.BaseSchema.contains`

***

### contentEncoding?

> `optional` **contentEncoding**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:63

#### Inherited from

`JSONSchema.BaseSchema.contentEncoding`

***

### contentMediaType?

> `optional` **contentMediaType**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:62

#### Inherited from

`JSONSchema.BaseSchema.contentMediaType`

***

### contentSchema?

> `optional` **contentSchema**: [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:64

#### Inherited from

`JSONSchema.BaseSchema.contentSchema`

***

### default?

> `optional` **default**: `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:55

#### Inherited from

`JSONSchema.BaseSchema.default`

***

### dependentRequired?

> `optional` **dependentRequired**: `Record`\<`string`, `string`[]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:49

#### Inherited from

`JSONSchema.BaseSchema.dependentRequired`

***

### dependentSchemas?

> `optional` **dependentSchemas**: `Record`\<`string`, [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:24

#### Inherited from

`JSONSchema.BaseSchema.dependentSchemas`

***

### deprecated?

> `optional` **deprecated**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:56

#### Inherited from

`JSONSchema.BaseSchema.deprecated`

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:54

#### Inherited from

`JSONSchema.BaseSchema.description`

***

### else?

> `optional` **else**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:28

#### Inherited from

`JSONSchema.BaseSchema.else`

***

### enum?

> `optional` **enum**: (`string` \| `number` \| `boolean` \| `null`)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:50

#### Inherited from

`JSONSchema.BaseSchema.enum`

***

### examples?

> `optional` **examples**: `unknown`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:60

#### Inherited from

`JSONSchema.BaseSchema.examples`

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `number` \| `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:35

#### Inherited from

`JSONSchema.BaseSchema.exclusiveMaximum`

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `number` \| `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:37

#### Inherited from

`JSONSchema.BaseSchema.exclusiveMinimum`

***

### format?

> `optional` **format**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:61

#### Inherited from

`JSONSchema.BaseSchema.format`

***

### id?

> `optional` **id**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:52

#### Inherited from

`JSONSchema.BaseSchema.id`

***

### if?

> `optional` **if**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:26

#### Inherited from

`JSONSchema.BaseSchema.if`

***

### items?

> `optional` **items**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md) \| [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:18

#### Inherited from

`JSONSchema.BaseSchema.items`

***

### maxContains?

> `optional` **maxContains**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:44

#### Inherited from

`JSONSchema.BaseSchema.maxContains`

***

### maximum?

> `optional` **maximum**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:34

#### Inherited from

`JSONSchema.BaseSchema.maximum`

***

### maxItems?

> `optional` **maxItems**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:41

#### Inherited from

`JSONSchema.BaseSchema.maxItems`

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:38

#### Inherited from

`JSONSchema.BaseSchema.maxLength`

***

### maxProperties?

> `optional` **maxProperties**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:46

#### Inherited from

`JSONSchema.BaseSchema.maxProperties`

***

### minContains?

> `optional` **minContains**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:45

#### Inherited from

`JSONSchema.BaseSchema.minContains`

***

### minimum?

> `optional` **minimum**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:36

#### Inherited from

`JSONSchema.BaseSchema.minimum`

***

### minItems?

> `optional` **minItems**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:42

#### Inherited from

`JSONSchema.BaseSchema.minItems`

***

### minLength?

> `optional` **minLength**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:39

#### Inherited from

`JSONSchema.BaseSchema.minLength`

***

### minProperties?

> `optional` **minProperties**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:47

#### Inherited from

`JSONSchema.BaseSchema.minProperties`

***

### multipleOf?

> `optional` **multipleOf**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:33

#### Inherited from

`JSONSchema.BaseSchema.multipleOf`

***

### not?

> `optional` **not**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:32

#### Inherited from

`JSONSchema.BaseSchema.not`

***

### nullable?

> `optional` **nullable**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:59

#### Inherited from

`JSONSchema.BaseSchema.nullable`

***

### oneOf?

> `optional` **oneOf**: [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:31

#### Inherited from

`JSONSchema.BaseSchema.oneOf`

***

### pattern?

> `optional` **pattern**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:40

#### Inherited from

`JSONSchema.BaseSchema.pattern`

***

### patternProperties?

> `optional` **patternProperties**: `Record`\<`string`, [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:23

#### Inherited from

`JSONSchema.BaseSchema.patternProperties`

***

### prefixItems?

> `optional` **prefixItems**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:17

#### Inherited from

`JSONSchema.BaseSchema.prefixItems`

***

### properties?

> `optional` **properties**: `Record`\<`string`, [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:22

#### Inherited from

`JSONSchema.BaseSchema.properties`

***

### propertyNames?

> `optional` **propertyNames**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:25

#### Inherited from

`JSONSchema.BaseSchema.propertyNames`

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:57

#### Inherited from

`JSONSchema.BaseSchema.readOnly`

***

### required?

> `optional` **required**: `string`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:48

#### Inherited from

`JSONSchema.BaseSchema.required`

***

### then?

> `optional` **then**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:27

#### Inherited from

`JSONSchema.BaseSchema.then`

***

### title?

> `optional` **title**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:53

#### Inherited from

`JSONSchema.BaseSchema.title`

***

### type?

> `optional` **type**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"null"` \| `"array"` \| `"integer"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:14

#### Inherited from

`JSONSchema.BaseSchema.type`

***

### unevaluatedItems?

> `optional` **unevaluatedItems**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:16

#### Inherited from

`JSONSchema.BaseSchema.unevaluatedItems`

***

### unevaluatedProperties?

> `optional` **unevaluatedProperties**: [`_JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:21

#### Inherited from

`JSONSchema.BaseSchema.unevaluatedProperties`

***

### uniqueItems?

> `optional` **uniqueItems**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:43

#### Inherited from

`JSONSchema.BaseSchema.uniqueItems`

***

### writeOnly?

> `optional` **writeOnly**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:58

#### Inherited from

`JSONSchema.BaseSchema.writeOnly`
