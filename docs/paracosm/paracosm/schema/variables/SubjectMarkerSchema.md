# Variable: SubjectMarkerSchema

> `const` **SubjectMarkerSchema**: `ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `interpretation`: `ZodOptional`\<`ZodString`\>; `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:429](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L429)

One categorical marker about a subject. Genome rsIDs, clinical flags,
classification tags, faction affiliations — anything discrete + labeled.
