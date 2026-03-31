# Type Alias: TaskType

> **TaskType** = `"text"` \| `"image"` \| `"embedding"`

Defined in: [packages/agentos/src/api/model.ts:211](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/model.ts#L211)

Supported task types used when looking up a provider's default model.

- `"text"` — text completion / chat (generateText, streamText, agent)
- `"image"` — image generation (generateImage)
- `"embedding"` — embedding generation
