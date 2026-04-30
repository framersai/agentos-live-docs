# Class: KeywordFeatureDetector

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/encoding/ContentFeatureDetector.ts#L100)

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

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/encoding/ContentFeatureDetector.ts#L101)

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

#### Implementation of

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md).[`detect`](../interfaces/IContentFeatureDetector.md#detect)
