# Interface: ParseContext\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:9

## Extended by

- [`ParseContextInternal`](ParseContextInternal.md)

## Type Parameters

### T

`T` *extends* [`$ZodIssueBase`]($ZodIssueBase.md) = `never`

## Properties

### error?

> `readonly` `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:11

Customize error messages.

***

### jitless?

> `readonly` `optional` **jitless**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:15

Skip eval-based fast path. Default `false`.

***

### reportInput?

> `readonly` `optional` **reportInput**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:13

Include the `input` field in issue objects. Default `false`.
