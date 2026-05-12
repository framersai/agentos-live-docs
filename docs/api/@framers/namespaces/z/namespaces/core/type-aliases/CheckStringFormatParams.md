# Type Alias: CheckStringFormatParams\<T, AlsoOmit\>

> **CheckStringFormatParams**\<`T`, `AlsoOmit`\> = [`Params`](Params.md)\<`T`, `NonNullable`\<`T`\[`"_zod"`\]\[`"issc"`\]\>, `"type"` \| `"coerce"` \| `"checks"` \| `"error"` \| `"check"` \| `"format"` \| `AlsoOmit`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:18

## Type Parameters

### T

`T` *extends* [`$ZodStringFormat`](../interfaces/$ZodStringFormat.md) = [`$ZodStringFormat`](../interfaces/$ZodStringFormat.md)

### AlsoOmit

`AlsoOmit` *extends* `Exclude`\<keyof `T`\[`"_zod"`\]\[`"def"`\], `"type"` \| `"coerce"` \| `"checks"` \| `"error"` \| `"check"` \| `"format"`\> = `never`
