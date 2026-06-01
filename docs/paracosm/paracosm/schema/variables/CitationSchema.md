# Variable: CitationSchema

> `const` **CitationSchema**: `ZodObject`\<\{ `context`: `ZodDefault`\<`ZodString`\>; `doi`: `ZodOptional`\<`ZodString`\>; `text`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:323](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L323)

Re-uses the shape of
the runtime `CitationSchema` so
existing paracosm internal callers don't break.
