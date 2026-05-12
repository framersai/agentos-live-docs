# Interface: $ZodBigIntFormatInternals

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:429

**`Internal`**

## Extends

- [`$ZodBigIntInternals`]($ZodBigIntInternals.md)\<`bigint`\>.[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md)

## Properties

### bag

> **bag**: [`LoosePartial`](../../util/type-aliases/LoosePartial.md)\<\{ `format`: `string`; `maximum`: `bigint`; `minimum`: `bigint`; \}\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:416

**`Internal`**

A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`.

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`bag`]($ZodBigIntInternals.md#bag)

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`constr`]($ZodBigIntInternals.md#constr)

***

### def

> **def**: [`$ZodBigIntFormatDef`]($ZodBigIntFormatDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:430

**`Internal`**

Internal API, use with caution

#### Overrides

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`def`]($ZodBigIntInternals.md#def)

***

### deferred

> **deferred**: [`AnyFunc`](../../util/type-aliases/AnyFunc.md)[] \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:42

**`Internal`**

List of deferred initializers.

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`deferred`]($ZodBigIntInternals.md#deferred)

***

### input

> **input**: `bigint`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:86

**`Internal`**

The inferred input type

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`input`]($ZodBigIntInternals.md#input)

***

### issc

> **issc**: [`$ZodIssueTooBig`]($ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`]($ZodIssueTooSmall.md)\<`"bigint"`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:82

The set of issues this check might throw.

#### Inherited from

[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md).[`issc`]($ZodCheckBigIntFormatInternals.md#issc)

***

### isst

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:415

**`Internal`**

The set of issues this schema might throw during type checking.

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`isst`]($ZodBigIntInternals.md#isst)

***

### onattach

> **onattach**: (`schema`) => `void`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:18

#### Parameters

##### schema

[`$ZodType`]($ZodType-1.md)

#### Returns

`void`

#### Inherited from

[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md).[`onattach`]($ZodCheckBigIntFormatInternals.md#onattach)

***

### optin?

> `optional` **optin**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:53

**`Internal`**

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`optin`]($ZodBigIntInternals.md#optin)

***

### optout?

> `optional` **optout**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:55

**`Internal`**

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`optout`]($ZodBigIntInternals.md#optout)

***

### output

> **output**: `bigint`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:84

**`Internal`**

The inferred output type

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`output`]($ZodBigIntInternals.md#output)

***

### parent?

> `optional` **parent**: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:79

**`Internal`**

The parent of this schema. Only set during certain clone operations.

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`parent`]($ZodBigIntInternals.md#parent)

***

### pattern

> **pattern**: `RegExp`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:412

**`Internal`**

This flag indicates that a schema validation can be represented with a regular expression. Used to determine allowable schemas in z.templateLiteral().

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`pattern`]($ZodBigIntInternals.md#pattern)

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`processJSONSchema`]($ZodBigIntInternals.md#processjsonschema)

***

### propValues?

> `optional` **propValues**: [`PropValues`](../../util/type-aliases/PropValues.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:65

**`Internal`**

A set of literal discriminators used for the fast path in discriminated unions.

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`propValues`]($ZodBigIntInternals.md#propvalues)

***

### toJSONSchema()?

> `optional` **toJSONSchema**: () => `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:77

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`toJSONSchema`]($ZodBigIntInternals.md#tojsonschema)

***

### traits

> **traits**: `Set`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:48

**`Internal`**

Stores identifiers for the set of traits implemented by this schema.

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`traits`]($ZodBigIntInternals.md#traits)

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`values`]($ZodBigIntInternals.md#values)

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`version`]($ZodBigIntInternals.md#version)

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`bigint`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md).[`check`]($ZodCheckBigIntFormatInternals.md#check)

***

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`parse`]($ZodBigIntInternals.md#parse)

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`run`]($ZodBigIntInternals.md#run)
