# Function: \_uint64()

> **\_uint64**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:132

## Type Parameters

### T

`T` *extends* [`$ZodBigIntFormat`](../interfaces/$ZodBigIntFormat.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>; `message?`: `string`; `when?`: (`payload`) => `boolean`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### when?

(`payload`) => `boolean`

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

## Returns

`T`
