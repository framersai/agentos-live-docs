# Variable: WorldSnapshotSchema

> `const` **WorldSnapshotSchema**: `ZodObject`\<\{ `capacities`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `environment`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`, `ZodBoolean`\]\>\>\>; `metrics`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `politics`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`, `ZodBoolean`\]\>\>\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `statuses`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodString`, `ZodBoolean`\]\>\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:128](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L128)

Five-bag world state. Promotes the internal
`WorldState` declaration to public API. All bags optional
except `metrics` — a sim without any numeric metric is degenerate.
