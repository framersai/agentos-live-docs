# Variable: RunMetadataSchema

> `const` **RunMetadataSchema**: `ZodObject`\<\{ `completedAt`: `ZodOptional`\<`ZodString`\>; `forkedFrom`: `ZodOptional`\<`ZodObject`\<\{ `atTurn`: `ZodNumber`; `parentRunId`: `ZodString`; \}, `$strip`\>\>; `mode`: `ZodEnum`\<\{ `batch-point`: `"batch-point"`; `batch-trajectory`: `"batch-trajectory"`; `turn-loop`: `"turn-loop"`; \}\>; `runId`: `ZodString`; `scenario`: `ZodObject`\<\{ `id`: `ZodString`; `name`: `ZodString`; `version`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `seed`: `ZodOptional`\<`ZodNumber`\>; `startedAt`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:89](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L89)
