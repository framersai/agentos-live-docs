# Variable: traitModelRegistry

> `const` **traitModelRegistry**: [`TraitModelRegistry`](../classes/TraitModelRegistry.md)

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:243](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L243)

Process-wide singleton registry. The hexaco + ai-agent built-ins
register on import via `engine/trait-models/builtins.ts` (which is
imported by `engine/index.ts`). External consumers should `import
{ traitModelRegistry } from 'paracosm/engine/trait-models'`.
