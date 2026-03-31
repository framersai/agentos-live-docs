# Type Alias: CallMode

> **CallMode** = `"notify"` \| `"conversation"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:151](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/types.ts#L151)

How the agent interacts during a call:
- `notify`: Speak a message and hang up (one-way TTS).
- `conversation`: Full duplex conversation with STT + LLM + TTS loop.
