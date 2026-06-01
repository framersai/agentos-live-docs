# Variable: SubjectSignalSchema

> `const` **SubjectSignalSchema**: `ZodObject`\<\{ `label`: `ZodString`; `recordedAt`: `ZodOptional`\<`ZodString`\>; `unit`: `ZodOptional`\<`ZodString`\>; `value`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:418](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L418)

One time-stamped observation about a subject. Biometric, telemetry,
sensor reading, or any other recorded measurement.
