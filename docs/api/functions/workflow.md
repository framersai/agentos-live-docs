# Function: workflow()

> **workflow**(`name`): [`WorkflowBuilder`](../classes/WorkflowBuilder.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:184](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L184)

Create a new `WorkflowBuilder` with the given human-readable name.

## Parameters

### name

`string`

Display name embedded in the compiled `CompiledExecutionGraph`.

## Returns

[`WorkflowBuilder`](../classes/WorkflowBuilder.md)

A fresh `WorkflowBuilder` instance.

## Example

```ts
const wf = workflow('my-pipeline')
  .input(z.object({ query: z.string() }))
  .returns(z.object({ answer: z.string() }))
  .step('search', { tool: 'web_search' })
  .step('answer', { gmi: { instructions: 'Answer the question.' } })
  .compile();
```
