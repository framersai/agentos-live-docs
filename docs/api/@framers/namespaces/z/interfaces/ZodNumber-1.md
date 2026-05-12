# Interface: ZodNumber

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:316

## Extends

- [`_ZodNumber`](ZodNumber.md)\<[`$ZodNumberInternals`](../namespaces/core/interfaces/$ZodNumberInternals.md)\<`number`\>\>

## Extended by

- [`ZodNumberFormat`](ZodNumberFormat.md)

## Properties

### ~~\_def~~

> **\_def**: [`$ZodNumberDef`](../namespaces/core/interfaces/$ZodNumberDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`_def`](ZodNumber.md#_def)

***

### ~~\_input~~

> **\_input**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`_input`](ZodNumber.md#_input)

***

### ~~\_output~~

> **\_output**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`_output`](ZodNumber.md#_output)

***

### \_zod

> **\_zod**: [`$ZodNumberInternals`](../namespaces/core/interfaces/$ZodNumberInternals.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:93

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`_zod`](ZodNumber.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`~standard`](ZodNumber.md#standard)

***

### def

> **def**: [`$ZodNumberDef`](../namespaces/core/interfaces/$ZodNumberDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`def`](ZodNumber.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`description`](ZodNumber.md#description)

***

### format

> **format**: `string` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:314

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`format`](ZodNumber.md#format)

***

### ~~isFinite~~

> **isFinite**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:313

#### Deprecated

Number schemas no longer accept infinite values, so this always returns `true`.

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`isFinite`](ZodNumber.md#isfinite)

***

### ~~isInt~~

> **isInt**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:311

#### Deprecated

Check the `format` property instead.

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`isInt`](ZodNumber.md#isint)

***

### maxValue

> **maxValue**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:309

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`maxValue`](ZodNumber.md#maxvalue)

***

### minValue

> **minValue**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:308

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`minValue`](ZodNumber.md#minvalue)

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`spa`](ZodNumber.md#spa)

***

### type

> **type**: `"number"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`type`](ZodNumber.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodNumber`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodNumber`, `T`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`and`](ZodNumber.md#and)

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

[`_ZodNumber`](ZodNumber.md).[`apply`](ZodNumber.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`array`](ZodNumber.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodNumber` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodNumber`, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodNumber` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodNumber`, `T`, `Dir`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`brand`](ZodNumber.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

`number`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodNumber`\>

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`catch`](ZodNumber.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => `number`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodNumber`\>

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`catch`](ZodNumber.md#catch)

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<`number`\> \| [`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<`number`\>)[]

#### Returns

`this`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`check`](ZodNumber.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodNumberDef`](../namespaces/core/interfaces/$ZodNumberDef.md)

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`clone`](ZodNumber.md#clone)

***

### decode()

> **decode**(`data`, `params?`): `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`number`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`decode`](ZodNumber.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`decodeAsync`](ZodNumber.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

`number`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodNumber`\>

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`default`](ZodNumber.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => `number`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodNumber`\>

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`default`](ZodNumber.md#default)

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

[`_ZodNumber`](ZodNumber.md).[`describe`](ZodNumber.md#describe)

***

### encode()

> **encode**(`data`, `params?`): `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`number`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`encode`](ZodNumber.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`encodeAsync`](ZodNumber.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`exactOptional`](ZodNumber.md#exactoptional)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`finite`](ZodNumber.md#finite)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`gt`](ZodNumber.md#gt)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`gte`](ZodNumber.md#gte)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`int`](ZodNumber.md#int)

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

[`_ZodNumber`](ZodNumber.md).[`isNullable`](ZodNumber.md#isnullable)

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

[`_ZodNumber`](ZodNumber.md).[`isOptional`](ZodNumber.md#isoptional)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`lt`](ZodNumber.md#lt)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`lte`](ZodNumber.md#lte)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`max`](ZodNumber.md#max)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`meta`](ZodNumber.md#meta)

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

[`_ZodNumber`](ZodNumber.md).[`meta`](ZodNumber.md#meta)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`min`](ZodNumber.md#min)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`multipleOf`](ZodNumber.md#multipleof)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`negative`](ZodNumber.md#negative)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`nonnegative`](ZodNumber.md#nonnegative)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodNumber`\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`nonoptional`](ZodNumber.md#nonoptional)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`nonpositive`](ZodNumber.md#nonpositive)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`nullable`](ZodNumber.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodNumber`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodNumber`\>\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`nullish`](ZodNumber.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`optional`](ZodNumber.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodNumber`, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodNumber`, `T`\]\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`or`](ZodNumber.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => `number`

#### Returns

`this`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`overwrite`](ZodNumber.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`number`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`parse`](ZodNumber.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`parseAsync`](ZodNumber.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodNumber`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `number`\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `number`\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodNumber`, `T`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`pipe`](ZodNumber.md#pipe)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`positive`](ZodNumber.md#positive)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => `number`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodNumber`\>

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`prefault`](ZodNumber.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

`number`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodNumber`\>

##### Inherited from

[`_ZodNumber`](ZodNumber.md).[`prefault`](ZodNumber.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`readonly`](ZodNumber.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodNumber` & [`ZodType`](ZodType-1.md)\<`R`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `number`\>\> : `ZodNumber`

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodNumber` & [`ZodType`](ZodType-1.md)\<`R`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `number`\>\> : `ZodNumber`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`refine`](ZodNumber.md#refine)

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

...`ZodNumber` *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodNumber`\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodNumber`\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`register`](ZodNumber.md#register)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safe`](ZodNumber.md#safe)

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safeDecode`](ZodNumber.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safeDecodeAsync`](ZodNumber.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safeEncode`](ZodNumber.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

`number`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safeEncodeAsync`](ZodNumber.md#safeencodeasync)

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safeParse`](ZodNumber.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`number`\>\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`safeParseAsync`](ZodNumber.md#safeparseasync)

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

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`step`](ZodNumber.md#step)

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

[`_ZodNumber`](ZodNumber.md).[`superRefine`](ZodNumber.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodNumber`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodNumber`\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`toJSONSchema`](ZodNumber.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodNumber`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `number`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodNumber`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `number`\>\>

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`transform`](ZodNumber.md#transform)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<`number`\> \| [`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<`number`\>)[]

#### Returns

`this`

#### Inherited from

[`_ZodNumber`](ZodNumber.md).[`with`](ZodNumber.md#with)
