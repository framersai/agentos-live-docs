# Class: ObservationReflector

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:105](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/ObservationReflector.ts#L105)

Condenses compressed observations into higher-level reflections.

Runs when accumulated compressed observations exceed 40,000 tokens
(configurable). Each reflection captures a long-lived pattern such as
a user preference, behavioral habit, capability, relationship dynamic,
or goal.

## Constructors

### Constructor

> **new ObservationReflector**(`llmInvoker`): `ObservationReflector`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:109](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/ObservationReflector.ts#L109)

#### Parameters

##### llmInvoker

(`system`, `user`) => `Promise`\<`string`\>

Function that calls an LLM with (system, user) prompts.

#### Returns

`ObservationReflector`

## Methods

### reflect()

> **reflect**(`observations`): `Promise`\<[`Reflection`](../interfaces/Reflection.md)[]\>

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:119](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/ObservationReflector.ts#L119)

Reflect on compressed observations to extract higher-level patterns.

#### Parameters

##### observations

[`CompressedObservation`](../interfaces/CompressedObservation.md)[]

Compressed observations to reflect on.

#### Returns

`Promise`\<[`Reflection`](../interfaces/Reflection.md)[]\>

Array of reflections. Returns empty array on LLM failure.
