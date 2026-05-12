# Type Alias: Extend\<A, B\>

> **Extend**\<`A`, `B`\> = [`Flatten`](Flatten.md)\<keyof `A` & keyof `B` *extends* `never` ? `A` & `B` : `{ [K in keyof A as K extends keyof B ? never : K]: A[K] }` & `{ [K in keyof B]: B[K] }`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:60

## Type Parameters

### A

`A` *extends* [`SomeObject`](SomeObject.md)

### B

`B` *extends* [`SomeObject`](SomeObject.md)
