# paracosm/core

Paracosm core state — kernel types, the deterministic SimulationKernel,
SeededRng, and the agent generator. The lowest layer most consumers
touch directly: build a kernel, advance it, snapshot it, replay it.

## Classes

- [SeededRng](classes/SeededRng.md)
- [SimulationKernel](classes/SimulationKernel.md)

## Interfaces

- [Agent](interfaces/Agent.md)
- [AgentCareer](interfaces/AgentCareer.md)
- [AgentCore](interfaces/AgentCore.md)
- [AgentHealth](interfaces/AgentHealth.md)
- [AgentMemory](interfaces/AgentMemory.md)
- [AgentMemoryEntry](interfaces/AgentMemoryEntry.md)
- [AgentNarrative](interfaces/AgentNarrative.md)
- [AgentSocial](interfaces/AgentSocial.md)
- [HexacoProfile](interfaces/HexacoProfile.md)
- [HexacoSnapshot](interfaces/HexacoSnapshot.md)
- [LifeEvent](interfaces/LifeEvent.md)
- [PromotionRecord](interfaces/PromotionRecord.md)
- [SimulationMetadata](interfaces/SimulationMetadata.md)
- [SimulationState](interfaces/SimulationState.md)
- [TurnEvent](interfaces/TurnEvent.md)
- [WorldMetrics](interfaces/WorldMetrics.md)
- [WorldPolitics](interfaces/WorldPolitics.md)

## Type Aliases

- [Department](type-aliases/Department.md)
- [TurnOutcome](type-aliases/TurnOutcome.md)

## Variables

- [HEXACO\_TRAITS](variables/HEXACO_TRAITS.md)

## Functions

- [generateInitialPopulation](functions/generateInitialPopulation.md)

## References

### KeyPersonnel

Re-exports [KeyPersonnel](../interfaces/KeyPersonnel.md)
