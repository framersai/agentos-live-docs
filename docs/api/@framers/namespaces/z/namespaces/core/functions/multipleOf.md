# Function: \_multipleOf()

> **\_multipleOf**(`value`, `params?`): [`$ZodCheckMultipleOf`](../interfaces/$ZodCheckMultipleOf.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:169

## Parameters

### value

`number` | `bigint`

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueNotMultipleOf`](../interfaces/$ZodIssueNotMultipleOf.md)\<`number` \| `bigint`\>\>; `message?`: `string`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueNotMultipleOf`](../interfaces/$ZodIssueNotMultipleOf.md)\<`number` \| `bigint`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckMultipleOf`](../interfaces/$ZodCheckMultipleOf.md)
