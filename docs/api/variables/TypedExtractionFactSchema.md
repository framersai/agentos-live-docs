# Variable: TypedExtractionFactSchema

> `const` **TypedExtractionFactSchema**: [`ZodObject`](../@framers/namespaces/z/interfaces/ZodObject.md)\<\{ `bank`: [`ZodPipe`](../@framers/namespaces/z/interfaces/ZodPipe.md)\<[`ZodTransform`](../@framers/namespaces/z/interfaces/ZodTransform.md)\<`unknown`, `unknown`\>, [`ZodEnum`](../@framers/namespaces/z/interfaces/ZodEnum.md)\<\{ `EXPERIENCE`: `"EXPERIENCE"`; `OBSERVATION`: `"OBSERVATION"`; `OPINION`: `"OPINION"`; `WORLD`: `"WORLD"`; \}\>\>; `confidence`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodNumber`](../@framers/namespaces/z/interfaces/ZodNumber-1.md)\>; `entities`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodArray`](../@framers/namespaces/z/interfaces/ZodArray.md)\<[`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md)\>\>; `participants`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodArray`](../@framers/namespaces/z/interfaces/ZodArray.md)\<[`ZodObject`](../@framers/namespaces/z/interfaces/ZodObject.md)\<\{ `name`: [`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md); `role`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md)\>; \}, [`$strip`](../@framers/namespaces/z/namespaces/core/type-aliases/$strip.md)\>\>\>; `reasoning_markers`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodArray`](../@framers/namespaces/z/interfaces/ZodArray.md)\<[`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md)\>\>; `temporal`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodObject`](../@framers/namespaces/z/interfaces/ZodObject.md)\<\{ `end`: [`ZodOptional`](../@framers/namespaces/z/interfaces/ZodOptional.md)\<[`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md)\>; `mention`: [`ZodDefault`](../@framers/namespaces/z/interfaces/ZodDefault.md)\<[`ZodOptional`](../@framers/namespaces/z/interfaces/ZodOptional.md)\<[`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md)\>\>; `start`: [`ZodOptional`](../@framers/namespaces/z/interfaces/ZodOptional.md)\<[`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md)\>; \}, [`$strip`](../@framers/namespaces/z/namespaces/core/type-aliases/$strip.md)\>\>; `text`: [`ZodString`](../@framers/namespaces/z/interfaces/ZodString-1.md); \}, [`$strip`](../@framers/namespaces/z/namespaces/core/type-aliases/$strip.md)\>

Defined in: [packages/agentos/src/memory/retrieval/typed-network/prompts/extraction-schema.ts:52](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/prompts/extraction-schema.ts#L52)

Schema for one extracted fact, matching the LLM's expected output.

Defaults applied when the LLM omits fields:
- `temporal.mention`: `''` (downstream tolerates empty mention)
- `participants`: `[]`
- `reasoning_markers`: `[]`
- `entities`: `[]`
- `confidence`: `1.0`

`bank` is uppercase-coerced before enum validation so a lowercase
model output (e.g. `'world'`) passes as `'WORLD'`.
