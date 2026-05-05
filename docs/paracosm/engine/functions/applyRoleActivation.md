# Function: applyRoleActivation()

> **applyRoleActivation**(`profile`, `model`, `ctx`): [`TraitProfile`](../interfaces/TraitProfile.md)

Defined in: [apps/paracosm/src/engine/trait-models/drift.ts:184](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/drift.ts#L184)

Apply role-activation drift: when an agent is promoted to a
department whose role activates one or more axes, push those axes
by `model.drift.roleActivation[axisId] * sign`. Sign comes from the
scenario's role-axis mapping (caller supplies via ctx.axisSigns).
Returns a new TraitProfile.

## Parameters

### profile

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

### ctx

`DriftRoleActivationContext`

## Returns

[`TraitProfile`](../interfaces/TraitProfile.md)
