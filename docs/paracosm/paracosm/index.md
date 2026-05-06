# paracosm

Paracosm v0.9 public root export.

Imports from this entry point cover the 90% case (`run`, `runMany`,
`WorldModel`, public types). Power users keep subpath escape hatches:
`paracosm/swarm`, `paracosm/compiler`, `paracosm/digital-twin`,
`paracosm/schema`, `paracosm/core`.

## Classes

- [ProviderKeyMissingError](classes/ProviderKeyMissingError.md)
- [TraitModelRegistry](classes/TraitModelRegistry.md)
- [UnknownTraitModelError](classes/UnknownTraitModelError.md)
- [WorldModel](classes/WorldModel.md)
- [WorldModelReplayError](classes/WorldModelReplayError.md)

## Interfaces

- [ActorConfig](interfaces/ActorConfig.md)
- [ActorRun](interfaces/ActorRun.md)
- [Citation](interfaces/Citation.md)
- [CustomEvent](interfaces/CustomEvent.md)
- [ForgedToolRecord](interfaces/ForgedToolRecord.md)
- [InterveneOptions](interfaces/InterveneOptions.md)
- [KeyPersonnel](interfaces/KeyPersonnel.md)
- [ParacosmClient](interfaces/ParacosmClient.md)
- [ParacosmClientOptions](interfaces/ParacosmClientOptions.md)
- [RunManyOptions](interfaces/RunManyOptions.md)
- [RunManyResult](interfaces/RunManyResult.md)
- [RunOptions](interfaces/RunOptions.md)
- [ScenarioPackage](interfaces/ScenarioPackage.md)
- [SimulateOptions](interfaces/SimulateOptions.md)
- [SimulationModelConfig](interfaces/SimulationModelConfig.md)
- [TraitProfile](interfaces/TraitProfile.md)
- [WorldModelQuickstartOptions](interfaces/WorldModelQuickstartOptions.md)
- [WorldModelQuickstartResult](interfaces/WorldModelQuickstartResult.md)
- [WorldModelReplayResult](interfaces/WorldModelReplayResult.md)
- [WorldModelSnapshot](interfaces/WorldModelSnapshot.md)

## Type Aliases

- [BatchOptions](type-aliases/BatchOptions.md)
- [InterventionConfig](type-aliases/InterventionConfig.md)
- [RunArtifact](type-aliases/RunArtifact.md)
- [StreamEvent](type-aliases/StreamEvent.md)
- [SubjectConfig](type-aliases/SubjectConfig.md)

## Variables

- [ACTOR\_PRESETS](variables/ACTOR_PRESETS.md)
- [aiAgentModel](variables/aiAgentModel.md)
- [hexacoModel](variables/hexacoModel.md)
- [lunarScenario](variables/lunarScenario.md)
- [marsScenario](variables/marsScenario.md)
- [traitModelRegistry](variables/traitModelRegistry.md)

## Functions

- [createParacosmClient](functions/createParacosmClient.md)
- [generateQuickstartActors](functions/generateQuickstartActors.md)
- [getPresetById](functions/getPresetById.md)
- [hexacoToTraits](functions/hexacoToTraits.md)
- [ingestFromUrl](functions/ingestFromUrl.md)
- [ingestSeed](functions/ingestSeed.md)
- [listPresetsByTrait](functions/listPresetsByTrait.md)
- [normalizeActorConfig](functions/normalizeActorConfig.md)
- [resolveProviderWithFallback](functions/resolveProviderWithFallback.md)
- [run](functions/run.md)
- [runMany](functions/runMany.md)
- [traitsToHexaco](functions/traitsToHexaco.md)
- [withDefaults](functions/withDefaults.md)

## References

### compileScenario

Re-exports [compileScenario](compiler/functions/compileScenario.md)

***

### HexacoProfile

Re-exports [HexacoProfile](core/interfaces/HexacoProfile.md)
