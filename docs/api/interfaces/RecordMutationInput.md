# Interface: RecordMutationInput

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:70](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L70)

Input parameters for recording a new personality mutation.

The `strength` and `createdAt` fields are set automatically by the store
(1.0 and `Date.now()` respectively).

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:72](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L72)

The agent making the mutation.

***

### baselineValue

> **baselineValue**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:84](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L84)

The trait value before mutation.

***

### delta

> **delta**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:78](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L78)

The signed delta to apply.

***

### mutatedValue

> **mutatedValue**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:87](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L87)

The trait value after mutation.

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:81](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L81)

Free-text reasoning for the mutation.

***

### trait

> **trait**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:75](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/PersonalityMutationStore.ts#L75)

The HEXACO trait being mutated.
