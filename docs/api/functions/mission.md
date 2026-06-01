# Function: mission()

> **mission**(`name`): [`MissionBuilder`](../classes/MissionBuilder.md)

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L54)

Create a new `MissionBuilder` for the named mission.

## Parameters

### name

`string`

Human-readable mission name; used as the compiled graph's display name
              and as a stable slug prefix for run ids and checkpoint keys.

## Returns

[`MissionBuilder`](../classes/MissionBuilder.md)

A fresh `MissionBuilder` instance ready to be configured.

## Example

```ts
const m = mission('summarise-article')
  .input(inputSchema)
  .goal('Summarise {{url}} in three bullet points')
  .returns(outputSchema)
  .planner({ strategy: 'linear', maxSteps: 4 })
  .compile();
```
