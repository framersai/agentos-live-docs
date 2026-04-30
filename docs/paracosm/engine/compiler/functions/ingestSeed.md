# Function: ingestSeed()

> **ingestSeed**(`seedText`, `options`): `Promise`\<[`KnowledgeBundle`](../../interfaces/KnowledgeBundle.md)\>

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:215](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/compiler/seed-ingestion.ts#L215)

Ingest a seed document and produce a KnowledgeBundle for a scenario.

## Parameters

### seedText

`string`

The raw text content of the seed document

### options

[`SeedIngestionOptions`](../interfaces/SeedIngestionOptions.md)

Ingestion options (LLM function, web search toggle)

## Returns

`Promise`\<[`KnowledgeBundle`](../../interfaces/KnowledgeBundle.md)\>

A KnowledgeBundle ready to merge into a ScenarioPackage
