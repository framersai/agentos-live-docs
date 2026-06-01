// @ts-check
/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
const typedocSidebar = {
  items: [
    {
      type: "category",
      label: "paracosm",
      items: [
        {
          type: "category",
          label: "Classes",
          items: [
            {
              type: "doc",
              id: "paracosm/paracosm/classes/ProviderKeyMissingError",
              label: "ProviderKeyMissingError"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/classes/TraitModelRegistry",
              label: "TraitModelRegistry"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/classes/UnknownTraitModelError",
              label: "UnknownTraitModelError"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/classes/WorldModel",
              label: "WorldModel"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/classes/WorldModelReplayError",
              label: "WorldModelReplayError"
            }
          ]
        },
        {
          type: "category",
          label: "Interfaces",
          items: [
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/ActorConfig",
              label: "ActorConfig"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/ActorRun",
              label: "ActorRun"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/Citation",
              label: "Citation"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/CustomEvent",
              label: "CustomEvent"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/ForgedToolRecord",
              label: "ForgedToolRecord"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/InterveneOptions",
              label: "InterveneOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/KeyPersonnel",
              label: "KeyPersonnel"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/ParacosmClient",
              label: "ParacosmClient"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/ParacosmClientOptions",
              label: "ParacosmClientOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/RunManyOptions",
              label: "RunManyOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/RunManyResult",
              label: "RunManyResult"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/RunOptions",
              label: "RunOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/ScenarioPackage",
              label: "ScenarioPackage"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/SimulateOptions",
              label: "SimulateOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/SimulationModelConfig",
              label: "SimulationModelConfig"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/TraitProfile",
              label: "TraitProfile"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/WorldModelQuickstartOptions",
              label: "WorldModelQuickstartOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/WorldModelQuickstartResult",
              label: "WorldModelQuickstartResult"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/WorldModelReplayResult",
              label: "WorldModelReplayResult"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/interfaces/WorldModelSnapshot",
              label: "WorldModelSnapshot"
            }
          ]
        },
        {
          type: "category",
          label: "Type Aliases",
          items: [
            {
              type: "doc",
              id: "paracosm/paracosm/type-aliases/BatchOptions",
              label: "BatchOptions"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/type-aliases/InterventionConfig",
              label: "InterventionConfig"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/type-aliases/RunArtifact",
              label: "RunArtifact"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/type-aliases/StreamEvent",
              label: "StreamEvent"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/type-aliases/SubjectConfig",
              label: "SubjectConfig"
            }
          ]
        },
        {
          type: "category",
          label: "Variables",
          items: [
            {
              type: "doc",
              id: "paracosm/paracosm/variables/ACTOR_PRESETS",
              label: "ACTOR_PRESETS"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/variables/aiAgentModel",
              label: "aiAgentModel"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/variables/hexacoModel",
              label: "hexacoModel"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/variables/lunarScenario",
              label: "lunarScenario"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/variables/marsScenario",
              label: "marsScenario"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/variables/traitModelRegistry",
              label: "traitModelRegistry"
            }
          ]
        },
        {
          type: "category",
          label: "Functions",
          items: [
            {
              type: "doc",
              id: "paracosm/paracosm/functions/createParacosmClient",
              label: "createParacosmClient"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/generateQuickstartActors",
              label: "generateQuickstartActors"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/getPresetById",
              label: "getPresetById"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/hexacoToTraits",
              label: "hexacoToTraits"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/ingestFromUrl",
              label: "ingestFromUrl"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/ingestSeed",
              label: "ingestSeed"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/listPresetsByTrait",
              label: "listPresetsByTrait"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/normalizeActorConfig",
              label: "normalizeActorConfig"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/resolveProviderWithFallback",
              label: "resolveProviderWithFallback"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/run",
              label: "run"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/runMany",
              label: "runMany"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/traitsToHexaco",
              label: "traitsToHexaco"
            },
            {
              type: "doc",
              id: "paracosm/paracosm/functions/withDefaults",
              label: "withDefaults"
            }
          ]
        },
        {
          type: "category",
          label: "compiler",
          items: [
            {
              type: "category",
              label: "Interfaces",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/compiler/interfaces/CompileOptions",
                  label: "CompileOptions"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/compiler/interfaces/SeedIngestionOptions",
                  label: "SeedIngestionOptions"
                }
              ]
            },
            {
              type: "category",
              label: "Type Aliases",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/compiler/type-aliases/GenerateTextFn",
                  label: "GenerateTextFn"
                }
              ]
            },
            {
              type: "category",
              label: "Functions",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/compiler/functions/compileScenario",
                  label: "compileScenario"
                }
              ]
            }
          ],
          link: {
            type: "doc",
            id: "paracosm/paracosm/compiler/index"
          }
        },
        {
          type: "category",
          label: "core",
          items: [
            {
              type: "category",
              label: "Classes",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/classes/SeededRng",
                  label: "SeededRng"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/classes/SimulationKernel",
                  label: "SimulationKernel"
                }
              ]
            },
            {
              type: "category",
              label: "Interfaces",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/Agent",
                  label: "Agent"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentCareer",
                  label: "AgentCareer"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentCore",
                  label: "AgentCore"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentHealth",
                  label: "AgentHealth"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentMemory",
                  label: "AgentMemory"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentMemoryEntry",
                  label: "AgentMemoryEntry"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentNarrative",
                  label: "AgentNarrative"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/AgentSocial",
                  label: "AgentSocial"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/HexacoProfile",
                  label: "HexacoProfile"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/HexacoSnapshot",
                  label: "HexacoSnapshot"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/LifeEvent",
                  label: "LifeEvent"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/PromotionRecord",
                  label: "PromotionRecord"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/SimulationMetadata",
                  label: "SimulationMetadata"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/SimulationState",
                  label: "SimulationState"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/TurnEvent",
                  label: "TurnEvent"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/WorldMetrics",
                  label: "WorldMetrics"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/interfaces/WorldPolitics",
                  label: "WorldPolitics"
                }
              ]
            },
            {
              type: "category",
              label: "Type Aliases",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/type-aliases/Department",
                  label: "Department"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/type-aliases/TurnOutcome",
                  label: "TurnOutcome"
                }
              ]
            },
            {
              type: "category",
              label: "Variables",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/variables/HEXACO_TRAITS",
                  label: "HEXACO_TRAITS"
                }
              ]
            },
            {
              type: "category",
              label: "Functions",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/core/functions/generateInitialPopulation",
                  label: "generateInitialPopulation"
                }
              ]
            }
          ],
          link: {
            type: "doc",
            id: "paracosm/paracosm/core/index"
          }
        },
        {
          type: "doc",
          id: "paracosm/paracosm/digital-twin/index",
          label: "digital-twin"
        },
        {
          type: "category",
          label: "schema",
          items: [
            {
              type: "category",
              label: "Type Aliases",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/Citation",
                  label: "Citation"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/Cost",
                  label: "Cost"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/Decision",
                  label: "Decision"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/DecisionOutcome",
                  label: "DecisionOutcome"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/ForgedToolSummary",
                  label: "ForgedToolSummary"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/HighlightMetric",
                  label: "HighlightMetric"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/ProviderError",
                  label: "ProviderError"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/RiskFlag",
                  label: "RiskFlag"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/RunMetadata",
                  label: "RunMetadata"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/ScenarioExtensions",
                  label: "ScenarioExtensions"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/Score",
                  label: "Score"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SimulationMode",
                  label: "SimulationMode"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SpecialistDetail",
                  label: "SpecialistDetail"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SpecialistNote",
                  label: "SpecialistNote"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/StreamEvent",
                  label: "StreamEvent"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/StreamEventType",
                  label: "StreamEventType"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SubjectMarker",
                  label: "SubjectMarker"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SubjectSignal",
                  label: "SubjectSignal"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SwarmAgent",
                  label: "SwarmAgent"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/SwarmSnapshot",
                  label: "SwarmSnapshot"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/Timepoint",
                  label: "Timepoint"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/Trajectory",
                  label: "Trajectory"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/TrajectoryPoint",
                  label: "TrajectoryPoint"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/type-aliases/WorldSnapshot",
                  label: "WorldSnapshot"
                }
              ]
            },
            {
              type: "category",
              label: "Variables",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/CitationSchema",
                  label: "CitationSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/CostSchema",
                  label: "CostSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/DecisionOutcomeSchema",
                  label: "DecisionOutcomeSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/DecisionSchema",
                  label: "DecisionSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/ForgedToolSummarySchema",
                  label: "ForgedToolSummarySchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/HighlightMetricSchema",
                  label: "HighlightMetricSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/InterventionConfigSchema",
                  label: "InterventionConfigSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/ProviderErrorSchema",
                  label: "ProviderErrorSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/RiskFlagSchema",
                  label: "RiskFlagSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/RunArtifactSchema",
                  label: "RunArtifactSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/RunMetadataSchema",
                  label: "RunMetadataSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/ScenarioExtensionsSchema",
                  label: "ScenarioExtensionsSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/ScoreSchema",
                  label: "ScoreSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SimulationModeSchema",
                  label: "SimulationModeSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SpecialistDetailSchema",
                  label: "SpecialistDetailSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SpecialistNoteSchema",
                  label: "SpecialistNoteSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/STREAM_EVENT_TYPES",
                  label: "STREAM_EVENT_TYPES"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/StreamEventSchema",
                  label: "StreamEventSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SubjectConfigSchema",
                  label: "SubjectConfigSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SubjectMarkerSchema",
                  label: "SubjectMarkerSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SubjectSignalSchema",
                  label: "SubjectSignalSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SwarmAgentSchema",
                  label: "SwarmAgentSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/SwarmSnapshotSchema",
                  label: "SwarmSnapshotSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/TimepointSchema",
                  label: "TimepointSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/TrajectoryPointSchema",
                  label: "TrajectoryPointSchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/TrajectorySchema",
                  label: "TrajectorySchema"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/schema/variables/WorldSnapshotSchema",
                  label: "WorldSnapshotSchema"
                }
              ]
            }
          ],
          link: {
            type: "doc",
            id: "paracosm/paracosm/schema/index"
          }
        },
        {
          type: "category",
          label: "swarm",
          items: [
            {
              type: "category",
              label: "Functions",
              items: [
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/aliveCount",
                  label: "aliveCount"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/deathCount",
                  label: "deathCount"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/departmentHeadcount",
                  label: "departmentHeadcount"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/getSwarm",
                  label: "getSwarm"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/moodHistogram",
                  label: "moodHistogram"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/swarmByDepartment",
                  label: "swarmByDepartment"
                },
                {
                  type: "doc",
                  id: "paracosm/paracosm/swarm/functions/swarmFamilyTree",
                  label: "swarmFamilyTree"
                }
              ]
            }
          ],
          link: {
            type: "doc",
            id: "paracosm/paracosm/swarm/index"
          }
        }
      ],
      link: {
        type: "doc",
        id: "paracosm/paracosm/index"
      }
    }
  ]
};
module.exports = typedocSidebar.items;