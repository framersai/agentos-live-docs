# Type Alias: CallMode

> **CallMode** = `"notify"` \| `"conversation"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:151](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L151)

How the agent interacts during a call:
- `notify`: Speak a message and hang up (one-way TTS).
- `conversation`: Full duplex conversation with STT + LLM + TTS loop.
