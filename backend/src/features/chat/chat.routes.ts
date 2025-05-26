/**
 * @file Chat API route handlers with conversational history support and dynamic LLM provider selection.
 * @description Handles requests to the /api/chat endpoint, processing chat messages
 * using the configured LLM services with conversation memory and tracking API usage costs.
 * Includes specialized system prompts for different modes.
 * @version 2.4.1 - Corrected CostService.trackCost parameters. Enhanced mode and prompt logging.
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
import { MODEL_PREFERENCES, getModelPrice, ModelConfig, MODEL_PRICING } from '../../../config/models.config';
import { IChatMessage, ILlmUsage, IChatCompletionParams } from '../../core/llm/llm.interfaces';

initializeLlmServices(); // Ensures LLM services are ready

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
      // Fallback template structure
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
    estimatedTokens += Math.ceil(systemMessage.content.length / 3.5); // Approx tokens
    truncatedMessages.push(systemMessage);
  }

  // Iterate from newest non-system messages to oldest
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'system') continue; // Already handled

    const msgTokens = Math.ceil(msg.content.length / 3.5); // Approx tokens
    if (estimatedTokens + msgTokens <= maxTokens) {
      truncatedMessages.splice(systemMessage ? 1 : 0, 0, msg); // Insert after system or at beginning
      estimatedTokens += msgTokens;
    } else {
      console.warn(`ChatRoutes: History truncated. Estimated tokens ${estimatedTokens + msgTokens} (current + new) exceeded max ${maxTokens}. Last message considered for truncation: "${msg.content.substring(0,50)}..."`);
      break; // Stop adding older messages
    }
  }
  if (messages.length > truncatedMessages.length) {
    console.log(`ChatRoutes: History was truncated from ${messages.length - (systemMessage ? 1 : 0)} user/assistant messages to ${truncatedMessages.length - (systemMessage ? 1 : 0)} user/assistant messages due to token limits.`);
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
    console.warn(`ChatRoutes: Cost calculation skipped for model "${modelId}" due to missing/invalid usage data. Provided usage: ${JSON.stringify(usage)}`);
    return 0;
  }
  const modelPriceConfig: ModelConfig | undefined = getModelPrice(modelId);
  if (!modelPriceConfig) {
    console.warn(`ChatRoutes: Cost calculation using default rates. Pricing for model "${modelId}" not found in models.config.ts.`);
    // Fallback to default pricing if specific model pricing is missing
    const defaultPricing = MODEL_PRICING['default'];
    if (defaultPricing) {
        const inputCost = (usage.prompt_tokens / 1000) * defaultPricing.inputCostPer1K;
        const outputCost = (usage.completion_tokens / 1000) * defaultPricing.outputCostPer1K;
        return inputCost + outputCost;
    }
    return 0; // No pricing found at all
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
  mode: string;
  messages: IChatMessage[];
  language?: string;
  generateDiagram?: boolean;
  userId?: string;
  conversationId?: string;
  maxHistoryMessages?: number; // Max number of *pairs* of user/assistant messages
  systemPromptOverride?: string;
  tutorMode?: boolean; // Specific flag if mode is generic but tutor behavior is desired
  tutorLevel?: string;
  interviewMode?: boolean; // Specific flag for interview sub-mode
}

export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const {
      mode = 'general', // Default mode
      messages: currentRequestMessages,
      language = process.env.DEFAULT_LANGUAGE || 'python',
      generateDiagram = false,
      userId: userIdFromRequest, // Will be overridden by authenticated user if present
      conversationId: reqConversationId, // Conversation ID from request
      maxHistoryMessages = DEFAULT_HISTORY_MESSAGES_CONFIG,
      systemPromptOverride,
      tutorLevel = 'intermediate',
      interviewMode: reqInterviewMode, // Explicit from request
      tutorMode: reqTutorMode, // Explicit from request
    } = req.body as ChatRequestBody;

    // @ts-ignore - req.user is a custom property potentially set by auth middleware
    const effectiveUserId = req.user?.id || userIdFromRequest || 'default_user_chat';
    const conversationId = reqConversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;


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
      console.log(`ChatRoutes: New conversation started for key: ${historyKey}`);
    } else {
      conversation.lastActivity = Date.now();
    }

    // maxHistoryMessages refers to pairs, so multiply by 2 for individual messages,
    // then ensure it doesn't exceed the absolute max config.
    const effectiveMaxIndividualHistoryMessages = Math.min(maxHistoryMessages * 2, MAX_HISTORY_MESSAGES_CONFIG * 2) ;
    const historyToConsider = conversation.messages.slice(-effectiveMaxIndividualHistoryMessages);

    let modelIdForMode: string;
    let promptTemplateName: string = mode.toLowerCase(); // Default template name matches mode (e.g., 'diary' -> 'diary.md')

    const modeKey = mode.toLowerCase() as keyof typeof MODEL_PREFERENCES;

    // Enhanced mode and model selection logic
    if (mode === 'coding' && reqInterviewMode) {
        modelIdForMode = MODEL_PREFERENCES.interview_tutor || MODEL_PREFERENCES.coding_tutor || MODEL_PREFERENCES.coding;
        promptTemplateName = 'coding_interviewer'; // e.g., prompts/coding_interviewer.md
    } else if ((mode === 'coding' && reqTutorMode) || mode === 'coding_tutor') {
        modelIdForMode = MODEL_PREFERENCES.coding_tutor || MODEL_PREFERENCES.coding;
        promptTemplateName = 'coding_tutor'; // e.g., prompts/coding_tutor.md
    } else if (MODEL_PREFERENCES[modeKey]) {
        modelIdForMode = MODEL_PREFERENCES[modeKey];
        // For modes like 'diary', 'tutor', 'business_meeting', template name is same as modeKey
        promptTemplateName = modeKey;
    } else {
        console.warn(`ChatRoutes: Mode key "${modeKey}" not found in MODEL_PREFERENCES. Using general/default model.`);
        modelIdForMode = MODEL_PREFERENCES.general || MODEL_PREFERENCES.default;
        promptTemplateName = (mode === 'general' || mode === 'general_chat' || !mode) ? 'general_chat' : modeKey; // Fallback prompt name
    }
    console.log(`ChatRoutes: User [${effectiveUserId}] Conv [${conversationId}] Mode [${mode}] -> Effective Prompt Template: "${promptTemplateName}.md", Model ID: "${modelIdForMode}"`);

    let systemPromptContent: string;
    if (systemPromptOverride) {
      systemPromptContent = systemPromptOverride;
      console.log(`ChatRoutes: Using system prompt override (length: ${systemPromptContent.length} chars).`);
    } else {
      let templateContent = loadPromptTemplate(promptTemplateName);
      templateContent = templateContent
        .replace(/{{LANGUAGE}}/g, language)
        .replace(/{{MODE}}/g, mode)
        .replace(/{{GENERATE_DIAGRAM}}/g, generateDiagram ? 'true' : 'false')
        .replace(/{{TUTOR_LEVEL}}/g, tutorLevel);

      const baseAdditionalInstructions = `
## Conversation Context & Real-Time Interaction (IMPORTANT):
You are an integral part of a DYNAMIC, REAL-TIME conversational application, "Voice Chat Assistant".
The user's messages represent an ONGOING dialogue. They may arrive with delays, reflect thinking-aloud processes, or be refinements of previous thoughts.
Your responses MUST be highly adaptable and maintain strong contextual awareness from the provided history.
This is NOT a static Q&A. Assume the conversation can and will pick up where it left off.
Prioritize clarity, accuracy, and helpfulness. Actively use the conversation history to avoid redundancy unless explicitly asked for clarification or repetition.
Your goal is to provide a fluid, natural, and contextually intelligent interaction.
`;
      systemPromptContent = templateContent.replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, baseAdditionalInstructions.trim());
    }

    const systemMessage: IChatMessage = { role: 'system', content: systemPromptContent };
    const messagesForLlmPrep: IChatMessage[] = [systemMessage, ...historyToConsider, ...currentRequestMessages];
    const finalApiMessages = truncateHistoryByTokenEstimate(messagesForLlmPrep, MAX_PROMPT_TOKENS_CONFIG);

    console.log(`ChatRoutes: Sending ${finalApiMessages.length} messages (out of ${messagesForLlmPrep.length} prepared) to LLM. System prompt length: ${systemMessage.content.length} chars.`);

    const llmParams: IChatCompletionParams = {
      temperature: LLM_DEFAULT_TEMPERATURE,
      max_tokens: LLM_DEFAULT_MAX_TOKENS,
      user: effectiveUserId,
    };

    const llmResponse = await callLlm(
      finalApiMessages,
      modelIdForMode,
      llmParams,
      process.env.ROUTING_LLM_PROVIDER_ID as LlmProviderId | undefined,
      effectiveUserId
    );
    const costOfThisCall = calculateLlmCost(llmResponse.model, llmResponse.usage);

    // Corrected CostService.trackCost call
    CostService.trackCost(
      effectiveUserId,
      'llm',
      costOfThisCall,
      llmResponse.model, // itemDescription
      llmResponse.usage?.prompt_tokens ?? 0, // inputUnits (number)
      'tokens', // inputUnitType (string)
      llmResponse.usage?.completion_tokens ?? 0, // outputUnits (number) - This was line 284 in original error
      'tokens', // outputUnitType (string)
      { conversationId, mode, language } // metadata
    );
    const sessionCostDetail = CostService.getSessionCost(effectiveUserId);

    // Append current turn (user message + assistant response) to permanent history
    currentRequestMessages.forEach(msg => conversation!.messages.push(msg));
    if (llmResponse.text) {
      conversation!.messages.push({ role: 'assistant', content: llmResponse.text });
    }
    // Prune overall conversation history if it grows too large (beyond active window consideration)
    // This check ensures the stored history doesn't grow indefinitely, separate from what's sent to LLM.
    if (conversation!.messages.length > (MAX_HISTORY_MESSAGES_CONFIG * 2 + 50) ) {
        const numToSlice = MAX_HISTORY_MESSAGES_CONFIG * 2; // Keep a bit more than default active window
        conversation!.messages = conversation!.messages.slice(-numToSlice);
        console.log(`ChatRoutes: Conversation history for key ${historyKey} pruned to last ${numToSlice} messages.`);
    }
    conversationHistories.set(historyKey, conversation!);

    res.status(200).json({
      content: llmResponse.text,
      model: llmResponse.model,
      usage: llmResponse.usage,
      sessionCost: sessionCostDetail,
      costOfThisCall: costOfThisCall,
      conversationId,
      historySize: conversation?.messages.length,
    });

  } catch (error: any) {
    console.error('ChatRoutes: Error in /api/chat POST endpoint:', error.message, error.stack ? `\nStack: ${error.stack}` : '');
    if (res.headersSent) return;

    let errorMessage = 'Error processing chat request.';
    let statusCode = 500;
    let errorCode = 'CHAT_PROCESSING_ERROR';

    if (error.message?.includes('API key') || error.response?.data?.error?.message?.includes('API key')) {
      errorMessage = 'AI service provider API key is invalid or missing.'; statusCode = 503; errorCode = 'API_KEY_ERROR';
    } else if (error.message?.includes('rate limit') || error.status === 429 || error.response?.status === 429) {
      errorMessage = 'AI service rate limit exceeded. Please try again later.'; statusCode = 429; errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message?.includes('insufficient_quota') || error.message?.includes('credits') || error.message?.includes('billing')) {
      errorMessage = 'AI service account has insufficient funds, quota exceeded, or billing issue.'; statusCode = 402; errorCode = 'INSUFFICIENT_FUNDS_OR_QUOTA';
    } else if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      errorMessage = 'Request to AI service timed out. Please try again.'; statusCode = 408; errorCode = 'REQUEST_TIMEOUT';
    } else if (error.message?.includes('model_not_found') || error.message?.includes('Model not found')) {
        errorMessage = `The requested AI model was not found: ${error.message}`; statusCode = 404; errorCode = 'MODEL_NOT_FOUND';
    } else if (error.status) {
        statusCode = error.status; errorMessage = error.message || errorMessage; errorCode = error.code || errorCode;
    } else if (error.response?.status) {
        statusCode = error.response.status;
        errorMessage = error.response.data?.message || error.response.data?.error?.message || errorMessage;
        errorCode = error.response.data?.error?.code || error.response.data?.error_type || 'PROVIDER_API_ERROR';
    }
    
    res.status(statusCode).json({
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' && error.message ? { originalError: error.message } : undefined,
    });
  }
}