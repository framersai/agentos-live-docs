// File: backend/agentos/cognitive_substrate/personas/IPersonaDefinition.ts
/**
 * @fileoverview This file defines the comprehensive structures and interfaces for Persona Definitions
 * within AgentOS.
 * @module backend/agentos/cognitive_substrate/personas/IPersonaDefinition
 */

import { ModelCompletionOptions } from '../../core/llm/providers/IProvider';
import { PromptEngineConfig } from '../../core/llm/IPromptEngine';
import { ITool } from '../../tools/interfaces/ITool'; // Corrected path, assuming ITool is in interfaces

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
  defaultMood: string; // Should align with GMIMood enum values if possible
  allowedMoods?: string[];
  moodPrompts?: Record<string, string>;
}

/**
 * Defines preferences for selecting AI models for various tasks or under certain conditions.
 * @interface ModelTargetPreference
 */
export interface ModelTargetPreference {
  taskHint?: string;
  providerId?: string;
  modelId?: string;
  modelFamily?: string;
  minQualityTier?: 'fastest' | 'balanced' | 'best';
  maxCostPerKiloTokenInput?: number;
  maxCostPerKiloTokenOutput?: number;
  allowedModelIds?: string[];
  requiredCapabilities?: Array<'tool_use' | 'vision_input' | 'json_mode' | 'long_context' | string>;
}

/**
 * Configuration for how the persona manages and utilizes conversation history.
 * @interface PersonaConversationContextConfig
 */
export interface PersonaConversationContextConfig {
  maxMessages?: number;
  maxTokens?: number;
  overflowStrategy?: 'truncate' | 'summarize' | 'hybrid';
  summarizationTriggerTokens?: number;
  includeToolResults?: boolean;
  includeSystemMessages?: boolean;
}

/**
 * Configuration for a specific RAG (Retrieval Augmented Generation) data source
 * @interface PersonaRagDataSourceConfig
 */
export interface PersonaRagDataSourceConfig {
  id: string;
  isEnabled: boolean;
  displayName?: string;
  defaultTopK?: number;
  defaultFilterMetadata?: Record<string, any>;
  priority?: number;
}

/**
 * Configuration for how memory (e.g., conversation history, retrieved documents) is processed
 * @interface PersonaUtilityProcessingConfig
 */
export interface PersonaUtilityProcessingConfig {
  engine: 'llm' | 'statistical' | 'none';
  llmConfig?: {
    providerId?: string;
    modelId?: string;
    promptTemplateName?: string;
    maxOutputTokens?: number;
  };
  statisticalConfig?: {
    summarizationMethod?: string;
    summarizationLength?: 'short' | 'medium' | 'long' | number;
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
    onIntentDetected?: string[]; // Trigger RAG if specific intents are detected
    onToolFailure?: string[]; // Trigger RAG if specific tools fail
    customLogicFunctionName?: string; // For more complex programmable triggers
}

/**
 * Configuration for RAG ingestion processing.
 * @interface PersonaRagIngestionProcessingConfig
 */
export interface PersonaRagIngestionProcessingConfig {
    summarization?: {
        enabled: boolean;
        targetLength?: 'short' | 'medium' | 'long' | number; // characters or abstract length
        method?: 'extractive' | 'abstractive_llm'; // Method for summarization
        modelId?: string; // Model to use if method is abstractive_llm
        providerId?: string;
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
  conversationContext?: PersonaConversationContextConfig; // Kept for potential direct use
  ragConfig?: {
    enabled: boolean;
    defaultRetrievalStrategy?: 'similarity' | 'mmr' | 'hybrid_search';
    defaultRetrievalTopK?: number;
    dataSources?: PersonaRagDataSourceConfig[];
    rerankerConfig?: {
      enabled: boolean;
      provider: 'cohere' | 'jina' | 'custom_llm' | string;
      modelName?: string;
      apiKeyEnvVar?: string;
      topN?: number;
    };
    queryAugmentationPromptName?: string;
    resultSynthesizerPromptName?: string;
    retrievedContextProcessing?: PersonaUtilityProcessingConfig;
    retrievalTriggers?: PersonaRagConfigRetrievalTrigger; // Added for GMI.ts usage
    ingestionProcessing?: PersonaRagIngestionProcessingConfig; // Added for GMI.ts usage
    defaultIngestionDataSourceId?: string; // Added for GMI.ts usage

  };
  workingMemoryProcessing?: {
    adaptationRules?: Array<{
      triggerEvent: string;
      action: 'update_trait' | 'log_preference' | 'trigger_self_reflection' | string;
      parameters?: any;
      processingEngine?: PersonaUtilityProcessingConfig;
    }>;
  };
  lifecycleConfig?: { // Added for GMI.ts usage
    negotiationEnabled?: boolean;
    // Other lifecycle related persona preferences can go here
  };
}

/**
 * Defines a meta-prompt for GMI self-regulation.
 * @interface MetaPromptDefinition
 */
export interface MetaPromptDefinition {
    id: string; // Unique identifier for the meta-prompt (e.g., "gmi_self_trait_adjustment")
    description?: string; // What this meta-prompt is for
    promptTemplate: string | { template: string; variables?: string[] };
    modelId?: string; // Optional: specific model to use for this meta-prompt
    providerId?: string; // Optional: specific provider
    maxOutputTokens?: number;
    temperature?: number;
    outputSchema?: Record<string, any>; // Optional JSON schema for the expected output structure
    trigger?: // How this meta-prompt is triggered
      | { type: 'turn_interval'; intervalTurns: number }
      | { type: 'event_based'; eventName: string }
      | { type: 'manual' }; // Triggered programmatically by GMI logic
}


/**
 * The primary interface defining a complete Persona for a Generalized Mind Instance (GMI).
 * @interface IPersonaDefinition
 */
export interface IPersonaDefinition {
  id: string;
  name: string;
  description: string;
  version: string;

  baseSystemPrompt: string | { template: string; variables?: string[] } | Array<{ content: string; priority?: number }>;
  defaultModelCompletionOptions?: Partial<ModelCompletionOptions>;
  modelTargetPreferences?: ModelTargetPreference[];
  costSavingStrategy?: 'always_cheapest' | 'balance_quality_cost' | 'prioritize_quality' | 'user_preference';
  promptEngineConfigOverrides?: Partial<PromptEngineConfig>;

  toolIds?: string[];
  allowedCapabilities?: string[];
  embeddedTools?: ITool[];

  allowedInputModalities?: Array<'text' | 'audio_transcription' | 'vision_image_url' | 'vision_image_base64'>;
  allowedOutputModalities?: Array<'text' | 'audio_tts' | 'image_generation_tool_result'>;
  voiceConfig?: PersonaVoiceConfig;
  avatarConfig?: PersonaAvatarConfig;

  personalityTraits?: Record<string, any>;
  moodAdaptation?: PersonaMoodAdaptationConfig;
  defaultLanguage?: string;
  uiInteractionStyle?: 'suggestive' | 'directive' | 'collaborative' | 'silent';

  memoryConfig?: PersonaMemoryConfig;
  conversationContextConfig?: PersonaConversationContextConfig;

  /**
   * A collection of prompt templates or instructions for the GMI's internal LLM calls
   * to manage its own behavior, make decisions, or handle complex situations.
   * These enable the GMI to "think about its thinking."
   * @type {MetaPromptDefinition[]}
   * @optional
   */
  metaPrompts?: MetaPromptDefinition[]; // Changed to array of MetaPromptDefinition

  isCreatorPersona?: boolean;
  isPublic?: boolean;
  activationKeywords?: string[];
  strengths?: string[];
  minSubscriptionTier?: string;

  initialMemoryImprints?: Array<{ key: string; value: any; description?: string }>;
  customFields?: Record<string, any> & { // For GMI.ts:189, 208
      defaultWorkingMemoryConfig?: any;
      initialUserContext?: Partial<UserContext>;
      initialTaskContext?: Partial<TaskContext>;
  };
}