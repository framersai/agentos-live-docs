# Interface: AgentOSResumeExternalToolRequestOptions

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSExternalToolRequest.ts#L23)

Optional runtime-only data needed when resuming a persisted external tool
pause after the original AgentOS process is gone.

## Extended by

- [`ResumeExternalToolRequestWithRegisteredToolsOptions`](ResumeExternalToolRequestWithRegisteredToolsOptions.md)

## Properties

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSExternalToolRequest.ts#L34)

Trusted request-scoped organization context to re-apply after restart.

This is intentionally runtime-only and is not persisted into conversation
metadata, so callers must re-supply it after tenant membership checks when
the resumed turn needs organization-scoped memory or routing.

***

### preferredModelId?

> `optional` **preferredModelId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:25](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSExternalToolRequest.ts#L25)

***

### preferredProviderId?

> `optional` **preferredProviderId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:26](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSExternalToolRequest.ts#L26)

***

### userApiKeys?

> `optional` **userApiKeys**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:24](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSExternalToolRequest.ts#L24)
