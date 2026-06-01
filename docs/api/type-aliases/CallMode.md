# Type Alias: CallMode

> **CallMode** = `"notify"` \| `"conversation"`

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:151](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L151)

How the agent interacts during a call:
- `notify`: Speak a message and hang up (one-way TTS).
- `conversation`: Full duplex conversation with STT + LLM + TTS loop.
