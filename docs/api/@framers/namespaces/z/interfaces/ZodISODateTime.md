# Interface: ZodISODateTime

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/iso.d.cts:3

## Extends

- [`ZodStringFormat`](ZodStringFormat.md)

## Properties

### ~~\_def~~

> **\_def**: [`$ZodStringFormatDef`](../namespaces/core/interfaces/$ZodStringFormatDef.md)\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`_def`](ZodStringFormat.md#_def)

***

### ~~\_input~~

> **\_input**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`_input`](ZodStringFormat.md#_input)

***

### ~~\_output~~

> **\_output**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`_output`](ZodStringFormat.md#_output)

***

### \_zod

> **\_zod**: [`$ZodISODateTimeInternals`](../namespaces/core/interfaces/$ZodISODateTimeInternals.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/iso.d.cts:4

#### Overrides

[`ZodStringFormat`](ZodStringFormat.md).[`_zod`](ZodStringFormat.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`~standard`](ZodStringFormat.md#standard)

***

### def

> **def**: [`$ZodStringFormatDef`](../namespaces/core/interfaces/$ZodStringFormatDef.md)\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`def`](ZodStringFormat.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`description`](ZodStringFormat.md#description)

***

### format

> **format**: `string` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:88

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`format`](ZodStringFormat.md#format-1)

***

### maxLength

> **maxLength**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:90

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`maxLength`](ZodStringFormat.md#maxlength)

***

### minLength

> **minLength**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:89

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`minLength`](ZodStringFormat.md#minlength)

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`spa`](ZodStringFormat.md#spa)

***

### type

> **type**: `"string"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`type`](ZodStringFormat.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodISODateTime`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodISODateTime`, `T`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`and`](ZodStringFormat.md#and)

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

[`ZodStringFormat`](ZodStringFormat.md).[`apply`](ZodStringFormat.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`array`](ZodStringFormat.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodISODateTime` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodISODateTime`, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodISODateTime` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodISODateTime`, `T`, `Dir`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`brand`](ZodStringFormat.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

`string`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodISODateTime`\>

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`catch`](ZodStringFormat.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => `string`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodISODateTime`\>

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`catch`](ZodStringFormat.md#catch)

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<`string`\> \| [`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<`string`\>)[]

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`check`](ZodStringFormat.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodStringFormatDef`](../namespaces/core/interfaces/$ZodStringFormatDef.md)\<`string`\>

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`clone`](ZodStringFormat.md#clone)

***

### decode()

> **decode**(`data`, `params?`): `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`string`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`decode`](ZodStringFormat.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`decodeAsync`](ZodStringFormat.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

`string`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodISODateTime`\>

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`default`](ZodStringFormat.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => `string`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodISODateTime`\>

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`default`](ZodStringFormat.md#default)

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

[`ZodStringFormat`](ZodStringFormat.md).[`describe`](ZodStringFormat.md#describe)

***

### encode()

> **encode**(`data`, `params?`): `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`string`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`encode`](ZodStringFormat.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`encodeAsync`](ZodStringFormat.md#encodeasync)

***

### endsWith()

> **endsWith**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:94

#### Parameters

##### value

`string`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`endsWith`](ZodStringFormat.md#endswith)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`exactOptional`](ZodStringFormat.md#exactoptional)

***

### includes()

> **includes**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:92

#### Parameters

##### value

`string`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `position?`: `number`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### position?

`number`

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`includes`](ZodStringFormat.md#includes)

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

[`ZodStringFormat`](ZodStringFormat.md).[`isNullable`](ZodStringFormat.md#isnullable)

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

[`ZodStringFormat`](ZodStringFormat.md).[`isOptional`](ZodStringFormat.md#isoptional)

***

### length()

> **length**(`len`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:97

#### Parameters

##### len

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`length`](ZodStringFormat.md#length)

***

### lowercase()

> **lowercase**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:99

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `pattern?`: `RegExp`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### pattern?

`RegExp`

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`lowercase`](ZodStringFormat.md#lowercase)

***

### max()

> **max**(`maxLength`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:96

#### Parameters

##### maxLength

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`max`](ZodStringFormat.md#max)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`meta`](ZodStringFormat.md#meta)

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

[`ZodStringFormat`](ZodStringFormat.md).[`meta`](ZodStringFormat.md#meta)

***

### min()

> **min**(`minLength`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:95

#### Parameters

##### minLength

`number`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`min`](ZodStringFormat.md#min)

***

### nonempty()

> **nonempty**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:98

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<[`HasLength`](../namespaces/util/type-aliases/HasLength.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`nonempty`](ZodStringFormat.md#nonempty)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodISODateTime`\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`nonoptional`](ZodStringFormat.md#nonoptional)

***

### normalize()

> **normalize**(`form?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:102

#### Parameters

##### form?

`string` & `object` | `"NFC"` | `"NFD"` | `"NFKC"` | `"NFKD"`

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`normalize`](ZodStringFormat.md#normalize)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`nullable`](ZodStringFormat.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodISODateTime`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodISODateTime`\>\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`nullish`](ZodStringFormat.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`optional`](ZodStringFormat.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodISODateTime`, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodISODateTime`, `T`\]\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`or`](ZodStringFormat.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => `string`

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`overwrite`](ZodStringFormat.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`string`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`parse`](ZodStringFormat.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`parseAsync`](ZodStringFormat.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodISODateTime`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `string`\>\>

#### Parameters

##### target

[`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `string`\>\> | `T`

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodISODateTime`, `T`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`pipe`](ZodStringFormat.md#pipe)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => `string`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodISODateTime`\>

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`prefault`](ZodStringFormat.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

`string`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodISODateTime`\>

##### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`prefault`](ZodStringFormat.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`readonly`](ZodStringFormat.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodISODateTime` & [`ZodType`](ZodType-1.md)\<`R`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `string`\>\> : `ZodISODateTime`

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodISODateTime` & [`ZodType`](ZodType-1.md)\<`R`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `string`\>\> : `ZodISODateTime`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`refine`](ZodStringFormat.md#refine)

***

### regex()

> **regex**(`regex`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:91

#### Parameters

##### regex

`RegExp`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`regex`](ZodStringFormat.md#regex)

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

...`ZodISODateTime` *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodISODateTime`\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodISODateTime`\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`register`](ZodStringFormat.md#register)

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`safeDecode`](ZodStringFormat.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`safeDecodeAsync`](ZodStringFormat.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`safeEncode`](ZodStringFormat.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

`string`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`safeEncodeAsync`](ZodStringFormat.md#safeencodeasync)

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`safeParse`](ZodStringFormat.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<`string`\>\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`safeParseAsync`](ZodStringFormat.md#safeparseasync)

***

### slugify()

> **slugify**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:105

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`slugify`](ZodStringFormat.md#slugify)

***

### startsWith()

> **startsWith**(`value`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:93

#### Parameters

##### value

`string`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`startsWith`](ZodStringFormat.md#startswith)

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

[`ZodStringFormat`](ZodStringFormat.md).[`superRefine`](ZodStringFormat.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodISODateTime`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodISODateTime`\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`toJSONSchema`](ZodStringFormat.md#tojsonschema)

***

### toLowerCase()

> **toLowerCase**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:103

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`toLowerCase`](ZodStringFormat.md#tolowercase)

***

### toUpperCase()

> **toUpperCase**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:104

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`toUpperCase`](ZodStringFormat.md#touppercase)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodISODateTime`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `string`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodISODateTime`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `string`\>\>

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`transform`](ZodStringFormat.md#transform)

***

### trim()

> **trim**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:101

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`trim`](ZodStringFormat.md#trim)

***

### uppercase()

> **uppercase**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:100

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `pattern?`: `RegExp`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### pattern?

`RegExp`

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`uppercase`](ZodStringFormat.md#uppercase)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<`string`\> \| [`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<`string`\>)[]

#### Returns

`this`

#### Inherited from

[`ZodStringFormat`](ZodStringFormat.md).[`with`](ZodStringFormat.md#with)
