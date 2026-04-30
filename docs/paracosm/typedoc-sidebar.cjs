// @ts-check
/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
const typedocSidebar = {
  items: [
    {
      type: "category",
      label: "engine",
      items: [
        {
          type: "category",
          label: "Classes",
          items: [
            {
              type: "doc",
              id: "paracosm/engine/classes/EffectRegistry",
              label: "EffectRegistry"
            },
            {
              type: "doc",
              id: "paracosm/engine/classes/EventTaxonomy",
              label: "EventTaxonomy"
            },
            {
              type: "doc",
              id: "paracosm/engine/classes/MetricRegistry",
              label: "MetricRegistry"
            },
            {
              type: "doc",
              id: "paracosm/engine/classes/ProviderKeyMissingError",
              label: "ProviderKeyMissingError"
            },
            {
              type: "doc",
              id: "paracosm/engine/classes/SeededRng",
              label: "SeededRng"
            },
            {
              type: "doc",
              id: "paracosm/engine/classes/SimulationKernel",
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
              id: "paracosm/engine/interfaces/Agent",
              label: "Agent"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentCareer",
              label: "AgentCareer"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentCore",
              label: "AgentCore"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentFieldDefinition",
              label: "AgentFieldDefinition"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentHealth",
              label: "AgentHealth"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentMemory",
              label: "AgentMemory"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentMemoryEntry",
              label: "AgentMemoryEntry"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentNarrative",
              label: "AgentNarrative"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/AgentSocial",
              label: "AgentSocial"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ColonyPatch",
              label: "ColonyPatch"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/DepartmentDefinition",
              label: "DepartmentDefinition"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/EffectDefinition",
              label: "EffectDefinition"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/EventDefinition",
              label: "EventDefinition"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/EventOptionDef",
              label: "EventOptionDef"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/HexacoProfile",
              label: "HexacoProfile"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/HexacoSnapshot",
              label: "HexacoSnapshot"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/KeyPersonnel",
              label: "KeyPersonnel"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/KnowledgeBundle",
              label: "KnowledgeBundle"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/KnowledgeCitation",
              label: "KnowledgeCitation"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/KnowledgeTopic",
              label: "KnowledgeTopic"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/LeaderConfig",
              label: "LeaderConfig"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/LifeEvent",
              label: "LifeEvent"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/MetricDefinition",
              label: "MetricDefinition"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/MilestoneEventDef",
              label: "MilestoneEventDef"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/OutcomeModifiers",
              label: "OutcomeModifiers"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ParacosmClient",
              label: "ParacosmClient"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ParacosmClientOptions",
              label: "ParacosmClientOptions"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/PolicyEffect",
              label: "PolicyEffect"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ProgressionHookContext",
              label: "ProgressionHookContext"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/PromotionRecord",
              label: "PromotionRecord"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/PromptHookContext",
              label: "PromptHookContext"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ResolvedProviderChoice",
              label: "ResolvedProviderChoice"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ResolveProviderOptions",
              label: "ResolveProviderOptions"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/Scenario",
              label: "Scenario"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioEventDef",
              label: "ScenarioEventDef"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioHooks",
              label: "ScenarioHooks"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioLabels",
              label: "ScenarioLabels"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioMetric",
              label: "ScenarioMetric"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioPackage",
              label: "ScenarioPackage"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioPolicies",
              label: "ScenarioPolicies"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioPreset",
              label: "ScenarioPreset"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioSetupSchema",
              label: "ScenarioSetupSchema"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioTheme",
              label: "ScenarioTheme"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioUiDefinition",
              label: "ScenarioUiDefinition"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/ScenarioWorldSchema",
              label: "ScenarioWorldSchema"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/SimulationInitOverrides",
              label: "SimulationInitOverrides"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/SimulationMetadata",
              label: "SimulationMetadata"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/SimulationModelConfig",
              label: "SimulationModelConfig"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/SimulationState",
              label: "SimulationState"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/TurnEvent",
              label: "TurnEvent"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/WorldMetricSchema",
              label: "WorldMetricSchema"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/WorldPolitics",
              label: "WorldPolitics"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/WorldState",
              label: "WorldState"
            },
            {
              type: "doc",
              id: "paracosm/engine/interfaces/WorldSystems",
              label: "WorldSystems"
            }
          ]
        },
        {
          type: "category",
          label: "Type Aliases",
          items: [
            {
              type: "doc",
              id: "paracosm/engine/type-aliases/AgentFieldValue",
              label: "AgentFieldValue"
            },
            {
              type: "doc",
              id: "paracosm/engine/type-aliases/CostPreset",
              label: "CostPreset"
            },
            {
              type: "doc",
              id: "paracosm/engine/type-aliases/Department",
              label: "Department"
            },
            {
              type: "doc",
              id: "paracosm/engine/type-aliases/LlmProvider",
              label: "LlmProvider"
            },
            {
              type: "doc",
              id: "paracosm/engine/type-aliases/TurnOutcome",
              label: "TurnOutcome"
            },
            {
              type: "doc",
              id: "paracosm/engine/type-aliases/TurnOutcomeType",
              label: "TurnOutcomeType"
            }
          ]
        },
        {
          type: "category",
          label: "Variables",
          items: [
            {
              type: "doc",
              id: "paracosm/engine/variables/lunarScenario",
              label: "lunarScenario"
            },
            {
              type: "doc",
              id: "paracosm/engine/variables/marsScenario",
              label: "marsScenario"
            }
          ]
        },
        {
          type: "category",
          label: "Functions",
          items: [
            {
              type: "doc",
              id: "paracosm/engine/functions/applyPersonalityDrift",
              label: "applyPersonalityDrift"
            },
            {
              type: "doc",
              id: "paracosm/engine/functions/classifyOutcome",
              label: "classifyOutcome"
            },
            {
              type: "doc",
              id: "paracosm/engine/functions/classifyOutcomeById",
              label: "classifyOutcomeById"
            },
            {
              type: "doc",
              id: "paracosm/engine/functions/createParacosmClient",
              label: "createParacosmClient"
            },
            {
              type: "doc",
              id: "paracosm/engine/functions/generateInitialPopulation",
              label: "generateInitialPopulation"
            },
            {
              type: "doc",
              id: "paracosm/engine/functions/progressBetweenTurns",
              label: "progressBetweenTurns"
            },
            {
              type: "doc",
              id: "paracosm/engine/functions/resolveProviderWithFallback",
              label: "resolveProviderWithFallback"
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
                  id: "paracosm/engine/compiler/interfaces/CompileOptions",
                  label: "CompileOptions"
                },
                {
                  type: "doc",
                  id: "paracosm/engine/compiler/interfaces/SeedIngestionOptions",
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
                  id: "paracosm/engine/compiler/type-aliases/GenerateTextFn",
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
                  id: "paracosm/engine/compiler/functions/compileScenario",
                  label: "compileScenario"
                },
                {
                  type: "doc",
                  id: "paracosm/engine/compiler/functions/ingestFromUrl",
                  label: "ingestFromUrl"
                },
                {
                  type: "doc",
                  id: "paracosm/engine/compiler/functions/ingestSeed",
                  label: "ingestSeed"
                }
              ]
            }
          ],
          link: {
            type: "doc",
            id: "paracosm/engine/compiler/index"
          }
        }
      ],
      link: {
        type: "doc",
        id: "paracosm/engine/index"
      }
    },
    {
      type: "category",
      label: "runtime",
      items: [
        {
          type: "category",
          label: "Classes",
          items: [
            {
              type: "doc",
              id: "paracosm/runtime/classes/EventDirector",
              label: "EventDirector"
            }
          ]
        },
        {
          type: "category",
          label: "Interfaces",
          items: [
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/BatchConfig",
              label: "BatchConfig"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/BatchManifest",
              label: "BatchManifest"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/BatchResult",
              label: "BatchResult"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/CommanderDecision",
              label: "CommanderDecision"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/CrisisResearchPacket",
              label: "CrisisResearchPacket"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/DepartmentReport",
              label: "DepartmentReport"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/DirectorContext",
              label: "DirectorContext"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/DirectorEvent",
              label: "DirectorEvent"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/EconomicsEnvelope",
              label: "EconomicsEnvelope"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/ResolvedEconomicsProfile",
              label: "ResolvedEconomicsProfile"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/RunOptions",
              label: "RunOptions"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/SimEventCostPayload",
              label: "SimEventCostPayload"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/SimEventPayloadMap",
              label: "SimEventPayloadMap"
            },
            {
              type: "doc",
              id: "paracosm/runtime/interfaces/TurnArtifact",
              label: "TurnArtifact"
            }
          ]
        },
        {
          type: "category",
          label: "Type Aliases",
          items: [
            {
              type: "doc",
              id: "paracosm/runtime/type-aliases/CrisisCategory",
              label: "CrisisCategory",
              className: "typedoc-sidebar-item-deprecated"
            },
            {
              type: "doc",
              id: "paracosm/runtime/type-aliases/DirectorCrisis",
              label: "DirectorCrisis",
              className: "typedoc-sidebar-item-deprecated"
            },
            {
              type: "doc",
              id: "paracosm/runtime/type-aliases/EventCategory",
              label: "EventCategory"
            },
            {
              type: "doc",
              id: "paracosm/runtime/type-aliases/SimEvent",
              label: "SimEvent"
            },
            {
              type: "doc",
              id: "paracosm/runtime/type-aliases/SimEventType",
              label: "SimEventType"
            },
            {
              type: "doc",
              id: "paracosm/runtime/type-aliases/SimulationEconomicsProfileId",
              label: "SimulationEconomicsProfileId"
            }
          ]
        },
        {
          type: "category",
          label: "Functions",
          items: [
            {
              type: "doc",
              id: "paracosm/runtime/functions/buildDepartmentContext",
              label: "buildDepartmentContext"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/buildEconomicsEnvelope",
              label: "buildEconomicsEnvelope"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/buildEventSummary",
              label: "buildEventSummary"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/buildMemoryContext",
              label: "buildMemoryContext"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/consolidateMemory",
              label: "consolidateMemory"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/generateAgentReactions",
              label: "generateAgentReactions"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/getDepartmentsForTurn",
              label: "getDepartmentsForTurn"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/recordReactionMemory",
              label: "recordReactionMemory"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/resolveEconomicsProfile",
              label: "resolveEconomicsProfile"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/runBatch",
              label: "runBatch"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/runSimulation",
              label: "runSimulation"
            },
            {
              type: "doc",
              id: "paracosm/runtime/functions/updateRelationshipsFromReactions",
              label: "updateRelationshipsFromReactions"
            }
          ]
        }
      ],
      link: {
        type: "doc",
        id: "paracosm/runtime/index"
      }
    }
  ]
};
module.exports = typedocSidebar.items;