// File: backend/agentos/api/types/AgentOSInput.ts
/**
 * @fileoverview Defines the unified input structure for the AgentOS API.
 * This interface encapsulates all possible data and options a user or
 * client might provide when interacting with an AgentOS instance.
 * It emphasizes clarity, type safety, and comprehensive data capture for
 * sophisticated GMI interactions.
 *
 * @module backend/agentos/api/types/AgentOSInput
 * @see ../../cognitive_substrate/IGMI.ts For VisionInputData and AudioInputData definitions.
 */

import { VisionInputData, AudioInputData } from '../../cognitive_substrate/IGMI';

/**
 * Defines the structure for user-provided feedback on a GMI's performance or a specific message.
 * This feedback is crucial for the GMI's adaptive learning capabilities and for system analytics.
 *
 * @interface UserFeedbackPayload
 * @property {'positive' | 'negative' | 'neutral'} [rating] - A categorical rating indicating overall satisfaction or sentiment.
 * @property {number} [score] - A numerical score, e.g., on a 1-5 scale, providing a more granular measure of feedback.
 * @property {string} [text] - Detailed textual feedback from the user, offering qualitative insights or suggestions.
 * @property {string[]} [tags] - Custom tags for categorizing the feedback (e.g., "inaccurate_tool_use", "helpful_summary", "creative_suggestion").
 * @property {string} [correctedContent] - User-provided correction for a GMI's response, useful for direct learning.
 * @property {string} [targetMessageId] - Optional ID of the specific GMI-generated message this feedback pertains to,
 * enabling targeted feedback attribution.
 * @property {Record<string, any>} [customData] - A flexible object for any other structured feedback data relevant to the application
 * or specific GMI persona.
 */
export interface UserFeedbackPayload {
  rating?: 'positive' | 'negative' | 'neutral';
  score?: number;
  text?: string;
  tags?: string[];
  correctedContent?: string;
  targetMessageId?: string;
  customData?: Record<string, any>;
}

/**
 * Encapsulates all data and options for a single interaction turn with AgentOS.
 * This structure is designed to be comprehensive, supporting multimodal inputs,
 * persona selection, user-specific API keys, explicit feedback, conversation
 * management, and fine-grained processing controls.
 *
 * @interface AgentOSInput
 * @property {string} userId - The ID of the authenticated user. For unauthenticated interactions,
 * a unique anonymous session ID might be used if the system design permits, but
 * authenticated user IDs are preferred for full functionality and personalization.
 * @property {string} sessionId - A unique identifier for the current client session. This helps
 * maintain conversational continuity and associate interactions across multiple requests
 * or devices if applicable. It can also be used to manage GMI instance affinity.
 * @property {string | null} textInput - The primary textual input from the user for this turn.
 * Can be `null` if the input is purely multimodal (e.g., only audio or vision) or
 * if the turn is initiated by a system event rather than direct user text.
 * @property {VisionInputData[]} [visionInputs] - Optional array of structured vision input data,
 * as defined in `IGMI.ts`. Supports image URLs, base64 encoded images, etc., allowing
 * GMIs to process and respond to visual information.
 * @property {AudioInputData} [audioInput] - Optional structured audio input data, as defined
 * in `IGMI.ts`. Can represent transcriptions, audio file references, or raw audio data,
 * enabling voice-based interactions.
 * @property {string} [selectedPersonaId] - The ID of the GMI persona the user explicitly
 * wishes to interact with or switch to. If omitted, AgentOS will use the last
 * active persona for the session or a system-defined default persona.
 * @property {Record<string, string>} [userApiKeys] - Optional user-provided API keys for
 * specific LLM providers (e.g., `{ "openai": "sk-...", "anthropic": "sk-..." }`).
 * Enables users to leverage their own provider accounts, subject to system policies and
 * potential benefits like different models or higher rate limits.
 * @property {UserFeedbackPayload} [userFeedback] - Optional structured feedback from the user
 * about the GMI's previous response or overall performance. This is crucial for the GMI's
 * adaptive learning mechanisms and for system improvement.
 * @property {string} [conversationId] - Optional ID of an ongoing conversation. If provided,
 * AgentOS will attempt to load and continue this specific conversation history.
 * If omitted, a new conversation context may be created or an existing one associated
 * with the `sessionId` might be used, depending on system configuration.
 * @property {ProcessingOptions} [options] - Optional processing options that allow fine-tuning
 * of GMI behavior for the current turn, overriding defaults or persona settings.
 */
export interface AgentOSInput {
  userId: string;
  sessionId: string;
  textInput: string | null;
  visionInputs?: VisionInputData[];
  audioInput?: AudioInputData;
  selectedPersonaId?: string;
  userApiKeys?: Record<string, string>;
  userFeedback?: UserFeedbackPayload;
  conversationId?: string;
  options?: ProcessingOptions;
}

/**
 * Defines fine-grained control options for how AgentOS processes an individual turn.
 * These options can override system defaults or persona-specific settings for the duration
 * of the current request, allowing for dynamic adjustments to GMI behavior and output.
 *
 * @interface ProcessingOptions
 * @property {boolean} [streamUICommands=true] - If true (default), UI commands generated by the GMI
 * (e.g., for rendering dynamic blocks or suggesting client-side actions) will be streamed
 * as part of the `AgentOSResponse`. Set to false to suppress these commands for specific requests.
 * @property {number} [maxToolCallIterations] - Overrides the default maximum number of
 * sequential tool calls an agent can make in a single logical turn. Useful for debugging,
 * controlling resource usage, or preventing unintended agent behavior loops.
 * @property {string} [preferredModelId] - Suggests a specific LLM model ID (e.g., "gpt-4-turbo")
 * to be used for this turn, potentially overriding the persona's default model preferences.
 * This is subject to model availability and user entitlements.
 * @property {string} [preferredProviderId] - Suggests a specific LLM provider ID (e.g., "openai", "anthropic")
 * to be used for this turn, directing the request to a particular backend service.
 * @property {number} [temperature] - Overrides the default temperature setting for the LLM call in this turn.
 * Controls the randomness/creativity of the LLM's output (typically a value between 0.0 and 2.0).
 * Lower values produce more deterministic output, higher values more creative.
 * @property {number} [topP] - Overrides the default top_p (nucleus sampling) setting for the LLM call.
 * Controls the diversity of tokens considered by the LLM (typically a value between 0.0 and 1.0).
 * The model considers only tokens comprising the top `topP` probability mass.
 * @property {number} [maxTokens] - Overrides the default maximum number of tokens the LLM should generate
 * for its response in this turn. Helps manage response length and cost.
 * @property {boolean} [disableAdaptation] - If true, the GMI will not apply any adaptive learning
 * mechanisms (e.g., mood changes, persona adjustments, memory updates based on this interaction)
 * based on user feedback or interaction patterns for this specific turn.
 * @property {boolean} [debugMode] - If true, AgentOS may include more verbose logging,
 * detailed reasoning traces, or other debugging information in the `AgentOSResponse` chunks.
 * This is intended for development and diagnostic purposes and might expose internal details.
 * @property {boolean} [forceNewConversation] - If true, forces the creation of a new conversation
 * context, even if a `conversationId` is provided or an existing context is associated with the `sessionId`.
 * Useful for starting a fresh interaction slate.
 * @property {Record<string, any>} [customFlags] - A flexible object for passing any other custom
 * processing flags or parameters that specific GMIs, personas, or advanced features might recognize.
 * This allows for extensible, application-specific control over GMI behavior.
 */
export interface ProcessingOptions {
  streamUICommands?: boolean;
  maxToolCallIterations?: number;
  preferredModelId?: string;
  preferredProviderId?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  disableAdaptation?: boolean;
  debugMode?: boolean;
  forceNewConversation?: boolean;
  customFlags?: Record<string, any>;
}