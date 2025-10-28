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