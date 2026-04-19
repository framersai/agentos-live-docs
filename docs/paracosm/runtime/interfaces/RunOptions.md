# Interface: RunOptions

Defined in: [runtime/orchestrator.ts:75](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L75)

## Properties

### activeDepartments?

> `optional` **activeDepartments**: `string`[]

Defined in: [runtime/orchestrator.ts:81](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L81)

***

### customEvents?

> `optional` **customEvents**: `object`[]

Defined in: [runtime/orchestrator.ts:84](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L84)

#### description

> **description**: `string`

#### title

> **title**: `string`

#### turn

> **turn**: `number`

***

### economics?

> `optional` **economics**: [`ResolvedEconomicsProfile`](ResolvedEconomicsProfile.md)

Defined in: [runtime/orchestrator.ts:86](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L86)

***

### execution?

> `optional` **execution**: `Partial`\<`SimulationExecutionConfig`\>

Defined in: [runtime/orchestrator.ts:90](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L90)

***

### initialPopulation?

> `optional` **initialPopulation**: `number`

Defined in: [runtime/orchestrator.ts:87](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L87)

***

### liveSearch?

> `optional` **liveSearch**: `boolean`

Defined in: [runtime/orchestrator.ts:80](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L80)

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [runtime/orchestrator.ts:76](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L76)

***

### models?

> `optional` **models**: `Partial`\<[`SimulationModelConfig`](../../engine/interfaces/SimulationModelConfig.md)\>

Defined in: [runtime/orchestrator.ts:85](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L85)

***

### onEvent()?

> `optional` **onEvent**: (`event`) => `void`

Defined in: [runtime/orchestrator.ts:83](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L83)

#### Parameters

##### event

[`SimEvent`](../type-aliases/SimEvent.md)

#### Returns

`void`

***

### provider?

> `optional` **provider**: [`LlmProvider`](../../engine/type-aliases/LlmProvider.md)

Defined in: [runtime/orchestrator.ts:82](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L82)

***

### scenario?

> `optional` **scenario**: [`ScenarioPackage`](../../engine/interfaces/ScenarioPackage.md)

Defined in: [runtime/orchestrator.ts:91](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L91)

***

### seed?

> `optional` **seed**: `number`

Defined in: [runtime/orchestrator.ts:77](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L77)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [runtime/orchestrator.ts:102](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L102)

Cancellation signal. When `.aborted` flips to true, the turn loop
short-circuits at the next turn boundary, emits a `sim_aborted`
event, and returns the partial result accumulated so far.

Server wires this to an AbortController that fires after a grace
period of zero connected SSE clients, so a user who closes the tab
or navigates away stops billing for new LLM calls while preserving
the partial results they already accumulated in the event buffer.

***

### startingPolitics?

> `optional` **startingPolitics**: `StartingPolitics`

Defined in: [runtime/orchestrator.ts:89](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L89)

***

### startingResources?

> `optional` **startingResources**: `StartingResources`

Defined in: [runtime/orchestrator.ts:88](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L88)

***

### startYear?

> `optional` **startYear**: `number`

Defined in: [runtime/orchestrator.ts:78](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L78)

***

### yearsPerTurn?

> `optional` **yearsPerTurn**: `number`

Defined in: [runtime/orchestrator.ts:79](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/orchestrator.ts#L79)
