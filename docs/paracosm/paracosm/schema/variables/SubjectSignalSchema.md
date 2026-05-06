# Variable: SubjectSignalSchema

> `const` **SubjectSignalSchema**: `ZodObject`\<\{ `label`: `ZodString`; `recordedAt`: `ZodOptional`\<`ZodString`\>; `unit`: `ZodOptional`\<`ZodString`\>; `value`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:418](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L418)

One time-stamped observation about a subject. Biometric, telemetry,
sensor reading, or any other recorded measurement.
