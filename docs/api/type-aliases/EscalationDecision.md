# Type Alias: EscalationDecision

> **EscalationDecision** = \{ `instructions?`: `string`; `type`: `"human_takeover"`; \} \| \{ `adjustedParameters?`: `Record`\<`string`, `unknown`\>; `guidance`: `string`; `type`: `"agent_continue"`; \} \| \{ `reason`: `string`; `type`: `"abort"`; \} \| \{ `instructions`: `string`; `targetAgentId`: `string`; `type`: `"delegate"`; \}

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:258](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/IHumanInteractionManager.ts#L258)

Human response to escalation.
