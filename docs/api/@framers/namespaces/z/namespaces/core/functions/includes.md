# Function: \_includes()

> **\_includes**(`includes`, `params?`): [`$ZodCheckIncludes`](../interfaces/$ZodCheckIncludes.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:189

## Parameters

### includes

`string`

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `position?`: `number`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### position?

`number`

## Returns

[`$ZodCheckIncludes`](../interfaces/$ZodCheckIncludes.md)
