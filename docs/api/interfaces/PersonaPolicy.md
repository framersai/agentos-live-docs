# Interface: PersonaPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:298](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L298)

Configures persona-layer traits injected into the node's prompt context.

## Properties

### adaptStyle?

> `optional` **adaptStyle**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:301](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L301)

Whether to apply learned communication-style preferences.

***

### mood?

> `optional` **mood**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:300](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L300)

Override the PAD mood state label for this node.

***

### traits?

> `optional` **traits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/orchestration/ir/types.ts:299](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L299)

HEXACO-style trait overrides (values in range 0–1).
