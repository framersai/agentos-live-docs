# Interface: $ZodFunctionInternals\<Args, Returns\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:1074

**`Internal`**

## Extends

- [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<[`$InferOuterFunctionType`](../type-aliases/$InferOuterFunctionType.md)\<`Args`, `Returns`\>, [`$InferInnerFunctionType`](../type-aliases/$InferInnerFunctionType.md)\<`Args`, `Returns`\>\>

## Type Parameters

### Args

`Args` *extends* [`$ZodFunctionIn`](../type-aliases/$ZodFunctionIn.md)

### Returns

`Returns` *extends* [`$ZodFunctionOut`](../type-aliases/$ZodFunctionOut.md)

## Properties

### bag

> **bag**: `Record`\<`string`, `unknown`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:71

**`Internal`**

A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`.

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`bag`]($ZodTypeInternals-1.md#bag)

***

### constr()

> **constr**: (`def`) => [`$ZodType`]($ZodType-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:69

**`Internal`**

The constructor function of this schema.

#### Parameters

##### def

`any`

#### Returns

[`$ZodType`]($ZodType-1.md)

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`constr`]($ZodTypeInternals-1.md#constr)

***

### def

> **def**: [`$ZodFunctionDef`]($ZodFunctionDef.md)\<`Args`, `Returns`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:1075

Schema definition.

#### Overrides

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`def`]($ZodTypeInternals-1.md#def)

***

### deferred

> **deferred**: [`AnyFunc`](../../util/type-aliases/AnyFunc.md)[] \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:42

**`Internal`**

List of deferred initializers.

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`deferred`]($ZodTypeInternals-1.md#deferred)

***

### input

> **input**: [`$InferInnerFunctionType`](../type-aliases/$InferInnerFunctionType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:86

**`Internal`**

The inferred input type

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`input`]($ZodTypeInternals-1.md#input)

***

### isst

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:1076

**`Internal`**

The set of issues this schema might throw during type checking.

#### Overrides

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`isst`]($ZodTypeInternals-1.md#isst)

***

### optin?

> `optional` **optin**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:53

**`Internal`**

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`optin`]($ZodTypeInternals-1.md#optin)

***

### optout?

> `optional` **optout**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:55

**`Internal`**

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`optout`]($ZodTypeInternals-1.md#optout)

***

### output

> **output**: [`$InferOuterFunctionType`](../type-aliases/$InferOuterFunctionType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:84

**`Internal`**

The inferred output type

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`output`]($ZodTypeInternals-1.md#output)

***

### parent?

> `optional` **parent**: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:79

**`Internal`**

The parent of this schema. Only set during certain clone operations.

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`parent`]($ZodTypeInternals-1.md#parent)

***

### pattern

> **pattern**: `RegExp` \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:67

**`Internal`**

This flag indicates that a schema validation can be represented with a regular expression. Used to determine allowable schemas in z.templateLiteral().

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`pattern`]($ZodTypeInternals-1.md#pattern)

***

### processJSONSchema()?

> `optional` **processJSONSchema**: (`ctx`, `json`, `params`) => `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:75

**`Internal`**

Subject to change, not a public API.

#### Parameters

##### ctx

[`ToJSONSchemaContext`](ToJSONSchemaContext.md)

##### json

[`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

##### params

[`ProcessParams`](ProcessParams.md)

#### Returns

`void`

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`processJSONSchema`]($ZodTypeInternals-1.md#processjsonschema)

***

### propValues?

> `optional` **propValues**: [`PropValues`](../../util/type-aliases/PropValues.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:65

**`Internal`**

A set of literal discriminators used for the fast path in discriminated unions.

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`propValues`]($ZodTypeInternals-1.md#propvalues)

***

### toJSONSchema()?

> `optional` **toJSONSchema**: () => `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:77

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`toJSONSchema`]($ZodTypeInternals-1.md#tojsonschema)

***

### traits

> **traits**: `Set`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:48

**`Internal`**

Stores identifiers for the set of traits implemented by this schema.

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`traits`]($ZodTypeInternals-1.md#traits)

***

### values?

> `optional` **values**: [`PrimitiveSet`](../../util/type-aliases/PrimitiveSet.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:62

**`Internal`**

The set of literal values that will pass validation. Must be an exhaustive set. Used to determine optionality in z.record().

Defined on: enum, const, literal, null, undefined
Passthrough: optional, nullable, branded, default, catch, pipe
Todo: unions?

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`values`]($ZodTypeInternals-1.md#values)

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

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`version`]($ZodTypeInternals-1.md#version)

## Methods

### parse()

> **parse**(`payload`, `ctx`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](ParsePayload.md)\<`unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:46

**`Internal`**

Parses input, doesn't run checks.

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`any`\>

##### ctx

[`ParseContextInternal`](ParseContextInternal.md)

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](ParsePayload.md)\<`unknown`\>\>

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`parse`]($ZodTypeInternals-1.md#parse)

***

### run()

> **run**(`payload`, `ctx`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](ParsePayload.md)\<`unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:44

**`Internal`**

Parses input and runs all checks (refinements).

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`any`\>

##### ctx

[`ParseContextInternal`](ParseContextInternal.md)

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`ParsePayload`](ParsePayload.md)\<`unknown`\>\>

#### Inherited from

[`$ZodTypeInternals`]($ZodTypeInternals-1.md).[`run`]($ZodTypeInternals-1.md#run)
