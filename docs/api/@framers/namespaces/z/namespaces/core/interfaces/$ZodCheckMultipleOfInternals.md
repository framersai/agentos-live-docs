# Interface: $ZodCheckMultipleOfInternals\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:54

## Extends

- [`$ZodCheckInternals`]($ZodCheckInternals.md)\<`T`\>

## Type Parameters

### T

`T` *extends* `number` \| `bigint` = `number` \| `bigint`

## Properties

### def

> **def**: [`$ZodCheckMultipleOfDef`]($ZodCheckMultipleOfDef.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:55

#### Overrides

[`$ZodCheckInternals`]($ZodCheckInternals.md).[`def`]($ZodCheckInternals.md#def)

***

### issc

> **issc**: [`$ZodIssueNotMultipleOf`]($ZodIssueNotMultipleOf.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:56

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

[`ParsePayload`](ParsePayload.md)\<`T`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodCheckInternals`]($ZodCheckInternals.md).[`check`]($ZodCheckInternals.md#check)
