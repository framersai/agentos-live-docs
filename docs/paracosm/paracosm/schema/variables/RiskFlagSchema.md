# Variable: RiskFlagSchema

> `const` **RiskFlagSchema**: `ZodObject`\<\{ `detail`: `ZodString`; `label`: `ZodString`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `severity`: `ZodEnum`\<\{ `high`: `"high"`; `low`: `"low"`; `medium`: `"medium"`; \}\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:372](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L372)

Risk callout with severity. Matches the typical digital-twin
`{ label, severity, detail }` shape.
