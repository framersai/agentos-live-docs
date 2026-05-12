# Function: \_uppercase()

> **\_uppercase**(`params?`): [`$ZodCheckUpperCase`](../interfaces/$ZodCheckUpperCase.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:187

## Parameters

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `pattern?`: `RegExp`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### pattern?

`RegExp`

## Returns

[`$ZodCheckUpperCase`](../interfaces/$ZodCheckUpperCase.md)
