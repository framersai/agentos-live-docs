# Interface: WorldModelSnapshot

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:115](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L115)

Serializable bundle that captures everything needed to reconstruct
an equivalent [WorldModel](../classes/WorldModel.md) at a specific turn. Round-trips
through `JSON.stringify` + `JSON.parse` without data loss.

Produced by [WorldModel.snapshot](../classes/WorldModel.md#snapshot) (live run) or implicitly
via [WorldModel.forkFromArtifact](../classes/WorldModel.md#forkfromartifact) (disk-persisted run that
was created with `captureSnapshots: true`).

## Properties

### kernel

> **kernel**: `KernelSnapshot`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:119](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L119)

Kernel state at capture time.

***

### parentRunId?

> `optional` **parentRunId**: `string`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:123](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L123)

Run-id the snapshot was captured from, when available. Threaded
 into `RunArtifact.metadata.forkedFrom.parentRunId` on the child
 run so fork chains reconstruct from stored artifacts.

***

### snapshotVersion

> **snapshotVersion**: `1`

Defined in: [apps/paracosm/src/runtime/world-model/index.ts:117](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/world-model/index.ts#L117)

Format discriminator; bumped when the shape changes.
