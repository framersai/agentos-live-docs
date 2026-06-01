# Variable: SwarmAgentSchema

> `const` **SwarmAgentSchema**: `ZodObject`\<\{ `age`: `ZodOptional`\<`ZodNumber`\>; `agentId`: `ZodString`; `alive`: `ZodBoolean`; `childrenIds`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `department`: `ZodString`; `featured`: `ZodOptional`\<`ZodBoolean`\>; `generation`: `ZodOptional`\<`ZodNumber`\>; `marsborn`: `ZodOptional`\<`ZodBoolean`\>; `mood`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `partnerId`: `ZodOptional`\<`ZodString`\>; `psychScore`: `ZodOptional`\<`ZodNumber`\>; `rank`: `ZodOptional`\<`ZodEnum`\<\{ `chief`: `"chief"`; `junior`: `"junior"`; `lead`: `"lead"`; `senior`: `"senior"`; \}\>\>; `role`: `ZodString`; `shortTermMemory`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:157](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L157)

Single agent in the paracosm swarm. The public, serializable subset of
the internal Agent type — fields that downstream consumers,
dashboards, and analytics pipelines can rely on across scenarios.

One leader runs the swarm top-down; specialists report; ~100 of these
agents react and propagate state. `partnerId` + `childrenIds` form a
family graph; `department` + `role` form a job graph; `mood` and
`psychScore` capture the per-turn emotional state. Use
[SwarmSnapshotSchema](SwarmSnapshotSchema.md) to query the whole population at once.
