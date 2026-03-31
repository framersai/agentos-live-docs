# Class: ExtensionRegistry\<TPayload\>

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:22](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L22)

Maintains layered stacks of descriptors for a particular extension kind.
New registrations push onto the stack, allowing later descriptors to
override earlier ones while maintaining history for fallbacks or debugging.

## Type Parameters

### TPayload

`TPayload` = `unknown`

## Constructors

### Constructor

> **new ExtensionRegistry**\<`TPayload`\>(`kind`): `ExtensionRegistry`\<`TPayload`\>

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:25](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L25)

#### Parameters

##### kind

`string`

#### Returns

`ExtensionRegistry`\<`TPayload`\>

## Methods

### clear()

> **clear**(`context?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:133](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L133)

Clears all stacks, calling deactivate hooks for active descriptors.

#### Parameters

##### context?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<`void`\>

***

### getActive()

> **getActive**(`id`): [`ActiveExtensionDescriptor`](../interfaces/ActiveExtensionDescriptor.md)\<`TPayload`\> \| `undefined`

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L98)

Returns the active descriptor for the provided id.

#### Parameters

##### id

`string`

#### Returns

[`ActiveExtensionDescriptor`](../interfaces/ActiveExtensionDescriptor.md)\<`TPayload`\> \| `undefined`

***

### listActive()

> **listActive**(): [`ActiveExtensionDescriptor`](../interfaces/ActiveExtensionDescriptor.md)\<`TPayload`\>[]

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:106](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L106)

Lists all currently active descriptors for this registry.

#### Returns

[`ActiveExtensionDescriptor`](../interfaces/ActiveExtensionDescriptor.md)\<`TPayload`\>[]

***

### listHistory()

> **listHistory**(`id`): [`ActiveExtensionDescriptor`](../interfaces/ActiveExtensionDescriptor.md)\<`TPayload`\>[]

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:121](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L121)

Returns the full stack history for a descriptor id.

#### Parameters

##### id

`string`

#### Returns

[`ActiveExtensionDescriptor`](../interfaces/ActiveExtensionDescriptor.md)\<`TPayload`\>[]

***

### register()

> **register**(`descriptor`, `context?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L30)

Registers a descriptor, making it the active entry for its id.

#### Parameters

##### descriptor

[`ExtensionDescriptor`](../interfaces/ExtensionDescriptor.md)\<`TPayload`\>

##### context?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<`void`\>

***

### unregister()

> **unregister**(`id`, `context?`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/extensions/ExtensionRegistry.ts:61](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/ExtensionRegistry.ts#L61)

Removes the active descriptor for an id. If older descriptors exist in the
stack, they become active again.

#### Parameters

##### id

`string`

##### context?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<`boolean`\>
