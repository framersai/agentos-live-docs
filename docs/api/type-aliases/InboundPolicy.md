# Type Alias: InboundPolicy

> **InboundPolicy** = `"disabled"` \| `"allowlist"` \| `"pairing"` \| `"open"`

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:165](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L165)

Inbound call policy -- how the agent handles incoming calls.
- `disabled`: Reject all inbound calls.
- `allowlist`: Only accept from allowed numbers.
- `pairing`: Accept and pair with agent owner.
- `open`: Accept all inbound calls.
