# Type Alias: CallMode

> **CallMode** = `"notify"` \| `"conversation"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:151](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L151)

How the agent interacts during a call:
- `notify`: Speak a message and hang up (one-way TTS).
- `conversation`: Full duplex conversation with STT + LLM + TTS loop.
