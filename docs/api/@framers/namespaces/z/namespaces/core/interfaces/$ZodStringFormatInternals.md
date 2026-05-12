# Interface: $ZodStringFormatInternals\<Format\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:124

**`Internal`**

## Extends

- [`$ZodStringInternals`]($ZodStringInternals.md)\<`string`\>.[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md)

## Extended by

- [`$ZodGUIDInternals`]($ZodGUIDInternals.md)
- [`$ZodUUIDInternals`]($ZodUUIDInternals.md)
- [`$ZodEmailInternals`]($ZodEmailInternals.md)
- [`$ZodURLInternals`]($ZodURLInternals.md)
- [`$ZodEmojiInternals`]($ZodEmojiInternals.md)
- [`$ZodNanoIDInternals`]($ZodNanoIDInternals.md)
- [`$ZodCUIDInternals`]($ZodCUIDInternals.md)
- [`$ZodCUID2Internals`]($ZodCUID2Internals.md)
- [`$ZodULIDInternals`]($ZodULIDInternals.md)
- [`$ZodXIDInternals`]($ZodXIDInternals.md)
- [`$ZodKSUIDInternals`]($ZodKSUIDInternals.md)
- [`$ZodISODateTimeInternals`]($ZodISODateTimeInternals.md)
- [`$ZodISODateInternals`]($ZodISODateInternals.md)
- [`$ZodISOTimeInternals`]($ZodISOTimeInternals.md)
- [`$ZodISODurationInternals`]($ZodISODurationInternals.md)
- [`$ZodIPv4Internals`]($ZodIPv4Internals.md)
- [`$ZodIPv6Internals`]($ZodIPv6Internals.md)
- [`$ZodMACInternals`]($ZodMACInternals.md)
- [`$ZodCIDRv4Internals`]($ZodCIDRv4Internals.md)
- [`$ZodCIDRv6Internals`]($ZodCIDRv6Internals.md)
- [`$ZodBase64Internals`]($ZodBase64Internals.md)
- [`$ZodBase64URLInternals`]($ZodBase64URLInternals.md)
- [`$ZodE164Internals`]($ZodE164Internals.md)
- [`$ZodJWTInternals`]($ZodJWTInternals.md)
- [`$ZodCustomStringFormatInternals`]($ZodCustomStringFormatInternals.md)

## Type Parameters

### Format

`Format` *extends* `string` = `string`

## Properties

### bag

> **bag**: [`LoosePartial`](../../util/type-aliases/LoosePartial.md)\<\{ `contentEncoding`: `string`; `format`: `string`; `maximum`: `number`; `minimum`: `number`; `patterns`: `Set`\<`RegExp`\>; \}\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:111

**`Internal`**

A catchall object for bag metadata related to this schema. Commonly modified by checks using `onattach`.

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`bag`]($ZodStringInternals.md#bag)

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

[`$ZodStringInternals`]($ZodStringInternals.md).[`constr`]($ZodStringInternals.md#constr)

***

### def

> **def**: [`$ZodStringFormatDef`]($ZodStringFormatDef.md)\<`Format`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:125

Schema definition.

#### Overrides

[`$ZodStringInternals`]($ZodStringInternals.md).[`def`]($ZodStringInternals.md#def)

***

### deferred

> **deferred**: [`AnyFunc`](../../util/type-aliases/AnyFunc.md)[] \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:42

**`Internal`**

List of deferred initializers.

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`deferred`]($ZodStringInternals.md#deferred)

***

### input

> **input**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:86

**`Internal`**

The inferred input type

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`input`]($ZodStringInternals.md#input-1)

***

### issc

> **issc**: [`$ZodIssueInvalidStringFormat`]($ZodIssueInvalidStringFormat.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:168

The set of issues this check might throw.

#### Inherited from

[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md).[`issc`]($ZodCheckStringFormatInternals.md#issc)

***

### ~~isst~~

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:110

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`isst`]($ZodStringInternals.md#isst)

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

[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md).[`onattach`]($ZodCheckStringFormatInternals.md#onattach)

***

### optin?

> `optional` **optin**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:53

**`Internal`**

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`optin`]($ZodStringInternals.md#optin)

***

### optout?

> `optional` **optout**: `"optional"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:55

**`Internal`**

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`optout`]($ZodStringInternals.md#optout)

***

### output

> **output**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:84

**`Internal`**

The inferred output type

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`output`]($ZodStringInternals.md#output)

***

### parent?

> `optional` **parent**: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:79

**`Internal`**

The parent of this schema. Only set during certain clone operations.

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`parent`]($ZodStringInternals.md#parent)

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

[`$ZodStringInternals`]($ZodStringInternals.md).[`processJSONSchema`]($ZodStringInternals.md#processjsonschema)

***

### propValues?

> `optional` **propValues**: [`PropValues`](../../util/type-aliases/PropValues.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:65

**`Internal`**

A set of literal discriminators used for the fast path in discriminated unions.

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`propValues`]($ZodStringInternals.md#propvalues)

***

### toJSONSchema()?

> `optional` **toJSONSchema**: () => `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:77

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`toJSONSchema`]($ZodStringInternals.md#tojsonschema)

***

### traits

> **traits**: `Set`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:48

**`Internal`**

Stores identifiers for the set of traits implemented by this schema.

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`traits`]($ZodStringInternals.md#traits)

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

[`$ZodStringInternals`]($ZodStringInternals.md).[`values`]($ZodStringInternals.md#values)

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

[`$ZodStringInternals`]($ZodStringInternals.md).[`version`]($ZodStringInternals.md#version)

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

[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md).[`check`]($ZodCheckStringFormatInternals.md#check)

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

[`$ZodStringInternals`]($ZodStringInternals.md).[`parse`]($ZodStringInternals.md#parse)

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

[`$ZodStringInternals`]($ZodStringInternals.md).[`run`]($ZodStringInternals.md#run)
