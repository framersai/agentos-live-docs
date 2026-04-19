# Function: judgeNode()

> **judgeNode**(`config`, `policies?`): [`GraphNode`](../interfaces/GraphNode.md)

Defined in: [packages/agentos/src/orchestration/builders/nodes.ts:186](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/builders/nodes.ts#L186)

Creates an LLM-as-judge evaluation node with structured rubric output.
The judge is a gmiNode that enforces single_turn execution and structured JSON output.

## Parameters

### config

#### model?

`string`

Optional model override for the judge LLM

#### rubric

`string`

Evaluation criteria description

#### schema

`any`

Zod schema for structured score output

#### threshold?

`number`

Optional minimum passing score per dimension

### policies?

[`NodePolicies`](../interfaces/NodePolicies.md)

## Returns

[`GraphNode`](../interfaces/GraphNode.md)
