# Interface: ExtensionPackEvent

Defined in: [packages/agentos/src/extensions/events.ts:14](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/events.ts#L14)

## Extends

- [`ExtensionEventBase`](ExtensionEventBase.md)

## Properties

### error?

> `optional` **error**: `Error`

Defined in: [packages/agentos/src/extensions/events.ts:17](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/events.ts#L17)

***

### source

> **source**: [`ExtensionSourceMetadata`](ExtensionSourceMetadata.md)

Defined in: [packages/agentos/src/extensions/events.ts:16](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/events.ts#L16)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/extensions/events.ts:11](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/events.ts#L11)

#### Inherited from

[`ExtensionEventBase`](ExtensionEventBase.md).[`timestamp`](ExtensionEventBase.md#timestamp)

***

### type

> **type**: `"pack:loaded"` \| `"pack:failed"`

Defined in: [packages/agentos/src/extensions/events.ts:15](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/events.ts#L15)

#### Overrides

[`ExtensionEventBase`](ExtensionEventBase.md).[`type`](ExtensionEventBase.md#type)
