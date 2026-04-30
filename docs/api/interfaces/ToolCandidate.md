# Interface: ToolCandidate

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:46](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L46)

A candidate tool submitted for creation review by the [EmergentJudge](../classes/EmergentJudge.md).

Contains all the information the judge needs to evaluate safety, correctness,
determinism, and bounded execution: the tool's identity and schemas, its
source code or composition spec, the sandbox API allowlist, and the results
of any test runs.

## Properties

### allowlist?

> `optional` **allowlist**: `string`[]

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L76)

Sandbox API allowlist — the set of APIs the tool's code is permitted to
invoke. Only relevant for `'sandbox'` mode tools. Used by the safety
auditor to verify that the code does not exceed its declared API surface.

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L51)

Natural language description of the tool's purpose and behaviour.

***

### implementationMode

> **implementationMode**: `"compose"` \| `"sandbox"`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:69](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L69)

Whether the tool was built by composing existing tools (`'compose'`) or
by running arbitrary code in a sandbox (`'sandbox'`).

***

### inputSchema

> **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L54)

JSON Schema defining the tool's input arguments.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L48)

Machine-readable name for the proposed tool.

***

### outputSchema?

> `optional` **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L57)

JSON Schema defining the tool's expected output shape (optional).

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L63)

The tool's source code (for sandbox mode) or serialized composition spec
(for compose mode). Included in the LLM prompt for security auditing.

***

### testResults

> **testResults**: `object`[]

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:83](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/EmergentJudge.ts#L83)

Results of test runs executed against the candidate tool before review.
Each entry contains the input, output, success flag, and optional error.
The judge uses these to assess correctness and determinism.

#### error?

> `optional` **error**: `string`

#### input

> **input**: `unknown`

#### output

> **output**: `unknown`

#### success

> **success**: `boolean`
