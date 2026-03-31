# Class: KeywordFeatureDetector

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:100](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/encoding/ContentFeatureDetector.ts#L100)

## Implements

- [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

## Constructors

### Constructor

> **new KeywordFeatureDetector**(): `KeywordFeatureDetector`

#### Returns

`KeywordFeatureDetector`

## Methods

### detect()

> **detect**(`text`): `Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/encoding/ContentFeatureDetector.ts#L101)

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

#### Implementation of

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md).[`detect`](../interfaces/IContentFeatureDetector.md#detect)
