# Interface: $ZodDiscriminatedUnionInternals\<Options, Disc\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:651

## Extends

- [`$ZodUnionInternals`]($ZodUnionInternals.md)\<`Options`\>

## Type Parameters

### Options

`Options` *extends* readonly [`SomeType`](../type-aliases/SomeType.md)[] = readonly [`$ZodType`]($ZodType-1.md)[]

### Disc

`Disc` *extends* `string` = `string`

## Properties

### bag

> **bag**: `Record`\<`string`, `unknown`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:71

**`Internal`**

A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`.

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`bag`]($ZodUnionInternals.md#bag)

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

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`constr`]($ZodUnionInternals.md#constr)

***

### def

> **def**: [`$ZodDiscriminatedUnionDef`]($ZodDiscriminatedUnionDef.md)\<`Options`, `Disc`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:652

Schema definition.

#### Overrides

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`def`]($ZodUnionInternals.md#def)

***

### deferred

> **deferred**: [`AnyFunc`](../../util/type-aliases/AnyFunc.md)[] \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:42

**`Internal`**

List of deferred initializers.

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`deferred`]($ZodUnionInternals.md#deferred)

***

### input

> **input**: [`$InferUnionInput`](../type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:633

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`input`]($ZodUnionInternals.md#input)

***

### isst

> **isst**: [`$ZodIssueInvalidUnion`](../type-aliases/$ZodIssueInvalidUnion.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:629

**`Internal`**

The set of issues this schema might throw during type checking.

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`isst`]($ZodUnionInternals.md#isst)

***

### optin

> **optin**: `IsOptionalIn`\<`Options`\[`number`\]\> *extends* `false` ? `"optional"` \| `undefined` : `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:634

**`Internal`**

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`optin`]($ZodUnionInternals.md#optin)

***

### optout

> **optout**: `IsOptionalOut`\<`Options`\[`number`\]\> *extends* `false` ? `"optional"` \| `undefined` : `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:635

**`Internal`**

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`optout`]($ZodUnionInternals.md#optout)

***

### output

> **output**: [`$InferUnionOutput`](../type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:632

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`output`]($ZodUnionInternals.md#output)

***

### parent?

> `optional` **parent**: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:79

**`Internal`**

The parent of this schema. Only set during certain clone operations.

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`parent`]($ZodUnionInternals.md#parent)

***

### pattern

> **pattern**: `Options`\[`number`\]\[`"_zod"`\]\[`"pattern"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:630

**`Internal`**

This flag indicates that a schema validation can be represented with a regular expression. Used to determine allowable schemas in z.templateLiteral().

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`pattern`]($ZodUnionInternals.md#pattern)

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

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`processJSONSchema`]($ZodUnionInternals.md#processjsonschema)

***

### propValues

> **propValues**: [`PropValues`](../../util/type-aliases/PropValues.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:653

**`Internal`**

A set of literal discriminators used for the fast path in discriminated unions.

#### Overrides

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`propValues`]($ZodUnionInternals.md#propvalues)

***

### toJSONSchema()?

> `optional` **toJSONSchema**: () => `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:77

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`toJSONSchema`]($ZodUnionInternals.md#tojsonschema)

***

### traits

> **traits**: `Set`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:48

**`Internal`**

Stores identifiers for the set of traits implemented by this schema.

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`traits`]($ZodUnionInternals.md#traits)

***

### values

> **values**: `Options`\[`number`\]\[`"_zod"`\]\[`"values"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:631

**`Internal`**

The set of literal values that will pass validation. Must be an exhaustive set. Used to determine optionality in z.record().

Defined on: enum, const, literal, null, undefined
Passthrough: optional, nullable, branded, default, catch, pipe
Todo: unions?

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`values`]($ZodUnionInternals.md#values)

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

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`version`]($ZodUnionInternals.md#version)

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

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`parse`]($ZodUnionInternals.md#parse)

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

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`run`]($ZodUnionInternals.md#run)
