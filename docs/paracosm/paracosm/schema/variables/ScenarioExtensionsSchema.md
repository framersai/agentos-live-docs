# Variable: ScenarioExtensionsSchema

> `const` **ScenarioExtensionsSchema**: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:38](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L38)

Escape-hatch bag for scenario-specific fields that don't belong on a
universal primitive (e.g., Mars radiation dose, digital-twin genome
markers, game inventory state). Universal consumers ignore it;
scenario-aware consumers narrow the `unknown` values explicitly.
