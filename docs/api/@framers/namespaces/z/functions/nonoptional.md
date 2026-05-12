# Function: nonoptional()

> **nonoptional**\<`T`\>(`innerType`, `params?`): [`ZodNonOptional`](../interfaces/ZodNonOptional.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:617

## Type Parameters

### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

## Parameters

### innerType

`T`

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

[`ZodNonOptional`](../interfaces/ZodNonOptional.md)\<`T`\>
