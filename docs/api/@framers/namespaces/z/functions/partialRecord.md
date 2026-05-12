# Function: partialRecord()

> **partialRecord**\<`Key`, `Value`\>(`keyType`, `valueType`, `params?`): [`ZodRecord`](../interfaces/ZodRecord.md)\<`Key` & [`$partial`](../namespaces/core/type-aliases/$partial.md), `Value`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:514

## Type Parameters

### Key

`Key` *extends* [`$ZodRecordKey`](../namespaces/core/type-aliases/$ZodRecordKey.md)

### Value

`Value` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

## Parameters

### keyType

`Key`

### valueType

`Value`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidKey`](../namespaces/core/interfaces/$ZodIssueInvalidKey.md)\<`Record`\<`PropertyKey`, `unknown`\>\>\>\>; `message?`: `string`; `mode?`: `"strict"` \| `"loose"`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidKey`](../namespaces/core/interfaces/$ZodIssueInvalidKey.md)\<`Record`\<`PropertyKey`, `unknown`\>\>\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### mode?

`"strict"` \| `"loose"`

**Default**

```ts
"strict" - errors on keys not matching keyType. "loose" passes through non-matching keys unchanged.
```

## Returns

[`ZodRecord`](../interfaces/ZodRecord.md)\<`Key` & [`$partial`](../namespaces/core/type-aliases/$partial.md), `Value`\>
