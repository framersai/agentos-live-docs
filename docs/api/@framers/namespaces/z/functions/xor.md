# Function: xor()

> **xor**\<`T`\>(`options`, `params?`): [`ZodXor`](../interfaces/ZodXor.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:486

Creates an exclusive union (XOR) where exactly one option must match.
Unlike regular unions that succeed when any option matches, xor fails if
zero or more than one option matches the input.

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

[`ZodXor`](../interfaces/ZodXor.md)\<`T`\>
