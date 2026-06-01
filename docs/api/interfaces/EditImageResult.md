# Interface: EditImageResult

Defined in: [packages/agentos/src/api/editImage.ts:125](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L125)

Result returned by [editImage](../functions/editImage.md).

## Properties

### images

> **images**: [`GeneratedImage`](GeneratedImage.md)[]

Defined in: [packages/agentos/src/api/editImage.ts:127](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L127)

Array of edited image objects containing URLs or base64 data.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:131](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L131)

Model identifier.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L129)

Provider identifier.

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/editImage.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L133)

Token/credit usage reported by the provider, when available.

#### costUSD?

> `optional` **costUSD**: `number`
