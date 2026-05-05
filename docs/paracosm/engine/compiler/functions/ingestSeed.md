# Function: ingestSeed()

> **ingestSeed**(`seedText`, `options`): `Promise`\<[`KnowledgeBundle`](../../interfaces/KnowledgeBundle.md)\>

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:223](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/seed-ingestion.ts#L223)

Ingest prompt, brief, or document text and produce a KnowledgeBundle for a scenario.

## Parameters

### seedText

`string`

The raw text content of the prompt, brief, or document

### options

[`SeedIngestionOptions`](../interfaces/SeedIngestionOptions.md)

Ingestion options (LLM function, web search toggle)

## Returns

`Promise`\<[`KnowledgeBundle`](../../interfaces/KnowledgeBundle.md)\>

A KnowledgeBundle ready to merge into a ScenarioPackage
