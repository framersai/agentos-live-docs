# Interface: EmergentAgentJudgeConfig

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentJudge.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentJudge.ts#L23)

Configuration for [EmergentAgentJudge](../classes/EmergentAgentJudge.md).

## Properties

### generateText

> **generateText**: [`JudgeGenerateText`](../type-aliases/JudgeGenerateText.md)

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentJudge.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentJudge.ts#L27)

LLM invocation callback the judge uses for its single evaluation call.

***

### judgeModel

> **judgeModel**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentJudge.ts:25](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentJudge.ts#L25)

Model identifier the judge calls (e.g. `'gpt-4o-mini'`, `'claude-haiku-4-5-20251001'`).
