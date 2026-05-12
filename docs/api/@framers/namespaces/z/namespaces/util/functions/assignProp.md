# Function: assignProp()

> **assignProp**\<`T`, `K`\>(`target`, `prop`, `value`): `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:127

## Type Parameters

### T

`T` *extends* `object`

### K

`K` *extends* `PropertyKey`

## Parameters

### target

`T`

### prop

`K`

### value

`K` *extends* keyof `T` ? `T`\[`K`\<`K`\>\] : `any`

## Returns

`void`
