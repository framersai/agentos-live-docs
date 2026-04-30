# Interface: EntityExtractionResult\<T\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:480](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L480)

Result of entity extraction.

## Type Parameters

### T

`T` = `unknown`

## Properties

### confidenceScores?

> `optional` **confidenceScores**: `number`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:488](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L488)

Confidence scores for each entity (0-1)

***

### entities

> **entities**: `T`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:485](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L485)

Extracted entities

***

### issues?

> `optional` **issues**: `string`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:494](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L494)

Any extraction issues

***

### sourceSpans?

> `optional` **sourceSpans**: `object`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:491](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L491)

Source text spans for each entity

#### end

> **end**: `number`

#### start

> **start**: `number`

#### text

> **text**: `string`

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:482](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L482)

Whether extraction succeeded

***

### tokenUsage?

> `optional` **tokenUsage**: `object`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:497](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/structured/output/IStructuredOutputManager.ts#L497)

Token usage

#### completionTokens

> **completionTokens**: `number`

#### promptTokens

> **promptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
