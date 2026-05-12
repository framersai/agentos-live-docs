# Type Alias: $replace\<Meta, S\>

> **$replace**\<`Meta`, `S`\> = `Meta` *extends* [`$output`]($output.md) ? [`output`](output.md)\<`S`\> : `Meta` *extends* [`$input`]($input.md) ? [`input`](input.md)\<`S`\> : `Meta` *extends* infer M[] ? `$replace`\<`M`, `S`\>[] : `Meta` *extends* (...`args`) => infer R ? (...`args`) => `$replace`\<`R`, `S`\> : `Meta` *extends* `object` ? `{ [K in keyof Meta]: $replace<Meta[K], S> }` : `Meta`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:7

## Type Parameters

### Meta

`Meta`

### S

`S` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)
