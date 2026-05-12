# Interface: $ZodEmailInternals

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:151

**`Internal`**

## Extends

- [`$ZodStringFormatInternals`]($ZodStringFormatInternals.md)\<`"email"`\>

## Properties

### bag

> **bag**: [`LoosePartial`](../../util/type-aliases/LoosePartial.md)\<\{ `contentEncoding`: `string`; `format`: `string`; `maximum`: `number`; `minimum`: `number`; `patterns`: `Set`\<`RegExp`\>; \}\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:111

**`Internal`**

A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`bag`]($ZodStringFormatInternals.md#bag)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`constr`]($ZodStringFormatInternals.md#constr)

***

### def

> **def**: [`$ZodStringFormatDef`]($ZodStringFormatDef.md)\<`"email"`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:125

Schema definition.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`def`]($ZodStringFormatInternals.md#def)

***

### deferred

> **deferred**: [`AnyFunc`](../../util/type-aliases/AnyFunc.md)[] \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:42

**`Internal`**

List of deferred initializers.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`deferred`]($ZodStringFormatInternals.md#deferred)

***

### input

> **input**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:86

**`Internal`**

The inferred input type

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`input`]($ZodStringFormatInternals.md#input)

***

### issc

> **issc**: [`$ZodIssueInvalidStringFormat`]($ZodIssueInvalidStringFormat.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:168

The set of issues this check might throw.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`issc`]($ZodStringFormatInternals.md#issc)

***

### ~~isst~~

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:110

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`isst`]($ZodStringFormatInternals.md#isst)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`onattach`]($ZodStringFormatInternals.md#onattach)

***

### optin?

> `optional` **optin**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:53

**`Internal`**

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`optin`]($ZodStringFormatInternals.md#optin)

***

### optout?

> `optional` **optout**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:55

**`Internal`**

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`optout`]($ZodStringFormatInternals.md#optout)

***

### output

> **output**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:84

**`Internal`**

The inferred output type

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`output`]($ZodStringFormatInternals.md#output)

***

### parent?

> `optional` **parent**: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:79

**`Internal`**

The parent of this schema. Only set during certain clone operations.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`parent`]($ZodStringFormatInternals.md#parent)

***

### ~~pattern~~

> **pattern**: `RegExp`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:108

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`pattern`]($ZodStringInternals.md#pattern)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`processJSONSchema`]($ZodStringFormatInternals.md#processjsonschema)

***

### propValues?

> `optional` **propValues**: [`PropValues`](../../util/type-aliases/PropValues.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:65

**`Internal`**

A set of literal discriminators used for the fast path in discriminated unions.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`propValues`]($ZodStringFormatInternals.md#propvalues)

***

### toJSONSchema()?

> `optional` **toJSONSchema**: () => `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:77

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`toJSONSchema`]($ZodStringFormatInternals.md#tojsonschema)

***

### traits

> **traits**: `Set`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:48

**`Internal`**

Stores identifiers for the set of traits implemented by this schema.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`traits`]($ZodStringFormatInternals.md#traits)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`values`]($ZodStringFormatInternals.md#values)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`version`]($ZodStringFormatInternals.md#version)

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`string`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`check`]($ZodStringFormatInternals.md#check)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`parse`]($ZodStringFormatInternals.md#parse)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`run`]($ZodStringFormatInternals.md#run)
