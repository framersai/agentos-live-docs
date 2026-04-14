# Interface: DiscoveryPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:321](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L321)

Controls dynamic capability discovery performed before or during node execution.

## Properties

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:322](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L322)

Master switch; when false all other fields are ignored.

***

### fallback?

> `optional` **fallback**: `"error"` \| `"all"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:326](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L326)

Behaviour when discovery returns no results.
                       `'all'` injects the full capability list; `'error'` aborts the node.

***

### kind?

> `optional` **kind**: `"tool"` \| `"skill"` \| `"extension"` \| `"any"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:324](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L324)

Restricts discovery to a specific capability kind.

***

### maxResults?

> `optional` **maxResults**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:325](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L325)

Maximum number of results injected into the node's context.

***

### query?

> `optional` **query**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:323](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L323)

Semantic query forwarded to `CapabilityDiscoveryEngine`.
