# Function: uuidv6()

> **uuidv6**(`params?`): [`ZodUUID`](../interfaces/ZodUUID.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:187

## Parameters

### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

#### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

## Returns

[`ZodUUID`](../interfaces/ZodUUID.md)
