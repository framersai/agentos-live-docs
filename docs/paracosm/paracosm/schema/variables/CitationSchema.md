# Variable: CitationSchema

> `const` **CitationSchema**: `ZodObject`\<\{ `context`: `ZodDefault`\<`ZodString`\>; `doi`: `ZodOptional`\<`ZodString`\>; `text`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:323](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L323)

Re-uses the shape of
the runtime `CitationSchema` so
existing paracosm internal callers don't break.
