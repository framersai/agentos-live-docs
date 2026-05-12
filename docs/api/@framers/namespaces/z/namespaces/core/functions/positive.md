# Function: \_positive()

> **\_positive**(`params?`): [`$ZodCheckGreaterThan`](../interfaces/$ZodCheckGreaterThan.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:164

## Parameters

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../../util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../../util/type-aliases/Numeric.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckGreaterThan`](../interfaces/$ZodCheckGreaterThan.md)
