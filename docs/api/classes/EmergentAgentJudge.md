# Class: EmergentAgentJudge

Defined in: [packages/agentos/src/emergent/EmergentAgentJudge.ts:90](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentJudge.ts#L90)

Strict LLM-as-judge gate for synthesized agent specs.

Constructed once per agency strategy execution; reused across multiple
`spawn_specialist` calls. Stateless aside from the immutable config.

## Example

```ts
const judge = new EmergentAgentJudge({
  judgeModel: 'gpt-4o-mini',
  generateText: async (model, prompt) => callLlm(model, prompt),
});

const verdict = await judge.reviewAgent(spec);
if (!verdict.approved) {
  return { success: false, data: `Judge rejected: ${verdict.reason}` };
}
```

## Constructors

### Constructor

> **new EmergentAgentJudge**(`config`): `EmergentAgentJudge`

Defined in: [packages/agentos/src/emergent/EmergentAgentJudge.ts:93](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentJudge.ts#L93)

#### Parameters

##### config

[`EmergentAgentJudgeConfig`](../interfaces/EmergentAgentJudgeConfig.md)

#### Returns

`EmergentAgentJudge`

## Methods

### reviewAgent()

> **reviewAgent**(`spec`): `Promise`\<[`AgentVerdict`](../interfaces/AgentVerdict.md)\>

Defined in: [packages/agentos/src/emergent/EmergentAgentJudge.ts:102](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentJudge.ts#L102)

Evaluate an agent spec. Never throws — all failure paths return a
structured rejection so the caller can surface a clean error to the
manager LLM.

#### Parameters

##### spec

[`AgentSpec`](../interfaces/AgentSpec.md)

#### Returns

`Promise`\<[`AgentVerdict`](../interfaces/AgentVerdict.md)\>
