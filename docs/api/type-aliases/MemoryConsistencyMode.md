# Type Alias: MemoryConsistencyMode

> **MemoryConsistencyMode** = `"live"` \| `"snapshot"` \| `"journaled"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:81](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L81)

How the runtime handles in-flight memory reads/writes relative to concurrent graph branches.

- `live`       — always reads/writes the latest committed value; no isolation.
- `snapshot`   — reads a point-in-time snapshot taken at graph start; writes are deferred.
- `journaled`  — writes are appended to a journal and replayed atomically at commit.
