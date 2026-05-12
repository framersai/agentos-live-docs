# Interface: $ZodCheckRegexInternals

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:178

## Extends

- [`$ZodCheckInternals`]($ZodCheckInternals.md)\<`string`\>

## Properties

### def

> **def**: [`$ZodCheckRegexDef`]($ZodCheckRegexDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:179

#### Overrides

[`$ZodCheckInternals`]($ZodCheckInternals.md).[`def`]($ZodCheckInternals.md#def)

***

### issc

> **issc**: [`$ZodIssueInvalidStringFormat`]($ZodIssueInvalidStringFormat.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:180

The set of issues this check might throw.

#### Overrides

[`$ZodCheckInternals`]($ZodCheckInternals.md).[`issc`]($ZodCheckInternals.md#issc)

***

### onattach

> **onattach**: (`schema`) => `void`[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:18

#### Parameters

##### schema

[`$ZodType`]($ZodType-1.md)

#### Returns

`void`

#### Inherited from

[`$ZodCheckInternals`]($ZodCheckInternals.md).[`onattach`]($ZodCheckInternals.md#onattach)

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`string`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodCheckInternals`]($ZodCheckInternals.md).[`check`]($ZodCheckInternals.md#check)
