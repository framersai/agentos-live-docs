# Function: string()

> **string**\<`T`\>(`params?`): [`ZodCoercedString`](../../../interfaces/ZodCoercedString.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/coerce.d.cts:5

## Type Parameters

### T

`T` = `unknown`

## Parameters

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodCoercedString`](../../../interfaces/ZodCoercedString.md)\<`T`\>
