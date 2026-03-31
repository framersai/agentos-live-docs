# Interface: ExtensionDescriptorEvent\<TPayload\>

Defined in: [packages/agentos/src/extensions/events.ts:20](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/events.ts#L20)

## Extends

- [`ExtensionEventBase`](ExtensionEventBase.md)

## Type Parameters

### TPayload

`TPayload` = `unknown`

## Properties

### descriptor

> **descriptor**: [`ExtensionDescriptor`](ExtensionDescriptor.md)\<`TPayload`\>

Defined in: [packages/agentos/src/extensions/events.ts:22](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/events.ts#L22)

***

### kind

> **kind**: `string`

Defined in: [packages/agentos/src/extensions/events.ts:23](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/events.ts#L23)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/extensions/events.ts:11](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/events.ts#L11)

#### Inherited from

[`ExtensionEventBase`](ExtensionEventBase.md).[`timestamp`](ExtensionEventBase.md#timestamp)

***

### type

> **type**: `"descriptor:activated"` \| `"descriptor:deactivated"`

Defined in: [packages/agentos/src/extensions/events.ts:21](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/events.ts#L21)

#### Overrides

[`ExtensionEventBase`](ExtensionEventBase.md).[`type`](ExtensionEventBase.md#type)
