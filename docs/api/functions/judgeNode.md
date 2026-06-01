# Function: judgeNode()

> **judgeNode**(`config`, `policies?`): [`GraphNode`](../interfaces/GraphNode.md)

Defined in: [packages/agentos/src/orchestration/builders/nodes.ts:181](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/nodes.ts#L181)

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
