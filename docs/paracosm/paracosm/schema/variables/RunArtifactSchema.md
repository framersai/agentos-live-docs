# Variable: RunArtifactSchema

> `const` **RunArtifactSchema**: `ZodObject`\<\{ `aborted`: `ZodOptional`\<`ZodBoolean`\>; `assumptions`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `citations`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `context`: `ZodDefault`\<`ZodString`\>; `doi`: `ZodOptional`\<`ZodString`\>; `text`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>\>\>; `cost`: `ZodOptional`\<`ZodObject`\<\{ `breakdown`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `cachedReadTokens`: `ZodOptional`\<`ZodNumber`\>; `cacheSavingsUSD`: `ZodOptional`\<`ZodNumber`\>; `inputTokens`: `ZodOptional`\<`ZodNumber`\>; `llmCalls`: `ZodOptional`\<`ZodNumber`\>; `outputTokens`: `ZodOptional`\<`ZodNumber`\>; `totalUSD`: `ZodNumber`; \}, `$strip`\>\>; `decisions`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `actor`: `ZodOptional`\<`ZodString`\>; `choice`: `ZodString`; `outcome`: `ZodOptional`\<`ZodEnum`\<\{ `conservative_failure`: `"conservative_failure"`; `conservative_success`: `"conservative_success"`; `risky_failure`: `"risky_failure"`; `risky_success`: `"risky_success"`; \}\>\>; `rationale`: `ZodOptional`\<`ZodString`\>; `reasoning`: `ZodOptional`\<`ZodString`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; \}, `$strip`\>\>\>; `disclaimer`: `ZodOptional`\<`ZodString`\>; `finalState`: `ZodOptional`\<`ZodObject`\<\{ `capacities`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `environment`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`, `ZodBoolean`\]\>\>\>; `metrics`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `politics`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`, `ZodBoolean`\]\>\>\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `statuses`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodString`, `ZodBoolean`\]\>\>\>; \}, `$strip`\>\>; `finalSwarm`: `ZodOptional`\<`ZodObject`\<\{ `agents`: `ZodArray`\<`ZodObject`\<\{ `age`: `ZodOptional`\<`ZodNumber`\>; `agentId`: `ZodString`; `alive`: `ZodBoolean`; `childrenIds`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `department`: `ZodString`; `featured`: `ZodOptional`\<`ZodBoolean`\>; `generation`: `ZodOptional`\<`ZodNumber`\>; `marsborn`: `ZodOptional`\<`ZodBoolean`\>; `mood`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `partnerId`: `ZodOptional`\<`ZodString`\>; `psychScore`: `ZodOptional`\<`ZodNumber`\>; `rank`: `ZodOptional`\<`ZodEnum`\<\{ `chief`: ...; `junior`: ...; `lead`: ...; `senior`: ...; \}\>\>; `role`: `ZodString`; `shortTermMemory`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>\>; `births`: `ZodOptional`\<`ZodNumber`\>; `deaths`: `ZodOptional`\<`ZodNumber`\>; `morale`: `ZodOptional`\<`ZodNumber`\>; `population`: `ZodNumber`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `time`: `ZodNumber`; `turn`: `ZodNumber`; \}, `$strip`\>\>; `fingerprint`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>\>\>; `forgedTools`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `approved`: `ZodBoolean`; `confidence`: `ZodOptional`\<`ZodNumber`\>; `department`: `ZodOptional`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; \}, `$strip`\>\>\>; `intervention`: `ZodOptional`\<`ZodObject`\<\{ `adherenceProfile`: `ZodOptional`\<`ZodObject`\<\{ `expected`: `ZodNumber`; `risks`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>\>; `category`: `ZodOptional`\<`ZodString`\>; `description`: `ZodString`; `duration`: `ZodOptional`\<`ZodObject`\<\{ `unit`: `ZodString`; `value`: `ZodNumber`; \}, `$strip`\>\>; `id`: `ZodString`; `mechanism`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `targetBehaviors`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>\>; `leveragePoints`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `metadata`: `ZodObject`\<\{ `completedAt`: `ZodOptional`\<`ZodString`\>; `forkedFrom`: `ZodOptional`\<`ZodObject`\<\{ `atTurn`: `ZodNumber`; `parentRunId`: `ZodString`; \}, `$strip`\>\>; `mode`: `ZodEnum`\<\{ `batch-point`: `"batch-point"`; `batch-trajectory`: `"batch-trajectory"`; `turn-loop`: `"turn-loop"`; \}\>; `runId`: `ZodString`; `scenario`: `ZodObject`\<\{ `id`: `ZodString`; `name`: `ZodString`; `version`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `seed`: `ZodOptional`\<`ZodNumber`\>; `startedAt`: `ZodString`; \}, `$strip`\>; `overview`: `ZodOptional`\<`ZodString`\>; `providerError`: `ZodOptional`\<`ZodNullable`\<`ZodObject`\<\{ `actionUrl`: `ZodOptional`\<`ZodString`\>; `kind`: `ZodEnum`\<\{ `auth`: `"auth"`; `network`: `"network"`; `quota`: `"quota"`; `rate_limit`: `"rate_limit"`; `unknown`: `"unknown"`; \}\>; `message`: `ZodString`; `provider`: `ZodString`; \}, `$strip`\>\>\>; `riskFlags`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `detail`: `ZodString`; `label`: `ZodString`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `severity`: `ZodEnum`\<\{ `high`: `"high"`; `low`: `"low"`; `medium`: `"medium"`; \}\>; \}, `$strip`\>\>\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `specialistNotes`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `confidence`: `ZodOptional`\<`ZodNumber`\>; `detail`: `ZodOptional`\<`ZodObject`\<\{ `citations`: `ZodOptional`\<`ZodArray`\<...\>\>; `openQuestions`: `ZodOptional`\<`ZodArray`\<...\>\>; `opportunities`: `ZodOptional`\<`ZodArray`\<...\>\>; `recommendedActions`: `ZodOptional`\<`ZodArray`\<...\>\>; `risks`: `ZodOptional`\<`ZodArray`\<...\>\>; \}, `$strip`\>\>; `domain`: `ZodString`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `summary`: `ZodString`; `trajectory`: `ZodOptional`\<`ZodEnum`\<\{ `mixed`: `"mixed"`; `negative`: `"negative"`; `neutral`: `"neutral"`; `positive`: `"positive"`; \}\>\>; \}, `$strip`\>\>\>; `subject`: `ZodOptional`\<`ZodObject`\<\{ `conditions`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `markers`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `interpretation`: `ZodOptional`\<`ZodString`\>; `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>\>; `name`: `ZodString`; `personality`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `profile`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `signals`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `recordedAt`: `ZodOptional`\<`ZodString`\>; `unit`: `ZodOptional`\<`ZodString`\>; `value`: `ZodUnion`\<readonly \[..., ...\]\>; \}, `$strip`\>\>\>; \}, `$strip`\>\>; `trajectory`: `ZodOptional`\<`ZodObject`\<\{ `points`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `metrics`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<..., ...\>\>; `time`: `ZodNumber`; \}, `$strip`\>\>\>; `timepoints`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `confidence`: `ZodOptional`\<`ZodNumber`\>; `highlightMetrics`: `ZodOptional`\<`ZodArray`\<...\>\>; `label`: `ZodString`; `narrative`: `ZodOptional`\<`ZodString`\>; `reasoning`: `ZodOptional`\<`ZodString`\>; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<..., ...\>\>; `score`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `time`: `ZodNumber`; `worldSnapshot`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; \}, `$strip`\>\>\>; `timeUnit`: `ZodObject`\<\{ `plural`: `ZodString`; `singular`: `ZodString`; \}, `$strip`\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/artifact.ts:104](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/artifact.ts#L104)

Universal paracosm run artifact. One shape, three modes, no schema
versioning at this layer.

Required fields: `metadata` only. Every other field is mode-conditional
or scenario-conditional. Consumers switch on `metadata.mode` to know
what to expect.

## Examples

```ts
{
  metadata: { runId, scenario, seed: 42, mode: 'turn-loop', startedAt, completedAt },
  overview: 'Bold expansion outpaced cautious engineering.',
  trajectory: { timeUnit, points, timepoints },
  specialistNotes: [...],     // one per department-turn
  decisions: [...],           // one per commander decision
  finalState: { metrics, ... },
  fingerprint: { resilience, innovation, riskStyle },
  citations: [...],
  forgedTools: [...],
  cost: { totalUSD, llmCalls, inputTokens, outputTokens },
  providerError: null,
  aborted: false,
}
```

```ts
{
  metadata: { runId, scenario, mode: 'batch-trajectory', startedAt, completedAt },
  overview: 'Creatine + sleep hygiene yields gradual HRV recovery over 3 months.',
  assumptions: ['...', '...'],
  leveragePoints: ['...', '...'],
  disclaimer: 'Not medical advice.',
  trajectory: { timeUnit: { singular: 'week', plural: 'weeks' }, timepoints: [...5 items] },
  specialistNotes: [...],
  riskFlags: [...],
  cost: { totalUSD, ... },
}
```

```ts
{
  metadata: { runId, scenario, mode: 'batch-point', startedAt, completedAt },
  overview: 'Short answer: yes, with two caveats.',
  assumptions: ['...'],
  leveragePoints: ['...'],
  specialistNotes: [...],
  riskFlags: [...],
  cost: { totalUSD, ... },
}
```
