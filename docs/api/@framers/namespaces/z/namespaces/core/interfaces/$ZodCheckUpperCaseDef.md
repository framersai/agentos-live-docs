# Interface: $ZodCheckUpperCaseDef

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:196

## Extends

- [`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md)\<`"uppercase"`\>

## Properties

### abort?

> `optional` **abort**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`abort`]($ZodCheckStringFormatDef.md#abort)

***

### check

> **check**: `"string_format"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:162

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`check`]($ZodCheckStringFormatDef.md#check)

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:7

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`error`]($ZodCheckStringFormatDef.md#error)

***

### format

> **format**: `"uppercase"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:163

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`format`]($ZodCheckStringFormatDef.md#format-1)

***

### pattern?

> `optional` **pattern**: `RegExp`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:164

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`pattern`]($ZodCheckStringFormatDef.md#pattern)

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

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`when`]($ZodCheckStringFormatDef.md#when)
