# Type Alias: Normalize\<T\>

> **Normalize**\<`T`\> = `T` *extends* `undefined` ? `never` : `T` *extends* `Record`\<`any`, `any`\> ? [`Flatten`](Flatten.md)\<\{ \[k in keyof Omit\<T, "error" \| "message"\>\]: T\[k\] \} & `"error"` *extends* keyof `T` ? `object` : `unknown`\> : `never`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:153

## Type Parameters

### T

`T`
