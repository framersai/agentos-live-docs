# Variable: TimepointSchema

> `const` **TimepointSchema**: `ZodObject`\<\{ `confidence`: `ZodOptional`\<`ZodNumber`\>; `highlightMetrics`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `color`: `ZodOptional`\<`ZodString`\>; `direction`: `ZodOptional`\<`ZodEnum`\<\{ `down`: `"down"`; `stable`: `"stable"`; `up`: `"up"`; \}\>\>; `label`: `ZodString`; `value`: `ZodString`; \}, `$strip`\>\>\>; `label`: `ZodString`; `narrative`: `ZodOptional`\<`ZodString`\>; `reasoning`: `ZodOptional`\<`ZodString`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `score`: `ZodOptional`\<`ZodObject`\<\{ `label`: `ZodString`; `max`: `ZodNumber`; `min`: `ZodNumber`; `value`: `ZodNumber`; \}, `$strip`\>\>; `time`: `ZodNumber`; `worldSnapshot`: `ZodOptional`\<`ZodObject`\<\{ `capacities`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `environment`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`, `ZodBoolean`\]\>\>\>; `metrics`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `politics`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`, `ZodBoolean`\]\>\>\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `statuses`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodString`, `ZodBoolean`\]\>\>\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:266](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L266)

Labeled snapshot with prose + score + highlight metrics. Works for a
short digital-twin forecast AND paracosm's per-turn snapshots.

No hardcoded count of timepoints, no hardcoded count of highlight
metrics, no hardcoded score bounds. Scenario declares shape.
