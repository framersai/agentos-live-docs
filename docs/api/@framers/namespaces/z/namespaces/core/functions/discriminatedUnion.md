# Function: \_discriminatedUnion()

> **\_discriminatedUnion**\<`Types`, `Disc`\>(`Class`, `discriminator`, `options`, `params?`): [`$ZodDiscriminatedUnion`](../interfaces/$ZodDiscriminatedUnion.md)\<`Types`, `Disc`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:220

## Type Parameters

### Types

`Types` *extends* \[[`$ZodTypeDiscriminable`](../interfaces/$ZodTypeDiscriminable.md), `...$ZodTypeDiscriminable[]`\]

### Disc

`Disc` *extends* `string`

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodDiscriminatedUnion`](../interfaces/$ZodDiscriminatedUnion.md)\<readonly [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>[], `string`\>\>

### discriminator

`Disc`

### options

`Types`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../type-aliases/$ZodIssueInvalidUnion.md)\>\>; `inclusive?`: `boolean`; `message?`: `string`; `unionFallback?`: `boolean`; \}

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../type-aliases/$ZodIssueInvalidUnion.md)\>\>

#### inclusive?

`boolean`

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### unionFallback?

`boolean`

## Returns

[`$ZodDiscriminatedUnion`](../interfaces/$ZodDiscriminatedUnion.md)\<`Types`, `Disc`\>
