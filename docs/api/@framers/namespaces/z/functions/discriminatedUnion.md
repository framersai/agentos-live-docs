# Function: discriminatedUnion()

> **discriminatedUnion**\<`Types`, `Disc`\>(`discriminator`, `options`, `params?`): [`ZodDiscriminatedUnion`](../interfaces/ZodDiscriminatedUnion.md)\<`Types`, `Disc`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:493

## Type Parameters

### Types

`Types` *extends* readonly \[[`$ZodTypeDiscriminable`](../namespaces/core/interfaces/$ZodTypeDiscriminable.md), [`$ZodTypeDiscriminable`](../namespaces/core/interfaces/$ZodTypeDiscriminable.md)\]

### Disc

`Disc` *extends* `string`

## Parameters

### discriminator

`Disc`

### options

`Types`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../namespaces/core/type-aliases/$ZodIssueInvalidUnion.md)\>\>; `inclusive?`: `boolean`; `message?`: `string`; `unionFallback?`: `boolean`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../namespaces/core/type-aliases/$ZodIssueInvalidUnion.md)\>\>

#### inclusive?

`boolean`

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### unionFallback?

`boolean`

## Returns

[`ZodDiscriminatedUnion`](../interfaces/ZodDiscriminatedUnion.md)\<`Types`, `Disc`\>
