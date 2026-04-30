# Class: HybridFeatureDetector

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:168](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/encoding/ContentFeatureDetector.ts#L168)

Uses keyword detection for real-time encoding. Exposes `detectWithLlm()`
for retroactive re-classification during consolidation.

## Implements

- [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

## Constructors

### Constructor

> **new HybridFeatureDetector**(`llmInvoker?`): `HybridFeatureDetector`

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:172](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/encoding/ContentFeatureDetector.ts#L172)

#### Parameters

##### llmInvoker?

(`system`, `user`) => `Promise`\<`string`\>

#### Returns

`HybridFeatureDetector`

## Methods

### detect()

> **detect**(`text`): `Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:177](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/encoding/ContentFeatureDetector.ts#L177)

Real-time detection: keyword only (zero latency).

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

#### Implementation of

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md).[`detect`](../interfaces/IContentFeatureDetector.md#detect)

***

### detectWithLlm()

> **detectWithLlm**(`text`): `Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:182](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/encoding/ContentFeatureDetector.ts#L182)

Deferred detection: LLM-based (called during consolidation).

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`ContentFeatures`](../interfaces/ContentFeatures.md)\>
