# Variable: SimulationModeSchema

> `const` **SimulationModeSchema**: `ZodEnum`\<\{ `batch-point`: `"batch-point"`; `batch-trajectory`: `"batch-trajectory"`; `turn-loop`: `"turn-loop"`; \}\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:87](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L87)

Simulation modes. Discriminator for [RunArtifactSchema](RunArtifactSchema.md).

- `turn-loop`: iterative, turn-by-turn, state carries forward. Paracosm's
  civ-sim shape. Always populates `trajectory.timepoints` + `decisions`.
- `batch-trajectory`: one-shot LLM synthesis emitting labeled timepoints
  in a single call. Digital-twin shape. Populates
  `trajectory.timepoints` + `specialistNotes` + `riskFlags`.
- `batch-point`: one-shot summary without trajectory. Pure forecast or
  overview-only output. Populates `specialistNotes` + `riskFlags` only.
