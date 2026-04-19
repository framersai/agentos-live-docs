# Interface: CognitiveWorkingMemoryConfig

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:21](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/CognitiveWorkingMemory.ts#L21)

## Properties

### activationDecayRate

> **activationDecayRate**: `number`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:29](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/CognitiveWorkingMemory.ts#L29)

Activation decay rate per turn (0-1).

#### Default

```ts
0.1
```

***

### baseCapacity

> **baseCapacity**: `number`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/CognitiveWorkingMemory.ts#L23)

Base capacity (Miller's number).

#### Default

```ts
7
```

***

### minActivation

> **minActivation**: `number`

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:31](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/CognitiveWorkingMemory.ts#L31)

Minimum activation before a slot is eligible for eviction.

#### Default

```ts
0.15
```

***

### onEvict()?

> `optional` **onEvict**: (`slotId`, `traceId`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:27](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/CognitiveWorkingMemory.ts#L27)

Callback when a slot is evicted (should encode into episodic LTM).

#### Parameters

##### slotId

`string`

##### traceId

`string`

#### Returns

`Promise`\<`void`\>

***

### traits

> **traits**: [`HexacoTraits`](HexacoTraits.md)

Defined in: [packages/agentos/src/memory/core/working/CognitiveWorkingMemory.ts:25](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/CognitiveWorkingMemory.ts#L25)

HEXACO traits for personality-modulated capacity.
