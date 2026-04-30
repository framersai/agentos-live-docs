# Interface: ParacosmClient

Defined in: [apps/paracosm/src/runtime/client.ts:80](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L80)

Handle returned by `createParacosmClient`. The three methods mirror
the corresponding standalone exports — same arg shapes, same return
types — but with the client's defaults layered in.

## Properties

### compileScenario()

> **compileScenario**: (`scenarioJson`, `opts?`) => `Promise`\<[`ScenarioPackage`](ScenarioPackage.md)\>

Defined in: [apps/paracosm/src/runtime/client.ts:98](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L98)

Compile a scenario with the client's compiler defaults.

#### Parameters

##### scenarioJson

`Record`\<`string`, `unknown`\>

##### opts?

[`CompileOptions`](../compiler/interfaces/CompileOptions.md)

#### Returns

`Promise`\<[`ScenarioPackage`](ScenarioPackage.md)\>

***

### runBatch()

> **runBatch**: (`config`) => `Promise`\<[`BatchManifest`](../../runtime/interfaces/BatchManifest.md)\>

Defined in: [apps/paracosm/src/runtime/client.ts:94](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L94)

Run a batch sweep. Scenarios / leaders / turns / seed are the
caller's responsibility; provider + costPreset + models inherit.

#### Parameters

##### config

[`BatchConfig`](../../runtime/interfaces/BatchConfig.md)

#### Returns

`Promise`\<[`BatchManifest`](../../runtime/interfaces/BatchManifest.md)\>

***

### runSimulation()

> **runSimulation**: (`leader`, `keyPersonnel`, `opts?`) => `Promise`\<\{ `aborted`: `boolean`; `agentReactions`: `object`[]; `agentTrajectories`: \{\[`k`: `string`\]: `object`; \}; `citationCatalog`: `CitationCatalogEntry`[]; `commanderDecisions`: `object`[]; `cost`: \{ `cacheStats?`: `CacheStats`; `forgeStats?`: `ForgeStats`; `llmCalls`: `number`; `providerErrors?`: `ProviderErrorStats`; `schemaRetries?`: `Record`\<`string`, \{ `attempts`: `number`; `calls`: `number`; `fallbacks`: `number`; \}\>; `totalCostUSD`: `number`; `totalTokens`: `number`; \}; `directorEvents`: `object`[]; `finalState`: [`SimulationState`](SimulationState.md); `fingerprint`: \{\[`key`: `string`\]: `string`; \}; `forgeAttempts`: `CapturedForge` & `object`[]; `forgedToolbox`: `ForgedToolboxEntry`[]; `leader`: \{ `archetype`: `string`; `colony`: `string`; `hexaco`: [`HexacoProfile`](HexacoProfile.md); `hexacoBaseline`: \{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honestyHumility`: `number`; `openness`: `number`; \}; `hexacoHistory`: [`HexacoSnapshot`](HexacoSnapshot.md)[]; `name`: `string`; \}; `outcomeClassifications`: `object`[]; `providerError`: \{ `actionUrl`: `string` \| `undefined`; `kind`: `ProviderErrorKind`; `message`: `string`; `provider`: `string` \| `undefined`; \} \| `null`; `simulation`: `string`; `toolRegistries`: `Record`\<`string`, `string`[]\>; `totalCitations`: `number`; `totalToolsForged`: `number`; `turnArtifacts`: [`TurnArtifact`](../../runtime/interfaces/TurnArtifact.md)[]; \}\>

Defined in: [apps/paracosm/src/runtime/client.ts:85](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L85)

Run one simulation. Leader + key personnel passed per-call; all
other options inherit from the client with per-call overrides.

#### Parameters

##### leader

[`LeaderConfig`](LeaderConfig.md)

##### keyPersonnel

[`KeyPersonnel`](KeyPersonnel.md)[]

##### opts?

[`RunOptions`](../../runtime/interfaces/RunOptions.md)

#### Returns

`Promise`\<\{ `aborted`: `boolean`; `agentReactions`: `object`[]; `agentTrajectories`: \{\[`k`: `string`\]: `object`; \}; `citationCatalog`: `CitationCatalogEntry`[]; `commanderDecisions`: `object`[]; `cost`: \{ `cacheStats?`: `CacheStats`; `forgeStats?`: `ForgeStats`; `llmCalls`: `number`; `providerErrors?`: `ProviderErrorStats`; `schemaRetries?`: `Record`\<`string`, \{ `attempts`: `number`; `calls`: `number`; `fallbacks`: `number`; \}\>; `totalCostUSD`: `number`; `totalTokens`: `number`; \}; `directorEvents`: `object`[]; `finalState`: [`SimulationState`](SimulationState.md); `fingerprint`: \{\[`key`: `string`\]: `string`; \}; `forgeAttempts`: `CapturedForge` & `object`[]; `forgedToolbox`: `ForgedToolboxEntry`[]; `leader`: \{ `archetype`: `string`; `colony`: `string`; `hexaco`: [`HexacoProfile`](HexacoProfile.md); `hexacoBaseline`: \{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honestyHumility`: `number`; `openness`: `number`; \}; `hexacoHistory`: [`HexacoSnapshot`](HexacoSnapshot.md)[]; `name`: `string`; \}; `outcomeClassifications`: `object`[]; `providerError`: \{ `actionUrl`: `string` \| `undefined`; `kind`: `ProviderErrorKind`; `message`: `string`; `provider`: `string` \| `undefined`; \} \| `null`; `simulation`: `string`; `toolRegistries`: `Record`\<`string`, `string`[]\>; `totalCitations`: `number`; `totalToolsForged`: `number`; `turnArtifacts`: [`TurnArtifact`](../../runtime/interfaces/TurnArtifact.md)[]; \}\>
