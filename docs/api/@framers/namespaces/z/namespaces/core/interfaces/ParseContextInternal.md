# Interface: ParseContextInternal\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:18

**`Internal`**

## Extends

- [`ParseContext`](ParseContext.md)\<`T`\>

## Type Parameters

### T

`T` *extends* [`$ZodIssueBase`]($ZodIssueBase.md) = `never`

## Properties

### async?

> `readonly` `optional` **async**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:19

***

### direction?

> `readonly` `optional` **direction**: `"forward"` \| `"backward"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:20

***

### error?

> `readonly` `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:11

Customize error messages.

#### Inherited from

[`ParseContext`](ParseContext.md).[`error`](ParseContext.md#error)

***

### jitless?

> `readonly` `optional` **jitless**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:15

Skip eval-based fast path. Default `false`.

#### Inherited from

[`ParseContext`](ParseContext.md).[`jitless`](ParseContext.md#jitless)

***

### reportInput?

> `readonly` `optional` **reportInput**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:13

Include the `input` field in issue objects. Default `false`.

#### Inherited from

[`ParseContext`](ParseContext.md).[`reportInput`](ParseContext.md#reportinput)

***

### skipChecks?

> `readonly` `optional` **skipChecks**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:21
