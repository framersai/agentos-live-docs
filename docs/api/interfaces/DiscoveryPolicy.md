# Interface: DiscoveryPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:283](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L283)

Controls dynamic capability discovery performed before or during node execution.

## Properties

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:284](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L284)

Master switch; when false all other fields are ignored.

***

### fallback?

> `optional` **fallback**: `"error"` \| `"all"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:288](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L288)

Behaviour when discovery returns no results.
                       `'all'` injects the full capability list; `'error'` aborts the node.

***

### kind?

> `optional` **kind**: `"tool"` \| `"skill"` \| `"extension"` \| `"any"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:286](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L286)

Restricts discovery to a specific capability kind.

***

### maxResults?

> `optional` **maxResults**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:287](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L287)

Maximum number of results injected into the node's context.

***

### query?

> `optional` **query**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:285](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L285)

Semantic query forwarded to `CapabilityDiscoveryEngine`.
