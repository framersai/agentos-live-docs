# Function: map()

> **map**\<`Key`, `Value`\>(`keyType`, `valueType`, `params?`): [`ZodMap`](../interfaces/ZodMap.md)\<`Key`, `Value`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:526

## Type Parameters

### Key

`Key` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

### Value

`Value` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

## Parameters

### keyType

`Key`

### valueType

`Value`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidKey`](../namespaces/core/interfaces/$ZodIssueInvalidKey.md)\<`unknown`\> \| [`$ZodIssueInvalidElement`](../namespaces/core/interfaces/$ZodIssueInvalidElement.md)\<`unknown`\>\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueInvalidKey`](../namespaces/core/interfaces/$ZodIssueInvalidKey.md)\<`unknown`\> \| [`$ZodIssueInvalidElement`](../namespaces/core/interfaces/$ZodIssueInvalidElement.md)\<`unknown`\>\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodMap`](../interfaces/ZodMap.md)\<`Key`, `Value`\>
