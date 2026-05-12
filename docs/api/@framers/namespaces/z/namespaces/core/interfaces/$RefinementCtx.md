# Interface: $RefinementCtx\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:282

## Extends

- [`ParsePayload`](ParsePayload.md)\<`T`\>

## Type Parameters

### T

`T` = `unknown`

## Properties

### aborted?

> `optional` **aborted**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:27

A may to mark a whole payload as aborted. Used in codecs/pipes.

#### Inherited from

[`ParsePayload`](ParsePayload.md).[`aborted`](ParsePayload.md#aborted)

***

### issues

> **issues**: (\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../../util/type-aliases/Primitive.md)[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \})[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:25

#### Inherited from

[`ParsePayload`](ParsePayload.md).[`issues`](ParsePayload.md#issues)

***

### value

> **value**: `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:24

#### Inherited from

[`ParsePayload`](ParsePayload.md).[`value`](ParsePayload.md#value)

## Methods

### addIssue()

> **addIssue**(`arg`): `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:283

#### Parameters

##### arg

`string` |

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../type-aliases/$ZodStringFormats.md); `input?`: `string`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \}

###### code

`"invalid_format"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### format

`string` & `object` \| [`$ZodStringFormats`](../type-aliases/$ZodStringFormats.md)

###### input?

`string`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### path?

`PropertyKey`[]

###### pattern?

`string`

|

\{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input?`: `Record`\<`string`, `unknown`\>; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \}

###### code

`"unrecognized_keys"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### input?

`Record`\<`string`, `unknown`\>

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### keys

`string`[]

###### message?

`string`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

###### code

`"invalid_union"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### discriminator?

`string`

###### errors

[`$ZodIssue`](../type-aliases/$ZodIssue.md)[][]

###### inclusive?

`true`

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

###### code

`"invalid_union"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### discriminator?

`string`

###### errors

\[\]

###### inclusive

`false`

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../type-aliases/$ZodInvalidTypeExpected.md); `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

###### code

`"invalid_type"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### expected

[`$ZodInvalidTypeExpected`](../type-aliases/$ZodInvalidTypeExpected.md)

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

###### code

`"too_big"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### exact?

`boolean`

###### inclusive?

`boolean`

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### maximum

`number` \| `bigint`

###### message?

`string`

###### origin

`"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

###### code

`"too_small"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### exact?

`boolean`

True if the allowed value is fixed (e.g.` z.length(5)`), not a range (`z.minLength(5)`)

###### inclusive?

`boolean`

True if the allowable range includes the minimum

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### minimum

`number` \| `bigint`

###### origin

`"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input?`: `number` \| `bigint`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

###### code

`"not_multiple_of"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### divisor

`number`

###### input?

`number` \| `bigint`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \}

###### code

`"invalid_key"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### issues

[`$ZodIssue`](../type-aliases/$ZodIssue.md)[]

###### message?

`string`

###### origin

`"map"` \| `"record"`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \}

###### code

`"invalid_element"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### issues

[`$ZodIssue`](../type-aliases/$ZodIssue.md)[]

###### key

`unknown`

###### message?

`string`

###### origin

`"map"` \| `"set"`

###### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../../util/type-aliases/Primitive.md)[]; \}

###### code

`"invalid_value"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### path?

`PropertyKey`[]

###### values

[`Primitive`](../../util/type-aliases/Primitive.md)[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input?`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \}

###### code

`"custom"`

###### continue?

`boolean`

If `true`, Zod will execute subsequent checks/refinements instead of immediately aborting

###### input?

`unknown`

###### inst?

[`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

###### message?

`string`

###### params?

`Record`\<`string`, `any`\>

###### path?

`PropertyKey`[]

#### Returns

`void`
