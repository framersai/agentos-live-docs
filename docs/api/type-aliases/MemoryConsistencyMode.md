# Type Alias: MemoryConsistencyMode

> **MemoryConsistencyMode** = `"live"` \| `"snapshot"` \| `"journaled"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:87](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L87)

How the runtime handles in-flight memory reads/writes relative to concurrent graph branches.

- `live`       — always reads/writes the latest committed value; no isolation.
- `snapshot`   — reads a point-in-time snapshot taken at graph start; writes are deferred.
- `journaled`  — writes are appended to a journal and replayed atomically at commit.
