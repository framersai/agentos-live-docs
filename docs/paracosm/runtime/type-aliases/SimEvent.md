# Type Alias: SimEvent

> **SimEvent** = `{ [K in SimEventType]: { data: SimEventPayloadMap[K] & SimEventCostPayload; leader: string; time?: number; turn?: number; type: K } }`\[[`SimEventType`](SimEventType.md)\]

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:254](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L254)

A single event delivered to the `onEvent` callback during a simulation.

Discriminated on `type`: `if (e.type === 'event_start') { e.data.title }`
compiles with full field-level intellisense. The runtime also spreads a
`_cost` book-keeping payload onto every event for the live-cost counter;
treat that as internal and read cost from the returned `result.cost`
instead.

## Example

```typescript
const output = await runSimulation(leader, [], {
  scenario, maxTurns: 8, seed: 42,
  onEvent(e) {
    if (e.type === 'event_start') console.log('crisis:', e.data.title, e.data.category);
    if (e.type === 'outcome')     console.log('resolved:', e.data.outcome);
    if (e.type === 'turn_done')   console.log('T' + e.turn, 'complete');
  },
});
```
