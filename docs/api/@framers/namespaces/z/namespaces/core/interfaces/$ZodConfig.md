# Interface: $ZodConfig

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/core.d.cts:61

## Properties

### customError?

> `optional` **customError**: [`$ZodErrorMap`]($ZodErrorMap.md)\<[`$ZodIssue`](../type-aliases/$ZodIssue.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/core.d.cts:63

Custom error map. Overrides `config().localeError`.

***

### jitless?

> `optional` **jitless**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/core.d.cts:67

Disable JIT schema compilation. Useful in environments that disallow `eval`.

***

### localeError?

> `optional` **localeError**: [`$ZodErrorMap`]($ZodErrorMap.md)\<[`$ZodIssue`](../type-aliases/$ZodIssue.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/core.d.cts:65

Localized error map. Lowest priority.
