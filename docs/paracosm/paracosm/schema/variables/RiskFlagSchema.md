# Variable: RiskFlagSchema

> `const` **RiskFlagSchema**: `ZodObject`\<\{ `detail`: `ZodString`; `label`: `ZodString`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `severity`: `ZodEnum`\<\{ `high`: `"high"`; `low`: `"low"`; `medium`: `"medium"`; \}\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:372](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L372)

Risk callout with severity. Matches the typical digital-twin
`{ label, severity, detail }` shape.
