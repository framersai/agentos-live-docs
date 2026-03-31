# Interface: RetrievalUpdateResult

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:40](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L40)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L50)

Incremented access count.

***

### encodingStrength

> **encodingStrength**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:42](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L42)

New encoding strength (small bump).

***

### lastAccessedAt

> **lastAccessedAt**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:48](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L48)

Updated timestamp.

***

### nextReinforcementAt

> **nextReinforcementAt**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L54)

Next reinforcement due.

***

### reinforcementInterval

> **reinforcementInterval**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L52)

Doubled reinforcement interval.

***

### retrievalCount

> **retrievalCount**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:46](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L46)

Incremented retrieval count.

***

### stability

> **stability**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:44](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/decay/DecayModel.ts#L44)

New stability (grows based on difficulty).
