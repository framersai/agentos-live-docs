# Class: StuckDetector

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:49](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/runtime/StuckDetector.ts#L49)

## Constructors

### Constructor

> **new StuckDetector**(`config?`): `StuckDetector`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/runtime/StuckDetector.ts#L54)

#### Parameters

##### config?

`Partial`\<[`StuckDetectorConfig`](../interfaces/StuckDetectorConfig.md)\>

#### Returns

`StuckDetector`

## Methods

### clearAgent()

> **clearAgent**(`agentId`): `void`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:101](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/runtime/StuckDetector.ts#L101)

#### Parameters

##### agentId

`string`

#### Returns

`void`

***

### clearAll()

> **clearAll**(): `void`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:106](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/runtime/StuckDetector.ts#L106)

#### Returns

`void`

***

### recordError()

> **recordError**(`agentId`, `errorMessage`): [`StuckDetection`](../interfaces/StuckDetection.md)

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:83](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/runtime/StuckDetector.ts#L83)

#### Parameters

##### agentId

`string`

##### errorMessage

`string`

#### Returns

[`StuckDetection`](../interfaces/StuckDetection.md)

***

### recordOutput()

> **recordOutput**(`agentId`, `output`): [`StuckDetection`](../interfaces/StuckDetection.md)

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:58](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/runtime/StuckDetector.ts#L58)

#### Parameters

##### agentId

`string`

##### output

`string`

#### Returns

[`StuckDetection`](../interfaces/StuckDetection.md)
