# Function: keyof()

> **keyof**\<`T`\>(`schema`): [`ZodEnum`](../interfaces/ZodEnum.md)\<\{ \[k in string \| number\]: \{ \[k in string \| number\]: k \}\[k\] \}\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:427

## Type Parameters

### T

`T` *extends* [`ZodObject`](../interfaces/ZodObject.md)\<[`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md), [`$strip`](../namespaces/core/type-aliases/$strip.md)\>

## Parameters

### schema

`T`

## Returns

[`ZodEnum`](../interfaces/ZodEnum.md)\<\{ \[k in string \| number\]: \{ \[k in string \| number\]: k \}\[k\] \}\>
