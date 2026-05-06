# Type Alias: BatchOptions

> **BatchOptions** = `WorldModelBatchOptions`

Defined in: [apps/paracosm/src/api/types.ts:138](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/api/types.ts#L138)

Options-bag for `wm.batch`. Already a single-arg options-bag in v0.8;
v0.9 just re-exports the existing shape from the public root for
symmetry with `SimulateOptions` / `InterveneOptions`.

Note: uses `turns` (required) instead of `maxTurns` (optional) to
match the underlying `runBatch` signature. For variable per-actor
lengths, call `wm.simulate({...})` directly in a loop.
