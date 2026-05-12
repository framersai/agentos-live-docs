# Function: \_minLength()

> **\_minLength**(`minimum`, `params?`): [`$ZodCheckMinLength`](../interfaces/$ZodCheckMinLength.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:179

## Parameters

### minimum

`number`

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckMinLength`](../interfaces/$ZodCheckMinLength.md)\<[`HasLength`](../../util/type-aliases/HasLength.md)\>
