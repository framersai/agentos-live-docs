# Variable: SimulationModeSchema

> `const` **SimulationModeSchema**: `ZodEnum`\<\{ `batch-point`: `"batch-point"`; `batch-trajectory`: `"batch-trajectory"`; `turn-loop`: `"turn-loop"`; \}\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:87](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L87)

Simulation modes. Discriminator for [RunArtifactSchema](RunArtifactSchema.md).

- `turn-loop`: iterative, turn-by-turn, state carries forward. Paracosm's
  civ-sim shape. Always populates `trajectory.timepoints` + `decisions`.
- `batch-trajectory`: one-shot LLM synthesis emitting labeled timepoints
  in a single call. Digital-twin shape. Populates
  `trajectory.timepoints` + `specialistNotes` + `riskFlags`.
- `batch-point`: one-shot summary without trajectory. Pure forecast or
  overview-only output. Populates `specialistNotes` + `riskFlags` only.
