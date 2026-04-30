# Interface: EmergentJudgeConfig

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L101)

Configuration for the [EmergentJudge](../classes/EmergentJudge.md).

All LLM interaction is abstracted behind the `generateText` callback,
making the judge model-agnostic and easily testable with mocks.

## Properties

### generateText()

> **generateText**: (`model`, `prompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L126)

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

### generateTextWithSystem()?

> `optional` **generateTextWithSystem**: (`model`, `system`, `user`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:146](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L146)

Optional structured callback that receives a stable `system` prefix and
a candidate-specific `user` payload separately. When supplied, the
judge prefers this path over [generateText](#generatetext) so hosts can attach
provider-level prompt caching (e.g. Anthropic `cache_control: ephemeral`
or OpenAI automatic prefix cache) to the shared rubric. A 10-20 call
run on Anthropic sees ~25% judge cost reduction once the ~500-token
rubric hits the cache on call 2+.

Hosts that do not care about caching may omit this field; the judge
falls back to concatenating `system + '\n\n' + user` and calling the
legacy [generateText](#generatetext) path, which preserves behavior exactly.

#### Parameters

##### model

`string`

Model ID to use for generation.

##### system

`string`

Stable rubric text. Safe to mark cacheable.

##### user

`string`

Candidate-specific payload that varies per call.

#### Returns

`Promise`\<`string`\>

The raw text response from the LLM.

***

### judgeModel

> **judgeModel**: `string`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:108](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L108)

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

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:116](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L116)

Model ID used by both reviewers in the promotion panel.
Should be a more capable model than `judgeModel` since promotion
decisions are higher-stakes.

#### Example

```ts
"gpt-4o"
```
