# Type Alias: InboundPolicy

> **InboundPolicy** = `"disabled"` \| `"allowlist"` \| `"pairing"` \| `"open"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:165](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L165)

Inbound call policy -- how the agent handles incoming calls.
- `disabled`: Reject all inbound calls.
- `allowlist`: Only accept from allowed numbers.
- `pairing`: Accept and pair with agent owner.
- `open`: Accept all inbound calls.
