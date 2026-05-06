# Variable: HighlightMetricSchema

> `const` **HighlightMetricSchema**: `ZodObject`\<\{ `color`: `ZodOptional`\<`ZodString`\>; `direction`: `ZodOptional`\<`ZodEnum`\<\{ `down`: `"down"`; `stable`: `"stable"`; `up`: `"up"`; \}\>\>; `label`: `ZodString`; `value`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:246](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L246)

Featured metric card shown alongside a Timepoint. Value is a
pre-formatted string (the scenario decides units + precision); direction
+ color are optional rendering hints.
