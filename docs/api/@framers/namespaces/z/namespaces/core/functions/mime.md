# Function: \_mime()

> **\_mime**(`types`, `params?`): [`$ZodCheckMimeType`](../interfaces/$ZodCheckMimeType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:199

## Parameters

### types

[`MimeTypes`](../../util/type-aliases/MimeTypes.md)[]

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckMimeType`](../interfaces/$ZodCheckMimeType.md)
