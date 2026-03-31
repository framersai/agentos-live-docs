# Type Alias: QueryRouterEventUnion

> **QueryRouterEventUnion** = [`ClassifyStartEvent`](../interfaces/ClassifyStartEvent.md) \| [`ClassifyCompleteEvent`](../interfaces/ClassifyCompleteEvent.md) \| [`ClassifyErrorEvent`](../interfaces/ClassifyErrorEvent.md) \| `CapabilitiesActivateEvent` \| [`RetrieveStartEvent`](../interfaces/RetrieveStartEvent.md) \| [`RetrieveVectorEvent`](../interfaces/RetrieveVectorEvent.md) \| [`RetrieveGraphEvent`](../interfaces/RetrieveGraphEvent.md) \| [`RetrieveRerankEvent`](../interfaces/RetrieveRerankEvent.md) \| [`RetrieveCompleteEvent`](../interfaces/RetrieveCompleteEvent.md) \| [`RetrieveFallbackEvent`](../interfaces/RetrieveFallbackEvent.md) \| [`ResearchStartEvent`](../interfaces/ResearchStartEvent.md) \| [`ResearchPhaseEvent`](../interfaces/ResearchPhaseEvent.md) \| [`ResearchCompleteEvent`](../interfaces/ResearchCompleteEvent.md) \| [`GenerateStartEvent`](../interfaces/GenerateStartEvent.md) \| [`GenerateCompleteEvent`](../interfaces/GenerateCompleteEvent.md) \| [`RouteCompleteEvent`](../interfaces/RouteCompleteEvent.md) \| `StrategySelectEvent` \| `DecomposeEvent` \| `GitHubIndexStartEvent` \| `GitHubIndexCompleteEvent` \| `GitHubIndexErrorEvent`

Defined in: [packages/agentos/src/query-router/types.ts:1159](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1159)

Discriminated union of all QueryRouter lifecycle events.
The `type` field serves as the discriminant for exhaustive matching.

## Example

```typescript
function handleEvent(event: QueryRouterEventUnion) {
  switch (event.type) {
    case 'classify:start':
      console.log(`Classifying: ${event.query}`);
      break;
    case 'retrieve:vector':
      console.log(`Vector search returned ${event.chunkCount} chunks`);
      break;
    case 'capabilities:activate':
      console.log(`Activating ${event.skills.length} skills, ${event.tools.length} tools`);
      break;
    case 'route:complete':
      console.log(`Done in ${event.durationMs}ms`);
      break;
  }
}
```
