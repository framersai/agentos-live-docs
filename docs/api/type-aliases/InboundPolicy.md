# Type Alias: InboundPolicy

> **InboundPolicy** = `"disabled"` \| `"allowlist"` \| `"pairing"` \| `"open"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:165](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L165)

Inbound call policy -- how the agent handles incoming calls.
- `disabled`: Reject all inbound calls.
- `allowlist`: Only accept from allowed numbers.
- `pairing`: Accept and pair with agent owner.
- `open`: Accept all inbound calls.
