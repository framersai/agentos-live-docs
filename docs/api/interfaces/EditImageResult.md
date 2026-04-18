# Interface: EditImageResult

Defined in: [packages/agentos/src/api/editImage.ts:103](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/editImage.ts#L103)

Result returned by [editImage](../functions/editImage.md).

## Properties

### images

> **images**: [`GeneratedImage`](GeneratedImage.md)[]

Defined in: [packages/agentos/src/api/editImage.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/editImage.ts#L105)

Array of edited image objects containing URLs or base64 data.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:109](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/editImage.ts#L109)

Model identifier.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:107](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/editImage.ts#L107)

Provider identifier.

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/editImage.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/editImage.ts#L111)

Token/credit usage reported by the provider, when available.

#### costUSD?

> `optional` **costUSD**: `number`
