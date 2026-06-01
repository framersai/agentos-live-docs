# Class: LlmFeatureDetector

Defined in: [packages/agentos/src/cognition/memory/core/encoding/ContentFeatureDetector.ts:132](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/encoding/ContentFeatureDetector.ts#L132)

## Implements

- [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

## Constructors

### Constructor

> **new LlmFeatureDetector**(`llmInvoker`): `LlmFeatureDetector`

Defined in: [packages/agentos/src/cognition/memory/core/encoding/ContentFeatureDetector.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/encoding/ContentFeatureDetector.ts#L133)

#### Parameters

##### llmInvoker

(`system`, `user`) => `Promise`\<`string`\>

#### Returns

`LlmFeatureDetector`

## Methods

### detect()

> **detect**(`text`): `Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

Defined in: [packages/agentos/src/cognition/memory/core/encoding/ContentFeatureDetector.ts:137](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/encoding/ContentFeatureDetector.ts#L137)

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

#### Implementation of

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md).[`detect`](../interfaces/IContentFeatureDetector.md#detect)
