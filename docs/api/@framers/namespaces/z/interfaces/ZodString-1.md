# Interface: ZodString

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:109

## Extends

- [`_ZodString`](ZodString.md)\<[`$ZodStringInternals`](../namespaces/core/interfaces/$ZodStringInternals.md)\<`string`\>\>

## Properties

### ~~\_def~~

> **\_def**: [`$ZodStringDef`](../namespaces/core/interfaces/$ZodStringDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`_ZodString`](ZodString.md).[`_def`](ZodString.md#_def)

***

### ~~\_input~~

> **\_input**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`_ZodString`](ZodString.md).[`_input`](ZodString.md#_input)

***

### ~~\_output~~

> **\_output**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`_ZodString`](ZodString.md).[`_output`](ZodString.md#_output)

***

### \_zod

> **\_zod**: [`$ZodStringInternals`](../namespaces/core/interfaces/$ZodStringInternals.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:93

#### Inherited from

[`_ZodString`](ZodString.md).[`_zod`](ZodString.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Inherited from

[`_ZodString`](ZodString.md).[`~standard`](ZodString.md#standard)

***

### def

> **def**: [`$ZodStringDef`](../namespaces/core/interfaces/$ZodStringDef.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`_ZodString`](ZodString.md).[`def`](ZodString.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`_ZodString`](ZodString.md).[`description`](ZodString.md#description)

***

### format

> **format**: `string` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:88

#### Inherited from

[`_ZodString`](ZodString.md).[`format`](ZodString.md#format)

***

### maxLength

> **maxLength**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:90

#### Inherited from

[`_ZodString`](ZodString.md).[`maxLength`](ZodString.md#maxlength)

***

### minLength

> **minLength**: `number` \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:89

#### Inherited from

[`_ZodString`](ZodString.md).[`minLength`](ZodString.md#minlength)

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

[`_ZodString`](ZodString.md).[`spa`](ZodString.md#spa)

***

### type

> **type**: `"string"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`_ZodString`](ZodString.md).[`type`](ZodString.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodString`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodString`, `T`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`and`](ZodString.md#and)

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

[`_ZodString`](ZodString.md).[`apply`](ZodString.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`array`](ZodString.md#array)

***

### ~~base64()~~

> **base64**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:139

#### Parameters

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

#### Deprecated

Use `z.base64()` instead.

***

### ~~base64url()~~

> **base64url**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:141

#### Parameters

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

#### Deprecated

Use `z.base64url()` instead.

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodString` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodString`, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodString` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodString`, `T`, `Dir`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`brand`](ZodString.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

`string`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodString`\>

##### Inherited from

[`_ZodString`](ZodString.md).[`catch`](ZodString.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => `string`

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodString`\>

##### Inherited from

[`_ZodString`](ZodString.md).[`catch`](ZodString.md#catch)

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

[`_ZodString`](ZodString.md).[`check`](ZodString.md#check)

***

### ~~cidrv4()~~

> **cidrv4**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:151

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v4"`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### version?

`"v4"`

#### Returns

`this`

#### Deprecated

Use `z.cidrv4()` instead.

***

### ~~cidrv6()~~

> **cidrv6**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:153

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v6"`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### version?

`"v6"`

#### Returns

`this`

#### Deprecated

Use `z.cidrv6()` instead.

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodStringDef`](../namespaces/core/interfaces/$ZodStringDef.md)

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`_ZodString`](ZodString.md).[`clone`](ZodString.md#clone)

***

### ~~cuid()~~

> **cuid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:133

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

#### Deprecated

Use `z.cuid()` instead.

***

### ~~cuid2()~~

> **cuid2**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:135

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

#### Deprecated

Use `z.cuid2()` instead.

***

### ~~date()~~

> **date**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:159

#### Parameters

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

#### Deprecated

Use `z.iso.date()` instead.

***

### ~~datetime()~~

> **datetime**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:157

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### local?

`boolean`

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### offset?

`boolean`

###### precision?

`number` \| `null`

#### Returns

`this`

#### Deprecated

Use `z.iso.datetime()` instead.

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

[`_ZodString`](ZodString.md).[`decode`](ZodString.md#decode)

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

[`_ZodString`](ZodString.md).[`decodeAsync`](ZodString.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

`string`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodString`\>

##### Inherited from

[`_ZodString`](ZodString.md).[`default`](ZodString.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => `string`

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodString`\>

##### Inherited from

[`_ZodString`](ZodString.md).[`default`](ZodString.md#default)

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

[`_ZodString`](ZodString.md).[`describe`](ZodString.md#describe)

***

### ~~duration()~~

> **duration**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:163

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

#### Deprecated

Use `z.iso.duration()` instead.

***

### ~~e164()~~

> **e164**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:155

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

#### Deprecated

Use `z.e164()` instead.

***

### ~~email()~~

> **email**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:111

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

#### Deprecated

Use `z.email()` instead.

***

### ~~emoji()~~

> **emoji**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:117

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

#### Deprecated

Use `z.emoji()` instead.

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

[`_ZodString`](ZodString.md).[`encode`](ZodString.md#encode)

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

[`_ZodString`](ZodString.md).[`encodeAsync`](ZodString.md#encodeasync)

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

[`_ZodString`](ZodString.md).[`endsWith`](ZodString.md#endswith)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`exactOptional`](ZodString.md#exactoptional)

***

### ~~guid()~~

#### Call Signature

> **guid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:119

##### Parameters

###### params?

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

##### Returns

`this`

##### Deprecated

Use `z.guid()` instead.

#### Call Signature

> **guid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:131

##### Parameters

###### params?

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

##### Returns

`this`

##### Deprecated

Use `z.guid()` instead.

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

[`_ZodString`](ZodString.md).[`includes`](ZodString.md#includes)

***

### ~~ipv4()~~

> **ipv4**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:147

#### Parameters

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

#### Deprecated

Use `z.ipv4()` instead.

***

### ~~ipv6()~~

> **ipv6**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:149

#### Parameters

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

#### Deprecated

Use `z.ipv6()` instead.

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

[`_ZodString`](ZodString.md).[`isNullable`](ZodString.md#isnullable)

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

[`_ZodString`](ZodString.md).[`isOptional`](ZodString.md#isoptional)

***

### ~~jwt()~~

> **jwt**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:115

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `alg?`: [`JWTAlgorithm`](../namespaces/util/type-aliases/JWTAlgorithm.md); `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### alg?

[`JWTAlgorithm`](../namespaces/util/type-aliases/JWTAlgorithm.md)

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

`this`

#### Deprecated

Use `z.jwt()` instead.

***

### ~~ksuid()~~

> **ksuid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:145

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

#### Deprecated

Use `z.ksuid()` instead.

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

[`_ZodString`](ZodString.md).[`length`](ZodString.md#length)

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

[`_ZodString`](ZodString.md).[`lowercase`](ZodString.md#lowercase)

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

[`_ZodString`](ZodString.md).[`max`](ZodString.md#max)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`_ZodString`](ZodString.md).[`meta`](ZodString.md#meta)

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

[`_ZodString`](ZodString.md).[`meta`](ZodString.md#meta)

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

[`_ZodString`](ZodString.md).[`min`](ZodString.md#min)

***

### ~~nanoid()~~

> **nanoid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:129

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

#### Deprecated

Use `z.nanoid()` instead.

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

[`_ZodString`](ZodString.md).[`nonempty`](ZodString.md#nonempty)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodString`\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`nonoptional`](ZodString.md#nonoptional)

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

[`_ZodString`](ZodString.md).[`normalize`](ZodString.md#normalize)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`nullable`](ZodString.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodString`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodString`\>\>

#### Inherited from

[`_ZodString`](ZodString.md).[`nullish`](ZodString.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`optional`](ZodString.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodString`, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodString`, `T`\]\>

#### Inherited from

[`_ZodString`](ZodString.md).[`or`](ZodString.md#or)

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

[`_ZodString`](ZodString.md).[`overwrite`](ZodString.md#overwrite)

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

[`_ZodString`](ZodString.md).[`parse`](ZodString.md#parse)

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

[`_ZodString`](ZodString.md).[`parseAsync`](ZodString.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodString`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `string`\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, `string`\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodString`, `T`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`pipe`](ZodString.md#pipe)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => `string`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodString`\>

##### Inherited from

[`_ZodString`](ZodString.md).[`prefault`](ZodString.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

`string`

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodString`\>

##### Inherited from

[`_ZodString`](ZodString.md).[`prefault`](ZodString.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`readonly`](ZodString.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodString` & [`ZodType`](ZodType-1.md)\<`R`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `string`\>\> : `ZodString`

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodString` & [`ZodType`](ZodType-1.md)\<`R`, `string`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, `string`\>\> : `ZodString`

#### Inherited from

[`_ZodString`](ZodString.md).[`refine`](ZodString.md#refine)

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

[`_ZodString`](ZodString.md).[`regex`](ZodString.md#regex)

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

...`ZodString` *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodString`\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodString`\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`_ZodString`](ZodString.md).[`register`](ZodString.md#register)

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

[`_ZodString`](ZodString.md).[`safeDecode`](ZodString.md#safedecode)

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

[`_ZodString`](ZodString.md).[`safeDecodeAsync`](ZodString.md#safedecodeasync)

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

[`_ZodString`](ZodString.md).[`safeEncode`](ZodString.md#safeencode)

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

[`_ZodString`](ZodString.md).[`safeEncodeAsync`](ZodString.md#safeencodeasync)

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

[`_ZodString`](ZodString.md).[`safeParse`](ZodString.md#safeparse)

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

[`_ZodString`](ZodString.md).[`safeParseAsync`](ZodString.md#safeparseasync)

***

### slugify()

> **slugify**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:105

#### Returns

`this`

#### Inherited from

[`_ZodString`](ZodString.md).[`slugify`](ZodString.md#slugify)

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

[`_ZodString`](ZodString.md).[`startsWith`](ZodString.md#startswith)

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

[`_ZodString`](ZodString.md).[`superRefine`](ZodString.md#superrefine)

***

### ~~time()~~

> **time**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:161

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `precision?`: `number` \| `null`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### precision?

`number` \| `null`

#### Returns

`this`

#### Deprecated

Use `z.iso.time()` instead.

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodString`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodString`\>

#### Inherited from

[`_ZodString`](ZodString.md).[`toJSONSchema`](ZodString.md#tojsonschema)

***

### toLowerCase()

> **toLowerCase**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:103

#### Returns

`this`

#### Inherited from

[`_ZodString`](ZodString.md).[`toLowerCase`](ZodString.md#tolowercase)

***

### toUpperCase()

> **toUpperCase**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:104

#### Returns

`this`

#### Inherited from

[`_ZodString`](ZodString.md).[`toUpperCase`](ZodString.md#touppercase)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodString`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `string`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodString`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, `string`\>\>

#### Inherited from

[`_ZodString`](ZodString.md).[`transform`](ZodString.md#transform)

***

### trim()

> **trim**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:101

#### Returns

`this`

#### Inherited from

[`_ZodString`](ZodString.md).[`trim`](ZodString.md#trim)

***

### ~~ulid()~~

> **ulid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:137

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

#### Deprecated

Use `z.ulid()` instead.

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

[`_ZodString`](ZodString.md).[`uppercase`](ZodString.md#uppercase)

***

### ~~url()~~

> **url**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:113

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `hostname?`: `RegExp`; `message?`: `string`; `normalize?`: `boolean`; `pattern?`: `RegExp`; `protocol?`: `RegExp`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### hostname?

`RegExp`

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### normalize?

`boolean`

###### pattern?

`RegExp`

###### protocol?

`RegExp`

#### Returns

`this`

#### Deprecated

Use `z.url()` instead.

***

### ~~uuid()~~

> **uuid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:121

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

#### Returns

`this`

#### Deprecated

Use `z.uuid()` instead.

***

### ~~uuidv4()~~

> **uuidv4**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:123

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

#### Returns

`this`

#### Deprecated

Use `z.uuid()` instead.

***

### ~~uuidv6()~~

> **uuidv6**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:125

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

#### Returns

`this`

#### Deprecated

Use `z.uuid()` instead.

***

### ~~uuidv7()~~

> **uuidv7**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:127

#### Parameters

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md)\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### version?

`"v1"` \| `"v2"` \| `"v3"` \| `"v4"` \| `"v5"` \| `"v6"` \| `"v7"` \| `"v8"`

#### Returns

`this`

#### Deprecated

Use `z.uuid()` instead.

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

[`_ZodString`](ZodString.md).[`with`](ZodString.md#with)

***

### ~~xid()~~

> **xid**(`params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:143

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

#### Deprecated

Use `z.xid()` instead.
