# Class: MetricRegistry

Defined in: [engine/metric-registry.ts:5](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L5)

## Constructors

### Constructor

> **new MetricRegistry**(`definitions`): `MetricRegistry`

Defined in: [engine/metric-registry.ts:8](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L8)

#### Parameters

##### definitions

[`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

#### Returns

`MetricRegistry`

## Methods

### all()

> **all**(): [`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

Defined in: [engine/metric-registry.ts:16](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L16)

#### Returns

[`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

***

### get()

> **get**(`id`): [`ScenarioMetric`](../interfaces/ScenarioMetric.md) \| `undefined`

Defined in: [engine/metric-registry.ts:12](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L12)

#### Parameters

##### id

`string`

#### Returns

[`ScenarioMetric`](../interfaces/ScenarioMetric.md) \| `undefined`

***

### getByCategory()

> **getByCategory**(`category`): [`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

Defined in: [engine/metric-registry.ts:24](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L24)

#### Parameters

##### category

`"metric"` | `"capacity"` | `"status"` | `"politic"`

#### Returns

[`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

***

### getHeaderMetrics()

> **getHeaderMetrics**(): [`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

Defined in: [engine/metric-registry.ts:20](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L20)

#### Returns

[`ScenarioMetric`](../interfaces/ScenarioMetric.md)[]

***

### getInitialValues()

> **getInitialValues**(): `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [engine/metric-registry.ts:28](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/metric-registry.ts#L28)

#### Returns

`Record`\<`string`, `number` \| `string` \| `boolean`\>
