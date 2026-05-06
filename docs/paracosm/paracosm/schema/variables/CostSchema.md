# Variable: CostSchema

> `const` **CostSchema**: `ZodObject`\<\{ `breakdown`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `cachedReadTokens`: `ZodOptional`\<`ZodNumber`\>; `cacheSavingsUSD`: `ZodOptional`\<`ZodNumber`\>; `inputTokens`: `ZodOptional`\<`ZodNumber`\>; `llmCalls`: `ZodOptional`\<`ZodNumber`\>; `outputTokens`: `ZodOptional`\<`ZodNumber`\>; `totalUSD`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:493](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L493)

Cost breakdown for a single run. Optional because non-LLM simulations
(pure mechanistic models) don't track LLM cost.
