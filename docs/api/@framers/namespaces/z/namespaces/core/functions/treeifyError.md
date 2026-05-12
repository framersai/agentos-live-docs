# Function: treeifyError()

## Call Signature

> **treeifyError**\<`T`\>(`error`): [`$ZodErrorTree`](../type-aliases/$ZodErrorTree.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:184

### Type Parameters

#### T

`T`

### Parameters

#### error

[`$ZodError`](../interfaces/$ZodError.md)\<`T`\>

### Returns

[`$ZodErrorTree`](../type-aliases/$ZodErrorTree.md)\<`T`\>

## Call Signature

> **treeifyError**\<`T`, `U`\>(`error`, `mapper?`): [`$ZodErrorTree`](../type-aliases/$ZodErrorTree.md)\<`T`, `U`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:185

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

[`$ZodErrorTree`](../type-aliases/$ZodErrorTree.md)\<`T`, `U`\>
