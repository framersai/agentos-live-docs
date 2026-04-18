# Interface: StructuredGenerationResult\<T\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:326](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L326)

Result of structured output generation.

## Type Parameters

### T

`T` = `unknown`

The expected type of the parsed data

## Properties

### data?

> `optional` **data**: `T`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:331](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L331)

The parsed, validated data (if successful)

***

### latencyMs

> **latencyMs**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:353](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L353)

Generation latency in milliseconds

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:359](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L359)

Model that was used

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:362](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L362)

Provider that was used

***

### rawOutput

> **rawOutput**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:334](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L334)

Raw string output from the LLM

***

### reasoning?

> `optional` **reasoning**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:356](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L356)

Reasoning/chain-of-thought if requested

***

### retryCount

> **retryCount**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:343](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L343)

Number of retry attempts made

***

### strategyUsed

> **strategyUsed**: [`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:340](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L340)

The strategy that was used

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:328](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L328)

Whether generation and validation succeeded

***

### tokenUsage?

> `optional` **tokenUsage**: `object`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:346](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L346)

Token usage statistics

#### completionTokens

> **completionTokens**: `number`

#### promptTokens

> **promptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`

***

### validationErrors?

> `optional` **validationErrors**: [`ValidationIssue`](ValidationIssue.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:337](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L337)

Validation errors if any
