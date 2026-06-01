# Variable: ForgedToolSummarySchema

> `const` **ForgedToolSummarySchema**: `ZodObject`\<\{ `approved`: `ZodBoolean`; `confidence`: `ZodOptional`\<`ZodNumber`\>; `department`: `ZodOptional`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/artifact.ts:38](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/artifact.ts#L38)

Summary of a runtime-forged tool. Full forge attempts (with sandbox
output, judge reasoning, etc.) live in the stream event log for the run;
this is the deduped catalog that shows up in the artifact.
