# Type Alias: InboundPolicy

> **InboundPolicy** = `"disabled"` \| `"allowlist"` \| `"pairing"` \| `"open"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:165](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L165)

Inbound call policy -- how the agent handles incoming calls.
- `disabled`: Reject all inbound calls.
- `allowlist`: Only accept from allowed numbers.
- `pairing`: Accept and pair with agent owner.
- `open`: Accept all inbound calls.
