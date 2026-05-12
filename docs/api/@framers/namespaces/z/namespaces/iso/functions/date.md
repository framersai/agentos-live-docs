# Function: date()

> **date**(`params?`): [`ZodISODate`](../../../interfaces/ZodISODate.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/iso.d.cts:12

## Parameters

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodISODate`](../../../interfaces/ZodISODate.md)
