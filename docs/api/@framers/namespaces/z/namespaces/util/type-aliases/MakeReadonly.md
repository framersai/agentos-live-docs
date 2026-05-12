# Type Alias: MakeReadonly\<T\>

> **MakeReadonly**\<`T`\> = `T` *extends* `Map`\<infer K, infer V\> ? `ReadonlyMap`\<`K`, `V`\> : `T` *extends* `Set`\<infer V\> ? `ReadonlySet`\<`V`\> : `T` *extends* \[infer Head, `...(infer Tail)`\] ? readonly \[`Head`, `...Tail`\] : `T` *extends* infer V[] ? `ReadonlyArray`\<`V`\> : `T` *extends* [`BuiltIn`](BuiltIn.md) ? `T` : `Readonly`\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:42

## Type Parameters

### T

`T`
