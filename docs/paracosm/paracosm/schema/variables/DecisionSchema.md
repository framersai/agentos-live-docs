# Variable: DecisionSchema

> `const` **DecisionSchema**: `ZodObject`\<\{ `actor`: `ZodOptional`\<`ZodString`\>; `choice`: `ZodString`; `outcome`: `ZodOptional`\<`ZodEnum`\<\{ `conservative_failure`: `"conservative_failure"`; `conservative_success`: `"conservative_success"`; `risky_failure`: `"risky_failure"`; `risky_success`: `"risky_success"`; \}\>\>; `rationale`: `ZodOptional`\<`ZodString`\>; `reasoning`: `ZodOptional`\<`ZodString`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:395](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L395)
