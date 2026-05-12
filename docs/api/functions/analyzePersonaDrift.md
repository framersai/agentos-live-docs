# Function: analyzePersonaDrift()

> **analyzePersonaDrift**(`traces`, `currentTraits`, `config`, `relationshipDeltas?`): [`PersonalityDriftProposal`](../interfaces/PersonalityDriftProposal.md)[]

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:75](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L75)

Analyze accumulated memory traces and relationship deltas to propose
HEXACO personality mutations. Heuristic mode — no LLM calls.

## Parameters

### traces

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

Episodic memory traces since last analysis

### currentTraits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

Current HEXACO trait values

### config

[`PersonaDriftConfig`](../interfaces/PersonaDriftConfig.md)

Drift configuration

### relationshipDeltas?

[`RelationshipDriftInput`](../interfaces/RelationshipDriftInput.md)

Accumulated relationship dimension changes

## Returns

[`PersonalityDriftProposal`](../interfaces/PersonalityDriftProposal.md)[]

Array of trait mutation proposals, may be empty
