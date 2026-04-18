# Interface: JudgmentResult

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/LLMJudge.ts#L47)

LLM judgment result

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/LLMJudge.ts#L57)

Confidence in the judgment

***

### criteriaScores

> **criteriaScores**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/LLMJudge.ts#L51)

Individual criterion scores

***

### feedback

> **feedback**: `string`[]

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:55](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/LLMJudge.ts#L55)

Specific feedback

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/LLMJudge.ts#L53)

Reasoning for the judgment

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/LLMJudge.ts#L49)

Overall score (0-1)
