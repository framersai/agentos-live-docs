# Function: ingestSeed()

> **ingestSeed**(`seedText`, `options`): `Promise`\<[`KnowledgeBundle`](../../interfaces/KnowledgeBundle.md)\>

Defined in: [engine/compiler/seed-ingestion.ts:215](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/seed-ingestion.ts#L215)

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
