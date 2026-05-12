# Function: \_uuidv6()

> **\_uuidv6**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:39

## Type Parameters

### T

`T` *extends* [`$ZodUUID`](../interfaces/$ZodUUID.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

|

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

## Returns

`T`
