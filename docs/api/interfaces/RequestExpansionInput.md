# Interface: RequestExpansionInput

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:13](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/tools/RequestExpansionTool.ts#L13)

Input args for the request_expansion tool call.

## Extends

- `Record`\<`string`, `any`\>

## Indexable

\[`key`: `string`\]: `any`

## Properties

### need

> **need**: `string`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:15](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/tools/RequestExpansionTool.ts#L15)

What capability or agent is needed and why.

***

### urgency

> **urgency**: `"blocking"` \| `"would_improve"` \| `"nice_to_have"`

Defined in: [packages/agentos/src/orchestration/tools/RequestExpansionTool.ts:17](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/tools/RequestExpansionTool.ts#L17)

How urgently this capability is needed.
