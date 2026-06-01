# Interface: AgentVerdict

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentJudge.ts:31](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentJudge.ts#L31)

Verdict returned by [EmergentAgentJudge.reviewAgent](../classes/EmergentAgentJudge.md#reviewagent).

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentJudge.ts:33](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentJudge.ts#L33)

Whether the spec passes review and may be activated.

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentJudge.ts:35](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentJudge.ts#L35)

Human-readable reasoning — surfaced in tool errors and audit events.
