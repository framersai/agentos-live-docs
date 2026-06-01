# Function: ingestSeed()

> **ingestSeed**(`seedText`, `options`): `Promise`\<`KnowledgeBundle`\>

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:223](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/compiler/seed-ingestion.ts#L223)

Ingest prompt, brief, or document text and produce a KnowledgeBundle for a scenario.

## Parameters

### seedText

`string`

The raw text content of the prompt, brief, or document

### options

[`SeedIngestionOptions`](../compiler/interfaces/SeedIngestionOptions.md)

Ingestion options (LLM function, web search toggle)

## Returns

`Promise`\<`KnowledgeBundle`\>

A KnowledgeBundle ready to merge into a ScenarioPackage
