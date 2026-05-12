# Type Alias: JSONSchema

> **JSONSchema** = `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:3

## Extended by

- [`ObjectSchema`](../interfaces/ObjectSchema.md)
- [`ArraySchema`](../interfaces/ArraySchema.md)
- [`StringSchema`](../interfaces/StringSchema.md)
- [`NumberSchema`](../interfaces/NumberSchema.md)
- [`IntegerSchema`](../interfaces/IntegerSchema.md)
- [`BooleanSchema`](../interfaces/BooleanSchema.md)
- [`NullSchema`](../interfaces/NullSchema.md)

## Indexable

\[`k`: `string`\]: `unknown`

## Properties

### \_prefault?

> `optional` **\_prefault**: `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:65

***

### $anchor?

> `optional` **$anchor**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:7

***

### $comment?

> `optional` **$comment**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:12

***

### $defs?

> `optional` **$defs**: `Record`\<`string`, `JSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:13

***

### $dynamicAnchor?

> `optional` **$dynamicAnchor**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:10

***

### $dynamicRef?

> `optional` **$dynamicRef**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:9

***

### $id?

> `optional` **$id**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:6

***

### $ref?

> `optional` **$ref**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:8

***

### $schema?

> `optional` **$schema**: `"https://json-schema.org/draft/2020-12/schema"` \| `"http://json-schema.org/draft-07/schema#"` \| `"http://json-schema.org/draft-04/schema#"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:5

***

### $vocabulary?

> `optional` **$vocabulary**: `Record`\<`string`, `boolean`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:11

***

### additionalItems?

> `optional` **additionalItems**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:15

***

### additionalProperties?

> `optional` **additionalProperties**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:20

***

### allOf?

> `optional` **allOf**: `JSONSchema`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:29

***

### anyOf?

> `optional` **anyOf**: `JSONSchema`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:30

***

### const?

> `optional` **const**: `string` \| `number` \| `boolean` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:51

***

### contains?

> `optional` **contains**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:19

***

### contentEncoding?

> `optional` **contentEncoding**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:63

***

### contentMediaType?

> `optional` **contentMediaType**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:62

***

### contentSchema?

> `optional` **contentSchema**: `JSONSchema`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:64

***

### default?

> `optional` **default**: `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:55

***

### dependentRequired?

> `optional` **dependentRequired**: `Record`\<`string`, `string`[]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:49

***

### dependentSchemas?

> `optional` **dependentSchemas**: `Record`\<`string`, [`_JSONSchema`](JSONSchema.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:24

***

### deprecated?

> `optional` **deprecated**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:56

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:54

***

### else?

> `optional` **else**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:28

***

### enum?

> `optional` **enum**: (`string` \| `number` \| `boolean` \| `null`)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:50

***

### examples?

> `optional` **examples**: `unknown`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:60

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `number` \| `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:35

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `number` \| `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:37

***

### format?

> `optional` **format**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:61

***

### id?

> `optional` **id**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:52

***

### if?

> `optional` **if**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:26

***

### items?

> `optional` **items**: [`_JSONSchema`](JSONSchema.md) \| [`_JSONSchema`](JSONSchema.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:18

***

### maxContains?

> `optional` **maxContains**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:44

***

### maximum?

> `optional` **maximum**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:34

***

### maxItems?

> `optional` **maxItems**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:41

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:38

***

### maxProperties?

> `optional` **maxProperties**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:46

***

### minContains?

> `optional` **minContains**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:45

***

### minimum?

> `optional` **minimum**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:36

***

### minItems?

> `optional` **minItems**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:42

***

### minLength?

> `optional` **minLength**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:39

***

### minProperties?

> `optional` **minProperties**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:47

***

### multipleOf?

> `optional` **multipleOf**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:33

***

### not?

> `optional` **not**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:32

***

### nullable?

> `optional` **nullable**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:59

***

### oneOf?

> `optional` **oneOf**: `JSONSchema`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:31

***

### pattern?

> `optional` **pattern**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:40

***

### patternProperties?

> `optional` **patternProperties**: `Record`\<`string`, [`_JSONSchema`](JSONSchema.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:23

***

### prefixItems?

> `optional` **prefixItems**: [`_JSONSchema`](JSONSchema.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:17

***

### properties?

> `optional` **properties**: `Record`\<`string`, [`_JSONSchema`](JSONSchema.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:22

***

### propertyNames?

> `optional` **propertyNames**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:25

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:57

***

### required?

> `optional` **required**: `string`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:48

***

### then?

> `optional` **then**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:27

***

### title?

> `optional` **title**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:53

***

### type?

> `optional` **type**: `"object"` \| `"array"` \| `"string"` \| `"number"` \| `"boolean"` \| `"null"` \| `"integer"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:14

***

### unevaluatedItems?

> `optional` **unevaluatedItems**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:16

***

### unevaluatedProperties?

> `optional` **unevaluatedProperties**: [`_JSONSchema`](JSONSchema.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:21

***

### uniqueItems?

> `optional` **uniqueItems**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:43

***

### writeOnly?

> `optional` **writeOnly**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema.d.cts:58
