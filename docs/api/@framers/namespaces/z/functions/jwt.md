# Function: jwt()

> **jwt**(`params?`): [`ZodJWT`](../interfaces/ZodJWT.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:274

## Parameters

### params?

`string` |

\{ `abort?`: `boolean`; `alg?`: [`JWTAlgorithm`](../namespaces/util/type-aliases/JWTAlgorithm.md); `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### alg?

[`JWTAlgorithm`](../namespaces/util/type-aliases/JWTAlgorithm.md)

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodJWT`](../interfaces/ZodJWT.md)
