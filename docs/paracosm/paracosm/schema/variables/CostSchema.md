# Variable: CostSchema

> `const` **CostSchema**: `ZodObject`\<\{ `breakdown`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `cachedReadTokens`: `ZodOptional`\<`ZodNumber`\>; `cacheSavingsUSD`: `ZodOptional`\<`ZodNumber`\>; `inputTokens`: `ZodOptional`\<`ZodNumber`\>; `llmCalls`: `ZodOptional`\<`ZodNumber`\>; `outputTokens`: `ZodOptional`\<`ZodNumber`\>; `totalUSD`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:493](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L493)

Cost breakdown for a single run. Optional because non-LLM simulations
(pure mechanistic models) don't track LLM cost.
