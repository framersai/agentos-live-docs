# Interface: AgentOSConfig

Defined in: [packages/agentos/src/api/AgentOS.ts:407](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L407)

## Interface

AgentOSConfig

## Description

Defines the comprehensive configuration structure required to initialize and operate
the `AgentOS` service. This configuration object aggregates settings for all major
sub-components and dependencies of the AgentOS platform.

## Properties

### authService?

> `optional` **authService**: `IAuthService`

Defined in: [packages/agentos/src/api/AgentOS.ts:514](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L514)

Optional authentication service implementing `IAuthService`. Provide via the auth extension or your own adapter.

***

### conversationManagerConfig

> **conversationManagerConfig**: [`ConversationManagerConfig`](ConversationManagerConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:489](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L489)

Configuration for the [ConversationManager](../classes/ConversationManager.md).

***

### defaultPersonaId

> **defaultPersonaId**: `string`

Defined in: [packages/agentos/src/api/AgentOS.ts:495](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L495)

The default Persona ID to use if none is specified in an interaction.

***

### emergent?

> `optional` **emergent**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:680](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L680)

Enable emergent capability creation. When true, the agent gains access
to the `forge_tool` meta-tool and can create new tools at runtime.

#### Default

```ts
false
```

***

### emergentConfig?

> `optional` **emergentConfig**: `Partial`\<[`EmergentConfig`](EmergentConfig.md)\>

Defined in: [packages/agentos/src/api/AgentOS.ts:686](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L686)

Configuration for the emergent capability engine.
Only applies when `emergent: true`.

***

### extensionManifest?

> `optional` **extensionManifest**: [`ExtensionManifest`](ExtensionManifest.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:608](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L608)

Optional extension manifest describing packs to load.

***

### extensionOverrides?

> `optional` **extensionOverrides**: [`ExtensionOverrides`](ExtensionOverrides.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:610](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L610)

Declarative overrides applied after packs are loaded.

***

### extensionSecrets?

> `optional` **extensionSecrets**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:520](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L520)

Optional map of secretId -> value for extension/tool credentials.

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:562](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L562)

Optional stable registry of host-managed external tools.

This is the runtime-level default for helper APIs such as
`processRequestWithRegisteredTools(...)` and
`resumeExternalToolRequestWithRegisteredTools(...)`.

Per-call `externalTools` passed into those helpers override entries from
this configured registry by tool name.

***

### gmiManagerConfig

> **gmiManagerConfig**: [`GMIManagerConfig`](GMIManagerConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:409](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L409)

Configuration for the [GMIManager](../classes/GMIManager.md).

***

### guardrailService?

> `optional` **guardrailService**: [`IGuardrailService`](IGuardrailService.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:518](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L518)

Optional guardrail service implementation used for policy enforcement.

***

### hitlManager?

> `optional` **hitlManager**: [`IHumanInteractionManager`](IHumanInteractionManager.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:485](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L485)

Optional human-in-the-loop manager for approvals/clarifications.

***

### languageConfig?

> `optional` **languageConfig**: [`AgentOSLanguageConfig`](AgentOSLanguageConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:643](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L643)

Optional multilingual configuration enabling detection, negotiation, translation.

***

### longTermMemoryRetriever?

> `optional` **longTermMemoryRetriever**: [`ILongTermMemoryRetriever`](ILongTermMemoryRetriever.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:421](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L421)

Optional retriever for injecting durable long-term memory context into prompts
(e.g. user/org/persona memories stored in a RAG/KG).

***

### manageRetrievalAugmentorLifecycle?

> `optional` **manageRetrievalAugmentorLifecycle**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:442](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L442)

If true, AgentOS will call `retrievalAugmentor.shutdown()` during `AgentOS.shutdown()`.
Default: false (caller manages lifecycle).

***

### memoryTools?

> `optional` **memoryTools**: [`AgentOSMemoryToolsConfig`](AgentOSMemoryToolsConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:528](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L528)

Optional standalone-memory tool registration.

When provided, AgentOS will load the standalone memory editor tools as an
extension pack during initialization, making them immediately available to
the shared `ToolExecutor`/`ToolOrchestrator`.

***

### modelProviderManagerConfig

> **modelProviderManagerConfig**: [`AIModelProviderManagerConfig`](AIModelProviderManagerConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:493](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L493)

Configuration for the [AIModelProviderManager](../classes/AIModelProviderManager.md).

***

### observability?

> `optional` **observability**: [`AgentOSObservabilityConfig`](AgentOSObservabilityConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:692](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L692)

Optional observability config for tracing, metrics, and log correlation.
Default: disabled (opt-in).

***

### orchestratorConfig

> **orchestratorConfig**: [`AgentOSOrchestratorConfig`](AgentOSOrchestratorConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:411](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L411)

Configuration for the [AgentOSOrchestrator](../classes/AgentOSOrchestrator.md).

***

### personaLoader?

> `optional` **personaLoader**: `IPersonaLoader`

Defined in: [packages/agentos/src/api/AgentOS.ts:645](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L645)

Optional custom persona loader (useful for browser/local runtimes).

***

### prisma

> **prisma**: `PrismaClient`

Defined in: [packages/agentos/src/api/AgentOS.ts:512](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L512)

An instance of the Prisma client for database interactions.

**Optional when `storageAdapter` is provided:**
- If `storageAdapter` is provided, Prisma is only used for server-side features (auth, subscriptions).
- If `storageAdapter` is omitted, Prisma is required for all database operations.

**Client-side usage:**
```typescript
const storage = await createAgentOSStorage({ platform: 'web' });
await agentos.initialize({
  storageAdapter: storage.getAdapter(),
  prisma: mockPrisma,  // Stub for compatibility (can be minimal mock)
  // ...
});
```

***

### promptEngineConfig

> **promptEngineConfig**: [`PromptEngineConfig`](PromptEngineConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:481](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L481)

Configuration for the prompt engine.

***

### ragConfig?

> `optional` **ragConfig**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:457](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L457)

Optional configuration for AgentOS-managed RAG subsystem initialization.

When provided and enabled, AgentOS will:
- Initialize an `EmbeddingManager` with `EmbeddingManagerConfig`
- Initialize a `VectorStoreManager` with `VectorStoreManagerConfig` and `RagDataSourceConfig`
- Initialize a `RetrievalAugmentor` with `RetrievalAugmentorServiceConfig`
- Pass the resulting [IRetrievalAugmentor](IRetrievalAugmentor.md) into GMIs via the [GMIManager](../classes/GMIManager.md)

Notes:
- If `retrievalAugmentor` is provided, it takes precedence and this config is ignored.
- By default, when AgentOS creates the RAG subsystem it also manages lifecycle and will
  shut it down during [AgentOS.shutdown](../classes/AgentOS.md#shutdown).

#### bindToStorageAdapter?

> `optional` **bindToStorageAdapter**: `boolean`

When true (default), AgentOS injects its `storageAdapter` into SQL vector-store providers
that did not specify `adapter` or `storage`. This keeps vector persistence colocated with
the host database by default.

#### dataSourceConfigs

> **dataSourceConfigs**: `RagDataSourceConfig`[]

Logical data sources mapped onto vector store providers.

#### embeddingManagerConfig

> **embeddingManagerConfig**: `EmbeddingManagerConfig`

Embedding manager configuration (must include at least one embedding model).

#### enabled?

> `optional` **enabled**: `boolean`

Enable or disable AgentOS-managed RAG initialization. Default: true.

#### manageLifecycle?

> `optional` **manageLifecycle**: `boolean`

If true, AgentOS will shut down the augmentor and any owned vector store providers
during [AgentOS.shutdown](../classes/AgentOS.md#shutdown). Default: true.

#### retrievalAugmentorConfig

> **retrievalAugmentorConfig**: `RetrievalAugmentorServiceConfig`

Retrieval augmentor configuration (category behaviors, defaults).

#### vectorStoreManagerConfig

> **vectorStoreManagerConfig**: `VectorStoreManagerConfig`

Vector store manager configuration (providers).

***

### registryConfig?

> `optional` **registryConfig**: [`MultiRegistryConfig`](MultiRegistryConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:637](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L637)

Optional registry configuration for loading extensions and personas from custom sources.
Allows self-hosted registries and custom git repositories.

#### Example

```typescript
registryConfig: {
  registries: {
    'extensions': {
      type: 'github',
      location: 'your-org/your-extensions',
      branch: 'main',
    },
    'personas': {
      type: 'github',
      location: 'your-org/your-personas',
      branch: 'main',
    }
  },
  defaultRegistries: {
    tool: 'extensions',
    persona: 'personas',
  }
}
```

***

### retrievalAugmentor?

> `optional` **retrievalAugmentor**: [`IRetrievalAugmentor`](IRetrievalAugmentor.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:437](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L437)

Optional retrieval augmentor enabling vector-based RAG and/or GraphRAG.
When provided, it is passed into GMIs via the GMIManager.

Notes:
- This is separate from `longTermMemoryRetriever`, which injects pre-formatted
  memory text into prompts.
- The augmentor instance is typically shared across GMIs; do not shut it down
  from individual GMIs.

***

### rollingSummaryMemorySink?

> `optional` **rollingSummaryMemorySink**: [`IRollingSummaryMemorySink`](IRollingSummaryMemorySink.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:416](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L416)

Optional sink for persisting rolling-memory outputs (`summary_markdown` + `memory_json`)
into an external long-term store (RAG / knowledge graph / database).

***

### schemaOnDemandTools?

> `optional` **schemaOnDemandTools**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:574](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L574)

Optional: enable schema-on-demand meta tools for lazy tool schema loading.

When enabled, AgentOS registers three meta tools:
- `extensions_list`
- `extensions_enable` (side effects)
- `extensions_status`

These tools allow an agent to load additional extension packs at runtime,
so newly-enabled tool schemas appear in the next `listAvailableTools()` call.

#### allowModules?

> `optional` **allowModules**: `boolean`

Allow enabling packs by local module specifier/path (source='module'). Default: false.

#### allowPackages?

> `optional` **allowPackages**: `boolean`

Allow enabling packs by explicit npm package name (source='package').
Default: true in non-production, false in production.

#### enabled?

> `optional` **enabled**: `boolean`

#### officialRegistryOnly?

> `optional` **officialRegistryOnly**: `boolean`

When true, only allow extension packs present in the official
`@framers/agentos-extensions-registry` catalog (if installed).

Default: true.

***

### standaloneMemory?

> `optional` **standaloneMemory**: [`AgentOSStandaloneMemoryConfig`](AgentOSStandaloneMemoryConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:538](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L538)

Optional unified standalone-memory bridge.

This derives one or more AgentOS integrations from a single standalone
`Memory` instance:
- memory tools
- long-term memory retriever
- rolling-summary sink

***

### storageAdapter?

> `optional` **storageAdapter**: `StorageAdapter`

Defined in: [packages/agentos/src/api/AgentOS.ts:673](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L673)

Optional cross-platform storage adapter for client-side persistence.
Enables fully offline AgentOS in browsers (IndexedDB), desktop (SQLite), mobile (Capacitor).

**Platform Support:**
- Web: IndexedDB (recommended) or sql.js
- Electron: better-sqlite3 (native) or sql.js (fallback)
- Capacitor: @capacitor-community/sqlite (native) or IndexedDB
- Node: better-sqlite3 or PostgreSQL

**Usage:**
```typescript
import { createAgentOSStorage } from '@framers/sql-storage-adapter/agentos';

const storage = await createAgentOSStorage({ platform: 'auto' });

await agentos.initialize({
  storageAdapter: storage.getAdapter(),
  // ... other config
});
```

**Graceful Degradation:**
- If omitted, AgentOS falls back to Prisma (server-side only).
- If provided, AgentOS uses storageAdapter for conversations, Prisma only for auth/subscriptions.
- Recommended: Always provide storageAdapter for cross-platform compatibility.

***

### streamingManagerConfig

> **streamingManagerConfig**: [`StreamingManagerConfig`](StreamingManagerConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:491](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L491)

Configuration for the internal streaming manager.

***

### subscriptionService?

> `optional` **subscriptionService**: `ISubscriptionService`

Defined in: [packages/agentos/src/api/AgentOS.ts:516](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L516)

Optional subscription service implementing `ISubscriptionService`. Provide via the auth extension or your own adapter.

***

### taskOutcomeTelemetryStore?

> `optional` **taskOutcomeTelemetryStore**: [`ITaskOutcomeTelemetryStore`](ITaskOutcomeTelemetryStore.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:426](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L426)

Optional persistence store for task outcome KPI windows.
When provided, rolling task-outcome telemetry survives orchestrator restarts.

***

### toolOrchestratorConfig

> **toolOrchestratorConfig**: [`ToolOrchestratorConfig`](ToolOrchestratorConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:483](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L483)

Configuration for the tool orchestrator.

***

### toolPermissionManagerConfig

> **toolPermissionManagerConfig**: [`ToolPermissionManagerConfig`](ToolPermissionManagerConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:487](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L487)

Configuration for the tool permission manager.

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:551](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L551)

Optional runtime-level registered tools.

These tools are normalized during initialization and registered into the
shared `ToolOrchestrator`, making them directly available to `processRequest()`
and other full-runtime flows without helper wrappers.

Accepts:
- a named high-level tool map
- an `ExternalToolRegistry` (`Record`, `Map`, or iterable)
- a prompt-only `ToolDefinitionForLLM[]`

***

### turnPlanning?

> `optional` **turnPlanning**: [`AgentOSTurnPlanningConfig`](AgentOSTurnPlanningConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:597](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L597)

Optional per-turn planning configuration.
Defaults:
- `defaultToolFailureMode = fail_open`
- discovery-driven tool selection enabled when discovery is available.

***

### utilityAIService?

> `optional` **utilityAIService**: [`IUtilityAI`](IUtilityAI.md) & [`IPromptEngineUtilityAI`](IPromptEngineUtilityAI.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:606](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L606)

Optional. An instance of a utility AI service.
This service should conform to `IUtilityAI` for general utility tasks.
If the prompt engine is used and requires specific utility functions (like advanced
summarization for prompt construction), this service *must* also fulfill the contract
of [IPromptEngineUtilityAI](IPromptEngineUtilityAI.md).
It's recommended that the concrete class for this service implements both interfaces if needed.

***

### workflowEngineConfig?

> `optional` **workflowEngineConfig**: [`WorkflowEngineConfig`](WorkflowEngineConfig.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:639](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L639)

Optional workflow engine configuration.

***

### workflowStore?

> `optional` **workflowStore**: [`IWorkflowStore`](IWorkflowStore.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:641](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L641)

Optional workflow store implementation. Defaults to the in-memory store if omitted.
