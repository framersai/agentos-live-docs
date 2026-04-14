# Interface: EmergentToolPackageManifest

Defined in: [packages/agentos/src/emergent/ToolPackage.ts:33](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/ToolPackage.ts#L33)

## Properties

### exportedAt

> **exportedAt**: `string`

Defined in: [packages/agentos/src/emergent/ToolPackage.ts:36](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/ToolPackage.ts#L36)

***

### packageType

> **packageType**: `"emergent-tool"`

Defined in: [packages/agentos/src/emergent/ToolPackage.ts:35](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/ToolPackage.ts#L35)

***

### portability

> **portability**: `object`

Defined in: [packages/agentos/src/emergent/ToolPackage.ts:37](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/ToolPackage.ts#L37)

#### portable

> **portable**: `boolean`

#### warnings

> **warnings**: `string`[]

***

### schemaVersion

> **schemaVersion**: `"agentos.emergent-tool.v1"`

Defined in: [packages/agentos/src/emergent/ToolPackage.ts:34](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/ToolPackage.ts#L34)

***

### tool

> **tool**: `object`

Defined in: [packages/agentos/src/emergent/ToolPackage.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/ToolPackage.ts#L41)

#### createdAt

> **createdAt**: `string`

#### createdBy

> **createdBy**: `string`

#### description

> **description**: `string`

#### implementation

> **implementation**: [`PortableToolImplementation`](../type-aliases/PortableToolImplementation.md)

#### inputSchema

> **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

#### judgeVerdicts

> **judgeVerdicts**: ([`CreationVerdict`](CreationVerdict.md) \| [`PromotionVerdict`](PromotionVerdict.md))[]

#### name

> **name**: `string`

#### originalTier

> **originalTier**: [`ToolTier`](../type-aliases/ToolTier.md)

#### originalToolId

> **originalToolId**: `string`

#### outputSchema

> **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

#### source

> **source**: `string`

#### usageStats

> **usageStats**: [`ToolUsageStats`](ToolUsageStats.md)
