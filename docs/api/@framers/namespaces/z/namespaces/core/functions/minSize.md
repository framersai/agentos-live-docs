# Function: \_minSize()

> **\_minSize**(`minimum`, `params?`): [`$ZodCheckMinSize`](../interfaces/$ZodCheckMinSize.md)\<[`HasSize`](../../util/type-aliases/HasSize.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:173

## Parameters

### minimum

`number`

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<[`HasSize`](../../util/type-aliases/HasSize.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<[`HasSize`](../../util/type-aliases/HasSize.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckMinSize`](../interfaces/$ZodCheckMinSize.md)\<[`HasSize`](../../util/type-aliases/HasSize.md)\>
