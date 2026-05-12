# Type Alias: $InferObjectOutput\<T, Extra\>

> **$InferObjectOutput**\<`T`, `Extra`\> = `string` *extends* keyof `T` ? [`IsAny`](../../util/type-aliases/IsAny.md)\<`T`\[keyof `T`\]\> *extends* `true` ? `Record`\<`string`, `unknown`\> : `Record`\<`string`, [`output`](output.md)\<`T`\[keyof `T`\]\>\> : keyof `T` & `Extra` *extends* `never` ? `Record`\<`string`, `never`\> : [`Prettify`](../../util/type-aliases/Prettify.md)\<`{ -readonly [k in keyof T as T[k] extends OptionalOutSchema ? never : k]: T[k]["_zod"]["output"] }` & `{ -readonly [k in keyof T as T[k] extends OptionalOutSchema ? k : never]?: T[k]["_zod"]["output"] }` & `Extra`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:557

## Type Parameters

### T

`T` *extends* [`$ZodLooseShape`]($ZodLooseShape.md)

### Extra

`Extra` *extends* `Record`\<`string`, `unknown`\>
