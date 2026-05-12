# Type Alias: $ZodBranded\<T, Brand, Dir\>

> **$ZodBranded**\<`T`, `Brand`, `Dir`\> = `T` & `Dir` *extends* `"inout"` ? `object` : `Dir` *extends* `"in"` ? `object` : `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/core.d.cts:25

## Type Parameters

### T

`T` *extends* [`SomeType`](SomeType.md)

### Brand

`Brand` *extends* `string` \| `number` \| `symbol`

### Dir

`Dir` *extends* `"in"` \| `"out"` \| `"inout"` = `"out"`
