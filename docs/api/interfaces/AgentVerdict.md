# Interface: AgentVerdict

Defined in: [packages/agentos/src/emergent/EmergentAgentJudge.ts:31](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentJudge.ts#L31)

Verdict returned by [EmergentAgentJudge.reviewAgent](../classes/EmergentAgentJudge.md#reviewagent).

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/emergent/EmergentAgentJudge.ts:33](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentJudge.ts#L33)

Whether the spec passes review and may be activated.

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/emergent/EmergentAgentJudge.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentJudge.ts#L35)

Human-readable reasoning — surfaced in tool errors and audit events.
