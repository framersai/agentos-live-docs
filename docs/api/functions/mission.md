# Function: mission()

> **mission**(`name`): [`MissionBuilder`](../classes/MissionBuilder.md)

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:53](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/builders/MissionBuilder.ts#L53)

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
