# Interface: ExtensionDescriptorEvent\<TPayload\>

Defined in: [packages/agentos/src/extensions/events.ts:20](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/events.ts#L20)

## Extends

- [`ExtensionEventBase`](ExtensionEventBase.md)

## Type Parameters

### TPayload

`TPayload` = `unknown`

## Properties

### descriptor

> **descriptor**: [`ExtensionDescriptor`](ExtensionDescriptor.md)\<`TPayload`\>

Defined in: [packages/agentos/src/extensions/events.ts:22](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/events.ts#L22)

***

### kind

> **kind**: `string`

Defined in: [packages/agentos/src/extensions/events.ts:23](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/events.ts#L23)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/extensions/events.ts:11](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/events.ts#L11)

#### Inherited from

[`ExtensionEventBase`](ExtensionEventBase.md).[`timestamp`](ExtensionEventBase.md#timestamp)

***

### type

> **type**: `"descriptor:activated"` \| `"descriptor:deactivated"`

Defined in: [packages/agentos/src/extensions/events.ts:21](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/events.ts#L21)

#### Overrides

[`ExtensionEventBase`](ExtensionEventBase.md).[`type`](ExtensionEventBase.md#type)
