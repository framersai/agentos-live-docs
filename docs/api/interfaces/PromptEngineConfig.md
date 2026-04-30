# Interface: PromptEngineConfig

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:278](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L278)

Configuration options for the PromptEngine's behavior, optimization strategies,
and integration with other services like IUtilityAI.

## Interface

PromptEngineConfig

## Properties

### availableTemplates

> **availableTemplates**: `Record`\<`string`, [`PromptTemplateFunction`](../type-aliases/PromptTemplateFunction.md)\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:282](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L282)

A record of available prompt template functions, keyed by template name.

***

### contextManagement

> **contextManagement**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:298](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L298)

Configuration for managing retrieved context (e.g., from RAG).

#### maxRAGContextTokens

> **maxRAGContextTokens**: `number`

#### minContextRelevanceThreshold?

> `optional` **minContextRelevanceThreshold**: `number`

#### preserveSourceAttributionInSummary

> **preserveSourceAttributionInSummary**: `boolean`

#### summarizationQualityTier

> **summarizationQualityTier**: `"balanced"` \| `"fast"` \| `"high_quality"`

***

### contextualElementSelection

> **contextualElementSelection**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:305](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L305)

Configuration for selecting and applying contextual elements.

#### conflictResolutionStrategy

> **conflictResolutionStrategy**: `"skip_conflicting"` \| `"merge_compatible"` \| `"error_on_conflict"`

#### defaultMaxElementsPerType

> **defaultMaxElementsPerType**: `number`

#### maxElementsPerType

> **maxElementsPerType**: `Partial`\<`Record`\<[`ContextualElementType`](../enumerations/ContextualElementType.md), `number`\>\>

Max number of elements to apply per type.

#### priorityResolutionStrategy

> **priorityResolutionStrategy**: `"highest_first"` \| `"weighted_random"` \| `"persona_preference"`

***

### debugging?

> `optional` **debugging**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:320](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L320)

Debugging and logging settings.

#### includeDebugMetadataInResult?

> `optional` **includeDebugMetadataInResult**: `boolean`

#### logConstructionSteps?

> `optional` **logConstructionSteps**: `boolean`

#### logSelectedContextualElements?

> `optional` **logSelectedContextualElements**: `boolean`

***

### defaultTemplateName

> **defaultTemplateName**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:280](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L280)

Default template name (from `availableTemplates`) to use if none is specified or inferable.

***

### historyManagement

> **historyManagement**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:291](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L291)

Configuration for managing conversation history within prompts.

#### defaultMaxMessages

> **defaultMaxMessages**: `number`

#### maxTokensForHistory

> **maxTokensForHistory**: `number`

#### preserveImportantMessages

> **preserveImportantMessages**: `boolean`

#### summarizationTriggerRatio

> **summarizationTriggerRatio**: `number`

***

### performance

> **performance**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:313](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L313)

Performance optimization settings.

#### cacheTimeoutSeconds

> **cacheTimeoutSeconds**: `number`

#### enableCaching

> **enableCaching**: `boolean`

#### maxCacheSizeBytes?

> `optional` **maxCacheSizeBytes**: `number`

***

### tokenCounting

> **tokenCounting**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:284](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L284)

Configuration for token counting strategies.

#### estimationModel?

> `optional` **estimationModel**: `"gpt-3.5-turbo"` \| `"gpt-4"` \| `"claude-3"` \| `"generic"`

#### strategy

> **strategy**: `"estimated"` \| `"precise"` \| `"hybrid"`

***

### toolSchemaManifest?

> `optional` **toolSchemaManifest**: `Record`\<`string`, \{ `disabledToolIds?`: `string`[]; `enabledToolIds?`: `string`[]; `modelOverrides?`: `Record`\<`string`, `string`[]\>; \}\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:349](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L349)

Optional tool schema registration manifest enabling per-persona and per-model enable/disable semantics.

Structure:
```ts
{
  [personaId: string]: {
    enabledToolIds: string[];
    disabledToolIds?: string[];
    modelOverrides?: {
      [modelId: string]: string[];
    };
  };
}
```

Resolution Order when filtering tools for prompt construction:
  1. If personaId present in manifest:
     a. If modelOverrides[modelId] exists => allowed set = that array (disabledToolIds still removes).
     b. Else allowed base = enabledToolIds (if defined) else all runtime tools.
     c. Remove any disabledToolIds from allowed set.
  2. If personaId absent => all runtime tools (no filtering).
Note: Unknown tool IDs in manifest are ignored gracefully.
