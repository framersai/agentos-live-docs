/**
 * @fileoverview This file defines the comprehensive structures and interfaces for Persona Definitions
 * within AgentOS. A Persona Definition is the blueprint that configures the behavior, capabilities,
 * knowledge access, and operational parameters of a Generalized MindInstance (GMI). It serves as
 * the primary configuration artifact for tailoring GMIs to specific roles, tasks, and interaction styles.
 *
 * The IPersonaDefinition interface and its constituent types aim to be highly extensible and descriptive,
 * allowing for fine-grained control over a GMI's functionality. This includes aspects like:
 * - Core identity and behavioral traits.
 * - LLM interaction preferences and prompting strategies.
 * - Allowed tools and broader capabilities.
 * - Multimodal input and output configurations.
 * - Memory management, including conversational context and RAG.
 * - Meta-reasoning prompts for self-regulation and complex decision-making.
 * - Lifecycle and discovery attributes for managing personas within the system.
 *
 * This structured approach ensures that personas are well-defined, maintainable, and can evolve
 * alongside the AgentOS framework and the underlying AI models.
 * @module backend/agentos/cognitive_substrate/personas/IPersonaDefinition
 */

import { ModelCompletionOptions } from '../../core/llm/providers/IProvider';
import { PromptEngineConfig } from '../../core/llm/IPromptEngine';
import { ITool } from '../../tools/interfaces/ITool';

/**
 * Specifies the configuration for a persona's voice when generating audio output (Text-to-Speech).
 * This allows for tailoring the auditory representation of the GMI.
 * @interface PersonaVoiceConfig
 */
export interface PersonaVoiceConfig {
  /**
   * The identifier of the Text-to-Speech (TTS) provider.
   * Examples: 'elevenlabs', 'azure_tts', 'google_tts', 'browser_tts'.
   * @type {string}
   * @optional
   */
  provider?: string;

  /**
   * The provider-specific ID for the voice to be used.
   * @type {string}
   * @optional
   */
  voiceId?: string;

  /**
   * The BCP-47 language code for the voice (e.g., 'en-US', 'es-ES', 'ja-JP').
   * @type {string}
   * @optional
   */
  languageCode?: string;

  /**
   * A record of additional provider-specific parameters for voice generation.
   * These could include settings for pitch, rate, speaking style, emotional tone, etc.
   * @type {Record<string, any>}
   * @optional
   * @example { "stability": 0.75, "clarity": 0.8 } // For ElevenLabs
   */
  customParams?: Record<string, any>;

  /**
   * Maps specific GMI moods to variations in voice style or even different voice IDs.
   * This allows for dynamic changes in vocal delivery based on the GMI's current adaptive mood.
   * @type {Record<string, { voiceId?: string; customParams?: Record<string, any> }>}
   * @optional
   * @example { "cheerful": { "customParams": { "style": "excited" } }, "sad": { "voiceId": "alternate_sad_voice" } }
   */
  moodToVoiceStyleMap?: Record<string, { voiceId?: string; customParams?: Record<string, any> }>;
}

/**
 * Defines the configuration for a persona's visual representation (avatar).
 * This can range from static images to dynamic, generatively produced avatars.
 * @interface PersonaAvatarConfig
 */
export interface PersonaAvatarConfig {
  /**
   * The type of avatar representation.
   * 'static_image': A single, unchanging image.
   * 'animated_image': A looping animation (e.g., GIF, APNG).
   * 'realtime_generative_placeholder': Placeholder for future real-time generative avatar systems.
   * @type {'static_image' | 'animated_image' | 'realtime_generative_placeholder'}
   * @optional
   */
  type?: 'static_image' | 'animated_image' | 'realtime_generative_placeholder';

  /**
   * URL pointing to the source of a static or animated image.
   * @type {string}
   * @optional
   */
  sourceUrl?: string;

  /**
   * A textual description used as a base for generating a real-time avatar, if applicable.
   * @type {string}
   * @optional
   */
  descriptionForGeneration?: string;

  /**
   * Maps GMI moods to different avatar states (e.g., different images or prompt suffixes for generative avatars).
   * @type {Record<string, { sourceUrl?: string; generationPromptSuffix?: string }>}
   * @optional
   * @example { "happy": { "sourceUrl": "/avatars/happy.png" }, "thinking": { "generationPromptSuffix": ", pensive expression" } }
   */
  moodToAvatarStateMap?: Record<string, { sourceUrl?: string; generationPromptSuffix?: string }>;
}

/**
 * Configures how a persona's mood adapts based on interaction context, user feedback, or internal state.
 * @interface PersonaMoodAdaptationConfig
 */
export interface PersonaMoodAdaptationConfig {
  /**
   * If true, mood adaptation is enabled for this persona.
   * @type {boolean}
   */
  enabled: boolean;

  /**
   * A factor (typically 0-1) determining how sensitive the persona is to events that trigger mood changes.
   * Higher values mean mood changes more readily.
   * @type {number}
   * @optional
   */
  sensitivityFactor?: number;

  /**
   * The initial or default mood of the persona (e.g., "neutral", "professional", "empathetic").
   * This mood is active when the GMI initializes or resets.
   * @type {string}
   */
  defaultMood: string;

  /**
   * An exhaustive list of moods this persona is capable of expressing or transitioning into.
   * @type {string[]}
   * @optional
   */
  allowedMoods?: string[];

  /**
   * A record mapping mood identifiers to specific system prompt additions or behavioral instructions.
   * These are injected into the GMI's context to influence its tone and response style.
   * @type {Record<string, string>}
   * @optional
   * @example { "neutral": "Respond in a calm and objective manner.", "cheerful": "Adopt a cheerful and optimistic tone in your responses." }
   */
  moodPrompts?: Record<string, string>;
}

/**
 * Defines preferences for selecting AI models for various tasks or under certain conditions.
 * This allows for fine-grained control over model selection, balancing cost, quality, and capabilities.
 * @interface ModelTargetPreference
 */
export interface ModelTargetPreference {
  /**
   * A hint for the type of task this preference applies to.
   * '*' indicates a general default.
   * @type {string}
   * @optional
   * @example "general_conversation", "code_generation", "rag_synthesis", "summarization"
   */
  taskHint?: string;

  /**
   * The ID of the preferred LLM provider (e.g., "openai", "ollama", "openrouter").
   * @type {string}
   * @optional
   */
  providerId?: string;

  /**
   * The specific ID of the preferred model (e.g., "gpt-4o-mini", "llama3:8b-instruct").
   * @type {string}
   * @optional
   */
  modelId?: string;

  /**
   * A broader model family preference (e.g., "gpt-4", "llama3", "claude-3").
   * Useful if specific model versions change frequently.
   * @type {string}
   * @optional
   */
  modelFamily?: string;

  /**
   * An abstract preference for the quality tier of the model.
   * 'fastest': Prioritizes speed, potentially sacrificing some quality.
   * 'balanced': Aims for a good mix of speed, quality, and cost.
   * 'best': Prioritizes the highest quality output, potentially at higher cost or latency.
   * @type {'fastest' | 'balanced' | 'best'}
   * @optional
   */
  minQualityTier?: 'fastest' | 'balanced' | 'best';

  /**
   * Optional budget constraint for input tokens, in USD per 1,000 tokens (kilo-token).
   * @type {number}
   * @optional
   */
  maxCostPerKiloTokenInput?: number;

  /**
   * Optional budget constraint for output tokens, in USD per 1,000 tokens (kilo-token).
   * @type {number}
   * @optional
   */
  maxCostPerKiloTokenOutput?: number;

  /**
   * An explicit list of model IDs that are allowed for this preference.
   * If specified, only models from this list will be considered, subject to other constraints.
   * @type {string[]}
   * @optional
   */
  allowedModelIds?: string[];

  /**
   * Functional capabilities the selected model must possess.
   * @type {Array<'tool_use' | 'vision_input' | 'json_mode' | 'long_context' | string>}
   * @optional
   * @example ["tool_use", "json_mode"]
   */
  requiredCapabilities?: Array<'tool_use' | 'vision_input' | 'json_mode' | 'long_context' | string>;
}

/**
 * Configuration for how the persona manages and utilizes conversation history.
 * @interface PersonaConversationContextConfig
 */
export interface PersonaConversationContextConfig {
  /**
   * The maximum number of messages (user and assistant turns) to retain in the active conversation window for the LLM.
   * Older messages may be truncated or summarized.
   * @type {number}
   * @optional
   */
  maxMessages?: number;

  /**
   * The maximum total number of tokens allowed for the conversation history portion of the prompt.
   * The PromptEngine will enforce this limit.
   * @type {number}
   * @optional
   */
  maxTokens?: number;

  /**
   * The strategy to employ when the conversation history exceeds `maxMessages` or `maxTokens`.
   * 'truncate': Simply remove older messages.
   * 'summarize': Use an LLM or statistical method to summarize older messages.
   * 'hybrid': A combination, e.g., summarize very old messages, truncate less old ones.
   * @type {'truncate' | 'summarize' | 'hybrid'}
   * @optional
   */
  overflowStrategy?: 'truncate' | 'summarize' | 'hybrid';

  /**
   * Token threshold in the conversation history that, when reached, triggers summarization of older messages.
   * Only applicable if `overflowStrategy` involves summarization.
   * @type {number}
   * @optional
   */
  summarizationTriggerTokens?: number;


  /**
   * If true, tool call requests and their corresponding results from the conversation history
   * will be included when passing history to the LLM.
   * @type {boolean}
   * @optional
   * @default true
   */
  includeToolResults?: boolean;

  /**
   * If true, system messages from the conversation history will be included.
   * @type {boolean}
   * @optional
   * @default true
   */
  includeSystemMessages?: boolean;
}

/**
 * Configuration for a specific RAG (Retrieval Augmented Generation) data source
 * that this persona can potentially access. The actual availability and connection
 * details for these sources are managed by a central RagManager or VectorStoreManager.
 * @interface PersonaRagDataSourceConfig
 */
export interface PersonaRagDataSourceConfig {
  /**
   * Unique identifier for this specific RAG data source configuration instance.
   * This ID should correspond to a globally defined `RagDataSourceConfig`.
   * @type {string}
   * @example "project_docs_pinecone", "web_search_general_knowledge"
   */
  id: string;

  /**
   * If true, this data source is actively used by the persona for RAG.
   * @type {boolean}
   */
  isEnabled: boolean;

  /**
   * A user-friendly name for this data source as perceived by the persona or in logs.
   * @type {string}
   * @optional
   */
  displayName?: string;

  /**
   * Default number of top-K results to retrieve from this source if not specified otherwise.
   * @type {number}
   * @optional
   */
  defaultTopK?: number;

  /**
   * Pre-defined metadata filters to apply when querying this source.
   * This can restrict retrieval to specific subsets of data within the source.
   * @type {Record<string, any>}
   * @optional
   * @example { "document_type": "api_reference", "version": "v2" }
   */
  defaultFilterMetadata?: Record<string, any>;

  /**
   * The relative priority of this data source when multiple sources are queried.
   * Higher numbers indicate higher priority; results from higher priority sources might be preferred.
   * @type {number}
   * @optional
   * @default 0
   */
  priority?: number;
}


/**
 * Configuration for how memory (e.g., conversation history, retrieved documents) is processed
 * by utility services (LLM or statistical) for tasks like summarization or keyword extraction.
 * @interface PersonaUtilityProcessingConfig
 */
export interface PersonaUtilityProcessingConfig {
  /**
   * The engine to use for processing.
   * 'llm': Use a Large Language Model.
   * 'statistical': Use statistical NLP methods.
   * 'none': No specific processing engine is designated for this task by default.
   * @type {'llm' | 'statistical' | 'none'}
   */
  engine: 'llm' | 'statistical' | 'none';

  /**
   * Configuration specific to LLM-based processing.
   * @type {{ providerId?: string; modelId?: string; promptTemplateName?: string; maxOutputTokens?: number }}
   * @optional
   */
  llmConfig?: {
    /** Preferred LLM provider for this utility task. */
    providerId?: string;
    /** Preferred LLM model for this utility task. */
    modelId?: string;
    /** Name of a custom prompt template for the utility task (e.g., summarization). */
    promptTemplateName?: string;
    /** Maximum number of tokens for the processed output. */
    maxOutputTokens?: number;
  };

  /**
   * Configuration specific to statistical method-based processing.
   * @type {{ summarizationMethod?: string; summarizationLength?: 'short' | 'medium' | 'long' | number; keywordExtractionMethod?: string; maxKeywords?: number }}
   * @optional
   */
  statisticalConfig?: {
    /** Method for summarization (e.g., 'first_n_sentences', 'lex_rank'). Names should align with IUtilityAI.SummarizationOptions. */
    summarizationMethod?: string;
    /** Target length for summarization. */
    summarizationLength?: 'short' | 'medium' | 'long' | number;
    /** Method for keyword extraction (e.g., 'tf_idf', 'rake'). Names should align with IUtilityAI.KeywordExtractionOptions. */
    keywordExtractionMethod?: string;
    /** Maximum number of keywords to extract. */
    maxKeywords?: number;
  };
}


/**
 * Configuration for the persona's memory systems, including conversational context,
 * RAG capabilities, and working memory adaptations.
 * @interface PersonaMemoryConfig
 */
export interface PersonaMemoryConfig {
  /**
   * If true, memory features (conversation, RAG, working memory adaptations) are globally enabled for this persona.
   * @type {boolean}
   */
  enabled: boolean;

  /**
   * Configuration for short-term/conversational memory.
   * This is now an alias or directly uses `PersonaConversationContextConfig`.
   * @type {PersonaConversationContextConfig}
   * @optional
   * @deprecated Prefer direct use of `conversationContextConfig` at the root of `IPersonaDefinition`.
   */
  conversationContext?: PersonaConversationContextConfig;

  /**
   * Configuration for long-term memory / Retrieval Augmented Generation (RAG).
   * @type {{ enabled: boolean; defaultRetrievalStrategy?: 'similarity' | 'mmr' | 'hybrid_search'; defaultRetrievalTopK?: number; dataSources?: PersonaRagDataSourceConfig[]; rerankerConfig?: any; queryAugmentationPromptName?: string; resultSynthesizerPromptName?: string; }}
   * @optional
   */
  ragConfig?: {
    /** If true, RAG is enabled for this persona. */
    enabled: boolean;
    /** Default strategy for retrieving documents ('similarity', 'mmr' for Max Marginal Relevance, 'hybrid_search'). */
    defaultRetrievalStrategy?: 'similarity' | 'mmr' | 'hybrid_search';
    /** Default number of documents to retrieve if not specified in the query. */
    defaultRetrievalTopK?: number;
    /** Specifies which globally defined RagDataSourceConfig instances this persona can use and their persona-specific settings. */
    dataSources?: PersonaRagDataSourceConfig[];
    /** Configuration for a reranker model to improve relevance of retrieved results. */
    rerankerConfig?: {
      enabled: boolean;
      provider: 'cohere' | 'jina' | 'custom_llm' | string; // Reranker provider
      modelName?: string; // Specific reranker model name
      apiKeyEnvVar?: string; // Environment variable for the reranker API key
      topN?: number; // Number of results to return after reranking
    };
    /** Name of a prompt template to augment user query before RAG. */
    queryAugmentationPromptName?: string;
    /** Name of a prompt template to synthesize RAG results with original query. */
    resultSynthesizerPromptName?: string;
    /** Configuration for how retrieved context is summarized or processed before injection. */
    retrievedContextProcessing?: PersonaUtilityProcessingConfig;
  };

  /**
   * Configuration for how the persona's working memory adapts or is processed.
   * This can define rules for GMI to update its traits or log preferences based on interactions.
   * @type {{ adaptationRules?: Array<{ triggerEvent: string; action: string; parameters?: any; processingEngine?: PersonaUtilityProcessingConfig; }> }}
   * @optional
   */
  workingMemoryProcessing?: {
    adaptationRules?: Array<{
      /** Event that triggers this rule (e.g., "user_feedback_positive", "repeated_tool_failure"). */
      triggerEvent: string;
      /** Action to take (e.g., "update_trait", "log_preference", "trigger_self_reflection"). */
      action: 'update_trait' | 'log_preference' | 'trigger_self_reflection' | string;
      /** Specific parameters for the action. */
      parameters?: any;
      /** How to process data for this rule, if needed. */
      processingEngine?: PersonaUtilityProcessingConfig;
    }>;
  };
}


/**
 * The primary interface defining a complete Persona for a Generalized Mind Instance (GMI).
 * This structure consolidates all aspects of a persona's definition, from its identity
 * and behavior to its capabilities, memory configuration, and interaction with LLMs.
 * @interface IPersonaDefinition
 */
export interface IPersonaDefinition {
  /**
   * A unique identifier for this persona definition.
   * Should be human-readable and version-able (e.g., "coding_mentor_v2.1", "customer_support_agent_enterprise").
   * @type {string}
   */
  id: string;

  /**
   * A human-friendly name for the persona.
   * @type {string}
   * @example "Expert Coding Mentor", "Friendly Travel Planner"
   */
  name: string;

  /**
   * A detailed description of the persona's role, purpose, key characteristics, and specializations.
   * This can be used for discovery and for informing the GMI's understanding of itself.
   * @type {string}
   */
  description: string;

  /**
   * The version of this persona definition, following semantic versioning (e.g., "1.0.0", "2.1.3-beta").
   * Useful for tracking changes and managing updates.
   * @type {string}
   */
  version: string;

  // --- Core LLM Interaction & Prompting ---

  /**
   * The foundational system prompt(s) that define the GMI's core instructions when this persona is active.
   * Can be:
   * - A single string.
   * - An object with a `template` string and an array of `variables` to be dynamically replaced (e.g., from working memory).
   * - An array of objects, each with `content` and `priority`, allowing for layered or conditional system prompts.
   * @type {string | { template: string; variables?: string[] } | Array<{ content: string; priority?: number }>}
   * @example "You are an expert Python developer specializing in data science."
   * @example { template: "You are {{agent_name}}, a {{agent_role}}.", variables: ["agent_name", "agent_role"] }
   */
  baseSystemPrompt: string | { template: string; variables?: string[] } | Array<{ content: string; priority?: number }>;

  /**
   * Default parameters for LLM completion requests (e.g., temperature, max_tokens, top_p).
   * These can be overridden by user input or more specific configurations.
   * @type {Partial<ModelCompletionOptions>}
   * @optional
   */
  defaultModelCompletionOptions?: Partial<ModelCompletionOptions>;

  /**
   * An ordered list of preferences for selecting AI models based on task hints, quality requirements,
   * cost constraints, or desired capabilities. The GMI will use this to make intelligent model choices.
   * @type {ModelTargetPreference[]}
   * @optional
   */
  modelTargetPreferences?: ModelTargetPreference[];

  /**
   * The overall strategy for the GMI to balance LLM cost versus performance/quality when selecting models.
   * 'always_cheapest': Prioritize the least expensive model that meets basic needs.
   * 'balance_quality_cost': Aim for a good trade-off.
   * 'prioritize_quality': Prefer higher-quality models, even if more expensive.
   * 'user_preference': If the user/session has specified a preference, adhere to it.
   * @type {'always_cheapest' | 'balance_quality_cost' | 'prioritize_quality' | 'user_preference'}
   * @optional
   */
  costSavingStrategy?: 'always_cheapest' | 'balance_quality_cost' | 'prioritize_quality' | 'user_preference';

  /**
   * Persona-specific overrides for the global PromptEngine configuration.
   * This allows tailoring aspects like history truncation or template usage for this persona.
   * @type {Partial<PromptEngineConfig>}
   * @optional
   */
  promptEngineConfigOverrides?: Partial<PromptEngineConfig>;

  // --- Agent Capabilities & Tools ---

  /**
   * A list of specific tool IDs that this persona is permitted to use.
   * These tools must be registered and available within the AgentOS ToolExecutor.
   * @type {string[]}
   * @optional
   */
  toolIds?: string[];

  /**
   * A list of broader capability tags that this persona possesses or is allowed to utilize.
   * Examples: "CAN_BROWSE_WEB", "CAN_EXECUTE_PYTHON_CODE", "CAN_ANALYZE_IMAGES", "FINANCIAL_DATA_ACCESS".
   * These are used for permissioning, dynamic tool discovery, and can influence meta-reasoning.
   * @type {string[]}
   * @optional
   */
  allowedCapabilities?: string[];

  /**
   * Definitions of tools that are directly embedded within this persona definition.
   * These are persona-specific tools or configurations of global tools.
   * If a tool with the same `id` is listed in `toolIds` (referencing a global tool)
   * and also defined here, the `embeddedTools` definition takes precedence for this persona.
   * @type {ITool[]}
   * @optional
   */
  embeddedTools?: ITool[];

  // --- Multimodal Interaction ---

  /**
   * Specifies the input modalities this persona is designed to process.
   * 'text': Standard text input.
   * 'audio_transcription': Text derived from user's speech (STT).
   * 'vision_image_url': URLs pointing to images.
   * 'vision_image_base64': Base64 encoded image data.
   * @type {Array<'text' | 'audio_transcription' | 'vision_image_url' | 'vision_image_base64'>}
   * @optional
   */
  allowedInputModalities?: Array<'text' | 'audio_transcription' | 'vision_image_url' | 'vision_image_base64'>;

  /**
   * Specifies the output modalities this persona can generate.
   * 'text': Standard textual responses.
   * 'audio_tts': Textual content intended for Text-to-Speech conversion.
   * 'image_generation_tool_result': Indicates an image was produced as a result of a tool call.
   * @type {Array<'text' | 'audio_tts' | 'image_generation_tool_result'>}
   * @optional
   */
  allowedOutputModalities?: Array<'text' | 'audio_tts' | 'image_generation_tool_result'>;

  /**
   * Configuration for Text-to-Speech output, if the persona supports it.
   * @type {PersonaVoiceConfig}
   * @optional
   */
  voiceConfig?: PersonaVoiceConfig;

  /**
   * Configuration for a visual avatar representation, if applicable.
   * @type {PersonaAvatarConfig}
   * @optional
   */
  avatarConfig?: PersonaAvatarConfig;

  // --- Behavioral Characteristics & Adaptation ---

  /**
   * A record of key-value pairs defining relatively static personality aspects of the persona.
   * These can be used in prompts or to guide GMI behavior.
   * @type {Record<string, any>}
   * @optional
   * @example { "verbosity": "concise", "humor_level": 0.2, "preferred_output_format": "markdown", "formality": "informal" }
   */
  personalityTraits?: Record<string, any>;

  /**
   * Configuration for dynamic mood changes based on interaction context and user feedback.
   * @type {PersonaMoodAdaptationConfig}
   * @optional
   */
  moodAdaptation?: PersonaMoodAdaptationConfig;

  /**
   * The default language for interaction (BCP-47 language code, e.g., "en-US", "es-ES").
   * @type {string}
   * @optional
   */
  defaultLanguage?: string;

  /**
   * Describes how the persona typically interacts with or suggests UI changes, if applicable.
   * 'suggestive': Offers suggestions for UI elements or actions.
   * 'directive': Directly instructs the UI to render specific components.
   * 'collaborative': Works with the user or system to define UI interactions.
   * 'silent': Does not directly interact with UI generation.
   * @type {'suggestive' | 'directive' | 'collaborative' | 'silent'}
   * @optional
   */
  uiInteractionStyle?: 'suggestive' | 'directive' | 'collaborative' | 'silent';

  // --- Memory, Context, and Knowledge ---

  /**
   * Comprehensive configuration for the persona's memory systems, including short-term
   * conversation context, long-term RAG, and working memory adaptation.
   * @type {PersonaMemoryConfig}
   * @optional
   */
  memoryConfig?: PersonaMemoryConfig;

  /**
   * Configuration for how this persona's conversation context is managed.
   * If `memoryConfig.conversationContext` is also defined, this field takes precedence.
   * @type {PersonaConversationContextConfig}
   * @optional
   */
  conversationContextConfig?: PersonaConversationContextConfig;


  // --- Meta-Reasoning & Self-Management Prompts ---

  /**
   * A collection of prompt templates or instructions for the GMI's internal LLM calls
   * to manage its own behavior, make decisions, or handle complex situations.
   * These enable the GMI to "think about its thinking."
   * @type {object}
   * @optional
   */
  metaPrompts?: {
    /** Prompt template for explaining errors, unexpected tool outputs, or ambiguous situations to the user. */
    explainUnexpectedSituation?: string;
    /** Prompt template for asking clarifying questions when user input is unclear or incomplete. */
    clarifyAmbiguousRequest?: string;
    /** Prompt template for the GMI to review and correct its own generated text before finalizing. */
    selfCorrectOutput?: string;
    /** Prompt template for complex decision-making, like choosing a sub-task, selecting a tool, or deciding to consult another persona. */
    decideNextActionOrPersona?: string;
    /** If true, hints to the GMI to consult the IModelRouter for model selection decisions, potentially overriding its local preferences. */
    useLLMRouterForModelSelection?: boolean;
    /** Prompt template to generate effective search queries from user input for RAG systems. */
    generateSearchQueriesForRag?: string;
    /** Prompt template to synthesize retrieved information from RAG with the original user query to form a coherent answer. */
    synthesizeRagResultsWithQuery?: string;
    /** Prompt template to analyze user intent for complex queries or when multiple interpretations are possible. */
    analyzeUserIntent?: string;
    /** Prompt template for the GMI to generate a rationale for why it's choosing to call a specific tool. */
    generateToolCallRationale?: string;
    /** Prompt template for the GMI to prompt itself (or be prompted by the system) to summarize the current conversation state. */
    summarizeConversation?: string;
  };

  // --- Persona Lifecycle & Discovery ---

  /**
   * If true, indicates this persona is specialized for "vibe coding" or generating/modifying
   * AgentOS components, configurations, or even other personas.
   * @type {boolean}
   * @optional
   */
  isCreatorPersona?: boolean;

  /**
   * If false, this persona might be restricted to specific users, groups, or organizations.
   * If true, it's generally available, subject to `minSubscriptionTier`.
   * @type {boolean}
   * @optional
   * @default true
   */
  isPublic?: boolean;

  /**
   * Keywords or phrases that, if detected in user input, might suggest a switch to this persona
   * in a multi-persona conversational environment.
   * @type {string[]}
   * @optional
   */
  activationKeywords?: string[];

  /**
   * A list of strings describing areas, tasks, or domains where this persona excels.
   * Used for discovery and can inform routing decisions.
   * @type {string[]}
   * @optional
   */
  strengths?: string[];

  /**
   * The minimum subscription tier name (e.g., "FREE", "PRO", "ENTERPRISE") required to use this persona.
   * This ties into the `SubscriptionService` for access control. If undefined, access is not tier-restricted unless `isPublic` is false.
   * @type {string}
   * @optional
   */
  minSubscriptionTier?: string;

  // --- Initial State ---

  /**
   * Key-value pairs to load into the GMI's working memory when this persona is activated.
   * This can include foundational facts, pre-learned user preferences (if applicable and migrated),
   * or initial operational parameters.
   * @type {Array<{ key: string; value: any; description?: string }>}
   * @optional
   * @example [{ key: "user_preferred_language", value: "python", description: "User's default coding language" }]
   */
  initialMemoryImprints?: Array<{ key: string; value: any; description?: string }>;

  // --- Extensibility ---

  /**
   * A flexible field for adding arbitrary additional configuration data specific to this persona
   * or its integrations. This allows for extending persona definitions without modifying the core interface.
   * @type {Record<string, any>}
   * @optional
   */
  customFields?: Record<string, any>;
}