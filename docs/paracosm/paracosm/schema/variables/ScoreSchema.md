# Variable: ScoreSchema

> `const` **ScoreSchema**: `ZodObject`\<\{ `label`: `ZodString`; `max`: `ZodNumber`; `min`: `ZodNumber`; `value`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:230](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L230)

Score with explicit bounds. A digital-twin "health score" on [0, 100]
becomes `{ value: 72, min: 0, max: 100, label: 'Health Score' }`. A
kingdom-prosperity sim uses `{ value: -3, min: -10, max: 10, label: 'Realm Stability' }`.
