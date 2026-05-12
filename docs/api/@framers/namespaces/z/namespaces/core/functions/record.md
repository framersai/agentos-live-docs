# Function: \_record()

> **\_record**\<`Key`, `Value`\>(`Class`, `keyType`, `valueType`, `params?`): [`$ZodRecord`](../interfaces/$ZodRecord.md)\<`Key`, `Value`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:227

## Type Parameters

### Key

`Key` *extends* [`$ZodRecordKey`](../type-aliases/$ZodRecordKey.md)

### Value

`Value` *extends* [`$ZodObject`](../interfaces/$ZodObject.md)\<`Readonly`\<`Readonly`\<\{\[`k`: `string`\]: [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>; \}\>\>, [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodRecord`](../interfaces/$ZodRecord.md)\<[`$ZodRecordKey`](../type-aliases/$ZodRecordKey.md), [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\>\>

### keyType

`Key`

### valueType

`Value`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidKey`](../interfaces/$ZodIssueInvalidKey.md)\<`Record`\<`PropertyKey`, `unknown`\>\>\>\>; `message?`: `string`; `mode?`: `"strict"` \| `"loose"`; \}

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidKey`](../interfaces/$ZodIssueInvalidKey.md)\<`Record`\<`PropertyKey`, `unknown`\>\>\>\>

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

[`$ZodRecord`](../interfaces/$ZodRecord.md)\<`Key`, `Value`\>
