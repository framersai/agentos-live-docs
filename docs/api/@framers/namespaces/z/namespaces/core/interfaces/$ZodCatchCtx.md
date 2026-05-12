# Interface: $ZodCatchCtx

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:941

## Extends

- [`ParsePayload`](ParsePayload.md)

## Properties

### aborted?

> `optional` **aborted**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:27

A may to mark a whole payload as aborted. Used in codecs/pipes.

#### Inherited from

[`ParsePayload`](ParsePayload.md).[`aborted`](ParsePayload.md#aborted)

***

### ~~error~~

> **error**: `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:943

#### ~~issues~~

> **issues**: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]

#### Deprecated

Use `ctx.issues`

***

### ~~input~~

> **input**: `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:947

#### Deprecated

Use `ctx.value`

***

### issues

> **issues**: (\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../../util/type-aliases/Primitive.md)[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`]($ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`]($ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \})[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:25

#### Inherited from

[`ParsePayload`](ParsePayload.md).[`issues`](ParsePayload.md#issues)

***

### value

> **value**: `unknown`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:24

#### Inherited from

[`ParsePayload`](ParsePayload.md).[`value`](ParsePayload.md#value)
