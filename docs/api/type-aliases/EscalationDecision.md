# Type Alias: EscalationDecision

> **EscalationDecision** = \{ `instructions?`: `string`; `type`: `"human_takeover"`; \} \| \{ `adjustedParameters?`: `Record`\<`string`, `unknown`\>; `guidance`: `string`; `type`: `"agent_continue"`; \} \| \{ `reason`: `string`; `type`: `"abort"`; \} \| \{ `instructions`: `string`; `targetAgentId`: `string`; `type`: `"delegate"`; \}

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:258](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L258)

Human response to escalation.
