// File: backend/agentos/cognitive_substrate/personas/IPersonaDefinition.ts
/**
 * @fileoverview This file defines the comprehensive structures and interfaces for Persona Definitions
 * within AgentOS.
 * @module backend/agentos/cognitive_substrate/personas/IPersonaDefinition
 */

import { ModelCompletionOptions } from '../../core/llm/providers/IProvider';
import { PromptEngineConfig } from '../../core/llm/IPromptEngine';
// Assuming ITool is in a subdirectory 'interfaces' under 'tools'
// The provided file structure is backend/agentos/core/tools/ITool.ts
// So the path should be ../../core/tools/ITool.ts if IPersonaDefinition.ts is in cognitive_substrate/personas
import { ITool } from '../../core/tools/ITool'; // Corrected path assumption

// Placeholder definitions for UserContext and TaskContext if not defined elsewhere
// It's recommended to define these in appropriate domain-specific files.
// IGMI.ts already exports UserContext and TaskContext, so we can use those if they are compatible
// For now, keeping local definitions as per original file if they are intended to be distinct
// or if IPersonaDefinition.ts cannot directly import from IGMI.ts due to layering.
// Given the file structure, it *can* import. Let's assume these are specialized for persona defaults.
export interface PersonaUserContextDefaults {
  skillLevel?: string;
  preferences?: Record<string, any>;
  // Other user-specific context defaults
}

export interface PersonaTaskContextDefaults {
  domain?: string;
  complexity?: string;
  goal?: string;
  // Other task-specific context defaults
}


/**
 * Specifies the configuration for a persona's voice when generating audio output (Text-to-Speech).
 * @interface PersonaVoiceConfig
 */
export interface PersonaVoiceConfig {
  provider?: string;
  voiceId?: string;
  languageCode?: string;
  customParams?: Record<string, any>;
  moodToVoiceStyleMap?: Record<string, { voiceId?: string; customParams?: Record<string, any> }>;
}

/**
 * Defines the configuration for a persona's visual representation (avatar).
 * @interface PersonaAvatarConfig
 */
export interface PersonaAvatarConfig {
  type?: 'static_image' | 'animated_image' | 'realtime_generative_placeholder';
  sourceUrl?: string;
  descriptionForGeneration?: string;
  moodToAvatarStateMap?: Record<string, { sourceUrl?: string; generationPromptSuffix?: string }>;
}

/**
 * Configures how a persona's mood adapts based on interaction context, user feedback, or internal state.
 * @interface PersonaMoodAdaptationConfig
 */
export interface PersonaMoodAdaptationConfig {
  enabled: boolean;
  sensitivityFactor?: number;
  defaultMood: string; // Should ideally map to GMIMood enum values
  allowedMoods?: string[];
  moodPrompts?: Record<string, string>;
}

/**
 * Defines preferences for selecting AI models for various tasks or under certain conditions.
 * @interface ModelTargetPreference
 */
export interface ModelTargetPreference {
  taskHint?: string; // e.g., 'summarization', 'code_generation', 'general_chat'
  providerId?: string;
  modelId?: string; // Can be a specific model ID or a pattern/family name
  modelFamily?: string; // e.g., 'gpt-4', 'claude-3'
  minQualityTier?: 'fastest' | 'balanced' | 'best';
  maxCostPerKiloTokenInput?: number;
  maxCostPerKiloTokenOutput?: number;
  allowedModelIds?: string[]; // Explicit list of allowed models for this preference
  requiredCapabilities?: Array<'tool_use' | 'vision_input' | 'json_mode' | 'long_context' | string>;
}

/**
 * Configuration for how the persona manages and utilizes conversation history.
 * @interface PersonaConversationContextConfig
 */
export interface PersonaConversationContextConfig {
  maxMessages?: number;
  maxTokens?: number; // Max tokens for the history part of the prompt
  overflowStrategy?: 'truncate' | 'summarize' | 'hybrid'; // How to handle history exceeding limits
  summarizationTriggerTokens?: number; // When to trigger summarization if 'summarize' or 'hybrid'
  includeToolResults?: boolean; // Whether tool results messages are part of the history for LLM
  includeSystemMessages?: boolean; // Whether system messages are part of the history for LLM
}

/**
 * Configuration for a specific RAG (Retrieval Augmented Generation) data source
 * @interface PersonaRagDataSourceConfig
 */
export interface PersonaRagDataSourceConfig {
  id: string; // Unique ID for this data source configuration entry
  dataSourceNameOrId: string; // Actual ID/name of the data source in the RAG system
  isEnabled: boolean;
  displayName?: string; // User-friendly name for this source in persona context
  defaultTopK?: number; // How many results to fetch from this source by default
  defaultFilterMetadata?: Record<string, any>; // Default metadata filters for this source
  priority?: number; // Retrieval priority for this source
  relevanceThreshold?: number; // Minimum relevance score to consider results from this source
}

/**
 * Configuration for how memory (e.g., conversation history, retrieved documents) is processed by utility AI.
 * @interface PersonaUtilityProcessingConfig
 */
export interface PersonaUtilityProcessingConfig {
  engine: 'llm' | 'statistical' | 'none'; // Which engine to use for processing
  llmConfig?: {
    providerId?: string;
    modelId?: string;
    promptTemplateName?: string; // Specific prompt template for this utility task
    maxOutputTokens?: number;
  };
  statisticalConfig?: {
    summarizationMethod?: string; // e.g., 'textrank', 'lexrank'
    summarizationLength?: 'short' | 'medium' | 'long' | number; // Target length/number of sentences
    keywordExtractionMethod?: string;
    maxKeywords?: number;
  };
}

/**
 * Defines triggers for RAG retrieval.
 * @interface PersonaRagConfigRetrievalTrigger
 */
export interface PersonaRagConfigRetrievalTrigger {
    onUserQuery?: boolean; // Trigger RAG on every user query
    onIntentDetected?: string[]; // Trigger if specific intents are detected
    onToolFailure?: string[]; // Trigger if specific tools fail
    onMissingContextKeywords?: string[]; // Trigger if query contains keywords but context seems lacking
    customLogicFunctionName?: string; // For more complex custom trigger logic
}

/**
 * Defines triggers for RAG ingestion (e.g., summarizing turns into RAG).
 * @interface PersonaRagConfigIngestionTrigger
 */
export interface PersonaRagConfigIngestionTrigger {
    onTurnSummary?: boolean; // Trigger ingestion of turn summary
    onExplicitUserCommand?: string; // e.g., "remember this for later"
    customLogicFunctionName?: string;
}


/**
 * Configuration for RAG ingestion processing.
 * @interface PersonaRagIngestionProcessingConfig
 */
export interface PersonaRagIngestionProcessingConfig {
    summarization?: {
        enabled: boolean;
        targetLength?: 'short' | 'medium' | 'long' | number; // Number of words/sentences or category
        method?: 'extractive' | 'abstractive_llm';
        modelId?: string; // For abstractive_llm
        providerId?: string; // For abstractive_llm
    };
    keywordExtraction?: {
        enabled: boolean;
        maxKeywords?: number;
    };
}


/**
 * Configuration for the persona's memory systems.
 * @interface PersonaMemoryConfig
 */
export interface PersonaMemoryConfig {
  enabled: boolean;
  conversationContext?: PersonaConversationContextConfig; // Configuration specific to history management
  ragConfig?: {
    enabled: boolean;
    defaultRetrievalStrategy?: 'similarity' | 'mmr' | 'hybrid_search';
    defaultRetrievalTopK?: number;
    dataSources?: PersonaRagDataSourceConfig[]; // Define how this persona uses specific RAG data sources
    rerankerConfig?: {
      enabled: boolean;
      provider: 'cohere' | 'jina' | 'custom_llm' | string; // e.g., specific model for reranking
      modelName?: string;
      apiKeyEnvVar?: string; // Env var name for API key if needed
      topN?: number; // Number of results to pass to reranker and expect back
    };
    queryAugmentationPromptName?: string; // Name of a prompt template for query expansion/rewriting
    resultSynthesizerPromptName?: string; // Name of a prompt template to synthesize final answer from RAG results
    retrievedContextProcessing?: PersonaUtilityProcessingConfig; // How to process/summarize retrieved context before injection
    retrievalTriggers?: PersonaRagConfigRetrievalTrigger; // When to trigger RAG retrieval
    ingestionTriggers?: PersonaRagConfigIngestionTrigger; // ADDED: When to trigger ingestion into RAG
    ingestionProcessing?: PersonaRagIngestionProcessingConfig; // How to process content before RAG ingestion
    defaultIngestionDataSourceId?: string; // Default RAG source to ingest persona-related memories
  };
  workingMemoryProcessing?: {
    adaptationRules?: Array<{
      triggerEvent: string; // e.g., 'user_feedback_positive', 'task_completed_successfully'
      action: 'update_trait' | 'log_preference' | 'trigger_self_reflection' | string;
      parameters?: any; // Parameters for the action
      processingEngine?: PersonaUtilityProcessingConfig; // Engine to process event data for action
    }>;
  };
  lifecycleConfig?: { // Configuration for memory lifecycle management interactions
    negotiationEnabled?: boolean; // Can GMI negotiate memory lifecycle events?
    // Potentially add rules here like "always_retain_user_explicit_memory"
  };
}

/**
 * Defines a meta-prompt for GMI self-regulation.
 * @interface MetaPromptDefinition
 */
export interface MetaPromptDefinition {
    id: string; // Unique ID for this meta-prompt (e.g., 'gmi_self_trait_adjustment')
    description?: string;
    promptTemplate: string | { template: string; variables?: string[] }; // The template itself
    modelId?: string; // Specific model to use for this meta-prompt
    providerId?: string; // Specific provider
    maxOutputTokens?: number;
    temperature?: number;
    outputSchema?: Record<string, any>; // Expected JSON schema of the output, for validation/parsing
    trigger?: // How this meta-prompt is triggered
      | { type: 'turn_interval'; intervalTurns: number }
      | { type: 'event_based'; eventName: string } // e.g., 'error_threshold_reached', 'user_sentiment_negative'
      | { type: 'manual' }; // Triggered explicitly by system or user
}

/**
 * Defines contextual elements that can be dynamically injected into prompts.
 * @interface ContextualPromptElement
 */
export interface ContextualPromptElement {
    id: string;
    type: string; // e.g., 'SYSTEM_INSTRUCTION_ADDON', 'FEW_SHOT_EXAMPLE' (maps to ContextualElementType in IPromptEngine)
    content: string | object; // The actual content to inject. Can be structured.
    criteria: ContextualPromptElementCriteria; // Conditions for activation
    priority?: number; // For resolving conflicts or ordering
    metadata?: Record<string, any>; // e.g., source, language
}

/**
 * Defines criteria for activating a contextual prompt element.
 * @interface ContextualPromptElementCriteria
 */
export interface ContextualPromptElementCriteria {
    // Define specific criteria fields, e.g.,
    // currentMood?: string[]; // Activates if GMI mood is one of these
    // userSkillLevel?: string[]; // Activates for these user skill levels
    // taskHint?: string[]; // Activates for these task types
    // customConditions?: Array<{ type: 'workingMemoryQuery', query: string, expectedValue: any } | { type: 'jsExpression', expression: string }>;
    // This structure needs to be defined based on what IPromptEngine.evaluateCriteria can handle.
    [key: string]: any; // Placeholder for actual criteria structure
}


/**
 * The primary interface defining a complete Persona for a Generalized Mind Instance (GMI).
 * @interface IPersonaDefinition
 */
export interface IPersonaDefinition {
  id: string;
  name: string;
  label?: string;
  description: string;
  version: string;

  // Core Prompting Configuration
  baseSystemPrompt: string | { template: string; variables?: string[] } | Array<{ content: string; priority?: number }>;

  // LLM Selection and Options
  defaultModelId?: string; // ADDED: Default model ID for this persona
  defaultProviderId?: string; // ADDED: Default provider ID (optional if modelId is globally unique or prefixed)
  defaultModelCompletionOptions?: Partial<ModelCompletionOptions>; // Options like temperature, maxTokens
  modelTargetPreferences?: ModelTargetPreference[];
  costSavingStrategy?: 'always_cheapest' | 'balance_quality_cost' | 'prioritize_quality' | 'user_preference';

  // Prompt Engine Overrides
  promptEngineConfigOverrides?: Partial<PromptEngineConfig>;

  // Tools and Capabilities
  toolIds?: string[]; // IDs of tools this persona is allowed to use
  allowedCapabilities?: string[]; // General capabilities like 'web_search', 'code_execution'
  embeddedTools?: ITool[]; // Actual tool instances embedded within the persona (less common for dynamic tools)

  // Modalities
  allowedInputModalities?: Array<'text' | 'audio_transcription' | 'vision_image_url' | 'vision_image_base64'>;
  allowedOutputModalities?: Array<'text' | 'audio_tts' | 'image_generation_tool_result'>;
  voiceConfig?: PersonaVoiceConfig;
  avatarConfig?: PersonaAvatarConfig;

  // Personality & Behavior
  personalityTraits?: Record<string, any>; // Key-value store for traits (e.g., "humor_level": 0.7)
  moodAdaptation?: PersonaMoodAdaptationConfig;
  defaultLanguage?: string; // BCP-47 language code
  uiInteractionStyle?: 'suggestive' | 'directive' | 'collaborative' | 'silent'; // How persona prefers to interact with UI

  // Memory and Context
  memoryConfig?: PersonaMemoryConfig;
  conversationContextConfig?: PersonaConversationContextConfig; // Kept for redundancy or specific overrides on top of memoryConfig.conversationContext

  // Meta-Processing & Self-Regulation
  metaPrompts?: MetaPromptDefinition[];
  contextualPromptElements?: ContextualPromptElement[]; // ADDED: For dynamic prompt adaptation


  // Access & Discovery
  isCreatorPersona?: boolean; // Special flag for personas that can create/modify others
  isPublic?: boolean; // Whether this persona is discoverable/usable by all users (respecting tiers)
  activationKeywords?: string[]; // Keywords that might trigger this persona in a multi-persona GMI
  strengths?: string[]; // Areas where this persona excels (tags for discovery)
  minSubscriptionTier?: string; // Name of the minimum subscription tier required

  // Initialization & State
  initialMemoryImprints?: Array<{ key: string; value: any; description?: string }>; // Initial data for working memory
  customFields?: Record<string, any> & {
    defaultWorkingMemoryConfig?: any; // Default config for this persona's GMI working memory
    initialUserContext?: Partial<PersonaUserContextDefaults>;
    initialTaskContext?: Partial<PersonaTaskContextDefaults>;
  };
}
