# Interface: RequestExpansionInput

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:13](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/RequestExpansionTool.ts#L13)

Input args for the request_expansion tool call.

## Extends

- `Record`\<`string`, `any`\>

## Indexable

\[`key`: `string`\]: `any`

## Properties

### need

> **need**: `string`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:15](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/RequestExpansionTool.ts#L15)

What capability or agent is needed and why.

***

### urgency

> **urgency**: `"blocking"` \| `"would_improve"` \| `"nice_to_have"`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:17](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/RequestExpansionTool.ts#L17)

How urgently this capability is needed.
