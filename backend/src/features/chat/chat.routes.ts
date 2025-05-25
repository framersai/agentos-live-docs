// File: backend/src/features/chat/chat.routes.ts
/**
 * @file Chat API route handlers with conversational history support and dynamic LLM provider selection.
 * @description Handles requests to the /api/chat endpoint, processing chat messages
 * using the configured LLM services with conversation memory and tracking API usage costs.
 * Includes specialized system prompts for different modes, particularly a detailed structure for interview mode.
 * @version 2.3.0 - Refactored interview prompt loading, enhanced logging for model selection.
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
dotenv.config({ path: path.join(__projectRoot, '.env') });

import { callLlm, initializeLlmServices } from '../../core/llm/llm.factory'; // Ensure initializeLlmServices is available
import { LlmProviderId, LlmConfigService } from '../../core/llm/llm.config.service';
import { CostService } from '../../core/cost/cost.service';
import { MODEL_PREFERENCES, getModelPrice, ModelConfig } from '../../../config/models.config';
import { IChatMessage, ILlmUsage, IChatCompletionParams } from '../../core/llm/llm.interfaces';

// Initialize LLM services once when the module is loaded
// This ensures that the factory and its dependent config service are ready.
initializeLlmServices();

interface IConversation {
  messages: IChatMessage[];
  lastActivity: number;
}
const conversationHistories = new Map<string, IConversation>();

const MAX_HISTORY_MESSAGES_CONFIG = parseInt(process.env.MAX_CONVERSATIONAL_HISTORY_MESSAGES || '100', 10);
const DEFAULT_HISTORY_MESSAGES_CONFIG = parseInt(process.env.DEFAULT_MAX_HISTORY_MESSAGES || '10', 10); // User+Assistant pairs
const MAX_PROMPT_TOKENS_CONFIG = parseInt(process.env.DEFAULT_MAX_PROMPT_TOKENS || '8000', 10);
const SESSION_COST_THRESHOLD_USD = parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00');
const DISABLE_COST_LIMITS_CONFIG = process.env.DISABLE_COST_LIMITS === 'true';
const LLM_DEFAULT_TEMPERATURE = parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7');
const LLM_DEFAULT_MAX_TOKENS = parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '2048', 10);

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

function truncateHistoryByTokenEstimate(messages: IChatMessage[], maxTokens: number): IChatMessage[] {
  let estimatedTokens = 0;
  const truncatedMessages: IChatMessage[] = [];
  const systemMessage = messages.find(m => m.role === 'system');

  if (systemMessage) {
    estimatedTokens += Math.ceil(systemMessage.content.length / 3.5); // Rough estimate
    truncatedMessages.push(systemMessage);
  }

  // Iterate from newest to oldest, excluding system message already added
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'system') continue; // Skip system messages here, already handled

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

function calculateLlmCost(modelId: string, usage?: ILlmUsage): number {
  if (!usage || typeof usage.prompt_tokens !== 'number' || typeof usage.completion_tokens !== 'number') {
    console.warn(`ChatRoutes: Cost calculation skipped for model "${modelId}" due to missing or invalid usage data (prompt_tokens: ${usage?.prompt_tokens}, completion_tokens: ${usage?.completion_tokens}).`);
    return 0;
  }
  const modelPriceConfig: ModelConfig | undefined = getModelPrice(modelId);
  if (!modelPriceConfig) {
    console.warn(`ChatRoutes: Cost calculation skipped. Pricing for model "${modelId}" not found.`);
    return 0;
  }
  const promptTokens = usage.prompt_tokens ?? 0;
  const completionTokens = usage.completion_tokens ?? 0;
  const inputCost = (promptTokens / 1000) * modelPriceConfig.inputCostPer1K;
  const outputCost = (completionTokens / 1000) * modelPriceConfig.outputCostPer1K;
  return inputCost + outputCost;
}

interface ChatRequestBody {
  mode: string;
  messages: IChatMessage[];
  language?: string;
  generateDiagram?: boolean;
  userId?: string;
  conversationId?: string;
  maxHistoryMessages?: number; // Number of user/assistant PAIRS
  systemPromptOverride?: string;
  tutorMode?: boolean;
  tutorLevel?: string; // e.g., 'beginner', 'intermediate', 'expert'
  interviewMode?: boolean; // Flag to trigger interview-specific logic
}

export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const {
      mode = 'general', // default mode if not specified
      messages: currentRequestMessages,
      language = process.env.DEFAULT_LANGUAGE || 'python',
      generateDiagram = false,
      userId: userIdFromRequest = 'default_user',
      conversationId = 'default_conversation', // Client should manage and send this
      maxHistoryMessages = DEFAULT_HISTORY_MESSAGES_CONFIG, // Number of user/assistant PAIRS
      systemPromptOverride,
      tutorMode = false, // Default to false, can be enabled by client
      tutorLevel = 'intermediate',
      interviewMode = false, // Default to false, can be enabled by client
    } = req.body as ChatRequestBody;

    const effectiveUserId = (req as any).user?.id || userIdFromRequest; // Get user ID from auth or fallback

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

    // maxHistoryMessages is pairs, so double for individual messages
    const effectiveMaxIndividualHistoryMessages = Math.min(maxHistoryMessages, MAX_HISTORY_MESSAGES_CONFIG) * 2;
    const historyToConsider = conversation.messages.slice(-effectiveMaxIndividualHistoryMessages);

    let modelIdForMode: string;
    let promptTemplateName: string = mode; // Default template name is the mode itself

    if (interviewMode && mode === 'coding') {
      modelIdForMode = process.env.MODEL_PREF_INTERVIEW_TUTOR || MODEL_PREFERENCES.coding || MODEL_PREFERENCES.default;
      promptTemplateName = 'coding_interviewer';
      console.log(`ChatRoutes: Interview Mode active. Model: ${modelIdForMode}, Prompt: ${promptTemplateName}.md`);
    } else if (tutorMode && mode === 'coding') {
      modelIdForMode = process.env.MODEL_PREF_CODING_TUTOR || MODEL_PREFERENCES.coding || MODEL_PREFERENCES.default;
      promptTemplateName = 'coding_tutor';
      console.log(`ChatRoutes: Tutor Mode active. Model: ${modelIdForMode}, Prompt: ${promptTemplateName}.md`);
    } else {
      const modelPrefsKey = (MODEL_PREFERENCES && mode in MODEL_PREFERENCES) ? mode as keyof typeof MODEL_PREFERENCES : 'default';
      modelIdForMode = MODEL_PREFERENCES[modelPrefsKey] || MODEL_PREFERENCES.default;
      // If mode is 'general', but 'general' isn't in MODEL_PREFERENCES, modelPrefsKey becomes 'default'.
      // We want to load 'general_chat.md' specifically for this case.
      if (modelPrefsKey === 'default' && mode === 'general') {
          promptTemplateName = 'general_chat';
      } else {
          promptTemplateName = modelPrefsKey; // e.g., 'coding', 'system_design'
      }
      console.log(`ChatRoutes: Standard Mode. Mode: ${mode} (key: ${modelPrefsKey}), Model: ${modelIdForMode}, Prompt: ${promptTemplateName}.md`);
    }


    let systemPromptContent: string;
    if (systemPromptOverride) {
      systemPromptContent = systemPromptOverride;
    } else {
      let templateContent = loadPromptTemplate(promptTemplateName);
      // Basic replacements
      templateContent = templateContent
        .replace(/{{LANGUAGE}}/g, language)
        .replace(/{{MODE}}/g, mode)
        .replace(/{{GENERATE_DIAGRAM}}/g, generateDiagram ? 'true' : 'false');

      // Tutor-specific replacements
      if (tutorMode && mode === 'coding') {
        templateContent = templateContent.replace(/{{TUTOR_LEVEL}}/g, tutorLevel);
      }
      
      // Generic additional instructions placeholder (can be empty if not needed by the specific prompt)
      const baseAdditionalInstructions = `
## Conversation Context & Real-Time Interaction (IMPORTANT):
You are an integral part of a DYNAMIC, REAL-TIME conversational application, "Voice Chat Assistant".
The user's messages represent an ONGOING dialogue. They may arrive with delays, reflect thinking-aloud processes, or be refinements of previous thoughts.
Your responses MUST be highly adaptable and maintain strong contextual awareness from the provided history.
This is NOT a static Q&A. Assume the conversation can and will pick up where it left off.
Prioritize clarity, accuracy, and helpfulness. Actively use the conversation history to avoid redundancy unless explicitly asked for clarification or repetition.
Your goal is to provide a fluid, natural, and contextually intelligent interaction.
`;
      templateContent = templateContent.replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, baseAdditionalInstructions);
      systemPromptContent = templateContent;
    }

    const systemMessage: IChatMessage = { role: 'system', content: systemPromptContent };
    const messagesForLlm: IChatMessage[] = [systemMessage, ...historyToConsider, ...currentRequestMessages];
    const finalApiMessages = truncateHistoryByTokenEstimate(messagesForLlm, MAX_PROMPT_TOKENS_CONFIG);

    console.log(`ChatRoutes: User [${effectiveUserId}] Conv [${conversationId}] Mode [${mode}] Model [${modelIdForMode}]`);
    console.log(`ChatRoutes: Sending ${finalApiMessages.length} messages to LLM. System prompt length: ${systemMessage.content.length} chars.`);

    const llmParams: IChatCompletionParams = {
      temperature: LLM_DEFAULT_TEMPERATURE,
      max_tokens: LLM_DEFAULT_MAX_TOKENS, // Ensure this is a reasonable value
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
    CostService.trackCost(
        effectiveUserId, 'llm', costOfThisCall, llmResponse.model,
        llmResponse.usage?.prompt_tokens ?? undefined,
        llmResponse.usage?.completion_tokens ?? undefined,
        { conversationId, mode }
    );
    const sessionCostDetail = CostService.getSessionCost(effectiveUserId);

    currentRequestMessages.forEach(msg => conversation!.messages.push(msg));
    if (llmResponse.text) {
      conversation!.messages.push({ role: 'assistant', content: llmResponse.text });
    }
    // Prune history if it gets too long (beyond max configured pairs + buffer)
    if (conversation!.messages.length > (MAX_HISTORY_MESSAGES_CONFIG * 2 + 50) ) {
        const numToSlice = MAX_HISTORY_MESSAGES_CONFIG * 2;
        console.log(`ChatRoutes: Trimming conversation history for ${historyKey} from ${conversation!.messages.length} to ~${numToSlice} messages.`);
        conversation!.messages = conversation!.messages.slice(-numToSlice);
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
    console.error('ChatRoutes: Error in /api/chat POST endpoint:', error.stack || error);
    if (res.headersSent) return;

    let errorMessage = 'Error processing chat request.';
    let statusCode = 500;
    let errorCode = 'CHAT_PROCESSING_ERROR';

    if (error.message?.includes('API key') || error.response?.data?.error?.message?.includes('API key')) {
      errorMessage = 'AI service provider API key is invalid or missing.';
      statusCode = 503; errorCode = 'API_KEY_ERROR';
    } else if (error.message?.includes('rate limit') || error.status === 429 || error.response?.status === 429) {
      errorMessage = 'AI service rate limit exceeded. Please try again later.';
      statusCode = 429; errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        errorMessage = 'Request to AI service timed out. Please try again.';
        statusCode = 408; errorCode = 'REQUEST_TIMEOUT';
    } else if (error.response?.data?.error?.type === 'insufficient_quota' || error.message?.includes('credits') || error.message?.includes('quota')) {
        errorMessage = 'AI service account has insufficient funds or quota exceeded.';
        statusCode = 402; errorCode = 'INSUFFICIENT_FUNDS_OR_QUOTA';
    } else if (error.status) {
        statusCode = error.status; errorMessage = error.message || errorMessage; errorCode = error.code || errorCode;
    } else if (error.response?.status) {
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