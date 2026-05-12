# Interface: ZodJSONSchemaInternals

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:731

## Extends

- `_ZodJSONSchemaInternals`

## Properties

### bag

> **bag**: `Record`\<`string`, `unknown`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:71

**`Internal`**

A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`.

#### Inherited from

`_ZodJSONSchemaInternals.bag`

***

### constr()

> **constr**: (`def`) => [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:69

**`Internal`**

The constructor function of this schema.

#### Parameters

##### def

`any`

#### Returns

[`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)

#### Inherited from

`_ZodJSONSchemaInternals.constr`

***

### def

> **def**: [`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<\[[`ZodString`](ZodString-1.md), [`ZodNumber`](ZodNumber-1.md), [`ZodBoolean`](ZodBoolean-1.md), [`ZodNull`](ZodNull.md), [`ZodArray`](ZodArray.md)\<[`ZodJSONSchema`](ZodJSONSchema.md)\>, [`ZodRecord`](ZodRecord.md)\<[`ZodString`](ZodString-1.md), [`ZodJSONSchema`](ZodJSONSchema.md)\>\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:628

Schema definition.

#### Inherited from

`_ZodJSONSchemaInternals.def`

***

### deferred

> **deferred**: [`AnyFunc`](../namespaces/util/type-aliases/AnyFunc.md)[] \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:42

**`Internal`**

List of deferred initializers.

#### Inherited from

`_ZodJSONSchemaInternals.deferred`

***

### input

> **input**: [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:733

#### Overrides

`_ZodJSONSchemaInternals.input`

***

### isst

> **isst**: [`$ZodIssueInvalidUnion`](../namespaces/core/type-aliases/$ZodIssueInvalidUnion.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:629

**`Internal`**

The set of issues this schema might throw during type checking.

#### Inherited from

`_ZodJSONSchemaInternals.isst`

***

### optin

> **optin**: `"optional"` \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:634

**`Internal`**

#### Inherited from

`_ZodJSONSchemaInternals.optin`

***

### optout

> **optout**: `"optional"` \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:635

**`Internal`**

#### Inherited from

`_ZodJSONSchemaInternals.optout`

***

### output

> **output**: [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:732

#### Overrides

`_ZodJSONSchemaInternals.output`

***

### parent?

> `optional` **parent**: [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:79

**`Internal`**

The parent of this schema. Only set during certain clone operations.

#### Inherited from

`_ZodJSONSchemaInternals.parent`

***

### pattern

> **pattern**: `RegExp` \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:630

**`Internal`**

This flag indicates that a schema validation can be represented with a regular expression. Used to determine allowable schemas in z.templateLiteral().

#### Inherited from

`_ZodJSONSchemaInternals.pattern`

***

### processJSONSchema()?

> `optional` **processJSONSchema**: (`ctx`, `json`, `params`) => `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:75

**`Internal`**

Subject to change, not a public API.

#### Parameters

##### ctx

[`ToJSONSchemaContext`](../namespaces/core/interfaces/ToJSONSchemaContext.md)

##### json

[`JSONSchema`](../namespaces/core/namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

##### params

[`ProcessParams`](../namespaces/core/interfaces/ProcessParams.md)

#### Returns

`void`

#### Inherited from

`_ZodJSONSchemaInternals.processJSONSchema`

***

### propValues?

> `optional` **propValues**: [`PropValues`](../namespaces/util/type-aliases/PropValues.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:65

**`Internal`**

A set of literal discriminators used for the fast path in discriminated unions.

#### Inherited from

`_ZodJSONSchemaInternals.propValues`

***

### toJSONSchema()?

> `optional` **toJSONSchema**: () => `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:77

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

`_ZodJSONSchemaInternals.toJSONSchema`

***

### traits

> **traits**: `Set`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:48

**`Internal`**

Stores identifiers for the set of traits implemented by this schema.

#### Inherited from

`_ZodJSONSchemaInternals.traits`

***

### values

> **values**: [`PrimitiveSet`](../namespaces/util/type-aliases/PrimitiveSet.md) \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:631

**`Internal`**

The set of literal values that will pass validation. Must be an exhaustive set. Used to determine optionality in z.record().

Defined on: enum, const, literal, null, undefined
Passthrough: optional, nullable, branded, default, catch, pipe
Todo: unions?

#### Inherited from

`_ZodJSONSchemaInternals.values`

***

### version

> **version**: `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:37

The `@zod/core` version of this schema

#### major

> `readonly` **major**: `4`

#### minor

> `readonly` **minor**: `3`

#### patch

> `readonly` **patch**: `number`

#### Inherited from

`_ZodJSONSchemaInternals.version`

## Methods

### parse()

> **parse**(`payload`, `ctx`): [`MaybeAsync`](../namespaces/util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](../namespaces/core/interfaces/ParsePayload.md)\<`unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:46

**`Internal`**

Parses input, doesn't run checks.

#### Parameters

##### payload

[`ParsePayload`](../namespaces/core/interfaces/ParsePayload.md)\<`any`\>

##### ctx

[`ParseContextInternal`](../namespaces/core/interfaces/ParseContextInternal.md)

#### Returns

[`MaybeAsync`](../namespaces/util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](../namespaces/core/interfaces/ParsePayload.md)\<`unknown`\>\>

#### Inherited from

`_ZodJSONSchemaInternals.parse`

***

### run()

> **run**(`payload`, `ctx`): [`MaybeAsync`](../namespaces/util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](../namespaces/core/interfaces/ParsePayload.md)\<`unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:44

**`Internal`**

Parses input and runs all checks (refinements).

#### Parameters

##### payload

[`ParsePayload`](../namespaces/core/interfaces/ParsePayload.md)\<`any`\>

##### ctx

[`ParseContextInternal`](../namespaces/core/interfaces/ParseContextInternal.md)

#### Returns

[`MaybeAsync`](../namespaces/util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](../namespaces/core/interfaces/ParsePayload.md)\<`unknown`\>\>

#### Inherited from

`_ZodJSONSchemaInternals.run`
