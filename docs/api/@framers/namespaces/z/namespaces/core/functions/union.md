# Function: \_union()

> **\_union**\<`T`\>(`Class`, `options`, `params?`): [`$ZodUnion`](../interfaces/$ZodUnion.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:210

## Type Parameters

### T

`T` *extends* readonly [`$ZodObject`](../interfaces/$ZodObject.md)\<`Readonly`\<`Readonly`\<\{\[`k`: `string`\]: [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>; \}\>\>, [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)\>[]

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodUnion`](../interfaces/$ZodUnion.md)\<readonly [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>[]\>\>

### options

`T`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../type-aliases/$ZodIssueInvalidUnion.md)\>\>; `inclusive?`: `boolean`; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidUnion`](../type-aliases/$ZodIssueInvalidUnion.md)\>\>

#### inclusive?

`boolean`

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodUnion`](../interfaces/$ZodUnion.md)\<`T`\>
