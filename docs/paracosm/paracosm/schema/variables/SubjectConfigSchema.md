# Variable: SubjectConfigSchema

> `const` **SubjectConfigSchema**: `ZodObject`\<\{ `conditions`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `markers`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `interpretation`: `ZodOptional`\<`ZodString`\>; `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>\>; `name`: `ZodString`; `personality`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `profile`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `signals`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `recordedAt`: `ZodOptional`\<`ZodString`\>; `unit`: `ZodOptional`\<`ZodString`\>; `value`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; \}, `$strip`\>\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:444](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L444)

Identity + context for the subject of a simulation. Domain-agnostic:
digital-twin = person (profile + genome + biometrics); game =
character (traits + inventory); ecology = organism; fleet ops = vessel.

`profile` is a free-form `Record<string, unknown>` — consumers narrow
to a scenario-specific sub-schema when they need stronger typing.
