# Interface: ForgeTestCase

Defined in: [packages/agentos/src/emergent/types.ts:516](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L516)

A single test case used by the LLM judge to evaluate a newly forged tool.

The judge invokes the tool with `input` and compares the result against
`expectedOutput` using semantic equivalence (not strict equality).

## Properties

### expectedOutput

> **expectedOutput**: `unknown`

Defined in: [packages/agentos/src/emergent/types.ts:527](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L527)

Expected output value used for correctness scoring.
The judge uses this as a reference — partial matches may still score well.

***

### input

> **input**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/emergent/types.ts:521](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L521)

Input arguments object passed to the tool's `run` / execution entry point.
Must conform to the tool's declared `inputSchema`.
