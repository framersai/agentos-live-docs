# Function: looseObject()

> **looseObject**\<`T`\>(`shape`, `params?`): [`ZodObject`](../interfaces/ZodObject.md)\<`T`, [`$loose`](../namespaces/core/type-aliases/$loose.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:471

## Type Parameters

### T

`T` *extends* [`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md)

## Parameters

### shape

`T`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueUnrecognizedKeys`](../namespaces/core/interfaces/$ZodIssueUnrecognizedKeys.md)\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueUnrecognizedKeys`](../namespaces/core/interfaces/$ZodIssueUnrecognizedKeys.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodObject`](../interfaces/ZodObject.md)\<`T`, [`$loose`](../namespaces/core/type-aliases/$loose.md)\>
