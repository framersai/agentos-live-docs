# Interface: SetupConfig

Defined in: [packages/agentos/src/rag/setup/types.ts:28](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/setup/types.ts#L28)

Configuration for auto-setup operations.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:36](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/setup/types.ts#L36)

API key for cloud instances.

***

### imageTag?

> `optional` **imageTag**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:32](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/setup/types.ts#L32)

Custom Docker image tag (e.g. 'v1.8.0').

***

### port?

> `optional` **port**: `number`

Defined in: [packages/agentos/src/rag/setup/types.ts:30](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/setup/types.ts#L30)

Custom port override.

***

### url?

> `optional` **url**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:34](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/setup/types.ts#L34)

Skip Docker and connect to this URL directly.
