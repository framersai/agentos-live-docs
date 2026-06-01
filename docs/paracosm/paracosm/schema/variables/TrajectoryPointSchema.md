# Variable: TrajectoryPointSchema

> `const` **TrajectoryPointSchema**: `ZodObject`\<\{ `metrics`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:289](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L289)

Lightweight sibling of [TimepointSchema](TimepointSchema.md). Metric samples without
prose — for sparklines, CSV export, chart axes.
