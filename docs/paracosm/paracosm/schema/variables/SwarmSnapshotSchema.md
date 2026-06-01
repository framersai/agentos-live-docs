# Variable: SwarmSnapshotSchema

> `const` **SwarmSnapshotSchema**: `ZodObject`\<\{ `agents`: `ZodArray`\<`ZodObject`\<\{ `age`: `ZodOptional`\<`ZodNumber`\>; `agentId`: `ZodString`; `alive`: `ZodBoolean`; `childrenIds`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `department`: `ZodString`; `featured`: `ZodOptional`\<`ZodBoolean`\>; `generation`: `ZodOptional`\<`ZodNumber`\>; `marsborn`: `ZodOptional`\<`ZodBoolean`\>; `mood`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `partnerId`: `ZodOptional`\<`ZodString`\>; `psychScore`: `ZodOptional`\<`ZodNumber`\>; `rank`: `ZodOptional`\<`ZodEnum`\<\{ `chief`: `"chief"`; `junior`: `"junior"`; `lead`: `"lead"`; `senior`: `"senior"`; \}\>\>; `role`: `ZodString`; `shortTermMemory`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>\>; `births`: `ZodOptional`\<`ZodNumber`\>; `deaths`: `ZodOptional`\<`ZodNumber`\>; `morale`: `ZodOptional`\<`ZodNumber`\>; `population`: `ZodNumber`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; `turn`: `ZodNumber`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:203](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L203)

Snapshot of the entire agent swarm at a point in time. Pairs naturally
with [WorldSnapshotSchema](WorldSnapshotSchema.md): the world snapshot describes the
macro state (metrics, statuses), the swarm snapshot describes the
micro state (every agent's role, mood, family edges).

Surfaced by [RunArtifactSchema](RunArtifactSchema.md)'s `finalSwarm` field at end-of-run
and by `WorldModel.swarm()` at any point during a live simulation.
