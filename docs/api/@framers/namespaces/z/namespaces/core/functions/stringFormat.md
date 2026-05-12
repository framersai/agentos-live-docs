# Function: \_stringFormat()

> **\_stringFormat**\<`Format`\>(`Class`, `format`, `fnOrRegex`, `_params?`): [`$ZodCustomStringFormat`](../interfaces/$ZodCustomStringFormat.md)\<`Format`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:304

## Type Parameters

### Format

`Format` *extends* `string`

## Parameters

### Class

[`$constructor`](../interfaces/$constructor.md)\<[`$ZodCustomStringFormat`](../interfaces/$ZodCustomStringFormat.md)\<`string`\>, [`$ZodCustomStringFormatDef`](../interfaces/$ZodCustomStringFormatDef.md)\<`string`\>\>

### format

`Format`

### fnOrRegex

`RegExp` | (`arg`) => `unknown`

### \_params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCustomStringFormat`](../interfaces/$ZodCustomStringFormat.md)\<`Format`\>
