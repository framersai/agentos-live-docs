# Function: \_maxLength()

> **\_maxLength**(`maximum`, `params?`): [`$ZodCheckMaxLength`](../interfaces/$ZodCheckMaxLength.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:177

## Parameters

### maximum

`number`

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckMaxLength`](../interfaces/$ZodCheckMaxLength.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>
