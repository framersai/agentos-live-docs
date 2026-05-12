# Function: \_check()

> **\_check**\<`O`\>(`fn`, `params?`): [`$ZodCheck`](../interfaces/$ZodCheck.md)\<`O`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:286

## Type Parameters

### O

`O` = `unknown`

## Parameters

### fn

[`CheckFn`](../type-aliases/CheckFn.md)\<`O`\>

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../type-aliases/$ZodIssue.md)\>\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; `when?`: (`payload`) => `boolean`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../type-aliases/$ZodIssue.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### params?

`Record`\<`string`, `any`\>

#### path?

`PropertyKey`[]

#### when?

(`payload`) => `boolean`

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

## Returns

[`$ZodCheck`](../interfaces/$ZodCheck.md)\<`O`\>
