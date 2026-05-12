# Interface: File

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:803

Do not reference this directly.

## Extends

- `_File`

## Properties

### lastModified

> `readonly` **lastModified**: `number`

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:8344

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/lastModified)

#### Inherited from

`_File.lastModified`

***

### name

> `readonly` **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:8346

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/name)

#### Inherited from

`_File.name`

***

### size

> `readonly` **size**: `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:805

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/size)

#### Overrides

`_File.size`

***

### type

> `readonly` **type**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:804

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/type)

#### Overrides

`_File.type`

***

### webkitRelativePath

> `readonly` **webkitRelativePath**: `string`

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:8348

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/webkitRelativePath)

#### Inherited from

`_File.webkitRelativePath`

## Methods

### arrayBuffer()

> **arrayBuffer**(): `Promise`\<`ArrayBuffer`\>

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:3153

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/arrayBuffer)

#### Returns

`Promise`\<`ArrayBuffer`\>

#### Inherited from

`_File.arrayBuffer`

***

### slice()

> **slice**(`start?`, `end?`, `contentType?`): `Blob`

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:3155

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/slice)

#### Parameters

##### start?

`number`

##### end?

`number`

##### contentType?

`string`

#### Returns

`Blob`

#### Inherited from

`_File.slice`

***

### stream()

> **stream**(): `ReadableStream`\<`Uint8Array`\>

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:3157

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/stream)

#### Returns

`ReadableStream`\<`Uint8Array`\>

#### Inherited from

`_File.stream`

***

### text()

> **text**(): `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.dom.d.ts:3159

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/text)

#### Returns

`Promise`\<`string`\>

#### Inherited from

`_File.text`
