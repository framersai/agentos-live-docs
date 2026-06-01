# Variable: SubjectMarkerSchema

> `const` **SubjectMarkerSchema**: `ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `interpretation`: `ZodOptional`\<`ZodString`\>; `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:429](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L429)

One categorical marker about a subject. Genome rsIDs, clinical flags,
classification tags, faction affiliations — anything discrete + labeled.
