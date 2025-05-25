/**
 * @file Chat API route handlers with conversational history support and dynamic LLM provider selection.
 * @description Handles requests to the /api/chat endpoint, processing chat messages
 * using the configured LLM services with conversation memory and tracking API usage costs.
 * Includes specialized system prompts for different modes, particularly a detailed structure for interview mode.
 * @version 2.2.1 // You might consider bumping this to 2.2.2 after fixes
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure .env is loaded relative to the project root for backend specific settings
const __filename = fileURLToPath(import.meta.url); // backend/src/features/chat/chat.routes.ts
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..'); // up to project root
dotenv.config({ path: path.join(__projectRoot, '.env') });

import { callLlm } from '../../core/llm/llm.factory';
import { LlmProviderId } from '../../core/llm/llm.config.service';
import { CostService } from '../../core/cost/cost.service';
import { MODEL_PREFERENCES, getModelPrice, ModelConfig } from '../../../config/models.config';
// Corrected import for IChatCompletionParams
import { IChatMessage, ILlmUsage, IChatCompletionParams } from '../../core/llm/llm.interfaces';

/**
 * In-memory store for conversation histories.
 * For production, consider a more persistent and scalable solution like Redis or a database.
 * @interface IConversation
 */
interface IConversation {
  /** Array of messages in the conversation. */
  messages: IChatMessage[];
  /** Timestamp of the last activity in this conversation. */
  lastActivity: number;
}
const conversationHistories = new Map<string, IConversation>();

// Configuration constants from environment variables with defaults
const MAX_HISTORY_MESSAGES_CONFIG = parseInt(process.env.MAX_CONVERSATIONAL_HISTORY_MESSAGES || '100', 10);
const DEFAULT_HISTORY_MESSAGES_CONFIG = parseInt(process.env.DEFAULT_MAX_HISTORY_MESSAGES || '10', 10); // This is interpreted as PAIRS
const MAX_PROMPT_TOKENS_CONFIG = parseInt(process.env.DEFAULT_MAX_PROMPT_TOKENS || '8000', 10);
const SESSION_COST_THRESHOLD_USD = parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00');
const DISABLE_COST_LIMITS_CONFIG = process.env.DISABLE_COST_LIMITS === 'true';
const LLM_DEFAULT_TEMPERATURE = parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7');
const LLM_DEFAULT_MAX_TOKENS = parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '2048', 10);


/**
 * Loads a prompt template by its name from the /prompts directory at the project root.
 *
 * @param {string} templateName - The name of the prompt template (e.g., 'coding', 'system_design') without the .md extension.
 * @returns {string} The content of the prompt template. Returns a fallback if the template is not found.
 */
function loadPromptTemplate(templateName: string): string {
  try {
    const promptPath = path.join(__projectRoot, 'prompts', `${templateName}.md`);
    if (!fs.existsSync(promptPath)) {
      console.warn(`ChatRoutes: Prompt template not found: ${promptPath}. Using default fallback for mode "${templateName}".`);
      // Generic fallback prompt structure
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
 * Truncates conversation history to stay within estimated token limits.
 * Prioritizes keeping the system message (if any) and the most recent user/assistant messages.
 *
 * @param {IChatMessage[]} messages - The full list of messages including system and history.
 * @param {number} maxTokens - The maximum number of estimated tokens allowed for the prompt payload.
 * @returns {IChatMessage[]} The truncated list of messages.
 */
function truncateHistoryByTokenEstimate(messages: IChatMessage[], maxTokens: number): IChatMessage[] {
  let estimatedTokens = 0;
  const truncatedMessages: IChatMessage[] = [];
  const systemMessage = messages.find(m => m.role === 'system');

  if (systemMessage) {
    estimatedTokens += Math.ceil(systemMessage.content.length / 3.5); // Simple estimation
    truncatedMessages.push(systemMessage);
  }

  // Iterate from newest to oldest, skipping system message if already added
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'system') continue; // Already handled

    const msgTokens = Math.ceil(msg.content.length / 3.5);
    if (estimatedTokens + msgTokens <= maxTokens) {
      truncatedMessages.splice(systemMessage ? 1 : 0, 0, msg); // Insert after system message or at the beginning
      estimatedTokens += msgTokens;
    } else {
      console.warn(`ChatRoutes: History truncated. Estimated tokens ${estimatedTokens + msgTokens} exceeded max ${maxTokens}. Last message considered: "${msg.content.substring(0,50)}..."`);
      break; // Stop adding messages if limit exceeded
    }
  }
  return truncatedMessages;
}


/**
 * Calculates the cost of an LLM interaction based on token usage and model pricing.
 *
 * @param {string} modelId - The ID of the LLM model used.
 * @param {ILlmUsage | undefined} usage - Token usage statistics from the LLM response.
 * @returns {number} The calculated cost in USD. Returns 0 if data is unavailable.
 */
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
  // Ensure prompt_tokens and completion_tokens are not null before calculation
  const promptTokens = usage.prompt_tokens ?? 0;
  const completionTokens = usage.completion_tokens ?? 0;

  const inputCost = (promptTokens / 1000) * modelPriceConfig.inputCostPer1K;
  const outputCost = (completionTokens / 1000) * modelPriceConfig.outputCostPer1K;
  return inputCost + outputCost;
}

/**
 * @typedef ChatRequestBody
 * @description Expected structure of the request body for the POST /api/chat endpoint.
 */
interface ChatRequestBody {
  mode: string;
  messages: IChatMessage[];
  language?: string;
  generateDiagram?: boolean;
  userId?: string;
  conversationId?: string;
  maxHistoryMessages?: number; // Number of PAIRS of user/assistant messages
  systemPromptOverride?: string;
  tutorMode?: boolean;
  tutorLevel?: string;
  interviewMode?: boolean;
}

/**
 * Handles POST requests to /api/chat for processing chat messages.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const {
      mode = 'general',
      messages: currentRequestMessages,
      language = process.env.DEFAULT_LANGUAGE || 'python',
      generateDiagram = false,
      userId: userIdFromRequest = 'default_user',
      conversationId = 'default_conversation',
      maxHistoryMessages = DEFAULT_HISTORY_MESSAGES_CONFIG,
      systemPromptOverride,
      tutorMode = process.env.FEATURE_FLAG_ENABLE_CODING_TUTOR_MODE === 'true',
      tutorLevel = 'intermediate',
      interviewMode = process.env.FEATURE_FLAG_ENABLE_INTERVIEW_MODE === 'true',
    } = req.body as ChatRequestBody;

    const effectiveUserId = (req as any).user?.id || userIdFromRequest;

    if (!currentRequestMessages || !Array.isArray(currentRequestMessages) || currentRequestMessages.length === 0) {
      res.status(400).json({
        message: 'Messages array is required and cannot be empty.',
        error: 'INVALID_MESSAGES_PAYLOAD',
      });
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

    const effectiveMaxHistoryPairs = Math.min(maxHistoryMessages, MAX_HISTORY_MESSAGES_CONFIG);
    const effectiveMaxIndividualHistoryMessages = effectiveMaxHistoryPairs * 2;
    const historyToConsider = conversation.messages.slice(-effectiveMaxIndividualHistoryMessages);

    let modelIdForMode: string;
    const modelPrefsKey = (mode in MODEL_PREFERENCES) ? mode as keyof typeof MODEL_PREFERENCES : 'default';

    // Updated model selection logic
    if (interviewMode && mode === 'coding') {
      modelIdForMode = process.env.MODEL_PREF_INTERVIEW_TUTOR || MODEL_PREFERENCES.coding || MODEL_PREFERENCES.default;
      console.log(`ChatRoutes: Interview Mode selected. Model: ${modelIdForMode} (Env: ${process.env.MODEL_PREF_INTERVIEW_TUTOR}, Pref.Coding: ${MODEL_PREFERENCES.coding})`);
    } else if (tutorMode && mode === 'coding') {
      modelIdForMode = process.env.MODEL_PREF_CODING_TUTOR || process.env.MODEL_PREF_INTERVIEW_TUTOR || MODEL_PREFERENCES.coding || MODEL_PREFERENCES.default;
      console.log(`ChatRoutes: Tutor Mode selected. Model: ${modelIdForMode} (Env CodingTutor: ${process.env.MODEL_PREF_CODING_TUTOR}, Env InterviewTutor: ${process.env.MODEL_PREF_INTERVIEW_TUTOR}, Pref.Coding: ${MODEL_PREFERENCES.coding})`);
    } else if (mode in MODEL_PREFERENCES) {
        // Type assertion is safe due to the check `mode in MODEL_PREFERENCES`
      modelIdForMode = MODEL_PREFERENCES[mode as keyof typeof MODEL_PREFERENCES];
    } else {
      console.warn(`ChatRoutes: Mode "${mode}" not found in MODEL_PREFERENCES. Using default model: ${MODEL_PREFERENCES.default}`);
      modelIdForMode = MODEL_PREFERENCES.default;
    }

    let systemPromptContent: string;
    if (systemPromptOverride) {
      systemPromptContent = systemPromptOverride;
    } else {
      const templateName = modelPrefsKey === 'default' ? 'general_chat' : modelPrefsKey;
      let templateContent = loadPromptTemplate(templateName);
      templateContent = templateContent
        .replace(/{{LANGUAGE}}/g, language)
        .replace(/{{MODE}}/g, mode)
        .replace(/{{GENERATE_DIAGRAM}}/g, generateDiagram ? 'true' : 'false');

      let additionalInstructions = `
## Conversation Context & Real-Time Interaction (IMPORTANT):
You are an integral part of a DYNAMIC, REAL-TIME conversational application.
The user's messages represent an ONGOING dialogue. They may arrive with delays, reflect thinking-aloud processes, or be refinements of previous thoughts.
Your responses MUST be highly adaptable and maintain strong contextual awareness from the provided history.
This is NOT a static Q&A. Assume the conversation can and will pick up where it left off.
Prioritize clarity, accuracy, and helpfulness. Actively use the conversation history to avoid redundancy unless explicitly asked for clarification or repetition.
Your goal is to provide a fluid, natural, and contextually intelligent interaction.
`;

      if (interviewMode && mode === 'coding') {
        additionalInstructions += `

## FAANG Senior Level Coding Interview Mode (ES4-ES5 Target Level) - STRICT RESPONSE STRUCTURE:
You are an expert interviewer conducting a FAANG-style coding interview for a Senior Software Engineer (L4/L5) role.
The candidate has approximately 20-25 minutes per problem.
Your response MUST be structured meticulously into distinct sections using ONLY the specified H2 Markdown headers below.
Do NOT use H3 or other headers for these primary sections. Be precise with the section titles.

## Section 1: Initial Concepts & Data Structures
**(Frontend Target Display: ~5-10 seconds). Goal: Quick, foundational grasp for someone needing initial guidance.**
- VERY CONCISELY introduce the core concept(s) or data structure(s) for an *initial, simplified understanding*.
- Use simple analogies if appropriate for rapid comprehension.
- Briefly mention relevant data structures (e.g., arrays, hash maps, trees, graphs) at a high level.
- *Crucial: This section must be extremely brief and introductory.*
- Frame explanations to gently guide someone who may not have deep prior knowledge of the specific optimal technique.

## Section 2: Optimal Solution - Detailed Explanation
**(Frontend Target Display: ~30-45 seconds). Goal: In-depth theoretical understanding.**
- Thoroughly explain the OPTIMAL algorithm step-by-step. Describe the logic, choices made, and key trade-offs.
- This is the most detailed *theoretical* portion, establishing the "why" before the "how" (code).
- Briefly discuss why this approach is superior to obvious naive solutions without deep diving into them here.

## Section 3: Final Code & In-Depth Analysis
**(Frontend Target Display: Remainder of time). Goal: Practical implementation and comprehensive analysis.**
- **A. Optimal Solution Code:** Provide the complete, runnable, and well-commented code for the optimal solution in \`\`\`${language}
// Your well-structured and commented code here
\`\`\`
- **B. Code Explanation:** Detail how the code implements the optimal algorithm from Section 2. Explain key segments or tricky parts.
- **C. Complexity Analysis:**
    - **Time Complexity:** State the Big O time complexity (e.g., O(N log N)) AND provide a clear, concise justification for this.
    - **Space Complexity:** State the Big O space complexity (e.g., O(N)) AND provide a clear, concise justification.
- **D. Alternative Approaches & Considerations (Visually distinct on frontend - use this exact divider):**
    \`---alt_solutions_divider---\`
    *(This content below the divider will be styled differently, e.g., smaller font, by the frontend)*
    - Briefly describe 1-2 alternative approaches (e.g., brute-force, less optimal but valid trade-offs).
    - For each alternative: Concisely state its Time and Space Complexity. Briefly explain its core idea and why it's different or less optimal than the main solution.
    - *DO NOT provide full code for these alternatives unless it's trivial (1-3 lines) or specifically requested in a follow-up.*
    - Optionally, briefly mention edge cases or follow-up considerations if highly relevant and not covered.

Remember, the frontend will parse these "## Section X:" headers to structure the display.
Your language should initially be accessible, then ramp up in depth for the optimal solution.
`;
      } else if (tutorMode) {
        additionalInstructions += `
## Interactive Coding Tutor Mode (Level: ${tutorLevel}):
Adapt your explanations to the student's level: ${tutorLevel}.
- **Beginner:** Use simple analogies, avoid jargon, break concepts into tiny steps, provide many examples, check understanding frequently.
- **Intermediate:** Balance technical accuracy with clarity, provide context and connections, include practice problems, gradually introduce complexity.
- **Expert:** Dive deep into technical details, discuss edge cases and optimizations, connect to advanced topics, challenge with complex scenarios.
Always aim to:
1. Provide interactive elements or thought exercises if possible.
2. Create mini-quizzes or questions to test understanding.
3. Suggest practice problems or next steps for learning.
4. Offer encouragement and constructive feedback.
Present information in digestible chunks.
`;
      }
      templateContent = templateContent.replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, additionalInstructions);
      systemPromptContent = templateContent;
    }

    const systemMessage: IChatMessage = { role: 'system', content: systemPromptContent };
    const messagesForLlm: IChatMessage[] = [systemMessage, ...historyToConsider, ...currentRequestMessages];
    const finalApiMessages = truncateHistoryByTokenEstimate(messagesForLlm, MAX_PROMPT_TOKENS_CONFIG);

    console.log(`ChatRoutes: User [${effectiveUserId}] Conv [${conversationId}] Mode [${mode}] Model [${modelIdForMode}]`);
    console.log(`ChatRoutes: Sending ${finalApiMessages.length} messages to LLM. System prompt length: ${systemMessage.content.length} chars.`);

    const llmParams: IChatCompletionParams = { // Type IChatCompletionParams is now imported
      temperature: LLM_DEFAULT_TEMPERATURE,
      max_tokens: LLM_DEFAULT_MAX_TOKENS,
      user: effectiveUserId, // Pass effectiveUserId to LLM for tracking/moderation
    };

    const llmResponse = await callLlm(
        finalApiMessages,
        modelIdForMode,
        llmParams,
        process.env.ROUTING_LLM_PROVIDER_ID as LlmProviderId | undefined,
        effectiveUserId // Pass user ID for potential internal LLM factory usage (e.g., logging, specific routing)
    );
    const costOfThisCall = calculateLlmCost(llmResponse.model, llmResponse.usage);

    CostService.trackCost(
      effectiveUserId, 'llm', costOfThisCall, llmResponse.model,
      // Correctly handle potential null from usage by converting to undefined
      llmResponse.usage?.prompt_tokens ?? undefined,
      llmResponse.usage?.completion_tokens ?? undefined,
      { conversationId, mode }
    );
    const sessionCostDetail = CostService.getSessionCost(effectiveUserId);

    // Add current user message and assistant response to history
    currentRequestMessages.forEach(msg => conversation!.messages.push(msg));
    if (llmResponse.text) {
      conversation!.messages.push({ role: 'assistant', content: llmResponse.text });
    }
    // Simple history cap, consider more sophisticated summarization/trimming for long conversations
    if (conversation!.messages.length > MAX_HISTORY_MESSAGES_CONFIG * 2 + 50) { // Allow some buffer over strict limit
        const numToSlice = MAX_HISTORY_MESSAGES_CONFIG * 2; // Keep the configured number of PAIRS
        console.log(`ChatRoutes: Trimming conversation history for ${historyKey} from ${conversation!.messages.length} to ~${numToSlice} messages.`);
        conversation!.messages = conversation!.messages.slice(-numToSlice);
        // Placeholder: Here you might trigger a summarization process for the trimmed part
    }
    conversationHistories.set(historyKey, conversation!); // Update the map

    res.status(200).json({
      content: llmResponse.text,
      model: llmResponse.model,
      usage: llmResponse.usage,
      sessionCost: sessionCostDetail,
      costOfThisCall: costOfThisCall,
      conversationId,
      historySize: conversation?.messages.length, // Current size after adding new messages
    });

  } catch (error: any) {
    console.error('ChatRoutes: Error in /api/chat POST endpoint:', error.stack || error);
    if (res.headersSent) return;

    let errorMessage = 'Error processing chat request.';
    let statusCode = 500;
    let errorCode = 'CHAT_PROCESSING_ERROR';

    if (error.message?.includes('API key') || error.response?.data?.error?.message?.includes('API key')) {
      errorMessage = 'AI service provider API key is invalid or missing.';
      statusCode = 503; // Service Unavailable (misconfigured external service)
      errorCode = 'API_KEY_ERROR';
    } else if (error.message?.includes('rate limit') || error.status === 429 || error.response?.status === 429) {
      errorMessage = 'AI service rate limit exceeded. Please try again later.';
      statusCode = 429;
      errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        errorMessage = 'Request to AI service timed out. Please try again.';
        statusCode = 408; // Request Timeout
        errorCode = 'REQUEST_TIMEOUT';
    } else if (error.response?.data?.error?.type === 'insufficient_quota' || error.message?.includes('credits')) {
        errorMessage = 'AI service account has insufficient funds or quota exceeded.';
        statusCode = 402; // Payment Required
        errorCode = 'INSUFFICIENT_FUNDS_OR_QUOTA';
    } else if (error.status) { // For errors from 'http-errors' or similar libraries
        statusCode = error.status;
        errorMessage = error.message || errorMessage;
        errorCode = error.code || errorCode;
    } else if (error.response?.status) { // For errors from Axios or other HTTP clients
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