# Function: set()

> **set**\<`Value`\>(`valueType`, `params?`): [`ZodSet`](../interfaces/ZodSet.md)\<`Value`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:535

## Type Parameters

### Value

`Value` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

## Parameters

### valueType

`Value`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodSet`](../interfaces/ZodSet.md)\<`Value`\>
