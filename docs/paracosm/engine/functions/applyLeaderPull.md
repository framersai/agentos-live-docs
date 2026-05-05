# Function: applyLeaderPull()

> **applyLeaderPull**(`agent`, `model`, `ctx`): [`TraitProfile`](../interfaces/TraitProfile.md)

Defined in: [apps/paracosm/src/engine/trait-models/drift.ts:97](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/drift.ts#L97)

Apply leader-pull drift: shift the agent's profile toward the
leader's per-axis values by `model.drift.leaderPull[axisId] *
(leader[axis] - agent[axis])`. Returns a new TraitProfile.

Skipped when the agent's modelId differs from the leader's
(cross-model pull is undefined).

## Parameters

### agent

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

### ctx

`DriftLeaderPullContext`

## Returns

[`TraitProfile`](../interfaces/TraitProfile.md)
