# Interface: CapturedForge

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:28](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L28)

Captured forge event — ground-truth record of an actual forge call,
independent of whether the LLM self-reported it.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:40](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L40)

Did the judge approve?

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:42](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L42)

Judge confidence for approved tools; 0 on rejection.

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L32)

Tool description (`fixed.description || name`).

***

### errorReason?

> `optional` **errorReason**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:46](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L46)

Populated on rejection or error. Truncated to 240 chars.

***

### inputSchema

> **inputSchema**: `unknown`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:36](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L36)

Forge request's declared input schema post-normalization.

***

### mode

> **mode**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L34)

`'sandbox'` or `'compose'` after normalization.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:30](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L30)

Tool name (`fixed.name || 'unnamed'`).

***

### output

> **output**: `unknown`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:44](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L44)

Judge verdict payload or shape-check context.

***

### outputSchema

> **outputSchema**: `unknown`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:38](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L38)

Forge request's declared output schema post-normalization.

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:52](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L52)

Optional free-form scope label (e.g. a department name, a chat
agent id, or any grouping the caller wants propagated onto every
capture record). Left undefined when the caller does not group.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L54)

Wall-clock ms so captures can be attributed to surrounding events.
