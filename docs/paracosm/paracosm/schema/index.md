# paracosm/schema

Paracosm Universal Schema — public contract for run artifacts + stream events.

One import surface, two consumption flavors:

```ts
// Runtime-validating consumers:
import { RunArtifactSchema, StreamEventSchema } from 'paracosm/schema';
const artifact = RunArtifactSchema.parse(json);

// Type-only consumers:
import type { RunArtifact, StreamEvent, Timepoint } from 'paracosm/schema';
```

## Type Aliases

- [Citation](type-aliases/Citation.md)
- [Cost](type-aliases/Cost.md)
- [Decision](type-aliases/Decision.md)
- [DecisionOutcome](type-aliases/DecisionOutcome.md)
- [ForgedToolSummary](type-aliases/ForgedToolSummary.md)
- [HighlightMetric](type-aliases/HighlightMetric.md)
- [ProviderError](type-aliases/ProviderError.md)
- [RiskFlag](type-aliases/RiskFlag.md)
- [RunMetadata](type-aliases/RunMetadata.md)
- [ScenarioExtensions](type-aliases/ScenarioExtensions.md)
- [Score](type-aliases/Score.md)
- [SimulationMode](type-aliases/SimulationMode.md)
- [SpecialistDetail](type-aliases/SpecialistDetail.md)
- [SpecialistNote](type-aliases/SpecialistNote.md)
- [StreamEvent](type-aliases/StreamEvent.md)
- [StreamEventType](type-aliases/StreamEventType.md)
- [SubjectMarker](type-aliases/SubjectMarker.md)
- [SubjectSignal](type-aliases/SubjectSignal.md)
- [SwarmAgent](type-aliases/SwarmAgent.md)
- [SwarmSnapshot](type-aliases/SwarmSnapshot.md)
- [Timepoint](type-aliases/Timepoint.md)
- [Trajectory](type-aliases/Trajectory.md)
- [TrajectoryPoint](type-aliases/TrajectoryPoint.md)
- [WorldSnapshot](type-aliases/WorldSnapshot.md)

## Variables

- [CitationSchema](variables/CitationSchema.md)
- [CostSchema](variables/CostSchema.md)
- [DecisionOutcomeSchema](variables/DecisionOutcomeSchema.md)
- [DecisionSchema](variables/DecisionSchema.md)
- [ForgedToolSummarySchema](variables/ForgedToolSummarySchema.md)
- [HighlightMetricSchema](variables/HighlightMetricSchema.md)
- [InterventionConfigSchema](variables/InterventionConfigSchema.md)
- [ProviderErrorSchema](variables/ProviderErrorSchema.md)
- [RiskFlagSchema](variables/RiskFlagSchema.md)
- [RunArtifactSchema](variables/RunArtifactSchema.md)
- [RunMetadataSchema](variables/RunMetadataSchema.md)
- [ScenarioExtensionsSchema](variables/ScenarioExtensionsSchema.md)
- [ScoreSchema](variables/ScoreSchema.md)
- [SimulationModeSchema](variables/SimulationModeSchema.md)
- [SpecialistDetailSchema](variables/SpecialistDetailSchema.md)
- [SpecialistNoteSchema](variables/SpecialistNoteSchema.md)
- [STREAM\_EVENT\_TYPES](variables/STREAM_EVENT_TYPES.md)
- [StreamEventSchema](variables/StreamEventSchema.md)
- [SubjectConfigSchema](variables/SubjectConfigSchema.md)
- [SubjectMarkerSchema](variables/SubjectMarkerSchema.md)
- [SubjectSignalSchema](variables/SubjectSignalSchema.md)
- [SwarmAgentSchema](variables/SwarmAgentSchema.md)
- [SwarmSnapshotSchema](variables/SwarmSnapshotSchema.md)
- [TimepointSchema](variables/TimepointSchema.md)
- [TrajectoryPointSchema](variables/TrajectoryPointSchema.md)
- [TrajectorySchema](variables/TrajectorySchema.md)
- [WorldSnapshotSchema](variables/WorldSnapshotSchema.md)

## References

### InterventionConfig

Re-exports [InterventionConfig](../type-aliases/InterventionConfig.md)

***

### RunArtifact

Re-exports [RunArtifact](../type-aliases/RunArtifact.md)

***

### SubjectConfig

Re-exports [SubjectConfig](../type-aliases/SubjectConfig.md)
