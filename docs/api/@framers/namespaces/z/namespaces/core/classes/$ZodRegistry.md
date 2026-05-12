# Class: $ZodRegistry\<Meta, Schema\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:13

## Type Parameters

### Meta

`Meta` *extends* `MetadataType` = `MetadataType`

### Schema

`Schema` *extends* [`$ZodType`](../interfaces/$ZodType-1.md) = [`$ZodType`](../interfaces/$ZodType-1.md)

## Constructors

### Constructor

> **new $ZodRegistry**\<`Meta`, `Schema`\>(): `$ZodRegistry`\<`Meta`, `Schema`\>

#### Returns

`$ZodRegistry`\<`Meta`, `Schema`\>

## Properties

### \_idmap

> **\_idmap**: `Map`\<`string`, `Schema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:17

***

### \_map

> **\_map**: `WeakMap`\<`Schema`, [`$replace`](../type-aliases/$replace.md)\<`Meta`, `Schema`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:16

***

### \_meta

> **\_meta**: `Meta`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:14

***

### \_schema

> **\_schema**: `Schema`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:15

## Methods

### add()

> **add**\<`S`\>(`schema`, ...`_meta`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:18

#### Type Parameters

##### S

`S` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

#### Parameters

##### schema

`S`

##### \_meta

...`undefined` *extends* `Meta` ? \[[`$replace`](../type-aliases/$replace.md)\<`Meta`, `S`\>?\] : \[[`$replace`](../type-aliases/$replace.md)\<`Meta`, `S`\>\]

#### Returns

`this`

***

### clear()

> **clear**(): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:19

#### Returns

`this`

***

### get()

> **get**\<`S`\>(`schema`): [`$replace`](../type-aliases/$replace.md)\<`Meta`, `S`\> \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:21

#### Type Parameters

##### S

`S` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

#### Parameters

##### schema

`S`

#### Returns

[`$replace`](../type-aliases/$replace.md)\<`Meta`, `S`\> \| `undefined`

***

### has()

> **has**(`schema`): `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:22

#### Parameters

##### schema

`Schema`

#### Returns

`boolean`

***

### remove()

> **remove**(`schema`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/registries.d.cts:20

#### Parameters

##### schema

`Schema`

#### Returns

`this`
