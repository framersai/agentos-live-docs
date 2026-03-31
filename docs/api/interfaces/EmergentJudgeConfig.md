# Interface: EmergentJudgeConfig

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentJudge.ts#L101)

Configuration for the [EmergentJudge](../classes/EmergentJudge.md).

All LLM interaction is abstracted behind the `generateText` callback,
making the judge model-agnostic and easily testable with mocks.

## Properties

### generateText()

> **generateText**: (`model`, `prompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:126](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentJudge.ts#L126)

Callback that invokes an LLM to generate text from a prompt.
The judge calls this for creation reviews and promotion panels.

#### Parameters

##### model

`string`

The model ID to use for generation.

##### prompt

`string`

The full prompt string to send to the LLM.

#### Returns

`Promise`\<`string`\>

The raw text response from the LLM.

***

### judgeModel

> **judgeModel**: `string`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:108](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentJudge.ts#L108)

Model ID used for the single-pass creation review.
Should be a fast, cost-efficient model since correctness is primarily
validated through test cases.

#### Example

```ts
"gpt-4o-mini"
```

***

### promotionModel

> **promotionModel**: `string`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:116](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentJudge.ts#L116)

Model ID used by both reviewers in the promotion panel.
Should be a more capable model than `judgeModel` since promotion
decisions are higher-stakes.

#### Example

```ts
"gpt-4o"
```
