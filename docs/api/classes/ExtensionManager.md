# Class: ExtensionManager

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:66](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L66)

Coordinates discovery and lifecycle management for extension packs. Packs
emit descriptors which are registered into kind-specific registries.

## Constructors

### Constructor

> **new ExtensionManager**(`options?`): `ExtensionManager`

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L85)

#### Parameters

##### options?

`ExtensionManagerOptions` = `{}`

#### Returns

`ExtensionManager`

## Methods

### getRegistry()

> **getRegistry**\<`TPayload`\>(`kind`): [`ExtensionRegistry`](ExtensionRegistry.md)\<`TPayload`\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:298](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L298)

Provides the registry for a particular kind, creating it if necessary.

#### Type Parameters

##### TPayload

`TPayload`

#### Parameters

##### kind

`string`

#### Returns

[`ExtensionRegistry`](ExtensionRegistry.md)\<`TPayload`\>

***

### listLoadedPacks()

> **listLoadedPacks**(): `object`[]

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:283](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L283)

List pack metadata for packs loaded during this process lifetime.

#### Returns

`object`[]

***

### loadManifest()

> **loadManifest**(`context?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:103](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L103)

Loads packs defined in the manifest, registering their descriptors in the
appropriate registries. Supports factory-based packs as well as resolving
packs from `package` and `module` manifest entries.

#### Parameters

##### context?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<`void`\>

***

### loadPackEntry()

> **loadPackEntry**(`entry`, `lifecycleContext?`): `Promise`\<\{ `key`: `string`; `loaded`: `true`; `pack`: \{ `identifier?`: `string`; `name`: `string`; `version?`: `string`; \}; \} \| \{ `key?`: `string`; `loaded`: `false`; `reason`: `"disabled"` \| `"already_loaded"` \| `"unresolved"`; `skipped`: `true`; \} \| \{ `error`: `Error`; `key?`: `string`; `loaded`: `false`; `reason`: `"failed"`; `skipped`: `false`; `sourceName`: `string`; \}\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:158](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L158)

Load a single manifest entry at runtime, applying the same resolution,
secret hydration, registration, and event emission logic as [loadManifest](#loadmanifest).

This enables schema-on-demand / lazy-loading flows where an agent can
enable an extension pack mid-session.

#### Parameters

##### entry

[`ExtensionPackManifestEntry`](../type-aliases/ExtensionPackManifestEntry.md)

##### lifecycleContext?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<\{ `key`: `string`; `loaded`: `true`; `pack`: \{ `identifier?`: `string`; `name`: `string`; `version?`: `string`; \}; \} \| \{ `key?`: `string`; `loaded`: `false`; `reason`: `"disabled"` \| `"already_loaded"` \| `"unresolved"`; `skipped`: `true`; \} \| \{ `error`: `Error`; `key?`: `string`; `loaded`: `false`; `reason`: `"failed"`; `skipped`: `false`; `sourceName`: `string`; \}\>

***

### loadPackFromFactory()

> **loadPackFromFactory**(`pack`, `identifier?`, `options?`, `lifecycleContext?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:129](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L129)

Directly loads a pack instance (typically produced by an inline factory)
and registers all of its descriptors.

#### Parameters

##### pack

[`ExtensionPack`](../interfaces/ExtensionPack.md)

##### identifier?

`string`

##### options?

`Record`\<`string`, `unknown`\>

##### lifecycleContext?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<`void`\>

***

### loadPackFromModule()

> **loadPackFromModule**(`moduleSpecifier`, `options?`, `identifier?`, `lifecycleContext?`): `Promise`\<\{ `key`: `string`; `loaded`: `true`; `pack`: \{ `identifier?`: `string`; `name`: `string`; `version?`: `string`; \}; \} \| \{ `key?`: `string`; `loaded`: `false`; `reason`: `"disabled"` \| `"already_loaded"` \| `"unresolved"`; `skipped`: `true`; \} \| \{ `error`: `Error`; `key?`: `string`; `loaded`: `false`; `reason`: `"failed"`; `skipped`: `false`; `sourceName`: `string`; \}\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:262](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L262)

Convenience: load an extension pack by local module specifier at runtime.

#### Parameters

##### moduleSpecifier

`string`

##### options?

`Record`\<`string`, `unknown`\>

##### identifier?

`string`

##### lifecycleContext?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<\{ `key`: `string`; `loaded`: `true`; `pack`: \{ `identifier?`: `string`; `name`: `string`; `version?`: `string`; \}; \} \| \{ `key?`: `string`; `loaded`: `false`; `reason`: `"disabled"` \| `"already_loaded"` \| `"unresolved"`; `skipped`: `true`; \} \| \{ `error`: `Error`; `key?`: `string`; `loaded`: `false`; `reason`: `"failed"`; `skipped`: `false`; `sourceName`: `string`; \}\>

***

### loadPackFromPackage()

> **loadPackFromPackage**(`packageName`, `options?`, `identifier?`, `lifecycleContext?`): `Promise`\<\{ `key`: `string`; `loaded`: `true`; `pack`: \{ `identifier?`: `string`; `name`: `string`; `version?`: `string`; \}; \} \| \{ `key?`: `string`; `loaded`: `false`; `reason`: `"disabled"` \| `"already_loaded"` \| `"unresolved"`; `skipped`: `true`; \} \| \{ `error`: `Error`; `key?`: `string`; `loaded`: `false`; `reason`: `"failed"`; `skipped`: `false`; `sourceName`: `string`; \}\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:241](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L241)

Convenience: load an extension pack by npm package name at runtime.

#### Parameters

##### packageName

`string`

##### options?

`Record`\<`string`, `unknown`\>

##### identifier?

`string`

##### lifecycleContext?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<\{ `key`: `string`; `loaded`: `true`; `pack`: \{ `identifier?`: `string`; `name`: `string`; `version?`: `string`; \}; \} \| \{ `key?`: `string`; `loaded`: `false`; `reason`: `"disabled"` \| `"already_loaded"` \| `"unresolved"`; `skipped`: `true`; \} \| \{ `error`: `Error`; `key?`: `string`; `loaded`: `false`; `reason`: `"failed"`; `skipped`: `false`; `sourceName`: `string`; \}\>

***

### off()

> **off**(`listener`): `void`

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:121](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L121)

#### Parameters

##### listener

[`ExtensionEventListener`](../type-aliases/ExtensionEventListener.md)

#### Returns

`void`

***

### on()

> **on**(`listener`): `void`

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L117)

Registers a listener for extension lifecycle events.

#### Parameters

##### listener

[`ExtensionEventListener`](../type-aliases/ExtensionEventListener.md)

#### Returns

`void`

***

### shutdown()

> **shutdown**(`context?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionManager.ts:313](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionManager.ts#L313)

Deactivates all loaded descriptors and extension packs.

This is intentionally best-effort: one failing deactivation should not
prevent other packs/descriptors from shutting down.

#### Parameters

##### context?

[`ExtensionLifecycleContext`](../interfaces/ExtensionLifecycleContext.md)

#### Returns

`Promise`\<`void`\>
