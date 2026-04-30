# Interface: GoogleChatAuthParams

Defined in: [packages/agentos/src/channels/adapters/GoogleChatChannelAdapter.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/GoogleChatChannelAdapter.ts#L49)

Platform-specific authentication parameters for Google Chat.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### credentials?

> `optional` **credentials**: `string`

Defined in: [packages/agentos/src/channels/adapters/GoogleChatChannelAdapter.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/GoogleChatChannelAdapter.ts#L54)

Inline JSON credentials for the service account.
Provide this OR use `credential` as a path to the key file.

***

### defaultSpace?

> `optional` **defaultSpace**: `string`

Defined in: [packages/agentos/src/channels/adapters/GoogleChatChannelAdapter.ts:59](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/GoogleChatChannelAdapter.ts#L59)

Space name to listen in (e.g., 'spaces/AAAA...').
Optional — the adapter can send to any space when given a conversation ID.
