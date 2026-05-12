# Type Alias: CleanKey\<T\>

> **CleanKey**\<`T`\> = `T` *extends* `` `?${infer K}` `` ? `K` : `T` *extends* `` `${infer K}?` `` ? `K` : `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:162

## Type Parameters

### T

`T` *extends* `PropertyKey`
