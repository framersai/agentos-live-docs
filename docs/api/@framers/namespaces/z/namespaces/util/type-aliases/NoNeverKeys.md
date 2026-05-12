# Type Alias: NoNeverKeys\<T\>

> **NoNeverKeys**\<`T`\> = `{ [k in keyof T]: [T[k]] extends [never] ? never : k }`\[keyof `T`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:54

## Type Parameters

### T

`T`
