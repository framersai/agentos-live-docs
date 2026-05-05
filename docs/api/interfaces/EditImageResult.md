# Interface: EditImageResult

Defined in: [packages/agentos/src/api/editImage.ts:124](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/editImage.ts#L124)

Result returned by [editImage](../functions/editImage.md).

## Properties

### images

> **images**: [`GeneratedImage`](GeneratedImage.md)[]

Defined in: [packages/agentos/src/api/editImage.ts:126](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/editImage.ts#L126)

Array of edited image objects containing URLs or base64 data.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:130](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/editImage.ts#L130)

Model identifier.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:128](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/editImage.ts#L128)

Provider identifier.

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/editImage.ts:132](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/editImage.ts#L132)

Token/credit usage reported by the provider, when available.

#### costUSD?

> `optional` **costUSD**: `number`
