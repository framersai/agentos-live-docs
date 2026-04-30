# Type Alias: SimEvent

> **SimEvent** = `{ [K in SimEventType]: { data: SimEventPayloadMap[K] & SimEventCostPayload; leader: string; turn?: number; type: K; year?: number } }`\[[`SimEventType`](SimEventType.md)\]

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:235](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L235)

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
