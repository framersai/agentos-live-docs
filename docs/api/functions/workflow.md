# Function: workflow()

> **workflow**(`name`): [`WorkflowBuilder`](../classes/WorkflowBuilder.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/builders/WorkflowBuilder.ts#L161)

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
