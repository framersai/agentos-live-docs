# Function: union()

> **union**\<`T`\>(`options`, `params?`): [`ZodUnion`](../interfaces/ZodUnion.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:477

## Type Parameters

### T

`T` *extends* readonly [`SomeType`](../namespaces/core/type-aliases/SomeType.md)[]

## Parameters

### options

`T`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../namespaces/core/type-aliases/$ZodIssueInvalidUnion.md)\>\>; `inclusive?`: `boolean`; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../namespaces/core/type-aliases/$ZodIssueInvalidUnion.md)\>\>

#### inclusive?

`boolean`

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodUnion`](../interfaces/ZodUnion.md)\<`T`\>
