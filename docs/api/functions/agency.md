# Function: agency()

> **agency**(`opts`): `Agent`

Defined in: [packages/agentos/src/api/agency.ts:77](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agency.ts#L77)

Creates a multi-agent agency that coordinates a named roster of sub-agents
using the specified orchestration strategy.

The agency validates configuration immediately and throws an
[AgencyConfigError](../interfaces/AgencyConfigErrorType.md) on any structural problem so issues surface at
wiring time rather than the first call.

## Parameters

### opts

[`AgencyOptions`](../interfaces/AgencyOptions.md)

Full agency configuration including the `agents` roster, optional
  `strategy`, `controls`, `hitl`, and `observability` settings.

## Returns

`Agent`

An [Agent](../interfaces/Agent.md) instance whose `generate` / `stream` / `session` methods
  invoke the compiled strategy over the configured sub-agents.

## Throws

When the configuration is structurally invalid
  (e.g. no agents defined, emergent enabled without hierarchical strategy,
  HITL approvals configured without a handler, parallel/debate without a
  synthesis model).
