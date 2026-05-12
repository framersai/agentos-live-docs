# Type Alias: CheckParams\<T, AlsoOmit\>

> **CheckParams**\<`T`, `AlsoOmit`\> = [`Params`](Params.md)\<`T`, `NonNullable`\<`T`\[`"_zod"`\]\[`"issc"`\]\>, `"check"` \| `"error"` \| `AlsoOmit`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:15

## Type Parameters

### T

`T` *extends* [`$ZodCheck`](../interfaces/$ZodCheck.md) = [`$ZodCheck`](../interfaces/$ZodCheck.md)

### AlsoOmit

`AlsoOmit` *extends* `Exclude`\<keyof `T`\[`"_zod"`\]\[`"def"`\], `"check"` \| `"error"`\> = `never`
