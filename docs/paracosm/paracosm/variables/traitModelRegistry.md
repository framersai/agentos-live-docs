# Variable: traitModelRegistry

> `const` **traitModelRegistry**: [`TraitModelRegistry`](../classes/TraitModelRegistry.md)

Defined in: [apps/paracosm/src/engine/traits/index.ts:243](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L243)

Process-wide singleton registry. The hexaco + ai-agent built-ins
register on import via `engine/traits/builtins.ts` (which is
imported by `engine/index.ts`). External consumers should `import
{ traitModelRegistry } from 'paracosm/engine/traits'`.
