# Function: \_int()

> **\_int**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:118

## Type Parameters

### T

`T` *extends* [`$ZodNumberFormat`](../interfaces/$ZodNumberFormat.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

`T`
