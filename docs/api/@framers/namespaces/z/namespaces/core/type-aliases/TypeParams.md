# Type Alias: TypeParams\<T, AlsoOmit\>

> **TypeParams**\<`T`, `AlsoOmit`\> = [`Params`](Params.md)\<`T`, `NonNullable`\<`T`\[`"_zod"`\]\[`"isst"`\]\>, `"type"` \| `"checks"` \| `"error"` \| `AlsoOmit`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:12

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md) = [`$ZodType`](../interfaces/$ZodType-1.md) & `object`

### AlsoOmit

`AlsoOmit` *extends* `Exclude`\<keyof `T`\[`"_zod"`\]\[`"def"`\], `"type"` \| `"checks"` \| `"error"`\> = `never`
