# Function: runSimulation()

> **runSimulation**(`leader`, `keyPersonnel`, `opts?`): `Promise`\<\{ `aborted`: `boolean`; `agentReactions`: `object`[]; `agentTrajectories`: \{\[`k`: `string`\]: `object`; \}; `citationCatalog`: `CitationCatalogEntry`[]; `commanderDecisions`: `object`[]; `cost`: \{ `cacheStats?`: `CacheStats`; `forgeStats?`: `ForgeStats`; `llmCalls`: `number`; `providerErrors?`: `ProviderErrorStats`; `schemaRetries?`: `Record`\<`string`, \{ `attempts`: `number`; `calls`: `number`; `fallbacks`: `number`; \}\>; `totalCostUSD`: `number`; `totalTokens`: `number`; \}; `directorEvents`: `object`[]; `finalState`: [`SimulationState`](../../engine/interfaces/SimulationState.md); `fingerprint`: \{\[`key`: `string`\]: `string`; \}; `forgeAttempts`: `CapturedForge` & `object`[]; `forgedToolbox`: `ForgedToolboxEntry`[]; `leader`: \{ `archetype`: `string`; `colony`: `string`; `hexaco`: [`HexacoProfile`](../../engine/interfaces/HexacoProfile.md); `hexacoBaseline`: \{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honestyHumility`: `number`; `openness`: `number`; \}; `hexacoHistory`: [`HexacoSnapshot`](../../engine/interfaces/HexacoSnapshot.md)[]; `name`: `string`; \}; `outcomeClassifications`: `object`[]; `providerError`: \{ `actionUrl`: `string` \| `undefined`; `kind`: `ProviderErrorKind`; `message`: `string`; `provider`: `string` \| `undefined`; \} \| `null`; `simulation`: `string`; `toolRegistries`: `Record`\<`string`, `string`[]\>; `totalCitations`: `number`; `totalToolsForged`: `number`; `turnArtifacts`: [`TurnArtifact`](../interfaces/TurnArtifact.md)[]; \}\>

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:384](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L384)

Paracosm Runtime — orchestration layer

Run simulations with AI agents, crisis directors, and department analysis.

## Parameters

### leader

[`LeaderConfig`](../../engine/interfaces/LeaderConfig.md)

### keyPersonnel

[`KeyPersonnel`](../../engine/interfaces/KeyPersonnel.md)[]

### opts?

[`RunOptions`](../interfaces/RunOptions.md) = `{}`

## Returns

`Promise`\<\{ `aborted`: `boolean`; `agentReactions`: `object`[]; `agentTrajectories`: \{\[`k`: `string`\]: `object`; \}; `citationCatalog`: `CitationCatalogEntry`[]; `commanderDecisions`: `object`[]; `cost`: \{ `cacheStats?`: `CacheStats`; `forgeStats?`: `ForgeStats`; `llmCalls`: `number`; `providerErrors?`: `ProviderErrorStats`; `schemaRetries?`: `Record`\<`string`, \{ `attempts`: `number`; `calls`: `number`; `fallbacks`: `number`; \}\>; `totalCostUSD`: `number`; `totalTokens`: `number`; \}; `directorEvents`: `object`[]; `finalState`: [`SimulationState`](../../engine/interfaces/SimulationState.md); `fingerprint`: \{\[`key`: `string`\]: `string`; \}; `forgeAttempts`: `CapturedForge` & `object`[]; `forgedToolbox`: `ForgedToolboxEntry`[]; `leader`: \{ `archetype`: `string`; `colony`: `string`; `hexaco`: [`HexacoProfile`](../../engine/interfaces/HexacoProfile.md); `hexacoBaseline`: \{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honestyHumility`: `number`; `openness`: `number`; \}; `hexacoHistory`: [`HexacoSnapshot`](../../engine/interfaces/HexacoSnapshot.md)[]; `name`: `string`; \}; `outcomeClassifications`: `object`[]; `providerError`: \{ `actionUrl`: `string` \| `undefined`; `kind`: `ProviderErrorKind`; `message`: `string`; `provider`: `string` \| `undefined`; \} \| `null`; `simulation`: `string`; `toolRegistries`: `Record`\<`string`, `string`[]\>; `totalCitations`: `number`; `totalToolsForged`: `number`; `turnArtifacts`: [`TurnArtifact`](../interfaces/TurnArtifact.md)[]; \}\>
