# Function: driftLeaderProfile()

> **driftLeaderProfile**(`profile`, `model`, `ctx`): [`TraitProfile`](../interfaces/TraitProfile.md)

Defined in: [apps/paracosm/src/engine/trait-models/drift.ts:145](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/drift.ts#L145)

Drift a leader's TraitProfile in place after a turn outcome,
mirroring the semantics of the legacy `driftCommanderHexaco` in
`src/engine/core/progression.ts` but generic over trait models:

  1. Per-axis pull from `model.drift.outcomes[axis][outcome]`
     (defaulting to 0 when missing).
  2. Pull is clamped to ±PER_TURN_DRIFT_CAP (±0.05) BEFORE applying
     timeDelta scaling. Matches progression.ts:142.
  3. Result clamped to [KERNEL_TRAIT_LOWER, KERNEL_TRAIT_UPPER]
     ([0.05, 0.95]). Matches progression.ts:143.
  4. The new traits are pushed to the snapshot history.

For HEXACO leaders this produces byte-identical output to
`driftCommanderHexaco` because hexacoModel.drift.outcomes mirrors
the canonical `outcomePullForTrait` table (see hexaco.ts comments).

For non-HEXACO leaders (ai-agent etc), this is the canonical drift
call site. Throws when profile.modelId mismatches model.id.

## Parameters

### profile

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

### ctx

#### history

`object`[]

#### outcome

[`Outcome`](../type-aliases/Outcome.md) \| `null`

#### time

`number`

#### timeDelta

`number`

#### turn

`number`

## Returns

[`TraitProfile`](../interfaces/TraitProfile.md)
