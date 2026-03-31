# Interface: StructuredOutputStats

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:511](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L511)

Statistics about structured output operations.

## Properties

### avgLatencyMs

> **avgLatencyMs**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:525](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L525)

Average latency in ms

***

### avgRetries

> **avgRetries**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:522](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L522)

Average retries per generation

***

### byStrategy

> **byStrategy**: `Record`\<[`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md), `number`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:528](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L528)

Generations by strategy

***

### successfulGenerations

> **successfulGenerations**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:516](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L516)

Successful generations

***

### successRate

> **successRate**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:519](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L519)

Success rate (0-1)

***

### topValidationErrors

> **topValidationErrors**: `object`[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:531](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L531)

Most common validation errors

#### count

> **count**: `number`

#### keyword

> **keyword**: `string`

***

### totalGenerations

> **totalGenerations**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:513](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L513)

Total generation attempts

***

### totalTokensUsed

> **totalTokensUsed**: `number`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:534](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/structured/output/IStructuredOutputManager.ts#L534)

Total tokens used
