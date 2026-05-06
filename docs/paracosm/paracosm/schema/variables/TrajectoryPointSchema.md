# Variable: TrajectoryPointSchema

> `const` **TrajectoryPointSchema**: `ZodObject`\<\{ `metrics`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:289](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L289)

Lightweight sibling of [TimepointSchema](TimepointSchema.md). Metric samples without
prose — for sparklines, CSV export, chart axes.
