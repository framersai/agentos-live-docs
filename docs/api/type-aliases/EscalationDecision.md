# Type Alias: EscalationDecision

> **EscalationDecision** = \{ `instructions?`: `string`; `type`: `"human_takeover"`; \} \| \{ `adjustedParameters?`: `Record`\<`string`, `unknown`\>; `guidance`: `string`; `type`: `"agent_continue"`; \} \| \{ `reason`: `string`; `type`: `"abort"`; \} \| \{ `instructions`: `string`; `targetAgentId`: `string`; `type`: `"delegate"`; \}

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:258](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/hitl/IHumanInteractionManager.ts#L258)

Human response to escalation.
