# Interface: JSONSchema

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:94](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L94)

Complete JSON Schema definition for structured outputs.

## Remarks

This interface supports the commonly used JSON Schema keywords
for defining structured LLM outputs. It's designed to be compatible
with OpenAI's structured output API and similar implementations.

## Properties

### $defs?

> `optional` **$defs**: `Record`\<`string`, `JSONSchema`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:191](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L191)

Schema definitions for $ref

***

### $ref?

> `optional` **$ref**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:189](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L189)

Reference to another schema

***

### additionalItems?

> `optional` **additionalItems**: `boolean` \| `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:145](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L145)

Schema for items after `items` tuple schemas

***

### additionalProperties?

> `optional` **additionalProperties**: `boolean` \| `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:157](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L157)

Schema for properties not in `properties`

***

### allOf?

> `optional` **allOf**: `JSONSchema`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:173](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L173)

Must match all schemas

***

### anyOf?

> `optional` **anyOf**: `JSONSchema`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:175](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L175)

Must match at least one schema

***

### const?

> `optional` **const**: `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:111](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L111)

Constant value (must be exactly this)

***

### contains?

> `optional` **contains**: `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:149](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L149)

Schema that must validate at least one item

***

### default?

> `optional` **default**: `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:105](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L105)

Default value if not provided

***

### dependentRequired?

> `optional` **dependentRequired**: `Record`\<`string`, `string`[]\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:167](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L167)

Dependencies between properties

***

### dependentSchemas?

> `optional` **dependentSchemas**: `Record`\<`string`, `JSONSchema`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:169](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L169)

Schema dependencies

***

### deprecated?

> `optional` **deprecated**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:201](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L201)

Deprecation flag

***

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L102)

Description of what the schema represents

***

### else?

> `optional` **else**: `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:185](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L185)

Schema if `if` fails

***

### enum?

> `optional` **enum**: `unknown`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L108)

Enumeration of allowed values

***

### examples?

> `optional` **examples**: `unknown`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:195](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L195)

Examples of valid values

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:131](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L131)

Maximum value (exclusive)

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:129](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L129)

Minimum value (exclusive)

***

### format?

> `optional` **format**: [`JSONSchemaStringFormat`](../type-aliases/JSONSchemaStringFormat.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:121](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L121)

String format validator

***

### if?

> `optional` **if**: `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:181](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L181)

Conditional schema application

***

### items?

> `optional` **items**: `JSONSchema` \| `JSONSchema`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:137](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L137)

Schema for array items

***

### maximum?

> `optional` **maximum**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L127)

Maximum value (inclusive)

***

### maxItems?

> `optional` **maxItems**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:141](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L141)

Maximum number of items

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L117)

Maximum string length

***

### maxProperties?

> `optional` **maxProperties**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:163](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L163)

Maximum number of properties

***

### minimum?

> `optional` **minimum**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L125)

Minimum value (inclusive)

***

### minItems?

> `optional` **minItems**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:139](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L139)

Minimum number of items

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:115](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L115)

Minimum string length

***

### minProperties?

> `optional` **minProperties**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:161](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L161)

Minimum number of properties

***

### multipleOf?

> `optional` **multipleOf**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:133](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L133)

Value must be a multiple of this number

***

### not?

> `optional` **not**: `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:179](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L179)

Must not match this schema

***

### oneOf?

> `optional` **oneOf**: `JSONSchema`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:177](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L177)

Must match exactly one schema

***

### pattern?

> `optional` **pattern**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:119](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L119)

Regex pattern the string must match

***

### patternProperties?

> `optional` **patternProperties**: `Record`\<`string`, `JSONSchema`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:159](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L159)

Pattern-based property schemas

***

### prefixItems?

> `optional` **prefixItems**: `JSONSchema`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:147](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L147)

Prefix items (for tuple validation)

***

### properties?

> `optional` **properties**: `Record`\<`string`, `JSONSchema`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:153](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L153)

Property definitions for object

***

### propertyNames?

> `optional` **propertyNames**: `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L165)

Property names must match this schema

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:197](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L197)

Whether this value is read-only

***

### required?

> `optional` **required**: `string`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:155](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L155)

Required property names

***

### then?

> `optional` **then**: `JSONSchema`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:183](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L183)

Schema if `if` passes

***

### title?

> `optional` **title**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:99](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L99)

Human-readable title for the schema

***

### type?

> `optional` **type**: [`JSONSchemaType`](../type-aliases/JSONSchemaType.md) \| [`JSONSchemaType`](../type-aliases/JSONSchemaType.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:96](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L96)

The data type of the schema

***

### uniqueItems?

> `optional` **uniqueItems**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:143](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L143)

All items must be unique

***

### writeOnly?

> `optional` **writeOnly**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:199](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/structured/output/IStructuredOutputManager.ts#L199)

Whether this value is write-only
