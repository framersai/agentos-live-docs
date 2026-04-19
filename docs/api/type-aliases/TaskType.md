# Type Alias: TaskType

> **TaskType** = `"text"` \| `"image"` \| `"embedding"`

Defined in: [packages/agentos/src/api/model.ts:211](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/model.ts#L211)

Supported task types used when looking up a provider's default model.

- `"text"` — text completion / chat (generateText, streamText, agent)
- `"image"` — image generation (generateImage)
- `"embedding"` — embedding generation
