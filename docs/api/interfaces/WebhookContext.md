# Interface: WebhookContext

Defined in: [packages/agentos/src/channels/telephony/types.ts:397](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L397)

Raw webhook context passed to provider verification.

Encapsulates everything a provider needs to verify a webhook's authenticity
and parse its payload, without coupling to any specific HTTP framework
(Express, Fastify, Koa, etc.).

## Properties

### body

> **body**: `string` \| `Buffer`

Defined in: [packages/agentos/src/channels/telephony/types.ts:405](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L405)

Raw request body (string or Buffer).

***

### headers

> **headers**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:403](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L403)

HTTP headers.

***

### method

> **method**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:399](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L399)

HTTP method (usually POST).

***

### parsedBody?

> `optional` **parsedBody**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:407](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L407)

Parsed body (for providers that need form-encoded data).

***

### url

> **url**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:401](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L401)

Full request URL (used for signature verification).
