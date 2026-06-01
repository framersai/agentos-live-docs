# Interface: GenerationHookContext

Defined in: [packages/agentos/src/api/generateText.ts:481](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L481)

Context available to pre-generation hooks.
Hooks may return a modified copy to transform the generation input.

## Properties

### messages

> **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:483](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L483)

Current messages array (system + conversation + user).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:489](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L489)

Resolved model ID.

***

### prompt

> **prompt**: `string` \| `undefined`

Defined in: [packages/agentos/src/api/generateText.ts:495](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L495)

The original user prompt (from opts.prompt).

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:491](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L491)

Resolved provider ID.

***

### step

> **step**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:493](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L493)

Current agentic step index (0-based).

***

### system

> **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[] \| `undefined`

Defined in: [packages/agentos/src/api/generateText.ts:485](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L485)

System prompt: plain string or structured blocks with cache breakpoints.

***

### tools

> **tools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/api/generateText.ts:487](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L487)

Tool definitions available for this step.
