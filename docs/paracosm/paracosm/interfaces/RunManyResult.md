# Interface: RunManyResult

Defined in: [apps/paracosm/src/api/types.ts:90](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L90)

Shape returned by `runMany(prompt, opts)`.

## Properties

### runs

> **runs**: [`ActorRun`](ActorRun.md)[]

Defined in: [apps/paracosm/src/api/types.ts:96](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L96)

One entry per actor; actor + artifact zipped.

***

### scenario

> **scenario**: [`ScenarioPackage`](ScenarioPackage.md)

Defined in: [apps/paracosm/src/api/types.ts:92](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L92)

The compiled scenario the run was executed against.

***

### wm

> **wm**: [`WorldModel`](../classes/WorldModel.md)

Defined in: [apps/paracosm/src/api/types.ts:94](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/types.ts#L94)

Mid-level handle for fork/replay/intervene against the same scenario.
