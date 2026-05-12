# Interface: $ZodCheckInternals\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:13

## Extended by

- [`$ZodCustomInternals`]($ZodCustomInternals.md)
- [`$ZodCheckLessThanInternals`]($ZodCheckLessThanInternals.md)
- [`$ZodCheckGreaterThanInternals`]($ZodCheckGreaterThanInternals.md)
- [`$ZodCheckMultipleOfInternals`]($ZodCheckMultipleOfInternals.md)
- [`$ZodCheckNumberFormatInternals`]($ZodCheckNumberFormatInternals.md)
- [`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md)
- [`$ZodCheckMaxSizeInternals`]($ZodCheckMaxSizeInternals.md)
- [`$ZodCheckMinSizeInternals`]($ZodCheckMinSizeInternals.md)
- [`$ZodCheckSizeEqualsInternals`]($ZodCheckSizeEqualsInternals.md)
- [`$ZodCheckMaxLengthInternals`]($ZodCheckMaxLengthInternals.md)
- [`$ZodCheckMinLengthInternals`]($ZodCheckMinLengthInternals.md)
- [`$ZodCheckLengthEqualsInternals`]($ZodCheckLengthEqualsInternals.md)
- [`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md)
- [`$ZodCheckRegexInternals`]($ZodCheckRegexInternals.md)
- [`$ZodCheckLowerCaseInternals`]($ZodCheckLowerCaseInternals.md)
- [`$ZodCheckUpperCaseInternals`]($ZodCheckUpperCaseInternals.md)
- [`$ZodCheckIncludesInternals`]($ZodCheckIncludesInternals.md)
- [`$ZodCheckStartsWithInternals`]($ZodCheckStartsWithInternals.md)
- [`$ZodCheckEndsWithInternals`]($ZodCheckEndsWithInternals.md)
- [`$ZodCheckEndsWith`]($ZodCheckEndsWith.md)
- [`$ZodCheckPropertyInternals`]($ZodCheckPropertyInternals.md)
- [`$ZodCheckMimeTypeInternals`]($ZodCheckMimeTypeInternals.md)
- [`$ZodCheckOverwriteInternals`]($ZodCheckOverwriteInternals.md)

## Type Parameters

### T

`T`

## Properties

### def

> **def**: [`$ZodCheckDef`]($ZodCheckDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:14

***

### issc?

> `optional` **issc**: [`$ZodIssueBase`]($ZodIssueBase.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:16

The set of issues this check might throw.

***

### onattach

> **onattach**: (`schema`) => `void`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:18

#### Parameters

##### schema

[`$ZodType`]($ZodType-1.md)

#### Returns

`void`

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`T`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>
