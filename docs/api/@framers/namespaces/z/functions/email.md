# Function: email()

> **email**(`params?`): [`ZodEmail`](../interfaces/ZodEmail.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:175

## Parameters

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>; `message?`: `string`; `pattern?`: `RegExp`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### pattern?

`RegExp`

## Returns

[`ZodEmail`](../interfaces/ZodEmail.md)
