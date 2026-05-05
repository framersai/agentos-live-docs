# Type Alias: TaskType

> **TaskType** = `"text"` \| `"image"` \| `"embedding"`

Defined in: [packages/agentos/src/api/model.ts:223](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/model.ts#L223)

Supported task types used when looking up a provider's default model.

- `"text"` — text completion / chat (generateText, streamText, agent)
- `"image"` — image generation (generateImage)
- `"embedding"` — embedding generation
