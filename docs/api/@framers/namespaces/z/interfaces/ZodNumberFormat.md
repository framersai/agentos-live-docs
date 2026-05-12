# Interface: ZodNumberFormat

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:320

## Extends

- [`ZodNumber`](ZodNumber-1.md)

## Extended by

- [`ZodInt`](ZodInt.md)
- [`ZodFloat32`](ZodFloat32.md)
- [`ZodFloat64`](ZodFloat64.md)
- [`ZodInt32`](ZodInt32.md)
- [`ZodUInt32`](ZodUInt32.md)

## Properties

### ~~\_def~~

> **\_def**: [`$ZodNumberDef`](../namespaces/core/interfaces/$ZodNumberDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`_def`](ZodNumber-1.md#_def)

***

### ~~\_input~~

> **\_input**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`_input`](ZodNumber-1.md#_input)

***

### ~~\_output~~

> **\_output**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`_output`](ZodNumber-1.md#_output)

***

### \_zod

> **\_zod**: [`$ZodNumberFormatInternals`](../namespaces/core/interfaces/$ZodNumberFormatInternals.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:321

#### Overrides

[`ZodNumber`](ZodNumber-1.md).[`_zod`](ZodNumber-1.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`~standard`](ZodNumber-1.md#standard)

***

### def

> **def**: [`$ZodNumberDef`](../namespaces/core/interfaces/$ZodNumberDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`def`](ZodNumber-1.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`description`](ZodNumber-1.md#description)

***

### format

> **format**: `string` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:314

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`format`](ZodNumber-1.md#format)

***

### ~~isFinite~~

> **isFinite**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:313

#### Deprecated

Number schemas no longer accept infinite values, so this always returns `true`.

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`isFinite`](ZodNumber-1.md#isfinite)

***

### ~~isInt~~

> **isInt**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:311

#### Deprecated

Check the `format` property instead.

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`isInt`](ZodNumber-1.md#isint)

***

### maxValue

> **maxValue**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:309

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`maxValue`](ZodNumber-1.md#maxvalue)

***

### minValue

> **minValue**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:308

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`minValue`](ZodNumber-1.md#minvalue)

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

[`ZodNumber`](ZodNumber-1.md).[`spa`](ZodNumber-1.md#spa)

***

### type

> **type**: `"number"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`type`](ZodNumber-1.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodNumberFormat`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodNumberFormat`, `T`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`and`](ZodNumber-1.md#and)

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

[`ZodNumber`](ZodNumber-1.md).[`apply`](ZodNumber-1.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`array`](ZodNumber-1.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodNumberFormat` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodNumberFormat`, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodNumberFormat` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodNumberFormat`, `T`, `Dir`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`brand`](ZodNumber-1.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

`number`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodNumberFormat`\>

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`catch`](ZodNumber-1.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => `number`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodNumberFormat`\>

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`catch`](ZodNumber-1.md#catch)

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

[`ZodNumber`](ZodNumber-1.md).[`check`](ZodNumber-1.md#check)

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

[`ZodNumber`](ZodNumber-1.md).[`clone`](ZodNumber-1.md#clone)

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

[`ZodNumber`](ZodNumber-1.md).[`decode`](ZodNumber-1.md#decode)

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

[`ZodNumber`](ZodNumber-1.md).[`decodeAsync`](ZodNumber-1.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

`number`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodNumberFormat`\>

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`default`](ZodNumber-1.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => `number`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodNumberFormat`\>

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`default`](ZodNumber-1.md#default)

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

[`ZodNumber`](ZodNumber-1.md).[`describe`](ZodNumber-1.md#describe)

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

[`ZodNumber`](ZodNumber-1.md).[`encode`](ZodNumber-1.md#encode)

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

[`ZodNumber`](ZodNumber-1.md).[`encodeAsync`](ZodNumber-1.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`exactOptional`](ZodNumber-1.md#exactoptional)

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

[`ZodNumber`](ZodNumber-1.md).[`finite`](ZodNumber-1.md#finite)

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

[`ZodNumber`](ZodNumber-1.md).[`gt`](ZodNumber-1.md#gt)

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

[`ZodNumber`](ZodNumber-1.md).[`gte`](ZodNumber-1.md#gte)

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

[`ZodNumber`](ZodNumber-1.md).[`int`](ZodNumber-1.md#int)

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

[`ZodNumber`](ZodNumber-1.md).[`isNullable`](ZodNumber-1.md#isnullable)

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

[`ZodNumber`](ZodNumber-1.md).[`isOptional`](ZodNumber-1.md#isoptional)

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

[`ZodNumber`](ZodNumber-1.md).[`lt`](ZodNumber-1.md#lt)

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

[`ZodNumber`](ZodNumber-1.md).[`lte`](ZodNumber-1.md#lte)

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

[`ZodNumber`](ZodNumber-1.md).[`max`](ZodNumber-1.md#max)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`meta`](ZodNumber-1.md#meta)

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

[`ZodNumber`](ZodNumber-1.md).[`meta`](ZodNumber-1.md#meta)

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

[`ZodNumber`](ZodNumber-1.md).[`min`](ZodNumber-1.md#min)

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

[`ZodNumber`](ZodNumber-1.md).[`multipleOf`](ZodNumber-1.md#multipleof)

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

[`ZodNumber`](ZodNumber-1.md).[`negative`](ZodNumber-1.md#negative)

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

[`ZodNumber`](ZodNumber-1.md).[`nonnegative`](ZodNumber-1.md#nonnegative)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodNumberFormat`\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`nonoptional`](ZodNumber-1.md#nonoptional)

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

[`ZodNumber`](ZodNumber-1.md).[`nonpositive`](ZodNumber-1.md#nonpositive)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`nullable`](ZodNumber-1.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodNumberFormat`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodNumberFormat`\>\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`nullish`](ZodNumber-1.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`optional`](ZodNumber-1.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodNumberFormat`, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodNumberFormat`, `T`\]\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`or`](ZodNumber-1.md#or)

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

[`ZodNumber`](ZodNumber-1.md).[`overwrite`](ZodNumber-1.md#overwrite)

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

[`ZodNumber`](ZodNumber-1.md).[`parse`](ZodNumber-1.md#parse)

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

[`ZodNumber`](ZodNumber-1.md).[`parseAsync`](ZodNumber-1.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodNumberFormat`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `number`\>\>

#### Parameters

##### target

[`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `number`\>\> | `T`

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodNumberFormat`, `T`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`pipe`](ZodNumber-1.md#pipe)

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

[`ZodNumber`](ZodNumber-1.md).[`positive`](ZodNumber-1.md#positive)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => `number`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodNumberFormat`\>

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`prefault`](ZodNumber-1.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

`number`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodNumberFormat`\>

##### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`prefault`](ZodNumber-1.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`readonly`](ZodNumber-1.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodNumberFormat` & [`ZodType`](ZodType-1.md)\<`R`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `number`\>\> : `ZodNumberFormat`

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodNumberFormat` & [`ZodType`](ZodType-1.md)\<`R`, `number`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `number`\>\> : `ZodNumberFormat`

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`refine`](ZodNumber-1.md#refine)

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

...`ZodNumberFormat` *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodNumberFormat`\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodNumberFormat`\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`register`](ZodNumber-1.md#register)

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

[`ZodNumber`](ZodNumber-1.md).[`safe`](ZodNumber-1.md#safe)

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

[`ZodNumber`](ZodNumber-1.md).[`safeDecode`](ZodNumber-1.md#safedecode)

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

[`ZodNumber`](ZodNumber-1.md).[`safeDecodeAsync`](ZodNumber-1.md#safedecodeasync)

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

[`ZodNumber`](ZodNumber-1.md).[`safeEncode`](ZodNumber-1.md#safeencode)

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

[`ZodNumber`](ZodNumber-1.md).[`safeEncodeAsync`](ZodNumber-1.md#safeencodeasync)

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

[`ZodNumber`](ZodNumber-1.md).[`safeParse`](ZodNumber-1.md#safeparse)

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

[`ZodNumber`](ZodNumber-1.md).[`safeParseAsync`](ZodNumber-1.md#safeparseasync)

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

[`ZodNumber`](ZodNumber-1.md).[`step`](ZodNumber-1.md#step)

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

[`ZodNumber`](ZodNumber-1.md).[`superRefine`](ZodNumber-1.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodNumberFormat`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodNumberFormat`\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`toJSONSchema`](ZodNumber-1.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodNumberFormat`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `number`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodNumberFormat`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `number`\>\>

#### Inherited from

[`ZodNumber`](ZodNumber-1.md).[`transform`](ZodNumber-1.md#transform)

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

[`ZodNumber`](ZodNumber-1.md).[`with`](ZodNumber-1.md#with)
