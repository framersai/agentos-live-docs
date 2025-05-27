/**
 * @file Chat API route handlers with integrated Context Aggregator, persistent memory, and function calling for agents.
 * @description Handles requests to the /api/chat endpoint. It uses a Context Aggregator LLM,
 * then, based on discernment, either responds directly or passes the bundle to the main
 * agent-specific LLM. Agent LLMs can now use tools/functions.
 * @version 3.1.0 - Added function calling support for main agent LLMs.
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// --- Core LLM & Config Imports ---
import { callLlm, initializeLlmServices } from '../../core/llm/llm.factory';
import { LlmConfigService, AgentLLMDefinition } from '../../core/llm/llm.config.service';
import { IChatMessage, ILlmUsage, IChatCompletionParams, ILlmResponse, ILlmToolCall } from '../../core/llm/llm.interfaces';

// --- Cost & Model Preference Imports ---
import { CostService } from '../../core/cost/cost.service';
import { getModelPrice, MODEL_PRICING } from '../../../config/models.config';

// --- Core Service Imports ---
import { llmContextAggregatorService } from '../../core/context/LLMContextAggregatorService';
import { IContextAggregatorInputSources, IContextBundle } from '../../core/context/IContextAggregatorService';
import { jsonFileKnowledgeBaseService } from '../../core/knowledge/JsonFileKnowledgeBaseService';
import { sqliteMemoryAdapter } from '../../core/memory/SqliteMemoryAdapter';
import { IStoredConversationTurn } from '../../core/memory/IMemoryAdapter';
import { ProcessedConversationMessageBE } from '../../core/conversation/conversation.interfaces';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
dotenv.config({ path: path.join(__projectRoot, '.env') });

// Ensure core services are initialized on module load
(async () => {
  try {
    await initializeLlmServices();
    await jsonFileKnowledgeBaseService.initialize();
    await sqliteMemoryAdapter.initialize();
    console.log('[ChatRoutes] Core services (LLM, KnowledgeBase, MemoryAdapter) initialized successfully.');
  } catch (error) {
    console.error('[ChatRoutes] CRITICAL ERROR during core service initialization:', error);
  }
})();

// --- Constants ---
const DEFAULT_HISTORY_MESSAGES_FOR_FALLBACK_CONTEXT = parseInt(process.env.DEFAULT_HISTORY_MESSAGES_FOR_FALLBACK_CONTEXT || '10', 10);
const SESSION_COST_THRESHOLD_USD = parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00');
const DISABLE_COST_LIMITS_CONFIG = process.env.DISABLE_COST_LIMITS === 'true';
const LLM_DEFAULT_TEMPERATURE = parseFloat(process.env.LLM_DEFAULT_TEMPERATURE || '0.7');
const LLM_DEFAULT_MAX_TOKENS = parseInt(process.env.LLM_DEFAULT_MAX_TOKENS || '2048');
const GLOBAL_USER_ID_FOR_MEMORY = 'default_user';

/**
 * @interface ClientChatMessage
 * @description Represents the structure of a message as potentially sent by the client.
 */
interface ClientChatMessage extends IChatMessage {
  timestamp?: number;
  agentId?: string;
}

/**
 * @function loadPromptTemplate
 * @description Loads an agent's system prompt template.
 */
function loadPromptTemplate(templateName: string): string {
  try {
    const promptPath = path.join(__projectRoot, 'prompts', `${templateName}.md`);
    if (!fs.existsSync(promptPath)) {
      console.warn(`[ChatRoutes] Prompt template not found: ${promptPath}. Using universal fallback for mode "${templateName}".`);
      return `You are a helpful AI assistant operating in "{{MODE}}" mode.
Your primary task is to analyze the provided 'ContextBundle' and generate an appropriate response.
Current preferred programming language (if applicable): {{LANGUAGE}}.
The user is interacting in real-time. Respond clearly and accurately.
Base your response strictly on the information and directives within the provided ContextBundle.
Some agents can call tools/functions. If your persona and the user request align with a tool, call it.
{{ADDITIONAL_INSTRUCTIONS}}`;
    }
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error: any) {
    console.error(`[ChatRoutes] Error loading prompt template "${templateName}":`, error.message);
    return `You are a helpful AI assistant. Error loading specific instructions for mode '{{MODE}}'.
Analyze the provided 'ContextBundle' to understand the user's request and respond.
Current language context: {{LANGUAGE}}.
{{ADDITIONAL_INSTRUCTIONS}}`;
  }
}

/**
 * @function calculateLlmCost
 * @description Calculates LLM call cost.
 */
function calculateLlmCost(modelId: string, usage?: ILlmUsage): number {
  const promptTokens = usage?.prompt_tokens ?? 0;
  const completionTokens = usage?.completion_tokens ?? 0;
  if (promptTokens === 0 && completionTokens === 0) return 0;

  const modelPriceConfig = getModelPrice(modelId);
  if (!modelPriceConfig) {
    const defaultPricing = MODEL_PRICING['default'];
    if (defaultPricing) {
      return (promptTokens / 1000) * defaultPricing.inputCostPer1K +
             (completionTokens / 1000) * defaultPricing.outputCostPer1K;
    }
    console.warn(`[ChatRoutes] Pricing not found for model "${modelId}" and no default pricing. Cost set to $0.`);
    return 0;
  }
  return (promptTokens / 1000) * modelPriceConfig.inputCostPer1K +
         (completionTokens / 1000) * modelPriceConfig.outputCostPer1K;
}

/**
 * @interface ChatRequestBodyBE
 * @description Expected request body structure for /api/chat.
 */
interface ChatRequestBodyBE {
  mode: string;
  messages: ClientChatMessage[];
  processedHistory?: ProcessedConversationMessageBE[];
  language?: string;
  generateDiagram?: boolean;
  userId?: string;
  conversationId?: string;
  systemPromptOverride?: string;
  tutorMode?: boolean;
  tutorLevel?: string;
  interviewMode?: boolean;
  // New field for tool responses from frontend
  tool_response?: {
    tool_call_id: string;
    tool_name: string; // For logging/context
    output: string; // Stringified result of the tool execution
  };
}

/**
 * @route POST /api/chat
 * @description Main chat processing endpoint.
 */
export async function POST(req: Request, res: Response): Promise<void> {
  const requestTimestamp = Date.now();
  let mainAgentLlmCallCost = 0;
  let contextAggregatorLlmCallCost = 0;

  try {
    const {
      mode = 'general',
      messages: currentTurnClientMessages, // Can be user message or tool response message
      processedHistory: historyFromClient,
      language = process.env.DEFAULT_LANGUAGE || 'python',
      generateDiagram = false,
      userId: userIdFromRequest,
      conversationId: reqConversationId,
      systemPromptOverride,
      tutorLevel = 'intermediate',
      interviewMode: reqInterviewMode,
      tutorMode: reqTutorMode,
      tool_response, // New: handle tool response from client
    } = req.body as ChatRequestBodyBE;

    // @ts-ignore
    const authenticatedUserId = req.user?.id;
    const effectiveUserId = userIdFromRequest || authenticatedUserId || GLOBAL_USER_ID_FOR_MEMORY;
    const conversationId = reqConversationId || `conv_${mode}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // --- 0. Cost Check ---
    if (!DISABLE_COST_LIMITS_CONFIG && CostService.isSessionCostThresholdReached(effectiveUserId, SESSION_COST_THRESHOLD_USD)) {
      const currentCostDetail = CostService.getSessionCost(effectiveUserId);
      res.status(403).json({
        message: `Session cost threshold of $${SESSION_COST_THRESHOLD_USD.toFixed(2)} reached.`,
        error: 'COST_THRESHOLD_EXCEEDED', currentCost: currentCostDetail.totalCost, threshold: SESSION_COST_THRESHOLD_USD,
      });
      return;
    }
    
    // --- 1. Store Current Message(s) from Client ---
    // This could be a user's text message OR a tool_response message.
    if (currentTurnClientMessages && Array.isArray(currentTurnClientMessages) && currentTurnClientMessages.length > 0) {
        for (const clientMsg of currentTurnClientMessages) {
            await sqliteMemoryAdapter.storeConversationTurn(effectiveUserId, conversationId, {
                role: clientMsg.role as 'user' | 'tool', // Expecting 'user' or 'tool' role from client's current turn messages
                content: clientMsg.content,
                timestamp: clientMsg.timestamp || requestTimestamp,
                agentId: mode, // The agent context this message belongs to
                tool_call_id: clientMsg.tool_call_id, // This will be present if role is 'tool'
            });
        }
    } else if (!tool_response && (!currentTurnClientMessages || currentTurnClientMessages.length === 0)) {
      // If not a tool_response, then messages array is required.
      res.status(400).json({ message: '`messages` array is required and cannot be empty if not a tool response.', error: 'INVALID_REQUEST_PAYLOAD'});
      return;
    }


    // --- 2. Prepare Inputs for Context Aggregator (if not a tool response continuation) ---
    // The Context Aggregator is typically run for a new user query, not when just returning a tool's result.
    let contextBundle: IContextBundle;
    const latestUserQueryObject = currentTurnClientMessages?.find(m => m.role === 'user');
    const currentUserQuery = latestUserQueryObject?.content || (tool_response ? `Result for tool: ${tool_response.tool_name}` : "Processing continuation.");


    // If it's a tool_response, we usually skip context aggregation and go straight to the main agent LLM
    // with the tool's output. The history should include the original assistant call and the tool response.
    if (!tool_response) {
        console.log(`[ChatRoutes] User [${effectiveUserId}] Conv [${conversationId}] Mode [${mode}] - Preparing for Context Aggregation.`);
        let historyForAggregator: Array<{ role: string; content: string | null; timestamp?: number; relevanceScore?: number }>;

        if (historyFromClient && historyFromClient.length > 0) {
            console.log(`[ChatRoutes] Using pre-processed history from client (${historyFromClient.length} messages).`);
            historyForAggregator = historyFromClient.map(m => ({ 
            role: m.role, 
            content: m.content ?? '', // Ensure content is always a string
            timestamp: m.timestamp, 
            relevanceScore: m.relevanceScore 
            }));
        } else {
            console.log(`[ChatRoutes] No pre-processed history from client. Fetching recent raw history from memory adapter.`);
            const rawHistoricalTurns: IStoredConversationTurn[] = await sqliteMemoryAdapter.retrieveConversationTurns(
            effectiveUserId, 
            conversationId, 
            { limit: DEFAULT_HISTORY_MESSAGES_FOR_FALLBACK_CONTEXT } // Limit includes user + assistant turns
            );
            historyForAggregator = rawHistoricalTurns.map(turn => ({
            role: turn.role,
            content: (turn.summary || turn.content) ?? '', // Ensure content is always a string
            timestamp: turn.timestamp,
            }));
        }
        
        const knowledgeSnippets = await jsonFileKnowledgeBaseService.searchKnowledgeBase(currentUserQuery, 3)
            .then(items => items.map(it => ({ 
            id: it.id, 
            type: it.type, 
            content: it.content.substring(0, 300) + (it.content.length > 300 ? "..." : ""),
            tags: it.tags,
            relevance: 1.0 
            })));

        const aggregatorInputSources: IContextAggregatorInputSources = {
            currentUserFocus: {
            query: currentUserQuery,
            intent: mode, // Initial intent can be refined by aggregator
            mode: mode,
            metadata: { language, generateDiagramPreference: generateDiagram, tutorLevel, reqInterviewMode, reqTutorMode },
            },
            conversationHistory: historyForAggregator.map(h => ({ ...h, content: h.content ?? '' })),
            userProfile: {
            preferences: { defaultLanguage: language, currentAgentMode: mode, tutorLevel },
            // customInstructions: "User prefers concise answers." // Example, load from user settings
            },
            systemState: {
            currentTaskContext: `User is interacting with the '${mode}' AI agent.`,
            responseConstraints: contextBundleOutputFormatHints(mode),
            sharedKnowledgeSnippets: knowledgeSnippets,
            },
        };

        try {
            contextBundle = await llmContextAggregatorService.generateContextBundle(aggregatorInputSources);
            const aggregatorModelId = process.env.AGGREGATOR_LLM_MODEL_ID || 'openai/gpt-4o-mini';
            contextAggregatorLlmCallCost = 0.00015; // Placeholder for actual cost calculation
            CostService.trackCost(
            effectiveUserId, 'llm_aggregator', contextAggregatorLlmCallCost, aggregatorModelId,
            500, 'tokens', 150, 'tokens', 
            { conversationId, mode, querySnippet: currentUserQuery.substring(0,50) }
            );
            console.log(`[ChatRoutes] Context Bundle generated. Discernment: ${contextBundle.discernmentOutcome}`);
        } catch (aggregatorError: any) {
            console.error("[ChatRoutes] Context Aggregator Service failed:", aggregatorError.message, aggregatorError.stack);
            res.status(503).json({ 
            message: 'Error processing your request context. The AI assistant may be temporarily unavailable. Please try again.', 
            error: 'CONTEXT_AGGREGATION_FAILURE', details: aggregatorError.message
            });
            return;
        }

        if (contextBundle.discernmentOutcome === 'IGNORE') {
            console.log('[ChatRoutes] Input determined as IGNORE. No agent LLM call.');
            res.status(200).json({
            content: null, model: 'context_aggregator_filter', discernment: 'IGNORE',
            message: "Input determined as irrelevant or noise.", conversationId,
            });
            return;
        }

        if (contextBundle.discernmentOutcome === 'ACTION_ONLY') {
            console.log('[ChatRoutes] Input determined as ACTION_ONLY.');
            const actionAckContent = `Okay, I'll handle that: "${contextBundle.primaryTask.description}"`;
            await sqliteMemoryAdapter.storeConversationTurn(effectiveUserId, conversationId, {
            role: 'assistant', content: actionAckContent, timestamp: Date.now(), agentId: mode, model: 'system_action'
            });
            res.status(200).json({
            content: actionAckContent, model: 'system_action', discernment: 'ACTION_ONLY', conversationId,
            });
            return;
        }
    } else { // This IS a tool_response turn
        // Create a minimal contextBundle or bypass it for tool responses.
        // For now, let's assume the main agent needs the tool response in its history.
        // The history for the main LLM call will include the tool_response message already stored.
        contextBundle = { // Create a direct-pass context bundle
            version: "1.1.0",
            aggregatedTimestamp: new Date().toISOString(),
            primaryTask: {
                description: `Process tool response for ${tool_response.tool_name}.`,
                derivedIntent: "process_tool_result",
                keyEntities: [tool_response.tool_name],
                requiredOutputFormat: ""
            },
            relevantHistorySummary: [], // History will be fetched fresh below
            pertinentUserProfileSnippets: { preferences: {}, customInstructionsSnippet: ""},
            keyInformationFromDocuments: [],
            criticalSystemContext: { notesForDownstreamLLM: "Continuing after tool execution." },
            confidenceFactors: { clarityOfUserQuery: "High", sufficiencyOfContext: "High" }, // Assuming tool call was clear
            discernmentOutcome: "RESPOND" // Always respond after a tool call
        };
        console.log(`[ChatRoutes] Processing tool response for tool: ${tool_response.tool_name}`);
    }


    // --- 3. Prepare and Call Main Agent LLM (for RESPOND or CLARIFY, or after tool_response) ---
    const llmConfigService = LlmConfigService.getInstance();
    const agentDefinition: AgentLLMDefinition = llmConfigService.getAgentDefinitionFromMode(mode, reqInterviewMode, reqTutorMode);
    
    let systemPromptForAgentLLM: string;
    if (systemPromptOverride) {
        systemPromptForAgentLLM = systemPromptOverride;
    } else {
        let templateContent = loadPromptTemplate(agentDefinition.promptTemplateKey);
        const bundleUsageInstructions = `
## IMPORTANT GUIDANCE - HOW TO USE THE CONTEXT BUNDLE:
You have been provided with a "ContextBundle" JSON object that summarizes all relevant information for the current user request.
Your response MUST be derived from this bundle. Key sections are:
- \`primaryTask\`: The user's direct goal, refined intent, key entities, and any implied output format. This is your main objective.
- \`relevantHistorySummary\`: Pertinent past exchanges (Note: full history including tool calls will be provided separately).
- \`pertinentUserProfileSnippets\`: User preferences/custom instructions.
- \`keyInformationFromDocuments\` & \`keyInformationFromSharedKnowledge\`: Crucial facts from external/shared knowledge.
- \`criticalSystemContext.notesForDownstreamLLM\`: Pay close attention for specific instructions.
- \`discernmentOutcome\`: If "CLARIFY", your goal is to ask targeted questions to resolve ambiguity.
If tools are available to you (${agentDefinition.callableTools?.map(t=>t.function.name).join(', ') || 'none currently defined'}), and the user's request aligns with a tool's purpose, call the appropriate tool.
Adhere to any 'requiredOutputFormat' in 'primaryTask'. Respond directly to 'primaryTask.description'. Do NOT hallucinate.`;
        systemPromptForAgentLLM = templateContent
        .replace(/{{LANGUAGE}}/g, contextBundle.pertinentUserProfileSnippets?.preferences?.defaultLanguage || language)
        .replace(/{{MODE}}/g, mode)
        .replace(/{{GENERATE_DIAGRAM}}/g, (contextBundle.primaryTask.requiredOutputFormat?.includes('diagram') || generateDiagram).toString())
        .replace(/{{TUTOR_LEVEL}}/g, (contextBundle.pertinentUserProfileSnippets?.preferences as any)?.expertiseLevel || tutorLevel)
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, bundleUsageInstructions.trim());
    }

    // Fetch full conversation history for the main agent, including prior tool calls and responses
    const fullHistoryForAgent: IStoredConversationTurn[] = await sqliteMemoryAdapter.retrieveConversationTurns(
        effectiveUserId, conversationId, { limit: 50 } // Retrieve a good amount of history
    );

    // Map IStoredConversationTurn to IChatMessage for the LLM
    const messagesForAgentLlm: IChatMessage[] = [
        { role: 'system', content: systemPromptForAgentLLM },
        ...fullHistoryForAgent.map(turn => {
            const msg: IChatMessage = { role: turn.role, content: turn.content };
            if (turn.tool_calls && turn.tool_calls.length > 0) {
                msg.tool_calls = turn.tool_calls as ILlmToolCall[]; // Assuming parsing from JSON is done by adapter
            }
            if (turn.role === 'tool' && turn.tool_call_id) {
                msg.tool_call_id = turn.tool_call_id;
                msg.name = turn.metadata?.tool_name; // If tool_name was stored in metadata
            }
            return msg;
        }),
    ];

    // If the current turn was a user message (not a tool response), add the ContextBundle message.
    // If it IS a tool_response turn, the tool_response message is already in fullHistoryForAgent.
    if (!tool_response) {
      messagesForAgentLlm.push({ 
        role: 'user', 
        content: `Context Bundle for my request:\n\`\`\`json\n${JSON.stringify(contextBundle, null, 2)}\n\`\`\`\nPlease proceed based on this context and our prior conversation.` 
      });
    }
    
    console.log(`[ChatRoutes] Calling Main Agent LLM (${agentDefinition.modelId}) for mode '${mode}'. Discernment: ${contextBundle.discernmentOutcome}. Tools available: ${agentDefinition.callableTools?.length || 0}`);

    const agentLlmParams: IChatCompletionParams = {
        temperature: LLM_DEFAULT_TEMPERATURE, 
        max_tokens: LLM_DEFAULT_MAX_TOKENS, 
        user: effectiveUserId,
        tools: agentDefinition.callableTools, // Pass agent-specific tools
        tool_choice: agentDefinition.callableTools && agentDefinition.callableTools.length > 0 ? 'auto' : undefined, // Let LLM decide if tools are present
    };

    const agentLlmResponse: ILlmResponse = await callLlm(
        messagesForAgentLlm, agentDefinition.modelId, agentLlmParams,
        agentDefinition.providerId, effectiveUserId
    );
    mainAgentLlmCallCost = calculateLlmCost(agentLlmResponse.model, agentLlmResponse.usage);

    CostService.trackCost(
        effectiveUserId, 'llm_agent', mainAgentLlmCallCost, agentLlmResponse.model,
        agentLlmResponse.usage?.prompt_tokens ?? 0, 'tokens',
        agentLlmResponse.usage?.completion_tokens ?? 0, 'tokens',
        { conversationId, mode, agentPromptTemplate: agentDefinition.promptTemplateKey, discernment: contextBundle.discernmentOutcome, toolCallsCount: agentLlmResponse.toolCalls?.length || 0 }
    );
    const sessionCostDetail = CostService.getSessionCost(effectiveUserId);

    // --- 4. Handle Agent LLM Response (Text or Tool Call) ---
    if (agentLlmResponse.toolCalls && agentLlmResponse.toolCalls.length > 0) {
        // LLM wants to call one or more tools
        console.log(`[ChatRoutes] Agent LLM responded with ${agentLlmResponse.toolCalls.length} tool call(s).`);
        // Store assistant's message that contains the tool_calls
        await sqliteMemoryAdapter.storeConversationTurn(effectiveUserId, conversationId, {
            role: 'assistant',
            content: agentLlmResponse.text, // Might be null or introductory text
            timestamp: Date.now(),
            agentId: mode,
            model: agentLlmResponse.model,
            usage: agentLlmResponse.usage ? { ...agentLlmResponse.usage } : undefined,
            tool_calls: agentLlmResponse.toolCalls, // Store the tool_calls object
            metadata: { discernment: contextBundle.discernmentOutcome }
        });

        // Send tool call information to frontend
        // For simplicity, handling one tool call at a time from the backend's perspective.
        // A more robust system might handle multiple parallel tool calls.
        const firstToolCall = agentLlmResponse.toolCalls[0];
        res.status(200).json({
            type: 'function_call_data', // New MainContentType for frontend
            toolName: firstToolCall.function.name,
            toolArguments: JSON.parse(firstToolCall.function.arguments), // Parse arguments for frontend
            toolCallId: firstToolCall.id,
            // Standard fields
            model: agentLlmResponse.model,
            usage: agentLlmResponse.usage,
            sessionCost: sessionCostDetail,
            costOfThisCall: mainAgentLlmCallCost + contextAggregatorLlmCallCost,
            conversationId,
            discernment: 'TOOL_CALL_PENDING', // Special discernment state
            assistantMessageText: agentLlmResponse.text, // Send any preliminary text from assistant
        });

    } else {
        // LLM responded with text
        const assistantResponseContent = agentLlmResponse.text || 
            (contextBundle.discernmentOutcome === 'CLARIFY' ? "I need a bit more information. Could you clarify your request?" : "Sorry, I couldn't formulate a response.");
        
        await sqliteMemoryAdapter.storeConversationTurn(effectiveUserId, conversationId, {
            role: 'assistant', content: assistantResponseContent, timestamp: Date.now(), agentId: mode,
            model: agentLlmResponse.model,
            usage: agentLlmResponse.usage ? { ...agentLlmResponse.usage } : undefined,
            metadata: { discernment: contextBundle.discernmentOutcome }
        });

        res.status(200).json({
            content: assistantResponseContent, model: agentLlmResponse.model, usage: agentLlmResponse.usage,
            sessionCost: sessionCostDetail, costOfThisCall: mainAgentLlmCallCost + contextAggregatorLlmCallCost,
            conversationId, discernment: contextBundle.discernmentOutcome,
        });
    }

  } catch (error: any) {
    console.error('[ChatRoutes] Error in /api/chat POST endpoint:', error.message, error.stack ? `\nStack: ${error.stack}` : '');
    if (res.headersSent) return;

    let errorMessage = 'An unexpected error occurred processing your chat request.';
    let statusCode = 500;
    let errorCode = 'INTERNAL_CHAT_ERROR';

    if (error.message?.includes('API key')) {
        errorMessage = 'AI service API key issue.'; statusCode = 503; errorCode = 'API_KEY_ERROR';
    } else if (error.status === 429 || error.response?.status === 429) {
        errorMessage = 'AI service rate limit exceeded.'; statusCode = 429; errorCode = 'RATE_LIMIT_EXCEEDED';
    } else if (error.message?.includes('CONTEXT_AGGREGATION_FAILURE')) {
        errorMessage = 'Failed to process request context.'; statusCode = 503; errorCode = 'CONTEXT_AGGREGATION_FAILURE';
    } else if (error.response?.status) {
        statusCode = error.response.status;
        errorMessage = error.response.data?.error?.message || error.response.data?.message || error.message;
        errorCode = error.response.data?.error?.code || 'PROVIDER_API_ERROR';
    } else if (error.status) {
        statusCode = error.status;
        errorMessage = error.message;
        errorCode = error.code || 'INTERNAL_ERROR_WITH_STATUS';
    }
    
    res.status(statusCode).json({
        message: errorMessage, error: errorCode,
        details: process.env.NODE_ENV === 'development' && error.message ? { originalError: error.message, stack: error.stack } : undefined,
    });
  }
}

/**
 * Provides hints for the 'requiredOutputFormat' field in the ContextBundle.
 */
function contextBundleOutputFormatHints(mode: string): string {
    switch (mode.toLowerCase()) {
        case 'coding': case 'codingassistant':
            return 'Markdown with code blocks (specify language), explanations. Optional: Mermaid for algorithms/data_structures.';
        case 'systemdesigner': case 'system_design':
            return 'Detailed Markdown explanations with embedded Mermaid for architecture. Use headings.';
        case 'tutor':
            return 'Structured Markdown (headings or ---SLIDE_BREAK---), examples. Optional: Mermaid for concepts. Guiding questions for chat. Can call createQuizItem or createFlashcard tools.';
        case 'diary':
            return 'Empathetic chat leading to structured Markdown diary entry (## Title, Date, Tags, Content).';
        case 'meeting': case 'businessmeeting':
            return 'Structured Markdown meeting summary (Overview, Key Points, Decisions, Action Items table).';
        case 'codinginterviewer':
            return 'Problem statements & feedback in structured Markdown (headings or ---SLIDE_BREAK---). Conversational Q&A. Can call generateCodingProblem or evaluateSolution tools.';
        default:
            return 'Clear, concise, well-formatted Markdown. Use lists/bullets if appropriate.';
    }
}