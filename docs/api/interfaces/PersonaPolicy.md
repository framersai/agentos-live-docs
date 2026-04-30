# Interface: PersonaPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:336](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L336)

Configures persona-layer traits injected into the node's prompt context.

## Properties

### adaptStyle?

> `optional` **adaptStyle**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:339](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L339)

Whether to apply learned communication-style preferences.

***

### mood?

> `optional` **mood**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:338](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L338)

Override the PAD mood state label for this node.

***

### traits?

> `optional` **traits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:337](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L337)

HEXACO-style trait overrides (values in range 0–1).
