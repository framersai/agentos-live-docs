# Variable: DecisionSchema

> `const` **DecisionSchema**: `ZodObject`\<\{ `actor`: `ZodOptional`\<`ZodString`\>; `choice`: `ZodString`; `outcome`: `ZodOptional`\<`ZodEnum`\<\{ `conservative_failure`: `"conservative_failure"`; `conservative_success`: `"conservative_success"`; `risky_failure`: `"risky_failure"`; `risky_success`: `"risky_success"`; \}\>\>; `rationale`: `ZodOptional`\<`ZodString`\>; `reasoning`: `ZodOptional`\<`ZodString`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:395](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L395)
