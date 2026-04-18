# Type Alias: TaskType

> **TaskType** = `"text"` \| `"image"` \| `"embedding"`

Defined in: [packages/agentos/src/api/model.ts:211](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/model.ts#L211)

Supported task types used when looking up a provider's default model.

- `"text"` — text completion / chat (generateText, streamText, agent)
- `"image"` — image generation (generateImage)
- `"embedding"` — embedding generation
