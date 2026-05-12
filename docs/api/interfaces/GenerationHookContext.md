# Interface: GenerationHookContext

Defined in: [packages/agentos/src/api/generateText.ts:427](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L427)

Context available to pre-generation hooks.
Hooks may return a modified copy to transform the generation input.

## Properties

### messages

> **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:429](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L429)

Current messages array (system + conversation + user).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:435](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L435)

Resolved model ID.

***

### prompt

> **prompt**: `string` \| `undefined`

Defined in: [packages/agentos/src/api/generateText.ts:441](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L441)

The original user prompt (from opts.prompt).

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:437](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L437)

Resolved provider ID.

***

### step

> **step**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:439](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L439)

Current agentic step index (0-based).

***

### system

> **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[] \| `undefined`

Defined in: [packages/agentos/src/api/generateText.ts:431](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L431)

System prompt — plain string or structured blocks with cache breakpoints.

***

### tools

> **tools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/api/generateText.ts:433](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L433)

Tool definitions available for this step.
