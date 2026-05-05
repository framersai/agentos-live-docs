# Interface: ScenarioLabels

Defined in: [apps/paracosm/src/engine/types.ts:22](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L22)

Human-readable labels for a scenario, used in UI and output naming.

## Properties

### actorNoun?

> `optional` **actorNoun**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:50](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L50)

Singular display word for the swappable decision-making entity that
runs each parallel counterfactual. Defaults to "actor" — the universal
abstract type. Scenarios specialize it: Mars Genesis sets "commander",
a hurricane scenario sets "incident commander", an AI release sets
"release director", a quantum-game scenario sets "player". The
engine type stays `ActorConfig` for SDK back-compat; this label is
for UI / copy / button text rendering only.

***

### actorNounPlural?

> `optional` **actorNounPlural**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:52](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L52)

Plural form of `actorNoun`. Defaults to "actors".

***

### currency

> **currency**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:32](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L32)

Currency unit (e.g., "credits")

***

### eventNoun?

> `optional` **eventNoun**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:34](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L34)

What to call turn events (e.g., "crises", "events", "incidents", "scenarios"). Default: "events"

***

### eventNounSingular?

> `optional` **eventNounSingular**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:36](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L36)

What to call a single turn event (e.g., "crisis", "event", "incident"). Default: "event"

***

### name

> **name**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:24](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L24)

Full display name (e.g., "Mars Genesis")

***

### populationNoun

> **populationNoun**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:28](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L28)

What to call population members (e.g., "colonists", "crew members")

***

### settlementNoun

> **settlementNoun**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:30](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L30)

What to call the settlement (e.g., "colony", "outpost")

***

### shortName

> **shortName**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:26](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L26)

Short identifier used in file names and localStorage keys

***

### timeUnitNoun?

> `optional` **timeUnitNoun**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:38](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L38)

Singular display word for one simulation time-unit (e.g., "year", "hour", "quarter", "tick"). Default when absent: "tick".

***

### timeUnitNounPlural?

> `optional` **timeUnitNounPlural**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:40](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L40)

Plural form of `timeUnitNoun` (e.g., "years", "hours", "quarters", "ticks"). Default when absent: "ticks".
