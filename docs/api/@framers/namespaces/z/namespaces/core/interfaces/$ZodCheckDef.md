# Interface: $ZodCheckDef

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:5

## Extended by

- [`$ZodCustomDef`]($ZodCustomDef.md)
- [`$ZodCheckLessThanDef`]($ZodCheckLessThanDef.md)
- [`$ZodCheckGreaterThanDef`]($ZodCheckGreaterThanDef.md)
- [`$ZodCheckMultipleOfDef`]($ZodCheckMultipleOfDef.md)
- [`$ZodCheckNumberFormatDef`]($ZodCheckNumberFormatDef.md)
- [`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md)
- [`$ZodCheckMaxSizeDef`]($ZodCheckMaxSizeDef.md)
- [`$ZodCheckMinSizeDef`]($ZodCheckMinSizeDef.md)
- [`$ZodCheckSizeEqualsDef`]($ZodCheckSizeEqualsDef.md)
- [`$ZodCheckMaxLengthDef`]($ZodCheckMaxLengthDef.md)
- [`$ZodCheckMinLengthDef`]($ZodCheckMinLengthDef.md)
- [`$ZodCheckLengthEqualsDef`]($ZodCheckLengthEqualsDef.md)
- [`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md)
- [`$ZodCheckPropertyDef`]($ZodCheckPropertyDef.md)
- [`$ZodCheckMimeTypeDef`]($ZodCheckMimeTypeDef.md)
- [`$ZodCheckOverwriteDef`]($ZodCheckOverwriteDef.md)

## Properties

### abort?

> `optional` **abort**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

***

### check

> **check**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:6

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:7

***

### when()?

> `optional` **when**: (`payload`) => `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:11

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)

#### Returns

`boolean`
