// File: backend/src/features/chat/chat.routes.ts
/**
 * @file Chat API route handlers with conversational history support and dynamic LLM provider selection.
 * @description Handles requests to the /api/chat endpoint, processing chat messages
 * using the configured LLM services with conversation memory and tracking API usage costs.
 * Includes specialized system prompts for different modes.
 * @version 2.4.0 - Added support for tutor, diary, and business meeting modes with specific prompts.
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
dotenv.config({ path: path.join(__projectRoot, '.env') });

import { callLlm, initializeLlmServices } from '../../core/llm/llm.factory';
import { LlmProviderId } from '../../core/llm/llm.config.service';
import { CostService } from '../../core/cost/cost.service';
import { MODEL_PREFERENCES, getModelPrice, ModelConfig, MODEL_PRICING } from '../../../config/models.config'; // Adjusted path
import { IChatMessage, ILlmUsage, IChatCompletionParams } from '../../core/llm/llm.interfaces';

initializeLlmServices();

interface IConversation {
  messages: IChatMessage[];
  lastActivity: number;
}
const conversationHistories = new Map<string, IConversation>();

const MAX_HISTORY_MESSAGES_CONFIG = parseInt(process.env.MAX_CONVERSATIONAL_HISTORY_MESSAGES || '100', 10);
const DEFAULT_HISTORY_MESSAGES_CONFIG = parseInt(process.env.DEFAULT_MAX_HISTORY_MESSAGES || '10', 10);
const MAX_PROMPT_TOKENS_CONFIG = parseInt(process.env.DEFAULT_MAX_PROMPT_TOKENS || '8000', 10);
const SESSION_COST_THRESHOLD_USD = parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00');
const DISABLE_COST_LIMITS_CONFIG = process.env.DISABLE_COST_LIMITS === 'true';
const LLM_DEFAULT_TEMPERATURE = parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7');
const LLM_DEFAULT_MAX_TOKENS = parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '2048', 10);

/**
 * Loads a prompt template from the /prompts directory.
 * @param {string} templateName - The name of the template file (without .md extension).
 * @returns {string} The content of the prompt template.
 */
function loadPromptTemplate(templateName: string): string {
  try {
    const promptPath = path.join(__projectRoot, 'prompts', `${templateName}.md`);
    if (!fs.existsSync(promptPath)) {
      console.warn(`ChatRoutes: Prompt template not found: ${promptPath}. Using default fallback for mode "${templateName}".`);
      return `You are a helpful AI assistant operating in "{{MODE}}" mode.
Current preferred programming language for code examples is {{LANGUAGE}}.
The user is interacting with you in real-time. Messages may be part of an ongoing conversation, potentially with delays.
Adjust your responses and decision-making accordingly, maintaining context from the provided history.
Strive for clarity and accuracy.
{{ADDITIONAL_INSTRUCTIONS}}`;
    }
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error(`ChatRoutes: Error loading prompt template "${templateName}":`, error);
    return `You are a helpful AI assistant. Error loading specific instructions for mode '{{MODE}}'.
Current language: {{LANGUAGE}}. Please respond generally.
The user is interacting with you in real-time. Messages may be part of an ongoing conversation, potentially with delays.
Adjust your responses and decision-making accordingly, maintaining context from the provided history.
{{ADDITIONAL_INSTRUCTIONS}}`;
  }
}

/**
 * Truncates chat history by an estimated token count to fit within a maximum.
 * @param {IChatMessage[]} messages - The full list of messages, including system prompt.
 * @param {number} maxTokens - The maximum estimated tokens allowed for the history.
 * @returns {IChatMessage[]} The potentially truncated list of messages.
 */
function truncateHistoryByTokenEstimate(messages: IChatMessage[], maxTokens: number): IChatMessage[] {
  let estimatedTokens = 0;
  const truncatedMessages: IChatMessage[] = [];
  const systemMessage = messages.find(m => m.role === 'system');

  if (systemMessage) {
    // Rough estimate: average 4 chars per token, but let's be generous for shorter system prompts.
    // For LLMs, it's closer to 1 token per ~4 chars for English.
    estimatedTokens += Math.ceil(systemMessage.content.length / 3.5); 
    truncatedMessages.push(systemMessage);
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'system') continue;

    const msgTokens = Math.ceil(msg.content.length / 3.5);
    if (estimatedTokens + msgTokens <= maxTokens) {
      truncatedMessages.splice(systemMessage ? 1 : 0, 0, msg); // Insert after system or at beginning
      estimatedTokens += msgTokens;
    } else {
      console.warn(`ChatRoutes: History truncated. Estimated tokens ${estimatedTokens + msgTokens} exceeded max ${maxTokens}. Last message considered: "${msg.content.substring(0,50)}..."`);
      break;
    }
  }
  return truncatedMessages;
}

/**
 * Calculates the cost of an LLM call based on usage and model pricing.
 * @param {string} modelId - The ID of the model used.
 * @param {ILlmUsage | undefined} usage - Token usage data (prompt_tokens, completion_tokens).
 * @returns {number} The calculated cost in USD.
 */
function calculateLlmCost(modelId: string, usage?: ILlmUsage): number {
  if (!usage || typeof usage.prompt_tokens !== 'number' || typeof usage.completion_tokens !== 'number') {
    console.warn(`ChatRoutes: Cost calculation skipped for model "${modelId}" due to missing/invalid usage data.`);
    return 0;
  }
  const modelPriceConfig: ModelConfig | undefined = getModelPrice(modelId);
  if (!modelPriceConfig) {
    console.warn(`ChatRoutes: Cost calculation skipped. Pricing for model "${modelId}" not found.`);
    return MODEL_PRICING['default'] ? (usage.prompt_tokens / 1000 * MODEL_PRICING['default'].inputCostPer1K) + (usage.completion_tokens / 1000 * MODEL_PRICING['default'].outputCostPer1K) : 0;
  }
  const promptTokens = usage.prompt_tokens ?? 0;
  const completionTokens = usage.completion_tokens ?? 0;
  const inputCost = (promptTokens / 1000) * modelPriceConfig.inputCostPer1K;
  const outputCost = (completionTokens / 1000) * modelPriceConfig.outputCostPer1K;
  return inputCost + outputCost;
}

/**
 * @interface ChatRequestBody
 * @description Defines the structure of the request body for the chat endpoint.
 */
interface ChatRequestBody {
  /** The operational mode or agent type (e.g., "coding", "diary", "tutor"). */
  mode: string;
  /** Array of current messages in the conversation. */
  messages: IChatMessage[];
  /** Preferred programming language for code examples (if applicable). */
  language?: string;
  /** Hint for diagram generation (if applicable). */
  generateDiagram?: boolean;
  /** User identifier, typically injected by auth middleware. */
  userId?: string;
  /** Unique identifier for the conversation session. */
  conversationId?: string;
  /** Max number of user/assistant message PAIRS to retain in history. */
  maxHistoryMessages?: number;
  /** Optional override for the system prompt. */
  systemPromptOverride?: string;
  /** Specific flag for tutor mode, if 'mode' is generic like 'custom_agent'. */
  tutorMode?: boolean; 
  /** Specific level for tutor, e.g., 'beginner', 'intermediate'. */
  tutorLevel?: string;
  /** Specific flag for interview mode. */
  interviewMode?: boolean; 
}

/**
 * Handles POST requests to the /api/chat endpoint.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const {
      mode = 'general',
      messages: currentRequestMessages,
      language = process.env.DEFAULT_LANGUAGE || 'python',
      generateDiagram = false,
      userId: userIdFromRequest = 'default_user_chat', // Fallback if auth is not used or fails
      conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, // Generate a new one if not provided
      maxHistoryMessages = DEFAULT_HISTORY_MESSAGES_CONFIG,
      systemPromptOverride,
      tutorLevel = 'intermediate', // Default tutor level
    } = req.body as ChatRequestBody;

    // @ts-ignore - req.user is custom property set by auth middleware
    const effectiveUserId = req.user?.id || userIdFromRequest;

    if (!currentRequestMessages || !Array.isArray(currentRequestMessages) || currentRequestMessages.length === 0) {
      res.status(400).json({ message: 'Messages array is required and cannot be empty.', error: 'INVALID_MESSAGES_PAYLOAD'});
      return;
    }

    if (!DISABLE_COST_LIMITS_CONFIG && CostService.isSessionCostThresholdReached(effectiveUserId, SESSION_COST_THRESHOLD_USD)) {
      const currentCostDetail = CostService.getSessionCost(effectiveUserId);
      res.status(403).json({
        message: `Session cost threshold of $${SESSION_COST_THRESHOLD_USD.toFixed(2)} reached. Further requests are blocked.`,
        error: 'COST_THRESHOLD_EXCEEDED',
        currentCost: currentCostDetail.totalCost,
        threshold: SESSION_COST_THRESHOLD_USD,
      });
      return;
    }

    const historyKey = `${effectiveUserId}:${conversationId}`;
    let conversation = conversationHistories.get(historyKey);
    if (!conversation) {
      conversation = { messages: [], lastActivity: Date.now() };
      conversationHistories.set(historyKey, conversation);
    } else {
      conversation.lastActivity = Date.now();
    }

    const effectiveMaxIndividualHistoryMessages = Math.min(maxHistoryMessages, MAX_HISTORY_MESSAGES_CONFIG) * 2;
    const historyToConsider = conversation.messages.slice(-effectiveMaxIndividualHistoryMessages);

    let modelIdForMode: string;
    let promptTemplateName: string = mode; // Default template name matches mode

    // Determine model and prompt template based on mode
    // Ensure MODEL_PREFERENCES in models.config.ts has entries like 'diary', 'tutor', etc.
    const modeKey = mode.toLowerCase() as keyof typeof MODEL_PREFERENCES;
    if (MODEL_PREFERENCES[modeKey]) {
        modelIdForMode = MODEL_PREFERENCES[modeKey];
        // Standardize prompt names, e.g. coding_tutor.md, coding_interviewer.md from .env
        if (mode === 'coding_tutor' || mode === 'coding_interviewer') {
             promptTemplateName = mode; // Use directly if named specifically
        } else {
            promptTemplateName = modeKey; // e.g. 'diary' loads 'diary.md'
        }
    } else if (mode === 'coding' && req.body.interviewMode) { // Special handling for interview sub-mode
        modelIdForMode = MODEL_PREFERENCES.interview_tutor || MODEL_PREFERENCES.coding;
        promptTemplateName = 'coding_interviewer';
    } else if (mode === 'coding' && req.body.tutorMode) { // Special handling for tutor sub-mode within coding
        modelIdForMode = MODEL_PREFERENCES.coding_tutor || MODEL_PREFERENCES.coding;
        promptTemplateName = 'coding_tutor';
    } else { // Fallback for general or unspecified modes
        modelIdForMode = MODEL_PREFERENCES.general || MODEL_PREFERENCES.default;
        promptTemplateName = (mode === 'general' || mode === 'general_chat') ? 'general_chat' : mode;
    }
    console.log(`ChatRoutes: Mode: "${mode}", Effective Prompt Template: "${promptTemplateName}.md", Model: "${modelIdForMode}"`);


    let systemPromptContent: string;
    if (systemPromptOverride) {
      systemPromptContent = systemPromptOverride;
    } else {
      let templateContent = loadPromptTemplate(promptTemplateName);
      templateContent = templateContent
        .replace(/{{LANGUAGE}}/g, language)
        .replace(/{{MODE}}/g, mode) // Actual mode passed in request
        .replace(/{{GENERATE_DIAGRAM}}/g, generateDiagram ? 'true' : 'false')
        .replace(/{{TUTOR_LEVEL}}/g, tutorLevel); // For tutor prompt

      const baseAdditionalInstructions = `
## Conversation Context & Real-Time Interaction (IMPORTANT):
You are an integral part of a DYNAMIC, REAL-TIME conversational application, "Voice Chat Assistant".
The user's messages represent an ONGOING dialogue. They may arrive with delays, reflect thinking-aloud processes, or be refinements of previous thoughts.
Your responses MUST be highly adaptable and maintain strong contextual awareness from the provided history.
This is NOT a static Q&A. Assume the conversation can and will pick up where it left off.
Prioritize clarity, accuracy, and helpfulness. Actively use the conversation history to avoid redundancy unless explicitly asked for clarification or repetition.
Your goal is to provide a fluid, natural, and contextually intelligent interaction.
`;
      systemPromptContent = templateContent.replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, baseAdditionalInstructions);
    }

    const systemMessage: IChatMessage = { role: 'system', content: systemPromptContent };
    const messagesForLlm: IChatMessage[] = [systemMessage, ...historyToConsider, ...currentRequestMessages];
    const finalApiMessages = truncateHistoryByTokenEstimate(messagesForLlm, MAX_PROMPT_TOKENS_CONFIG);

    console.log(`ChatRoutes: User [${effectiveUserId}] Conv [${conversationId}] Mode [${mode}] Model [${modelIdForMode}]`);
    console.log(`ChatRoutes: Sending ${finalApiMessages.length} messages to LLM. System prompt length: ${systemMessage.content.length} chars.`);

    const llmParams: IChatCompletionParams = {
      temperature: LLM_DEFAULT_TEMPERATURE,
      max_tokens: LLM_DEFAULT_MAX_TOKENS,
      user: effectiveUserId, // Pass user ID for tracking/moderation if supported by LLM provider
    };

    const llmResponse = await callLlm(
      finalApiMessages,
      modelIdForMode,
      llmParams,
      process.env.ROUTING_LLM_PROVIDER_ID as LlmProviderId | undefined, // Explicit provider from .env
      effectiveUserId // For cost tracking association
    );
    const costOfThisCall = calculateLlmCost(llmResponse.model, llmResponse.usage);
    CostService.trackCost(
      effectiveUserId, 
      'llm', 
      costOfThisCall, 
      llmResponse.model,
      llmResponse.usage?.prompt_tokens ?? undefined, // Convert null to undefined
      llmResponse.usage?.completion_tokens ?? undefined, // Convert null to undefined
      { conversationId, mode }
    );
    const sessionCostDetail = CostService.getSessionCost(effectiveUserId);

    currentRequestMessages.forEach(msg => conversation!.messages.push(msg));
    if (llmResponse.text) {
      conversation!.messages.push({ role: 'assistant', content: llmResponse.text });
    }
    if (conversation!.messages.length > (MAX_HISTORY_MESSAGES_CONFIG * 2 + 50) ) { // Prune history
        const numToSlice = MAX_HISTORY_MESSAGES_CONFIG * 2;
        conversation!.messages = conversation!.messages.slice(-numToSlice);
    }
    conversationHistories.set(historyKey, conversation!);

    res.status(200).json({
      content: llmResponse.text,
      model: llmResponse.model,
      usage: llmResponse.usage,
      sessionCost: sessionCostDetail, // Total session cost
      costOfThisCall: costOfThisCall,
      conversationId,
      historySize: conversation?.messages.length,
    });

  } catch (error: any) {
    console.error('ChatRoutes: Error in /api/chat POST endpoint:', error.stack || error);
    if (res.headersSent) return;

    let errorMessage = 'Error processing chat request.';
    let statusCode = 500;
    let errorCode = 'CHAT_PROCESSING_ERROR';

    // Simplified error checking, specific checks can be more granular
    if (error.message?.includes('API key') || error.response?.data?.error?.message?.includes('API key')) {
      errorMessage = 'AI service provider API key is invalid or missing.'; statusCode = 503; errorCode = 'API_KEY_ERROR';
    } else if (error.message?.includes('rate limit') || error.status === 429 || error.response?.status === 429) {
      errorMessage = 'AI service rate limit exceeded. Please try again later.'; statusCode = 429; errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message?.includes('insufficient_quota') || error.message?.includes('credits')) {
      errorMessage = 'AI service account has insufficient funds or quota exceeded.'; statusCode = 402; errorCode = 'INSUFFICIENT_FUNDS_OR_QUOTA';
    } else if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      errorMessage = 'Request to AI service timed out. Please try again.'; statusCode = 408; errorCode = 'REQUEST_TIMEOUT';
    } else if (error.status) { // If error object has a status property
        statusCode = error.status; errorMessage = error.message || errorMessage; errorCode = error.code || errorCode;
    } else if (error.response?.status) { // Axios-like error
        statusCode = error.response.status;
        errorMessage = error.response.data?.message || error.response.data?.error?.message || errorMessage;
        errorCode = error.response.data?.error?.code || error.response.data?.error_type || errorCode;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' && error.message ? { originalError: error.message, stack: error.stack } : undefined,
    });
  }
}