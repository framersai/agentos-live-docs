# Function: issue()

## Call Signature

> **issue**(`_iss`, `input`, `inst`): \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../type-aliases/Primitive.md)[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \}

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:188

### Parameters

#### \_iss

`string`

#### input

`any`

#### inst

`any`

### Returns

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_format"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### format

> `readonly` **format**: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md)

#### input

> `readonly` **input**: `string` \| `undefined`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

#### pattern?

> `readonly` `optional` **pattern**: `string`

\{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"unrecognized_keys"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `Record`\<`string`, `unknown`\> \| `undefined`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### keys

> `readonly` **keys**: `string`[]

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_union"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### discriminator?

> `readonly` `optional` **discriminator**: `string`

#### errors

> `readonly` **errors**: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]

#### inclusive?

> `readonly` `optional` **inclusive**: `true`

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_union"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### discriminator?

> `readonly` `optional` **discriminator**: `string`

#### errors

> `readonly` **errors**: \[\]

#### inclusive

> `readonly` **inclusive**: `false`

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_type"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### expected

> `readonly` **expected**: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md)

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"too_big"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### exact?

> `readonly` `optional` **exact**: `boolean`

#### inclusive?

> `readonly` `optional` **inclusive**: `boolean`

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### maximum

> `readonly` **maximum**: `number` \| `bigint`

#### message?

> `readonly` `optional` **message**: `string`

#### origin

> `readonly` **origin**: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"too_small"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### exact?

> `readonly` `optional` **exact**: `boolean`

True if the allowed value is fixed (e.g.` z.length(5)`), not a range (`z.minLength(5)`)

#### inclusive?

> `readonly` `optional` **inclusive**: `boolean`

True if the allowable range includes the minimum

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### minimum

> `readonly` **minimum**: `number` \| `bigint`

#### origin

> `readonly` **origin**: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"not_multiple_of"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### divisor

> `readonly` **divisor**: `number`

#### input

> `readonly` **input**: `number` \| `bigint` \| `undefined`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_key"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### issues

> `readonly` **issues**: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]

#### message?

> `readonly` `optional` **message**: `string`

#### origin

> `readonly` **origin**: `"map"` \| `"record"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_element"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### issues

> `readonly` **issues**: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]

#### key

> `readonly` **key**: `unknown`

#### message?

> `readonly` `optional` **message**: `string`

#### origin

> `readonly` **origin**: `"map"` \| `"set"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../type-aliases/Primitive.md)[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_value"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

#### values

> `readonly` **values**: [`Primitive`](../type-aliases/Primitive.md)[]

\{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"custom"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### params?

> `readonly` `optional` **params**: `Record`\<`string`, `any`\>

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

## Call Signature

> **issue**(`_iss`): \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../type-aliases/Primitive.md)[]; \} \| \{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \}

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:189

### Parameters

#### \_iss

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \}

##### code

`"invalid_format"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### format

`string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md)

##### input

`string` \| `undefined`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### path?

`PropertyKey`[]

##### pattern?

`string`

|

\{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \}

##### code

`"unrecognized_keys"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### input

`Record`\<`string`, `unknown`\> \| `undefined`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### keys

`string`[]

##### message?

`string`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

##### code

`"invalid_union"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### discriminator?

`string`

##### errors

[`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]

##### inclusive?

`true`

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

##### code

`"invalid_union"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### discriminator?

`string`

##### errors

\[\]

##### inclusive

`false`

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

##### code

`"invalid_type"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### expected

[`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md)

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

##### code

`"too_big"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### exact?

`boolean`

##### inclusive?

`boolean`

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### maximum

`number` \| `bigint`

##### message?

`string`

##### origin

`"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

##### code

`"too_small"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### exact?

`boolean`

True if the allowed value is fixed (e.g.` z.length(5)`), not a range (`z.minLength(5)`)

##### inclusive?

`boolean`

True if the allowable range includes the minimum

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### minimum

`number` \| `bigint`

##### origin

`"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

##### code

`"not_multiple_of"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### divisor

`number`

##### input

`number` \| `bigint` \| `undefined`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \}

##### code

`"invalid_key"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### issues

[`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]

##### message?

`string`

##### origin

`"map"` \| `"record"`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \}

##### code

`"invalid_element"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### issues

[`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]

##### key

`unknown`

##### message?

`string`

##### origin

`"map"` \| `"set"`

##### path?

`PropertyKey`[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../type-aliases/Primitive.md)[]; \}

##### code

`"invalid_value"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### path?

`PropertyKey`[]

##### values

[`Primitive`](../type-aliases/Primitive.md)[]

|

\{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \}

##### code

`"custom"`

##### continue?

`boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

##### input

`unknown`

The input data

##### inst?

[`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

##### message?

`string`

##### params?

`Record`\<`string`, `any`\>

##### path?

`PropertyKey`[]

### Returns

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_format"`; `continue?`: `boolean`; `format`: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md); `input`: `string` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `pattern?`: `string`; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_format"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### format

> `readonly` **format**: `string` & `object` \| [`$ZodStringFormats`](../../core/type-aliases/$ZodStringFormats.md)

#### input

> `readonly` **input**: `string` \| `undefined`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

#### pattern?

> `readonly` `optional` **pattern**: `string`

\{\[`key`: `string`\]: `unknown`; `code`: `"unrecognized_keys"`; `continue?`: `boolean`; `input`: `Record`\<`string`, `unknown`\> \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `keys`: `string`[]; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"unrecognized_keys"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `Record`\<`string`, `unknown`\> \| `undefined`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### keys

> `readonly` **keys**: `string`[]

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]; `inclusive?`: `true`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_union"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### discriminator?

> `readonly` `optional` **discriminator**: `string`

#### errors

> `readonly` **errors**: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[][]

#### inclusive?

> `readonly` `optional` **inclusive**: `true`

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_union"`; `continue?`: `boolean`; `discriminator?`: `string`; `errors`: \[\]; `inclusive`: `false`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_union"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### discriminator?

> `readonly` `optional` **discriminator**: `string`

#### errors

> `readonly` **errors**: \[\]

#### inclusive

> `readonly` **inclusive**: `false`

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_type"`; `continue?`: `boolean`; `expected`: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md); `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_type"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### expected

> `readonly` **expected**: [`$ZodInvalidTypeExpected`](../../core/type-aliases/$ZodInvalidTypeExpected.md)

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"too_big"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `maximum`: `number` \| `bigint`; `message?`: `string`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"too_big"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### exact?

> `readonly` `optional` **exact**: `boolean`

#### inclusive?

> `readonly` `optional` **inclusive**: `boolean`

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### maximum

> `readonly` **maximum**: `number` \| `bigint`

#### message?

> `readonly` `optional` **message**: `string`

#### origin

> `readonly` **origin**: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"too_small"`; `continue?`: `boolean`; `exact?`: `boolean`; `inclusive?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `minimum`: `number` \| `bigint`; `origin`: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"too_small"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### exact?

> `readonly` `optional` **exact**: `boolean`

True if the allowed value is fixed (e.g.` z.length(5)`), not a range (`z.minLength(5)`)

#### inclusive?

> `readonly` `optional` **inclusive**: `boolean`

True if the allowable range includes the minimum

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### minimum

> `readonly` **minimum**: `number` \| `bigint`

#### origin

> `readonly` **origin**: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"not_multiple_of"`; `continue?`: `boolean`; `divisor`: `number`; `input`: `number` \| `bigint` \| `undefined`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"not_multiple_of"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### divisor

> `readonly` **divisor**: `number`

#### input

> `readonly` **input**: `number` \| `bigint` \| `undefined`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_key"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `message?`: `string`; `origin`: `"map"` \| `"record"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_key"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### issues

> `readonly` **issues**: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]

#### message?

> `readonly` `optional` **message**: `string`

#### origin

> `readonly` **origin**: `"map"` \| `"record"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_element"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `issues`: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]; `key`: `unknown`; `message?`: `string`; `origin`: `"map"` \| `"set"`; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_element"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### issues

> `readonly` **issues**: [`$ZodIssue`](../../core/type-aliases/$ZodIssue.md)[]

#### key

> `readonly` **key**: `unknown`

#### message?

> `readonly` `optional` **message**: `string`

#### origin

> `readonly` **origin**: `"map"` \| `"set"`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

\{\[`key`: `string`\]: `unknown`; `code`: `"invalid_value"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `path?`: `PropertyKey`[]; `values`: [`Primitive`](../type-aliases/Primitive.md)[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"invalid_value"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]

#### values

> `readonly` **values**: [`Primitive`](../type-aliases/Primitive.md)[]

\{\[`key`: `string`\]: `unknown`; `code`: `"custom"`; `continue?`: `boolean`; `input`: `unknown`; `inst?`: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; \}

### Index Signature

\[`key`: `string`\]: `unknown`

#### code

> `readonly` **code**: `"custom"`

#### continue?

> `readonly` `optional` **continue**: `boolean`

If `true`, Zod will continue executing checks/refinements after this issue.

#### input

> `readonly` **input**: `unknown`

The input data

#### inst?

> `readonly` `optional` **inst**: [`$ZodType`](../../core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../../core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| [`$ZodCheck`](../../core/interfaces/$ZodCheck.md)\<`never`\>

The schema or check that originated this issue.

#### message?

> `readonly` `optional` **message**: `string`

#### params?

> `readonly` `optional` **params**: `Record`\<`string`, `any`\>

#### path?

> `readonly` `optional` **path**: `PropertyKey`[]
