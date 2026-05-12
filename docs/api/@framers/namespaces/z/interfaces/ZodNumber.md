# Interface: \_ZodNumber\<Internals\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:286

## Extends

- [`_ZodType`](ZodType.md)\<`Internals`\>

## Extended by

- [`ZodNumber`](ZodNumber-1.md)
- [`ZodCoercedNumber`](ZodCoercedNumber.md)

## Type Parameters

### Internals

`Internals` *extends* [`$ZodNumberInternals`](../namespaces/core/interfaces/$ZodNumberInternals.md) = [`$ZodNumberInternals`](../namespaces/core/interfaces/$ZodNumberInternals.md)

## Properties

### ~~\_def~~

> **\_def**: `Internals`\[`"def"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`_ZodType`](ZodType.md).[`_def`](ZodType.md#_def)

***

### ~~\_input~~

> **\_input**: `Internals`\[`"input"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`_ZodType`](ZodType.md).[`_input`](ZodType.md#_input)

***

### ~~\_output~~

> **\_output**: `Internals`\[`"output"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`_ZodType`](ZodType.md).[`_output`](ZodType.md#_output)

***

### \_zod

> **\_zod**: `Internals`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:93

#### Inherited from

[`_ZodType`](ZodType.md).[`_zod`](ZodType.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Inherited from

[`_ZodType`](ZodType.md).[`~standard`](ZodType.md#standard)

***

### def

> **def**: `Internals`\[`"def"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`_ZodType`](ZodType.md).[`def`](ZodType.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`_ZodType`](ZodType.md).[`description`](ZodType.md#description)

***

### format

> **format**: `string` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:314

***

### ~~isFinite~~

> **isFinite**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:313

#### Deprecated

Number schemas no longer accept infinite values, so this always returns `true`.

***

### ~~isInt~~

> **isInt**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:311

#### Deprecated

Check the `format` property instead.

***

### maxValue

> **maxValue**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:309

***

### minValue

> **minValue**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:308

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`spa`](ZodType.md#spa)

***

### type

> **type**: `Internals`\[`"def"`\]\[`"type"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`_ZodType`](ZodType.md).[`type`](ZodType.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`_ZodNumber`\<`Internals`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`_ZodNumber`\<`Internals`\>, `T`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`and`](ZodType.md#and)

***

### apply()

> **apply**\<`T`\>(`fn`): `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:82

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`schema`) => `T`

#### Returns

`T`

#### Inherited from

[`_ZodType`](ZodType.md).[`apply`](ZodType.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`array`](ZodType.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `_ZodNumber`\<`Internals`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`_ZodNumber`\<`Internals`\>, `T`, `Dir`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:24

#### Type Parameters

##### T

`T` *extends* `PropertyKey` = `PropertyKey`

##### Dir

`Dir` *extends* `"inout"` \| `"in"` \| `"out"` = `"out"`

#### Parameters

##### value?

`T`

#### Returns

`PropertyKey` *extends* `T` ? `_ZodNumber`\<`Internals`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`_ZodNumber`\<`Internals`\>, `T`, `Dir`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`brand`](ZodType.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`_ZodNumber`\<`Internals`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`catch`](ZodType.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`_ZodNumber`\<`Internals`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`catch`](ZodType.md#catch)

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>)[]

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`check`](ZodType.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

`Internals`\[`"def"`\]

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`clone`](ZodType.md#clone)

***

### decode()

> **decode**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`decode`](ZodType.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`decodeAsync`](ZodType.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`_ZodNumber`\<`Internals`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`default`](ZodType.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`_ZodNumber`\<`Internals`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`default`](ZodType.md#default)

***

### describe()

> **describe**(`description`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:59

Returns a new instance that has been registered in `z.globalRegistry` with the specified description

#### Parameters

##### description

`string`

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`describe`](ZodType.md#describe)

***

### encode()

> **encode**(`data`, `params?`): [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`encode`](ZodType.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`encodeAsync`](ZodType.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`exactOptional`](ZodType.md#exactoptional)

***

### ~~finite()~~

> **finite**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:307

#### Parameters

##### params?

`unknown`

#### Returns

`this`

#### Deprecated

In v4 and later, z.number() does not allow infinite values by default. This is a no-op.

***

### gt()

> **gt**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:287

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### gte()

> **gte**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:289

Identical to .min()

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### int()

> **int**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:296

Consider `z.int()` instead. This API is considered *legacy*; it will never be removed but a better alternative exists.

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### ~~isNullable()~~

> **isNullable**(): `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:81

#### Returns

`boolean`

#### Deprecated

Try safe-parsing `null` (this is what `isNullable` does internally):

```ts
const schema = z.string().nullable();
const isNullable = schema.safeParse(null).success; // true
```

#### Inherited from

[`_ZodType`](ZodType.md).[`isNullable`](ZodType.md#isnullable)

***

### ~~isOptional()~~

> **isOptional**(): `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:72

#### Returns

`boolean`

#### Deprecated

Try safe-parsing `undefined` (this is what `isOptional` does internally):

```ts
const schema = z.string().optional();
const isOptional = schema.safeParse(undefined).success; // true
```

#### Inherited from

[`_ZodType`](ZodType.md).[`isOptional`](ZodType.md#isoptional)

***

### lt()

> **lt**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:291

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### lte()

> **lte**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:293

Identical to .max()

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### max()

> **max**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:294

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`_ZodType`](ZodType.md).[`meta`](ZodType.md#meta)

#### Call Signature

> **meta**(`data`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:64

Returns a new instance that has been registered in `z.globalRegistry` with the specified metadata

##### Parameters

###### data

###### deprecated?

`boolean`

###### description?

`string`

###### id?

`string`

###### title?

`string`

##### Returns

`this`

##### Inherited from

[`_ZodType`](ZodType.md).[`meta`](ZodType.md#meta)

***

### min()

> **min**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:290

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### multipleOf()

> **multipleOf**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:303

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueNotMultipleOf`](../namespaces/core/interfaces/$ZodIssueNotMultipleOf.md)\<`number` \| `bigint`\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueNotMultipleOf`](../namespaces/core/interfaces/$ZodIssueNotMultipleOf.md)\<`number` \| `bigint`\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### negative()

> **negative**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:301

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### nonnegative()

> **nonnegative**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:300

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:43

#### Parameters

##### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

[`ZodNonOptional`](ZodNonOptional.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`nonoptional`](ZodType.md#nonoptional)

***

### nonpositive()

> **nonpositive**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:302

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`nullable`](ZodType.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`nullish`](ZodType.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`optional`](ZodType.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`_ZodNumber`\<`Internals`\>, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`_ZodNumber`\<`Internals`\>, `T`\]\>

#### Inherited from

[`_ZodType`](ZodType.md).[`or`](ZodType.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`overwrite`](ZodType.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`parse`](ZodType.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`parseAsync`](ZodType.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`_ZodNumber`\<`Internals`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`_ZodNumber`\<`Internals`\>, `T`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`pipe`](ZodType.md#pipe)

***

### positive()

> **positive**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:299

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`Numeric`](../namespaces/util/type-aliases/Numeric.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`_ZodNumber`\<`Internals`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`prefault`](ZodType.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`_ZodNumber`\<`Internals`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`prefault`](ZodType.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`readonly`](ZodType.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `_ZodNumber`\<`Internals`\> & [`ZodType`](ZodType-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>\> : `_ZodNumber`\<`Internals`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:38

#### Type Parameters

##### Ch

`Ch` *extends* (`arg`) => `unknown`

#### Parameters

##### check

`Ch`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; `when?`: (`payload`) => `boolean`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### params?

`Record`\<`string`, `any`\>

###### path?

`PropertyKey`[]

###### when?

(`payload`) => `boolean`

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

#### Returns

`Ch` *extends* (`arg`) => `arg is R` ? `_ZodNumber`\<`Internals`\> & [`ZodType`](ZodType-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>\> : `_ZodNumber`\<`Internals`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`refine`](ZodType.md#refine)

***

### register()

> **register**\<`R`\>(`registry`, ...`meta`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:23

#### Type Parameters

##### R

`R` *extends* [`$ZodRegistry`](../namespaces/core/classes/$ZodRegistry.md)\<`MetadataType`, [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\>

#### Parameters

##### registry

`R`

##### meta

...`_ZodNumber`\<`Internals`\> *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `_ZodNumber`\<`Internals`\>\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `_ZodNumber`\<`Internals`\>\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`register`](ZodType.md#register)

***

### ~~safe()~~

> **safe**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:298

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Deprecated

This is now identical to `.int()`. Only numbers in the safe integer range are accepted.

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeDecode`](ZodType.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeDecodeAsync`](ZodType.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeEncode`](ZodType.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeEncodeAsync`](ZodType.md#safeencodeasync)

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeParse`](ZodType.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeParseAsync`](ZodType.md#safeparseasync)

***

### ~~step()~~

> **step**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:305

#### Parameters

##### value

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueNotMultipleOf`](../namespaces/core/interfaces/$ZodIssueNotMultipleOf.md)\<`number` \| `bigint`\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueNotMultipleOf`](../namespaces/core/interfaces/$ZodIssueNotMultipleOf.md)\<`number` \| `bigint`\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Deprecated

Use `.multipleOf()` instead.

***

### superRefine()

> **superRefine**(`refinement`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:39

#### Parameters

##### refinement

(`arg`, `ctx`) => `void` \| `Promise`\<`void`\>

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`superRefine`](ZodType.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`_ZodNumber`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`_ZodNumber`\<`Internals`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`toJSONSchema`](ZodType.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`_ZodNumber`\<`Internals`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`_ZodNumber`\<`Internals`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`transform`](ZodType.md#transform)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodNumber`\<`Internals`\>\>\>)[]

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`with`](ZodType.md#with)
