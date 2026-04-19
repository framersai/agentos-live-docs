# Class: PersonalityMutationStore

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/PersonalityMutationStore.ts#L135)

SQLite-backed persistence layer for personality mutations with decay.

Follows the same `ensureSchema()` pattern as [EmergentToolRegistry](EmergentToolRegistry.md):
a cached promise guards against concurrent DDL execution, and all DML
methods await schema readiness before proceeding.

## Example

```ts
const store = new PersonalityMutationStore(sqliteAdapter);

// Record a mutation
const id = await store.record({
  agentId: 'agent-42',
  trait: 'openness',
  delta: 0.1,
  reasoning: 'User prefers creative responses',
  baselineValue: 0.7,
  mutatedValue: 0.8,
});

// Get strength-weighted effective deltas
const deltas = await store.getEffectiveDeltas('agent-42');
// => { openness: 0.1 }  (strength is 1.0 initially)

// Decay all mutations by 5%
const { decayed, pruned } = await store.decayAll(0.05);
```

## Constructors

### Constructor

> **new PersonalityMutationStore**(`db`): `PersonalityMutationStore`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:151](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/PersonalityMutationStore.ts#L151)

Create a new PersonalityMutationStore.

#### Parameters

##### db

[`EmergentRegistryStorageAdapter`](../interfaces/EmergentRegistryStorageAdapter.md)

A storage adapter implementing the [IStorageAdapter](../interfaces/EmergentRegistryStorageAdapter.md)
  interface. The same adapter used by EmergentToolRegistry can be reused.

#### Returns

`PersonalityMutationStore`

## Methods

### decayAll()

> **decayAll**(`rate`): `Promise`\<[`DecayResult`](../interfaces/DecayResult.md)\>

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:317](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/PersonalityMutationStore.ts#L317)

Decay all active mutations by the given rate and prune expired ones.

For each mutation with strength above 0.1:
- Subtracts `rate` from its strength.
- If the new strength is at or below 0.1, the mutation is deleted (pruned).
- Otherwise, the strength is updated in place.

This implements Ebbinghaus-style forgetting: mutations that aren't
reinforced by repeated adaptation gradually fade away.

#### Parameters

##### rate

`number`

The amount to subtract from each mutation's strength.
  Typically 0.05 (the default from SelfImprovementConfig).

#### Returns

`Promise`\<[`DecayResult`](../interfaces/DecayResult.md)\>

A [DecayResult](../interfaces/DecayResult.md) with counts of decayed and pruned mutations.

***

### getEffectiveDeltas()

> **getEffectiveDeltas**(`agentId`): `Promise`\<`Record`\<`string`, `number`\>\>

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:287](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/PersonalityMutationStore.ts#L287)

Compute the effective (strength-weighted) delta for each trait.

For each active mutation, multiplies the raw delta by the mutation's
current strength, then sums per trait. This gives a realistic picture
of how much each trait has drifted from baseline, accounting for decay.

#### Parameters

##### agentId

`string`

The agent whose effective deltas to compute.

#### Returns

`Promise`\<`Record`\<`string`, `number`\>\>

A map of trait name to effective delta (sum of `delta * strength`).

***

### loadForAgent()

> **loadForAgent**(`agentId`): `Promise`\<[`PersonalityMutation`](../interfaces/PersonalityMutation.md)[]\>

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:252](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/PersonalityMutationStore.ts#L252)

Load all active mutations for a given agent.

Returns only mutations whose strength is above the 0.1 pruning threshold,
ordered by creation time (newest first).

#### Parameters

##### agentId

`string`

The agent whose mutations to load.

#### Returns

`Promise`\<[`PersonalityMutation`](../interfaces/PersonalityMutation.md)[]\>

An array of [PersonalityMutation](../interfaces/PersonalityMutation.md) records.

***

### record()

> **record**(`input`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:215](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/PersonalityMutationStore.ts#L215)

Record a new personality mutation.

Inserts a mutation record with initial strength of 1.0 and the current
timestamp. The mutation ID is generated deterministically from the
current time and a random suffix.

#### Parameters

##### input

[`RecordMutationInput`](../interfaces/RecordMutationInput.md)

The mutation parameters (agent, trait, delta, reasoning, values).

#### Returns

`Promise`\<`string`\>

The generated mutation ID.
