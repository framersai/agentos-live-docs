# Variable: HighlightMetricSchema

> `const` **HighlightMetricSchema**: `ZodObject`\<\{ `color`: `ZodOptional`\<`ZodString`\>; `direction`: `ZodOptional`\<`ZodEnum`\<\{ `down`: `"down"`; `stable`: `"stable"`; `up`: `"up"`; \}\>\>; `label`: `ZodString`; `value`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:246](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L246)

Featured metric card shown alongside a Timepoint. Value is a
pre-formatted string (the scenario decides units + precision); direction
+ color are optional rendering hints.
