# Type Alias: Params\<T, IssueTypes, OmitKeys\>

> **Params**\<`T`, `IssueTypes`, `OmitKeys`\> = [`Flatten`](../../util/type-aliases/Flatten.md)\<`Partial`\<[`EmptyToNever`](../../util/type-aliases/EmptyToNever.md)\<`Omit`\<`T`\[`"_zod"`\]\[`"def"`\], `OmitKeys`\> & \[`IssueTypes`\] *extends* \[`never`\] ? `object` : `object`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:7

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md) \| [`$ZodCheck`](../interfaces/$ZodCheck.md)

### IssueTypes

`IssueTypes` *extends* [`$ZodIssueBase`](../interfaces/$ZodIssueBase.md)

### OmitKeys

`OmitKeys` *extends* keyof `T`\[`"_zod"`\]\[`"def"`\] = `never`
