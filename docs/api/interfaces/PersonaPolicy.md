# Interface: PersonaPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:336](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L336)

Configures persona-layer traits injected into the node's prompt context.

## Properties

### adaptStyle?

> `optional` **adaptStyle**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:339](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L339)

Whether to apply learned communication-style preferences.

***

### mood?

> `optional` **mood**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:338](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L338)

Override the PAD mood state label for this node.

***

### traits?

> `optional` **traits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:337](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L337)

HEXACO-style trait overrides (values in range 0–1).
