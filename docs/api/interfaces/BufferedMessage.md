# Interface: BufferedMessage

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:15](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/pipeline/observation/ObservationBuffer.ts#L15)

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:17](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/pipeline/observation/ObservationBuffer.ts#L17)

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:16](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/pipeline/observation/ObservationBuffer.ts#L16)

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:18](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/pipeline/observation/ObservationBuffer.ts#L18)

***

### tokenEstimate

> **tokenEstimate**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationBuffer.ts:20](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/pipeline/observation/ObservationBuffer.ts#L20)

Cached token estimate for this message.
