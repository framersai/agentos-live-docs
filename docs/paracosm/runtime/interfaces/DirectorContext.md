# Interface: DirectorContext

Defined in: [runtime/director.ts:52](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L52)

Context passed to the Event Director for generating turn events.

## Properties

### agentMoodSummary?

> `optional` **agentMoodSummary**: `string`

Defined in: [runtime/director.ts:82](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L82)

Agent mood summary from last turn

***

### aliveCount

> **aliveCount**: `number`

Defined in: [runtime/director.ts:64](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L64)

***

### ~~colony?~~

> `optional` **colony**: `Record`\<`string`, `number`\>

Defined in: [runtime/director.ts:91](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L91)

#### Deprecated

Use state

***

### driftSummary

> **driftSummary**: `object`[]

Defined in: [runtime/director.ts:78](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L78)

#### conscientiousness

> **conscientiousness**: `number`

#### name

> **name**: `string`

#### openness

> **openness**: `number`

#### role

> **role**: `string`

***

### knowledgeCategories?

> `optional` **knowledgeCategories**: `string`[]

Defined in: [runtime/director.ts:87](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L87)

Categories the scenario knows about (from KnowledgeBundle.categoryMapping).

***

### knowledgeTopics?

> `optional` **knowledgeTopics**: `string`[]

Defined in: [runtime/director.ts:85](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L85)

Knowledge topic IDs available in the scenario knowledge bundle.
 Provides grounding for researchKeywords so events tie back to real citations.

***

### leaderArchetype

> **leaderArchetype**: `string`

Defined in: [runtime/director.ts:56](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L56)

***

### leaderHexaco

> **leaderHexaco**: [`HexacoProfile`](../../engine/interfaces/HexacoProfile.md)

Defined in: [runtime/director.ts:57](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L57)

***

### leaderHexacoHistory?

> `optional` **leaderHexacoHistory**: [`HexacoSnapshot`](../../engine/interfaces/HexacoSnapshot.md)[]

Defined in: [runtime/director.ts:59](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L59)

Commander's HEXACO per-turn history for trajectory cue generation.

***

### leaderName

> **leaderName**: `string`

Defined in: [runtime/director.ts:55](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L55)

***

### ~~marsBornCount?~~

> `optional` **marsBornCount**: `number`

Defined in: [runtime/director.ts:95](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L95)

#### Deprecated

Use nativeBornCount

***

### nativeBornCount

> **nativeBornCount**: `number`

Defined in: [runtime/director.ts:66](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L66)

Count of agents born at the settlement (vs arrived from elsewhere)

***

### politics

> **politics**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [runtime/director.ts:63](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L63)

Political/social state variables

***

### ~~previousCrises?~~

> `optional` **previousCrises**: `object`[]

Defined in: [runtime/director.ts:93](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L93)

#### ~~category~~

> **category**: `string`

#### ~~decision?~~

> `optional` **decision**: `string`

#### ~~outcome~~

> **outcome**: [`TurnOutcome`](../../engine/type-aliases/TurnOutcome.md)

#### ~~selectedOptionId?~~

> `optional` **selectedOptionId**: `string`

#### ~~title~~

> **title**: `string`

#### ~~turn~~

> **turn**: `number`

#### Deprecated

Use previousEvents

***

### previousEvents

> **previousEvents**: `object`[]

Defined in: [runtime/director.ts:69](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L69)

#### category

> **category**: `string`

#### decision?

> `optional` **decision**: `string`

#### outcome

> **outcome**: [`TurnOutcome`](../../engine/type-aliases/TurnOutcome.md)

#### selectedOptionId?

> `optional` **selectedOptionId**: `string`

#### title

> **title**: `string`

#### turn

> **turn**: `number`

***

### recentBirths

> **recentBirths**: `number`

Defined in: [runtime/director.ts:68](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L68)

***

### recentDeaths

> **recentDeaths**: `number`

Defined in: [runtime/director.ts:67](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L67)

***

### recentToolOutputs

> **recentToolOutputs**: `object`[]

Defined in: [runtime/director.ts:80](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L80)

Key outputs from forged tools last turn

#### department

> **department**: `string`

#### name

> **name**: `string`

#### output

> **output**: `string`

***

### state

> **state**: `Record`\<`string`, `number`\>

Defined in: [runtime/director.ts:61](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L61)

Scenario state metrics (population, morale, resources, etc.)

***

### toolsForged

> **toolsForged**: `string`[]

Defined in: [runtime/director.ts:77](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L77)

***

### turn

> **turn**: `number`

Defined in: [runtime/director.ts:53](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L53)

***

### year

> **year**: `number`

Defined in: [runtime/director.ts:54](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L54)
