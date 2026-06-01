# Variable: SpecialistDetailSchema

> `const` **SpecialistDetailSchema**: `ZodObject`\<\{ `citations`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `context`: `ZodDefault`\<`ZodString`\>; `doi`: `ZodOptional`\<`ZodString`\>; `text`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>\>\>; `openQuestions`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `opportunities`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodString`; `impact`: `ZodEnum`\<\{ `high`: `"high"`; `low`: `"low"`; `medium`: `"medium"`; \}\>; \}, `$strip`\>\>\>; `recommendedActions`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `risks`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodString`; `severity`: `ZodEnum`\<\{ `critical`: `"critical"`; `high`: `"high"`; `low`: `"low"`; `medium`: `"medium"`; \}\>; \}, `$strip`\>\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:340](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L340)

Optional thick detail for paracosm department-style rich reports. When
a scenario populates `SpecialistNote.detail`, consumers get the full
risks + opportunities + actions + citations drill-down. Thin specialist
notes (single-turn digital-twin forecasts, etc.) leave it undefined.
