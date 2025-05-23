/**
 * @fileoverview Implements the IPromptEngine interface, providing an advanced system
 * for constructing dynamic, context-aware, and token-budgeted prompts for Large
 * Language Models (LLMs).
 *
 * This PromptEngine is responsible for:
 * - Assembling various prompt components (system messages, conversation history,
 * user input, RAG context, tool schemas, few-shot examples).
 * - Dynamically selecting and incorporating contextual prompt elements from the
 * active persona definition based on the current PromptExecutionContext (e.g.,
 * GMI mood, user skill level, task hint).
 * - Applying truncation and summarization strategies (leveraging IUtilityAI) to
 * ensure the final prompt fits within the target model's token limits.
 * - Formatting the assembled components into the specific structure expected by the
 * target LLM (e.g., OpenAI chat format, Anthropic messages format).
 * - Providing detailed results, including the formatted prompt, token counts,
 * modification details, and any warnings or errors encountered.
 *
 * It uses an ITokenizer for accurate token counting when available, falling back to
 * estimations otherwise. It can also register and use custom prompt templates.
 * @module backend/agentos/core/llm/PromptEngine
 */

import {
  IPromptEngine,
  PromptComponents,
  PromptEngineResult,
  FormattedPrompt,
  ModelTargetInfo,
  PromptEngineConfig,
  ITokenizer,
  PromptExecutionContext,
} from './IPromptEngine';
import {
  IPersonaDefinition,
  ContextualPromptElement,
  ContextualPromptElementCriteria,
} from '../../cognitive_substrate/personas/IPersonaDefinition';
import { ConversationMessage, MessageRole } from '../conversation/ConversationMessage';
import { ToolDefinition } from '../agents/tools/Tool'; // Assuming path based on prior context
import { IUtilityAI, SummarizationOptions } from '../ai_utilities/IUtilityAI';
import { IWorkingMemory } from '../../cognitive_substrate/memory/IWorkingMemory';

/**
 * Default number of tokens to reserve for the LLM's output if not specified
 * in `ModelTargetInfo`.
 * @constant {number}
 */
const DEFAULT_RESERVED_OUTPUT_TOKENS = 512;

/**
 * Default system prompt content if none is provided or dynamically selected.
 * @constant {string}
 */
const DEFAULT_SYSTEM_PROMPT_CONTENT = "You are a helpful and concise AI assistant.";

/**
 * Fallback average number of characters per token, used if no tokenizer is available.
 * This is a rough estimate and can vary significantly between models.
 * @constant {number}
 */
const FALLBACK_AVG_CHARS_PER_TOKEN = 4;

/**
 * Minimum number of tokens a text segment should have before attempting summarization.
 * Prevents trying to summarize very short texts where it's not beneficial.
 * @constant {number}
 */
const MIN_TOKENS_FOR_SUMMARIZATION = 100; // Based on estimated tokens if no tokenizer

/**
 * Minimum number of messages in history before summarization strategies like
 * SUMMARIZE_OLDEST or SUMMARIZE_MIDDLE are typically applied.
 * @constant {number}
 */
const MIN_MESSAGES_FOR_HISTORY_SUMMARIZATION = 5;

/**
 * Represents a message internally within the PromptEngine during processing.
 * It augments standard message types with token counts and source information.
 * @interface IntermediateMessage
 */
interface IntermediateMessage extends Partial<ConversationMessage> {
  // Role must be one of these specific literal types for many models.
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null; // Ensure content can be null (e.g. for tool_calls only messages)
  name?: string; // For tool role or multi-speaker distinction
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  priority?: number; // Higher numbers can mean higher priority for retention or ordering
  source?: string;   // e.g., 'system_static', 'system_dynamic_mood', 'history_original', 'history_summary', 'context_rag', 'few_shot_example_input'
  tokenCount: number; // Calculated token count
  isSummary?: boolean;
  originalMessageCount?: number; // If it's a summary, how many original messages it represents
  id?: string; // Optional unique ID for the source component
}

/**
 * Defines the signature for a prompt template function.
 * Template functions are responsible for taking processed messages and other components
 * and formatting them into the final `FormattedPrompt` structure expected by a specific model or API.
 * @typedef PromptTemplateFunction
 */
type PromptTemplateFunction = (
  processedContent: {
    messages: IntermediateMessage[];
    toolSchemas?: ToolDefinition[]; // Raw definitions for the template to format
    // Potentially other components if a template needs them raw
  },
  modelInfo: ModelTargetInfo,
  executionContext: PromptExecutionContext
) => FormattedPrompt;


/**
 * Custom error class for issues specific to PromptEngine operations.
 * @class PromptEngineError
 * @extends {Error}
 */
export class PromptEngineError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'PromptEngineError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, PromptEngineError.prototype);
  }
}

/**
 * Implements the IPromptEngine interface.
 * @class PromptEngine
 * @implements {IPromptEngine}
 */
export class PromptEngine implements IPromptEngine {
  private config!: Required<PromptEngineConfig>;
  private tokenizer?: ITokenizer;
  private utilityAI?: IUtilityAI;
  private templates: Record<string, PromptTemplateFunction> = {};
  private isInitialized: boolean = false;

  /**
   * {@inheritDoc IPromptEngine.initialize}
   */
  public async initialize(
    config: PromptEngineConfig,
    tokenizer?: ITokenizer,
    utilityAI?: IUtilityAI
  ): Promise<void> {
    if (!config) {
      throw new PromptEngineError('PromptEngine configuration must be provided.', 'INIT_NO_CONFIG');
    }

    this.config = {
      defaultHistoryTruncationStrategy: config.defaultHistoryTruncationStrategy || 'FIFO',
      defaultHistoryMaxMessages: config.defaultHistoryMaxMessages === undefined ? 20 : config.defaultHistoryMaxMessages,
      defaultHistoryMaxTokens: config.defaultHistoryMaxTokens === undefined ? 2000 : config.defaultHistoryMaxTokens,
      historySummarizationOptions: config.historySummarizationOptions || { desiredLength: 'short', style: 'key_points' } as SummarizationOptions,
      defaultContextTruncationStrategy: config.defaultContextTruncationStrategy || 'TRUNCATE_CONTENT',
      defaultContextMaxTokens: config.defaultContextMaxTokens === undefined ? 1500 : config.defaultContextMaxTokens,
      contextSummarizationOptions: config.contextSummarizationOptions || { desiredLength: 'short', style: 'extractive' } as SummarizationOptions,
      templateStorePath: config.templateStorePath || '', // Actual loading from path not implemented in this example
      defaultTemplateName: config.defaultTemplateName || 'default_chat_format',
      useTokenizerIfAvailable: config.useTokenizerIfAvailable !== false, // default true
      utilityAIServiceId: config.utilityAIServiceId, // Stored but direct injection is preferred
    };

    if (this.config.useTokenizerIfAvailable && tokenizer) {
      this.tokenizer = tokenizer;
    }
    this.utilityAI = utilityAI; // Use injected instance if provided

    this.loadDefaultTemplates();
    // In a real scenario, loadCustomTemplatesFromStore(this.config.templateStorePath) would be called here.

    this.isInitialized = true;
    // console.log('PromptEngine initialized successfully.');
  }

  /**
   * Ensures that the PromptEngine has been initialized.
   * @private
   * @throws {PromptEngineError} If not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new PromptEngineError('PromptEngine has not been initialized. Call initialize() first.', 'NOT_INITIALIZED');
    }
  }

  /**
   * Loads default prompt templates into the engine.
   * @private
   */
  private loadDefaultTemplates(): void {
    this.templates['default_chat_format'] = (processedContent, _modelInfo, _executionContext) => {
      return processedContent.messages.map(msg => {
        const chatMsg: any = { role: msg.role, content: msg.content };
        if (msg.name) chatMsg.name = msg.name;
        if (msg.tool_calls) chatMsg.tool_calls = msg.tool_calls;
        if (msg.tool_call_id) chatMsg.tool_call_id = msg.tool_call_id;

        // Ensure content is not undefined if role expects it (some models are strict)
        // Null content is usually fine for assistant messages with only tool_calls.
        // User/system messages generally need content, even if empty string.
        if ((msg.role === 'user' || msg.role === 'system') && chatMsg.content === null && !msg.tool_calls) {
          chatMsg.content = "";
        }
        return chatMsg;
      }).filter(msg => msg.content !== undefined || msg.tool_calls); // Filter out malformed messages
    };

    this.templates['anthropic_messages_format'] = (processedContent, _modelInfo, _executionContext) => {
        // Anthropic specific: System prompt must be a top-level parameter, not in messages array.
        // And messages must alternate user/assistant.
        // This is a simplified example; a real one would handle this more robustly.
        const systemPrompt = processedContent.messages.find(m => m.role === 'system')?.content || undefined;
        const messages = processedContent.messages.filter(m => m.role !== 'system').map(msg => {
            const chatMsg: any = { role: msg.role, content: msg.content };
             // Anthropic tools are different, this template would need more logic
            if (msg.role === 'tool') {
                chatMsg.role = 'user'; // Tool results are user messages with tool_result block
                chatMsg.content = [
                    { type: 'tool_result', tool_use_id: msg.tool_call_id, content: msg.content || "Tool executed successfully." }
                ];
            }
            if(msg.role === 'assistant' && msg.tool_calls) {
                chatMsg.content = [
                    ...(msg.content ? [{type: 'text', text: msg.content}] : []),
                    ...msg.tool_calls.map(tc => ({ type: 'tool_use', id: tc.id, name: tc.function.name, input: JSON.parse(tc.function.arguments || '{}')}))
                ]
            }
            return chatMsg;
        });
        // This is not the final FormattedPrompt, as system goes outside.
        // The actual call to Anthropic would take { system: systemPrompt, messages: messages }.
        // So the template might return an object for the provider to further process.
        return { system: systemPrompt, messages: messages };
    };


    this.templates['raw_text_format'] = (processedContent, _modelInfo, _executionContext) => {
      // Simple concatenation for basic completion models.
      return processedContent.messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
    };
    // Add more default templates as needed
  }

  /**
   * {@inheritDoc IPromptEngine.registerPromptTemplate}
   */
  public async registerPromptTemplate(
    templateName: string,
    templateFunction: PromptTemplateFunction
  ): Promise<void> {
    this.ensureInitialized();
    if (this.templates[templateName]) {
      console.warn(`PromptEngine: Template '${templateName}' is already registered. Overwriting.`);
    }
    this.templates[templateName] = templateFunction;
  }

  /**
   * {@inheritDoc IPromptEngine.constructPrompt}
   */
  public async constructPrompt(
    components: Partial<PromptComponents>,
    modelTargetInfo: ModelTargetInfo,
    executionContext: PromptExecutionContext,
    templateName?: string
  ): Promise<PromptEngineResult> {
    this.ensureInitialized();

    if (!modelTargetInfo) {
        throw new PromptEngineError('ModelTargetInfo is required for constructPrompt.', 'CONSTRUCT_NO_MODEL_INFO');
    }
    if (!executionContext || !executionContext.activePersona || !executionContext.workingMemory) {
        throw new PromptEngineError('PromptExecutionContext with activePersona and workingMemory is required.', 'CONSTRUCT_NO_EXEC_CONTEXT');
    }

    const issues: NonNullable<PromptEngineResult['issues']> = [];
    const modificationDetails: NonNullable<PromptEngineResult['modificationDetails']> = {};
    let wasTruncatedOrSummarized = false;

    // 1. Dynamic Element Selection & Augmentation
    const augmentedComponents = await this._augmentComponentsWithDynamicElements(
      { ...components }, // Work on a copy
      executionContext,
      issues
    );

    // 2. Preprocess and Tokenize all components
    const processedMessages = this._preprocessAndTokenizeComponents(
      augmentedComponents,
      modelTargetInfo,
      issues
    );

    // 3. Token Budgeting and Assembly
    const reservedOutputTokens = modelTargetInfo.reservedOutputTokens ?? DEFAULT_RESERVED_OUTPUT_TOKENS;
    let promptTokenBudget = modelTargetInfo.maxTokens - reservedOutputTokens;

    if (promptTokenBudget <= 0) {
      issues.push({ type: 'error', message: `Model maxTokens (${modelTargetInfo.maxTokens}) is less than or equal to reservedOutputTokens (${reservedOutputTokens}). No budget for prompt.`, component: 'global_budget' });
      return this._buildResult([], 0, true, modificationDetails, issues, modelTargetInfo, augmentedComponents.toolSchemas);
    }

    let finalMessages: IntermediateMessage[] = [];
    let currentUsedTokens = 0;

    // Assembly Order (example): System, Few-shot, RAG Context, Task-Specific, History, User Input
    // This order can be made more configurable.

    // System Prompts (static + dynamic, already merged and tokenized in processedMessages)
    processedMessages.systemPrompts.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    for (const msg of processedMessages.systemPrompts) {
      if (currentUsedTokens + msg.tokenCount <= promptTokenBudget) {
        finalMessages.push(msg);
        currentUsedTokens += msg.tokenCount;
      } else {
        wasTruncatedOrSummarized = true;
        const {text, tokens} = this._truncateText(msg.content || "", promptTokenBudget - currentUsedTokens, modelTargetInfo, true);
        if (tokens > 0) {
            finalMessages.push({...msg, content: text, tokenCount: tokens});
            currentUsedTokens += tokens;
        }
        modificationDetails[`systemPrompt_${msg.id || 'general'}`] = `Truncated to fit budget. Original: ${msg.tokenCount}, Final: ${tokens}`;
        issues.push({ type: 'warning', message: `System prompt '${msg.id || 'general'}' was truncated.`, component: 'systemPrompts' });
        break; // No more budget for system prompts
      }
    }
    promptTokenBudget -= finalMessages.filter(m=>m.source?.startsWith('system')).reduce((sum, msg) => sum + msg.tokenCount, 0);


    // Few-Shot Examples
    const fewShotBudget = Math.min(promptTokenBudget * 0.25, 1000); // Example budget allocation
    let fewShotTokensUsed = 0;
    processedMessages.fewShotExamples.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    for (const example of processedMessages.fewShotExamples) {
      if (fewShotTokensUsed + example.tokenCount <= fewShotBudget && currentUsedTokens + example.tokenCount <= modelTargetInfo.maxTokens - reservedOutputTokens) {
        finalMessages.push(example);
        currentUsedTokens += example.tokenCount;
        fewShotTokensUsed += example.tokenCount;
      } else {
        wasTruncatedOrSummarized = true;
        modificationDetails['fewShotExamples'] = (modificationDetails['fewShotExamples'] || 'Partially included or dropped examples. ');
        break;
      }
    }
    promptTokenBudget -= fewShotTokensUsed;


    // RAG Context
    if (processedMessages.retrievedContext.length > 0) {
      const contextBudget = Math.min(promptTokenBudget * 0.4, this.config.defaultContextMaxTokens); // Example budget
      const { messages: finalContext, wasModified: contextModified, details: contextDetails } =
        await this._truncateOrSummarizeContentList(
          processedMessages.retrievedContext,
          contextBudget,
          this.config.defaultContextTruncationStrategy,
          this.config.contextSummarizationOptions,
          modelTargetInfo,
          'retrievedContext'
        );
      finalMessages.push(...finalContext);
      currentUsedTokens += finalContext.reduce((sum, msg) => sum + msg.tokenCount, 0);
      if (contextModified) wasTruncatedOrSummarized = true;
      if (contextDetails) modificationDetails.retrievedContext = contextDetails;
      promptTokenBudget -= finalContext.reduce((sum, msg) => sum + msg.tokenCount, 0);
    }

    // Task-Specific Data (insert before history/user input)
    if (processedMessages.taskSpecificData) {
        if (currentUsedTokens + processedMessages.taskSpecificData.tokenCount <= modelTargetInfo.maxTokens - reservedOutputTokens) {
            finalMessages.push(processedMessages.taskSpecificData);
            currentUsedTokens += processedMessages.taskSpecificData.tokenCount;
            promptTokenBudget -= processedMessages.taskSpecificData.tokenCount;
        } else {
            // Truncate or drop taskSpecificData if it doesn't fit
            wasTruncatedOrSummarized = true;
            modificationDetails.taskSpecificData = 'Truncated or dropped due to budget.';
            issues.push({type: 'warning', message: 'Task-specific data truncated or dropped.', component: 'taskSpecificData'});
        }
    }


    // Conversation History (takes a large portion of remaining budget)
    if (processedMessages.conversationHistory.length > 0) {
        const historyBudget = Math.min(promptTokenBudget * 0.8, this.config.defaultHistoryMaxTokens); // Allocate most of remaining to history
        const { messages: finalHistory, wasModified: historyModified, details: historyDetails } =
            await this._truncateOrSummarizeContentList(
                processedMessages.conversationHistory,
                historyBudget,
                this.config.defaultHistoryTruncationStrategy,
                this.config.historySummarizationOptions,
                modelTargetInfo,
                'conversationHistory',
                this.config.defaultHistoryMaxMessages
            );
        // Insert history before user input if present, otherwise at the end of current messages
        const userIndex = finalMessages.findIndex(m => m.role === 'user' && m.source === 'userInput_main');
        if (userIndex !== -1) {
            finalMessages.splice(userIndex, 0, ...finalHistory);
        } else {
            finalMessages.push(...finalHistory);
        }
        currentUsedTokens += finalHistory.reduce((sum, msg) => sum + msg.tokenCount, 0);
        if (historyModified) wasTruncatedOrSummarized = true;
        if (historyDetails) modificationDetails.conversationHistory = historyDetails;
        promptTokenBudget -= finalHistory.reduce((sum, msg) => sum + msg.tokenCount, 0);
    }

    // User Input (usually last or just before last assistant response slot)
    if (processedMessages.userInput) {
        if (currentUsedTokens + processedMessages.userInput.tokenCount <= modelTargetInfo.maxTokens - reservedOutputTokens) {
            finalMessages.push(processedMessages.userInput);
            currentUsedTokens += processedMessages.userInput.tokenCount;
        } else {
            const {text, tokens} = this._truncateText(processedMessages.userInput.content || "", modelTargetInfo.maxTokens - reservedOutputTokens - currentUsedTokens, modelTargetInfo, true);
            if (tokens > 0) {
                finalMessages.push({...processedMessages.userInput, content: text, tokenCount: tokens});
                currentUsedTokens += tokens;
            }
            wasTruncatedOrSummarized = true;
            modificationDetails.userInput = `Truncated. Original: ${processedMessages.userInput.tokenCount}, Final: ${tokens}`;
            issues.push({ type: 'warning', message: 'User input was truncated.', component: 'userInput' });
        }
    }

    // Final ordering pass (e.g. ensure system prompts are first if not already)
    // This might be complex if priorities are heavily used across different types.
    // For now, assume assembly order mostly dictates final order.

    // 4. Template Application
    const templateKey = templateName || modelTargetInfo.promptFormatType || this.config.defaultTemplateName;
    const selectedTemplate = this.templates[templateKey];

    if (!selectedTemplate) {
      issues.push({ type: 'error', message: `Prompt template '${templateKey}' not found.`, component: 'template' });
      return this._buildResult(finalMessages, currentUsedTokens, wasTruncatedOrSummarized, modificationDetails, issues, modelTargetInfo, augmentedComponents.toolSchemas);
    }

    const formattedPrompt = selectedTemplate(
      { messages: finalMessages, toolSchemas: augmentedComponents.toolSchemas },
      modelTargetInfo,
      executionContext
    );

    // 5. Prepare and Return Result
    return this._buildResult(
      finalMessages,
      currentUsedTokens, // This is the token count of `finalMessages` *before* template formatting.
                        // True final token count requires tokenizing the `formattedPrompt`.
      wasTruncatedOrSummarized,
      modificationDetails,
      issues,
      modelTargetInfo,
      augmentedComponents.toolSchemas,
      formattedPrompt // Pass this to potentially re-tokenize for final count
    );
  }

  /**
   * Builds the final PromptEngineResult object.
   * Optionally re-tokenizes the formattedPrompt for an accurate final token count.
   * @private
   */
  private _buildResult(
    finalMessages: IntermediateMessage[], // Messages that went into the template
    inputMessagesTokenCount: number, // Token count of finalMessages
    wasTruncatedOrSummarized: boolean,
    modificationDetails: NonNullable<PromptEngineResult['modificationDetails']>,
    issues: NonNullable<PromptEngineResult['issues']>,
    modelTargetInfo: ModelTargetInfo,
    toolSchemas?: ToolDefinition[],
    formattedPrompt?: FormattedPrompt // Optional: final output from template
  ): PromptEngineResult {

    let finalTokenCount = inputMessagesTokenCount;
    if (formattedPrompt && this.tokenizer && this.config.useTokenizerIfAvailable) {
        try {
            if (typeof formattedPrompt === 'string') {
                finalTokenCount = this.tokenizer.countTokens(formattedPrompt);
            } else if (Array.isArray(formattedPrompt)) { // Likely ChatMessage[]
                const textToTokenize = formattedPrompt.map(m => typeof (m as any).content === 'string' ? (m as any).content : JSON.stringify((m as any).content || "")).join(" ");
                finalTokenCount = this.tokenizer.countTokens(textToTokenize); // Rough for chat, actual depends on model API
            }
            // Add more complex tokenization for specific formats if needed
        } catch (e) {
            issues.push({type: 'warning', message: 'Failed to re-tokenize final formatted prompt for accurate count.', details: (e as Error).message});
        }
    }


    let finalFormattedToolSchemas: any[] | undefined;
    if (toolSchemas && toolSchemas.length > 0) {
        if (modelTargetInfo.toolSupport?.format === 'openai_tools') {
            finalFormattedToolSchemas = toolSchemas.map(ts => ({
                type: 'function',
                function: { name: ts.name, description: ts.description, parameters: ts.parameters }
            }));
        }
        // Add other tool formats here (Anthropic, Google AI)
        else if (modelTargetInfo.toolSupport?.format === 'anthropic_tools') {
             // Anthropic tools are complex XML-like structures or JSON for the API
             // This formatting should ideally happen within the template or a dedicated formatter.
             // For simplicity, we'll represent them abstractly here.
            finalFormattedToolSchemas = toolSchemas.map(ts => ({
                name: ts.name,
                description: ts.description,
                input_schema: ts.parameters
            }));
        }
    }


    return {
      prompt: formattedPrompt || finalMessages, // Fallback to messages if template failed or not applicable
      tokenCount: finalTokenCount,
      estimatedTokenCount: (!this.tokenizer || !this.config.useTokenizerIfAvailable) ? finalTokenCount : undefined,
      wasTruncatedOrSummarized,
      modificationDetails: Object.keys(modificationDetails).length > 0 ? modificationDetails : undefined,
      issues: issues.length > 0 ? issues : undefined,
      metadata: {
        finalMessageCount: finalMessages.length,
        modelTarget: modelTargetInfo.modelId,
        promptFormat: modelTargetInfo.promptFormatType,
        // Add more metadata about dynamic elements selection if useful
      },
      formattedToolSchemas: finalFormattedToolSchemas,
    };
  }

  /**
   * {@inheritDoc IPromptEngine.getTokenCount}
   */
  public async getTokenCount(
    textOrComponents: string | Partial<PromptComponents>,
    modelTargetInfo: ModelTargetInfo
  ): Promise<number> {
    this.ensureInitialized();
    if (!modelTargetInfo) {
        throw new PromptEngineError("ModelTargetInfo is required for getTokenCount.", "COUNT_NO_MODEL_INFO");
    }

    if (typeof textOrComponents === 'string') {
      return this._countTokens(textOrComponents, 'getTokenCount_string', []).count;
    }

    // For PromptComponents, this is an estimation as it doesn't do full assembly.
    // It sums up tokens from individual parts.
    let totalTokens = 0;
    const issues: any[] = []; // Dummy issues array for _countTokens

    if (textOrComponents.systemPrompts) {
      textOrComponents.systemPrompts.forEach(sp => totalTokens += this._countTokens(sp.content, 'system', issues).count);
    }
    if (textOrComponents.conversationHistory) {
      textOrComponents.conversationHistory.forEach(msg => totalTokens += this._countTokens(msg.content as string, 'history', issues).count);
    }
    if (textOrComponents.userInput) {
      totalTokens += this._countTokens(textOrComponents.userInput, 'userInput', issues).count;
    }
    if (textOrComponents.retrievedContext) {
      textOrComponents.retrievedContext.forEach(ctx => totalTokens += this._countTokens(ctx.content, 'context', issues).count);
    }
    if (textOrComponents.fewShotExamples) {
      textOrComponents.fewShotExamples.forEach(ex => {
        totalTokens += this._countTokens(ex.input, 'example_input', issues).count;
        totalTokens += this._countTokens(ex.output, 'example_output', issues).count;
      });
    }
    // Add rough overhead for message structures in chat models (e.g., role, separators)
    const messageCount = (textOrComponents.systemPrompts?.length || 0) +
                         (textOrComponents.conversationHistory?.length || 0) +
                         (textOrComponents.userInput ? 1 : 0) +
                         (textOrComponents.fewShotExamples?.length || 0) * 2 +
                         (textOrComponents.retrievedContext?.length || 0);
    totalTokens += messageCount * 4; // Extremely rough overhead per message
    totalTokens += 5; // Base overhead for the prompt structure

    return totalTokens;
  }


  /**
   * Augments the initial PromptComponents with dynamically selected contextual elements
   * from the active persona, based on the PromptExecutionContext.
   * @private
   */
  private async _augmentComponentsWithDynamicElements(
    baseComponents: Partial<PromptComponents>,
    executionContext: PromptExecutionContext,
    issues: NonNullable<PromptEngineResult['issues']>
  ): Promise<Partial<PromptComponents>> {
    const { activePersona, workingMemory, taskHint, userSkillLevel, language } = executionContext;

    const dynamicElements = activePersona.promptConfig?.contextualElements || [];
    if (dynamicElements.length === 0) {
      return baseComponents; // No dynamic elements defined
    }

    const currentMood = await workingMemory.get<string>('current_mood');
    // In a real system, other context factors like 'conversationSignal' would be fetched or passed in.

    const selectedDynamicElements: ContextualPromptElement[] = [];
    for (const element of dynamicElements) {
      if (this._evaluateCriteria(element.criteria, { currentMood, taskHint, userSkillLevel, language /*, activePersonaTraits, conversationSignals */ })) {
        selectedDynamicElements.push(element);
      }
    }

    // Sort selected elements by priority (lower number = higher priority)
    selectedDynamicElements.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));

    // Merge selected elements into baseComponents
    // This is a simplified merge; more sophisticated logic might be needed for limits per type, etc.
    if (!baseComponents.systemPrompts) baseComponents.systemPrompts = [];
    if (!baseComponents.fewShotExamples) baseComponents.fewShotExamples = [];

    for (const selected of selectedDynamicElements) {
      switch (selected.type) {
        case 'system_instruction_addon':
          baseComponents.systemPrompts.push({ content: selected.content, priority: selected.priority, id: selected.id });
          break;
        case 'few_shot_example_input': // Assuming 'content' holds the input part of an example
                                     // and a paired 'few_shot_example_output' element exists.
          // This requires a more robust way to handle input/output pairs for few-shot examples.
          // For simplicity here, we'll add it as a potential input example that a template might use.
          // A better approach: group input/output pairs in `dynamicPromptElements`.
          const pairedOutputElement = selected.pairId ? dynamicElements.find(el => el.id === selected.pairId && el.type === 'few_shot_example_output') : undefined;
           if (pairedOutputElement) {
                baseComponents.fewShotExamples.push({
                    input: selected.content,
                    output: pairedOutputElement.content,
                    criteria: selected.criteria, // Carry criteria for traceability
                    id: selected.id
                });
           } else if (!selected.pairId && selected.content.includes("Input:") && selected.content.includes("Output:")) {
               // Try to parse if content itself is a full example
               // This is heuristic and less robust. Structured pairs are better.
               const parts = selected.content.split("Output:");
               const inputPart = parts[0].replace("Input:","").trim();
               const outputPart = parts[1] ? parts[1].trim() : "";
                baseComponents.fewShotExamples.push({
                    input: inputPart,
                    output: outputPart,
                    criteria: selected.criteria,
                    id: selected.id
                });

           } else {
                issues.push({type: 'warning', message: `Dynamic few-shot input '${selected.id}' added without a clearly paired output. Structure examples as pairs or provide a 'pairId'.`});
           }
          break;
        // case 'few_shot_example_output': // Handled by pairing with input
        //   break;
        case 'user_prompt_prefix':
          baseComponents.userInput = `${selected.content}${baseComponents.userInput || ''}`;
          break;
        case 'user_prompt_suffix':
          baseComponents.userInput = `${baseComponents.userInput || ''}${selected.content}`;
          break;
        // Add more cases for other ContextualPromptElement types
        default:
          issues.push({ type: 'warning', message: `Unhandled dynamic prompt element type: '${selected.type}' for element ID '${selected.id}'.`, component: 'dynamicElements' });
      }
    }
    return baseComponents;
  }

  /**
   * Evaluates if a set of criteria matches the current execution context.
   * @private
   */
  private _evaluateCriteria(
    criteria: ContextualPromptElementCriteria,
    context: {
      currentMood?: string | null;
      taskHint?: string;
      userSkillLevel?: string;
      language?: string;
      // personaTraitActive?: string[]; (from working memory if used)
      // conversationSignal?: string[]; (from working memory if used)
      customFlags?: Record<string, string | boolean | number>;
    }
  ): boolean {
    if (!criteria) return true; // No criteria means always applicable (or handle as error if criteria are mandatory)

    if (criteria.mood) {
      const moods = Array.isArray(criteria.mood) ? criteria.mood : [criteria.mood];
      if (!context.currentMood || !moods.includes(context.currentMood)) return false;
    }
    if (criteria.userSkillLevel) {
      const levels = Array.isArray(criteria.userSkillLevel) ? criteria.userSkillLevel : [criteria.userSkillLevel];
      if (!context.userSkillLevel || !levels.includes(context.userSkillLevel)) return false;
    }
    if (criteria.taskHint) {
      const hints = Array.isArray(criteria.taskHint) ? criteria.taskHint : [criteria.taskHint];
      if (!context.taskHint || !hints.includes(context.taskHint)) return false;
    }
    if (criteria.language) {
        const languages = Array.isArray(criteria.language) ? criteria.language : [criteria.language];
        if (!context.language || !languages.some(lang => context.language?.startsWith(lang))) return false; // Allow for "en" to match "en-US"
    }
    // Implement personaTraitActive and conversationSignal checks if those are passed in context
    if (criteria.customFlags && context.customFlags) {
        for (const key in criteria.customFlags) {
            if (criteria.customFlags[key] !== context.customFlags[key]) return false;
        }
    } else if (criteria.customFlags && !context.customFlags) {
        return false; // Criteria require custom flags but none provided in context
    }

    return true; // All checked criteria matched
  }


  /**
   * Counts tokens for a given text, using the configured tokenizer or falling back to estimation.
   * @private
   */
  private _countTokens(
    text: string | null,
    componentName: string, // For logging/issue reporting
    issues: NonNullable<PromptEngineResult['issues']>
  ): { count: number; estimated: boolean } {
    if (!text) return { count: 0, estimated: false };

    if (this.tokenizer && this.config.useTokenizerIfAvailable) {
      try {
        return { count: this.tokenizer.countTokens(text), estimated: false };
      } catch (e: any) {
        issues.push({
          type: 'warning',
          message: `Tokenizer error while counting tokens for ${componentName}: ${e.message}. Falling back to character-based estimation.`,
          component: componentName,
          details: e,
        });
        // Fall through to estimation
      }
    }
    return {
      count: Math.ceil(text.length / FALLBACK_AVG_CHARS_PER_TOKEN),
      estimated: true,
    };
  }

  /**
   * Preprocesses raw PromptComponents into an array of IntermediateMessage objects,
   * calculating initial token counts for each.
   * @private
   */
  private _preprocessAndTokenizeComponents(
    rawComponents: Partial<PromptComponents>,
    modelInfo: ModelTargetInfo, // Not directly used for tokenization here, but could be for role validation
    issues: NonNullable<PromptEngineResult['issues']>
  ): {
    systemPrompts: IntermediateMessage[];
    conversationHistory: IntermediateMessage[];
    userInput: IntermediateMessage | null;
    retrievedContext: IntermediateMessage[];
    taskSpecificData: IntermediateMessage | null;
    fewShotExamples: IntermediateMessage[]; // Flattened into alternating user/assistant messages
    toolSchemas: ToolDefinition[]; // Passed through
  } {
    const result = {
      systemPrompts: [] as IntermediateMessage[],
      conversationHistory: [] as IntermediateMessage[],
      userInput: null as IntermediateMessage | null,
      retrievedContext: [] as IntermediateMessage[],
      taskSpecificData: null as IntermediateMessage | null,
      fewShotExamples: [] as IntermediateMessage[],
      toolSchemas: rawComponents.toolSchemas || [],
    };

    // System Prompts
    if (rawComponents.systemPrompts) {
      rawComponents.systemPrompts.forEach((sp, i) => {
        const { count: tokenCount } = this._countTokens(sp.content, `systemPrompts[${i}]`, issues);
        result.systemPrompts.push({
          role: 'system',
          content: sp.content,
          priority: sp.priority,
          source: `system_static_${sp.id || i}`,
          tokenCount,
          id: sp.id,
        });
      });
    } else {
        const { count: tokenCount } = this._countTokens(DEFAULT_SYSTEM_PROMPT_CONTENT, `system_default`, issues);
        result.systemPrompts.push({
            role: 'system',
            content: DEFAULT_SYSTEM_PROMPT_CONTENT,
            priority: 1000, // Default has low priority if dynamic ones are added
            source: 'system_default',
            tokenCount,
            id: 'default_system_prompt',
        });
    }


    // Conversation History
    if (rawComponents.conversationHistory) {
      rawComponents.conversationHistory.forEach((msg, i) => {
        // Ensure role is one of the literal types
        let role: IntermediateMessage['role'] = 'user'; // default
        if (msg.role === MessageRole.SYSTEM) role = 'system';
        else if (msg.role === MessageRole.USER) role = 'user';
        else if (msg.role === MessageRole.ASSISTANT) role = 'assistant';
        else if (msg.role === MessageRole.TOOL) role = 'tool';

        const { count: tokenCount } = this._countTokens(msg.content as string | null, `history[${i}]`, issues);
        result.conversationHistory.push({
          ...msg, // Spread original message to keep tool_calls etc.
          role,
          content: msg.content as string | null,
          tokenCount,
          source: `history_original_${i}`,
          // priority: default history message priority might be its index or a fixed value.
        });
      });
    }

    // User Input
    if (rawComponents.userInput) {
      const { count: tokenCount } = this._countTokens(rawComponents.userInput, 'userInput', issues);
      result.userInput = {
        role: 'user',
        content: rawComponents.userInput,
        tokenCount,
        source: 'userInput_main',
        priority: 0, // User input is usually high priority
      };
    }

    // Retrieved Context (typically injected as user or system messages, depending on template)
    // For processing, treat as distinct items. Template decides final role.
    if (rawComponents.retrievedContext) {
      rawComponents.retrievedContext.forEach((ctx, i) => {
        const content = `Retrieved context (source: ${ctx.source || 'unknown'}, score: ${ctx.score?.toFixed(2) || 'N/A'}):\n${ctx.content}`;
        const { count: tokenCount } = this._countTokens(content, `retrievedContext[${i}]`, issues);
        result.retrievedContext.push({
          // The role here is provisional; the template might re-assign it.
          // For budgeting, we need its content. Using 'user' as a placeholder if forced.
          role: 'user', // Or 'system' - depends on how the model best processes context.
          content: content,
          tokenCount,
          priority: ctx.score ? Math.round(ctx.score * 100) : 50, // Higher score = higher priority for retention
          source: `context_rag_${ctx.id || i}`,
          id: ctx.id,
        });
      });
      result.retrievedContext.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)); // Higher score first
    }

    // Few-Shot Examples (flatten into alternating user/assistant messages)
    if (rawComponents.fewShotExamples) {
      rawComponents.fewShotExamples.forEach((ex, i) => {
        const { count: inputTokens } = this._countTokens(ex.input, `fewShotExample[${i}]_input`, issues);
        result.fewShotExamples.push({
          role: 'user',
          content: ex.input,
          tokenCount: inputTokens,
          source: `few_shot_example_${ex.id || i}_input`,
          priority: ex.criteria?.priority || i + 100, // Example priority
          id: ex.id ? `${ex.id}_input` : undefined,
        });
        const { count: outputTokens } = this._countTokens(ex.output, `fewShotExample[${i}]_output`, issues);
        result.fewShotExamples.push({
          role: 'assistant',
          content: ex.output,
          tokenCount: outputTokens,
          source: `few_shot_example_${ex.id || i}_output`,
          priority: (ex.criteria?.priority || i + 100) + 0.5, // Ensure output follows input
          id: ex.id ? `${ex.id}_output` : undefined,
        });
      });
    }
     // Task-Specific Data (often prepended to user input or as a system message)
    if (rawComponents.taskSpecificData) {
        const dataContent = typeof rawComponents.taskSpecificData === 'string'
            ? rawComponents.taskSpecificData
            : JSON.stringify(rawComponents.taskSpecificData);
        const { count: tokenCount } = this._countTokens(dataContent, 'taskSpecificData', issues);
        result.taskSpecificData = {
            role: 'system', // Often treated as a focused system instruction
            content: dataContent,
            tokenCount,
            source: 'taskSpecificData',
            priority: -50, // Higher than general system, lower than user input
        };
    }


    return result;
  }

  /**
   * Truncates or summarizes a list of content items (history or context)
   * to fit within a given token budget.
   * @private
   */
  private async _truncateOrSummarizeContentList(
    messages: IntermediateMessage[],
    maxTokens: number,
    strategy: PromptEngineConfig['defaultHistoryTruncationStrategy'] | PromptEngineConfig['defaultContextTruncationStrategy'],
    summarizationOptions: SummarizationOptions | undefined,
    modelInfo: ModelTargetInfo,
    componentName: string, // For logging/details
    maxMessages?: number
  ): Promise<{ messages: IntermediateMessage[]; wasModified: boolean; details?: any }> {
    let currentTokens = messages.reduce((sum, msg) => sum + msg.tokenCount, 0);
    let workingMessages = [...messages]; // Work on a copy
    let wasModified = false;
    const originalMessageCount = workingMessages.length;
    const originalTokenCount = currentTokens;

    // 1. Apply maxMessages limit (primarily for history)
    if (maxMessages !== undefined && workingMessages.length > maxMessages) {
      wasModified = true;
      if (strategy === 'FIFO' || strategy === 'SUMMARIZE_OLDEST') {
        workingMessages = workingMessages.slice(-maxMessages);
      } else { // LIFO, SUMMARIZE_MIDDLE (keeps N most recent, or start+end for middle)
        workingMessages = workingMessages.slice(workingMessages.length - maxMessages);
      }
      currentTokens = workingMessages.reduce((sum, msg) => sum + msg.tokenCount, 0);
    }

    // 2. Apply token budget
    if (currentTokens > maxTokens) {
      wasModified = true;
      switch (strategy) {
        case 'FIFO': // Remove oldest
          while (currentTokens > maxTokens && workingMessages.length > 0) {
            currentTokens -= workingMessages.shift()!.tokenCount;
          }
          break;
        case 'LIFO': // Remove least recent (from the start of the current window)
          while (currentTokens > maxTokens && workingMessages.length > 0) {
            currentTokens -= workingMessages.shift()!.tokenCount; // Effectively same as FIFO for history if already sliced by maxMessages
          }
          break;
        case 'SUMMARIZE_OLDEST':
        case 'SUMMARIZE_MIDDLE':
          if (this.utilityAI && workingMessages.length >= MIN_MESSAGES_FOR_HISTORY_SUMMARIZATION && summarizationOptions) {
            try {
              // Determine which messages to summarize
              let retainEndCount = Math.max(1, Math.floor(workingMessages.length * 0.25)); // Keep last 25%
              let retainStartCount = (strategy === 'SUMMARIZE_MIDDLE') ? Math.max(1, Math.floor(workingMessages.length * 0.25)) : 0;
              
              // Ensure retain counts don't exceed available messages if list is small
              if (workingMessages.length < retainStartCount + retainEndCount +1) {
                  retainStartCount = 0; // just summarize oldest if too few for complex middle summarization
                  retainEndCount = Math.min(retainEndCount, Math.max(0, workingMessages.length-1));
              }


              const headMessages = workingMessages.slice(0, retainStartCount);
              const tailMessages = workingMessages.slice(workingMessages.length - retainEndCount);
              const messagesToSummarize = workingMessages.slice(retainStartCount, workingMessages.length - retainEndCount);

              if (messagesToSummarize.length > 0) {
                const textToSummarize = messagesToSummarize.map(m => `${m.role}: ${m.content}`).join('\n');
                const tokensToSummarize = messagesToSummarize.reduce((s,m)=>s+m.tokenCount,0);

                // Budget for summary: maxTokens - (tokens of head+tail) - safety_buffer
                const budgetForSummary = maxTokens - headMessages.reduce((s,m)=>s+m.tokenCount,0) - tailMessages.reduce((s,m)=>s+m.tokenCount,0) - 50;

                if (this._countTokens(textToSummarize, componentName, []).count > MIN_TOKENS_FOR_SUMMARIZATION && budgetForSummary > (this.tokenizer ? 20 : 80)) {
                  const dynamicSummaryOptions: SummarizationOptions = {
                    ...summarizationOptions,
                    // Adjust desiredLength of summary based on available token budget
                    // desiredLength can be number of words, sentences, or target token count if utilityAI supports it
                    // For now, assume it's a hint and utilityAI manages token output.
                  };
                  const summaryContent = await this.utilityAI.summarize(textToSummarize, dynamicSummaryOptions);
                  const { count: summaryTokenCount } = this._countTokens(summaryContent, `${componentName}_summary`, []);

                  if (summaryTokenCount <= budgetForSummary) {
                    const summaryMessage: IntermediateMessage = {
                      role: 'system', // Summaries are often injected as system messages
                      content: `[Summary of ${messagesToSummarize.length} older conversation turns]:\n${summaryContent}`,
                      tokenCount: summaryTokenCount,
                      isSummary: true,
                      originalMessageCount: messagesToSummarize.length,
                      source: `${componentName}_summary`,
                      priority: (headMessages.length > 0 ? headMessages[headMessages.length-1].priority! : tailMessages[0]?.priority || 0) + 0.1, // Insert appropriately
                    };
                    workingMessages = [...headMessages, summaryMessage, ...tailMessages];
                    currentTokens = workingMessages.reduce((sum, msg) => sum + msg.tokenCount, 0);
                  } else { /* Summary too long, fallback to truncation */ fallbackToTruncate(); }
                } else { /* Not enough content or budget to summarize, fallback */ fallbackToTruncate(); }
              } // else no messages to summarize if head+tail cover everything
            } catch (e: any) {
              console.warn(`PromptEngine: Summarization failed for ${componentName}, falling back to FIFO truncation. Error: ${e.message}`);
              fallbackToTruncate();
            }
          } else { /* No utilityAI or not enough messages, fallback */ fallbackToTruncate(); }
          break;
        case 'TRUNCATE_CONTENT': // For context items
        case 'TOP_K_BY_SCORE':   // For context items (assumes already sorted by score)
        case 'REMOVE_LOW_SCORE': // For context items
        default: // Fallback to FIFO-like for generic content lists
          fallbackToTruncate();
          break;
      }
      function fallbackToTruncate() {
        // More aggressive FIFO if summarization fails or not applicable
        workingMessages = [...messages]; // Reset to original slice (if maxMessages was applied)
        currentTokens = workingMessages.reduce((sum, msg) => sum + msg.tokenCount, 0);
        while (currentTokens > maxTokens && workingMessages.length > 0) {
            currentTokens -= workingMessages.shift()!.tokenCount;
        }
      }
    }

    const finalTokenCount = workingMessages.reduce((sum, msg) => sum + msg.tokenCount, 0);
    return {
      messages: workingMessages,
      wasModified,
      details: {
        strategy,
        originalItems: originalMessageCount,
        finalItems: workingMessages.length,
        originalTokens: originalTokenCount,
        finalTokens: finalTokenCount,
        maxTokensBudget: maxTokens,
      }
    };
  }

  /**
   * Truncates a single piece of text to fit a token budget.
   * Prefers to truncate from the beginning for history/context if `fromStart` is true.
   * @private
   */
  private _truncateText(
    text: string,
    budget: number,
    modelInfo: ModelTargetInfo, // For potential model-specific truncation (e.g. preferring full words)
    fromStart: boolean = false // if true, truncates from the beginning (for old history)
  ): { text: string; tokens: number } {
    if (budget <= 0) return { text: "", tokens: 0 };
    let currentTokens = this._countTokens(text, 'truncate_text', []).count;
    if (currentTokens <= budget) return { text, tokens: currentTokens };

    if (this.tokenizer && this.config.useTokenizerIfAvailable) {
      let tokens = this.tokenizer.encode(text);
      if (fromStart) {
        tokens = tokens.slice(tokens.length - budget); // Highly approximate, as token budget != token count directly
      } else {
        tokens = tokens.slice(0, budget); // Again, approximate
      }
      // A more accurate approach is iterative removal of tokens until count is <= budget
      while (tokens.length > 0 && this.tokenizer.countTokens(this.tokenizer.decode(tokens)) > budget) {
          if (fromStart) tokens = tokens.slice(1);
          else tokens.pop();
      }
      const truncatedText = this.tokenizer.decode(tokens);
      return { text: truncatedText, tokens: this.tokenizer.countTokens(truncatedText) };
    } else {
      // Character-based truncation
      const estimatedChars = budget * FALLBACK_AVG_CHARS_PER_TOKEN;
      const truncatedText = fromStart
        ? text.slice(-estimatedChars)
        : text.substring(0, estimatedChars);
      return { text: truncatedText, tokens: this._countTokens(truncatedText, 'truncate_text_char_est', []).count };
    }
  }
}