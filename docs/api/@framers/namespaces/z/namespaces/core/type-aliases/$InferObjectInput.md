# Type Alias: $InferObjectInput\<T, Extra\>

> **$InferObjectInput**\<`T`, `Extra`\> = `string` *extends* keyof `T` ? [`IsAny`](../../util/type-aliases/IsAny.md)\<`T`\[keyof `T`\]\> *extends* `true` ? `Record`\<`string`, `unknown`\> : `Record`\<`string`, [`input`](input.md)\<`T`\[keyof `T`\]\>\> : keyof `T` & `Extra` *extends* `never` ? `Record`\<`string`, `never`\> : [`Prettify`](../../util/type-aliases/Prettify.md)\<`{ -readonly [k in keyof T as T[k] extends OptionalInSchema ? never : k]: T[k]["_zod"]["input"] }` & `{ -readonly [k in keyof T as T[k] extends OptionalInSchema ? k : never]?: T[k]["_zod"]["input"] }` & `Extra`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:562

## Type Parameters

### T

`T` *extends* [`$ZodLooseShape`]($ZodLooseShape.md)

### Extra

`Extra` *extends* `Record`\<`string`, `unknown`\>
