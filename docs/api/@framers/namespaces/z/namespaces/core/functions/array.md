# Function: \_array()

> **\_array**\<`T`\>(`Class`, `element`, `params?`): [`$ZodArray`](../interfaces/$ZodArray.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:207

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodArray`](../interfaces/$ZodArray.md)\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\>\>

### element

`T`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodArray`](../interfaces/$ZodArray.md)\<`T`\>
