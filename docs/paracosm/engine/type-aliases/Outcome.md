# Type Alias: Outcome

> **Outcome** = `"risky_success"` \| `"risky_failure"` \| `"conservative_success"` \| `"conservative_failure"` \| `"safe_success"` \| `"safe_failure"`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:23](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L23)

Outcome classes the kernel emits for each turn. Trait models map
each outcome to a per-axis delta in their drift table.
