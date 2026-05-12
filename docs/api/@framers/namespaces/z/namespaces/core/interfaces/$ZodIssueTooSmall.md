# Interface: $ZodIssueTooSmall\<Input\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:26

## Extends

- [`$ZodIssueBase`]($ZodIssueBase.md)

## Type Parameters

### Input

`Input` = `unknown`

## Properties

### code

> `readonly` **code**: `"too_small"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:27

#### Overrides

[`$ZodIssueBase`]($ZodIssueBase.md).[`code`]($ZodIssueBase.md#code)

***

### exact?

> `readonly` `optional` **exact**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:33

True if the allowed value is fixed (e.g.` z.length(5)`), not a range (`z.minLength(5)`)

***

### inclusive?

> `readonly` `optional` **inclusive**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:31

True if the allowable range includes the minimum

***

### input?

> `readonly` `optional` **input**: `Input`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:34

#### Overrides

[`$ZodIssueBase`]($ZodIssueBase.md).[`input`]($ZodIssueBase.md#input)

***

### message

> `readonly` **message**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:10

#### Inherited from

[`$ZodIssueBase`]($ZodIssueBase.md).[`message`]($ZodIssueBase.md#message)

***

### minimum

> `readonly` **minimum**: `number` \| `bigint`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:29

***

### origin

> `readonly` **origin**: `"string"` \| `"number"` \| `"bigint"` \| `"file"` \| `string` & `object` \| `"int"` \| `"date"` \| `"array"` \| `"set"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:28

***

### path

> `readonly` **path**: `PropertyKey`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:9

#### Inherited from

[`$ZodIssueBase`]($ZodIssueBase.md).[`path`]($ZodIssueBase.md#path)
