# Type Alias: CheckTypeParams\<T, AlsoOmit\>

> **CheckTypeParams**\<`T`, `AlsoOmit`\> = [`Params`](Params.md)\<`T`, `NonNullable`\<`T`\[`"_zod"`\]\[`"isst"`\] \| `T`\[`"_zod"`\]\[`"issc"`\]\>, `"type"` \| `"checks"` \| `"error"` \| `"check"` \| `AlsoOmit`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:19

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md) & [`$ZodCheck`](../interfaces/$ZodCheck.md) = [`$ZodType`](../interfaces/$ZodType-1.md) & [`$ZodCheck`](../interfaces/$ZodCheck.md)

### AlsoOmit

`AlsoOmit` *extends* `Exclude`\<keyof `T`\[`"_zod"`\]\[`"def"`\], `"type"` \| `"checks"` \| `"error"` \| `"check"`\> = `never`
