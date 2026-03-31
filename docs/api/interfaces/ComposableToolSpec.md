# Interface: ComposableToolSpec

Defined in: [packages/agentos/src/emergent/types.ts:113](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L113)

Implementation specification for a tool built by composing existing tools.

The engine executes each step in order, threading outputs through the
reference expression system. The final step's output becomes the tool's output.

## Properties

### mode

> **mode**: `"compose"`

Defined in: [packages/agentos/src/emergent/types.ts:115](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L115)

Discriminant: always `'compose'` for composable specs.

***

### steps

> **steps**: [`ComposableStep`](ComposableStep.md)[]

Defined in: [packages/agentos/src/emergent/types.ts:121](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/types.ts#L121)

Ordered list of pipeline steps.
Must contain at least one step; the last step's output is the tool result.
