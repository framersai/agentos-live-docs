# Interface: ForgeTestCase

Defined in: [packages/agentos/src/emergent/types.ts:514](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/types.ts#L514)

A single test case used by the LLM judge to evaluate a newly forged tool.

The judge invokes the tool with `input` and compares the result against
`expectedOutput` using semantic equivalence (not strict equality).

## Properties

### expectedOutput

> **expectedOutput**: `unknown`

Defined in: [packages/agentos/src/emergent/types.ts:525](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/types.ts#L525)

Expected output value used for correctness scoring.
The judge uses this as a reference — partial matches may still score well.

***

### input

> **input**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/emergent/types.ts:519](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/types.ts#L519)

Input arguments object passed to the tool's `run` / execution entry point.
Must conform to the tool's declared `inputSchema`.
