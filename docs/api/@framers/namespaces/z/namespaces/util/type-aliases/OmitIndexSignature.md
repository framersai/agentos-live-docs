# Type Alias: OmitIndexSignature\<T\>

> **OmitIndexSignature**\<`T`\> = `{ [K in keyof T as string extends K ? never : K extends string ? K : never]: T[K] }`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:70

## Type Parameters

### T

`T`
