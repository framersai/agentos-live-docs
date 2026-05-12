# Function: formatError()

## Call Signature

> **formatError**\<`T`\>(`error`): [`$ZodFormattedError`](../type-aliases/$ZodFormattedError.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:164

### Type Parameters

#### T

`T`

### Parameters

#### error

[`$ZodError`](../interfaces/$ZodError.md)\<`T`\>

### Returns

[`$ZodFormattedError`](../type-aliases/$ZodFormattedError.md)\<`T`\>

## Call Signature

> **formatError**\<`T`, `U`\>(`error`, `mapper?`): [`$ZodFormattedError`](../type-aliases/$ZodFormattedError.md)\<`T`, `U`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:165

### Type Parameters

#### T

`T`

#### U

`U`

### Parameters

#### error

[`$ZodError`](../interfaces/$ZodError.md)\<`T`\>

#### mapper?

(`issue`) => `U`

### Returns

[`$ZodFormattedError`](../type-aliases/$ZodFormattedError.md)\<`T`, `U`\>
