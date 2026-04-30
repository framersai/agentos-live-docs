# Interface: CommanderDecision

Defined in: [apps/paracosm/src/runtime/contracts.ts:60](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L60)

## Properties

### decision

> **decision**: `string`

Defined in: [apps/paracosm/src/runtime/contracts.ts:63](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L63)

***

### departmentsConsulted

> **departmentsConsulted**: `string`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:73](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L73)

***

### expectedTradeoffs

> **expectedTradeoffs**: `string`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:76](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L76)

***

### rationale

> **rationale**: `string`

Defined in: [apps/paracosm/src/runtime/contracts.ts:64](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L64)

***

### reasoning?

> `optional` **reasoning**: `string`

Defined in: [apps/paracosm/src/runtime/contracts.ts:72](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L72)

Full stepwise reasoning populated by the commander's CoT prompt
(numbered list: personality pole, dept consensus, forged-tool
evidence, risk tradeoff, final choice). Empty string on pre-Zod
runs or on schema fallback. Dashboard renders behind a
"show full analysis" expand; `rationale` is the compressed view.

***

### rejectedPolicies

> **rejectedPolicies**: `object`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:75](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L75)

#### policy

> **policy**: `string`

#### reason

> **reason**: `string`

***

### selectedEffectIds?

> `optional` **selectedEffectIds**: `string`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:62](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L62)

***

### selectedOptionId?

> `optional` **selectedOptionId**: `string`

Defined in: [apps/paracosm/src/runtime/contracts.ts:61](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L61)

***

### selectedPolicies

> **selectedPolicies**: `string`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:74](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L74)

***

### watchMetricsNextTurn

> **watchMetricsNextTurn**: `string`[]

Defined in: [apps/paracosm/src/runtime/contracts.ts:77](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/contracts.ts#L77)
