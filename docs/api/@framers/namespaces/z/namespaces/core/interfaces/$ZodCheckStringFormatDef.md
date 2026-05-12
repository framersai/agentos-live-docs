# Interface: $ZodCheckStringFormatDef\<Format\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:161

## Extends

- [`$ZodCheckDef`]($ZodCheckDef.md)

## Extended by

- [`$ZodStringFormatDef`]($ZodStringFormatDef.md)
- [`$ZodCheckRegexDef`]($ZodCheckRegexDef.md)
- [`$ZodCheckLowerCaseDef`]($ZodCheckLowerCaseDef.md)
- [`$ZodCheckUpperCaseDef`]($ZodCheckUpperCaseDef.md)
- [`$ZodCheckIncludesDef`]($ZodCheckIncludesDef.md)
- [`$ZodCheckStartsWithDef`]($ZodCheckStartsWithDef.md)
- [`$ZodCheckEndsWithDef`]($ZodCheckEndsWithDef.md)

## Type Parameters

### Format

`Format` *extends* `string` = `string`

## Properties

### abort?

> `optional` **abort**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`abort`]($ZodCheckDef.md#abort)

***

### check

> **check**: `"string_format"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:162

#### Overrides

[`$ZodCheckDef`]($ZodCheckDef.md).[`check`]($ZodCheckDef.md#check)

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:7

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`error`]($ZodCheckDef.md#error)

***

### format

> **format**: `Format`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:163

***

### pattern?

> `optional` **pattern**: `RegExp`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:164

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

[`$ZodCheckDef`]($ZodCheckDef.md).[`when`]($ZodCheckDef.md#when)
