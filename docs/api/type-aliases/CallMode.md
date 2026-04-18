# Type Alias: CallMode

> **CallMode** = `"notify"` \| `"conversation"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:151](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L151)

How the agent interacts during a call:
- `notify`: Speak a message and hang up (one-way TTS).
- `conversation`: Full duplex conversation with STT + LLM + TTS loop.
