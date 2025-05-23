// backend/agentos/core/llm/providers/implementations/OpenAIProvider.ts

import OpenAI from 'openai';
import {
  IProvider,
  ModelCompletionOptions,
  ModelCompletionResponse,
  ModelUsage,
  ModelInfo,
  ModelResponseMessage,
  ModelResponseChoice
} from '../IProvider';
import { FormattedPrompt, PromptEngineResult, ModelTargetInfo } from '../../IPromptEngine';
import { ChatCompletionMessageParam, ChatCompletionChunk } from 'openai/resources/chat/completions';

/**
 * @fileoverview OpenAI Provider implementation for AgentOS.
 * Handles interactions with OpenAI's API, including cost calculation and streaming.
 * @module agentos/core/llm/providers/implementations/OpenAIProvider
 */

export interface OpenAIProviderConfig {
  apiKey: string;
  organizationId?: string;
  defaultModel?: string;
  // Pricing info (per 1K tokens) - should be updatable/configurable externally in a real system
  pricing?: Record<string, { prompt: number; completion: number; inputCurrency?: string; outputCurrency?: string; contextWindow?: number }>;
}

export class OpenAIProvider implements IProvider {
  public readonly providerId = 'openai';
  public defaultModelId?: string;
  public isInitialized = false;
  private openai!: OpenAI;
  private config!: OpenAIProviderConfig;

  // Default pricing based on common models (as of early 2024/2025, check current OpenAI pricing)
  private static readonly DEFAULT_PRICING: Record<string, { prompt: number; completion: number; contextWindow?: number }> = {
    "gpt-4o": { prompt: 0.005, completion: 0.015, contextWindow: 128000 },
    "gpt-4o-mini": { prompt: 0.00015, completion: 0.0006, contextWindow: 128000 },
    "gpt-4-turbo": { prompt: 0.01, completion: 0.03, contextWindow: 128000 },
    "gpt-4-turbo-preview": { prompt: 0.01, completion: 0.03, contextWindow: 128000 }, // alias
    "gpt-4": { prompt: 0.03, completion: 0.06, contextWindow: 8192 },
    "gpt-4-32k": { prompt: 0.06, completion: 0.12, contextWindow: 32768 },
    "gpt-3.5-turbo": { prompt: 0.0005, completion: 0.0015, contextWindow: 16385 }, // Common variant
    "gpt-3.5-turbo-16k": { prompt: 0.0005, completion: 0.0015, contextWindow: 16385 }, // Often same pricing now
    // Add embeddings, image models if this provider handles them
  };

  public async initialize(config: OpenAIProviderConfig): Promise<void> {
    if (!config.apiKey) throw new Error('OpenAIProvider: API key is required.');
    this.config = {
        ...config,
        pricing: { ...OpenAIProvider.DEFAULT_PRICING, ...(config.pricing || {}) }
    };
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      organization: this.config.organizationId,
    });
    this.defaultModelId = this.config.defaultModel || 'gpt-4o-mini';
    this.isInitialized = true;
    console.log(`OpenAIProvider initialized. Default model: ${this.defaultModelId}`);
  }

  private mapToPricingKey(modelId: string): string {
    // OpenAI model IDs can have version suffixes like -0125.
    // Try to map to base model for pricing if exact match isn't found.
    if (this.config.pricing?.[modelId]) return modelId;
    if (modelId.startsWith("gpt-4-turbo")) return "gpt-4-turbo"; // Covers preview, vision
    if (modelId.startsWith("gpt-4o-mini")) return "gpt-4o-mini";
    if (modelId.startsWith("gpt-4o")) return "gpt-4o";
    if (modelId.startsWith("gpt-4")) return "gpt-4"; // Fallback for other gpt-4 variants
    if (modelId.startsWith("gpt-3.5-turbo")) return "gpt-3.5-turbo";
    return modelId; // Default to exact ID
  }

  public calculateCostForUsage(
    modelId: string,
    usage: { promptTokens: number; completionTokens: number }
  ): Pick<ModelUsage, 'costUSD' | 'promptTokenCostPer1K' | 'completionTokenCostPer1K' | 'currency'> | undefined {
    const pricingKey = this.mapToPricingKey(modelId);
    const modelPricing = this.config.pricing?.[pricingKey];

    if (!modelPricing || usage.promptTokens === undefined || usage.completionTokens === undefined) {
      console.warn(`OpenAIProvider: Pricing or usage info not found for model ${modelId} (key: ${pricingKey}). Cannot calculate cost.`);
      return undefined;
    }

    const cost =
      (usage.promptTokens / 1000 * modelPricing.prompt) +
      (usage.completionTokens / 1000 * modelPricing.completion);

    return {
      costUSD: parseFloat(cost.toFixed(6)),
      promptTokenCostPer1K: modelPricing.prompt,
      completionTokenCostPer1K: modelPricing.completion,
      currency: 'USD',
    };
  }

  private transformOpenAIMessages(prompt: FormattedPrompt): ChatCompletionMessageParam[] {
    if (typeof prompt === 'string') {
      return [{ role: 'user', content: prompt }];
    }
    return prompt.map(p => ({
      role: p.role as 'user' | 'assistant' | 'system' | 'tool', // OpenAI specific roles
      content: p.content,
      tool_calls: p.tool_calls as any, // Assuming structure matches
      tool_call_id: p.tool_call_id,
      name: p.name,
    }));
  }

  public async generateCompletion(
    prompt: FormattedPrompt,
    options: ModelCompletionOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _promptEngineResult?: PromptEngineResult
  ): Promise<ModelCompletionResponse> {
    if (!this.isInitialized) throw new Error("OpenAIProvider not initialized.");

    const messages = this.transformOpenAIMessages(prompt);
    const requestOptions: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: options.modelId,
      messages: messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      top_p: options.top_p,
      frequency_penalty: options.frequency_penalty,
      presence_penalty: options.presence_penalty,
      stop: options.stop,
      stream: false, // Explicitly false for non-streaming
      user: options.user,
      tools: options.tools as any, // Assuming ToolDefinition aligns or is transformed
      tool_choice: options.tool_choice as any,
      response_format: options.response_format as {type: "text" | "json_object"} | undefined,
    };

    try {
      const response = await this.openai.chat.completions.create(requestOptions);
      const usageStats = response.usage ? this.calculateCostForUsage(options.modelId, {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
      }) : undefined;

      return {
        id: response.id,
        created: response.created,
        modelId: response.model,
        choices: response.choices.map(choice => ({
          message: choice.message as ModelResponseMessage, // Assuming structure aligns
          finish_reason: choice.finish_reason,
          index: choice.index,
        })),
        usage: usageStats ? {
            promptTokens: response.usage!.prompt_tokens,
            completionTokens: response.usage!.completion_tokens,
            totalTokens: response.usage!.total_tokens,
            ...usageStats,
        } : undefined,
        rawResponse: response,
      };
    } catch (error: any) {
      console.error(`OpenAIProvider error for model ${options.modelId}:`, error);
      return {
        id: `error-${Date.now()}`,
        created: Math.floor(Date.now() / 1000),
        modelId: options.modelId,
        choices: [],
        error: {
          message: error.message || 'Unknown OpenAI API error',
          type: error.type || error.name,
          code: error.status || error.code,
          details: error.error || error,
        },
      };
    }
  }

  public async *generateCompletionStream(
    prompt: FormattedPrompt,
    options: ModelCompletionOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _promptEngineResult?: PromptEngineResult
  ): AsyncIterable<ModelCompletionResponse> {
    if (!this.isInitialized) throw new Error("OpenAIProvider not initialized.");

    const messages = this.transformOpenAIMessages(prompt);
    const requestOptions: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: options.modelId,
      messages: messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      // ... (all other options as in generateCompletion)
      stream: true, // Key for streaming
      tools: options.tools as any,
      tool_choice: options.tool_choice as any,
      response_format: options.response_format as {type: "text" | "json_object"} | undefined,
    };

    let finalUsage: OpenAI.CompletionUsage | null = null;
    let finalId = `stream-${Date.now()}`;
    let finalCreated = Math.floor(Date.now() / 1000);
    let finalModel = options.modelId;

    try {
      const stream = await this.openai.chat.completions.create(requestOptions);

      for await (const chunk of stream) {
        finalId = chunk.id; // ID is usually consistent across chunks in a stream
        finalCreated = chunk.created;
        finalModel = chunk.model;

        // OpenAI stream chunks provide 'delta' for content and tool calls
        // The 'usage' object often comes in a separate event or at the end with some providers,
        // or in newer OpenAI API versions, it might be in the last chunk or an x-header.
        // For OpenAI, `usage` is not part of the per-chunk data in `ChatCompletionChunk`.
        // It's often retrieved after the stream is fully processed or via a separate mechanism
        // if the library supports it (e.g. `stream.finalChatCompletion()`).
        // For simplicity here, we'll assume usage is only processed at the end.
        
        // Attempt to get usage if the library supports it (conceptual)
        if ((stream as any).usage) { // Check if the stream object itself might accumulate usage
            finalUsage = (stream as any).usage;
        }
        // Or, some SDKs might provide a final_usage on the last chunk or via a method
        // if (chunk.choices[0]?.finish_reason && (stream as any).final_usage) {
        // finalUsage = await (stream as any).final_usage();
        // }


        yield {
          id: chunk.id,
          created: chunk.created,
          modelId: chunk.model,
          choices: chunk.choices.map(choice => ({
            delta: choice.delta as ModelResponseChoice['delta'], // Cast, ensure fields match
            finish_reason: choice.finish_reason,
            index: choice.index,
          })),
          isFinal: !!chunk.choices[0]?.finish_reason,
          rawResponse: chunk,
        };
      }
      
      // After the loop, try to get final usage if the OpenAI SDK's stream object provides it.
      // This is a common pattern for some SDKs, but the exact mechanism can vary.
      // For the `openai` Node.js library version 4+, usage is not directly available this way from the stream iterator.
      // Typically, you'd make a non-streaming call if you need precise token counts for billing from OpenAI,
      // or rely on dashboard reporting. For this example, we'll make `finalUsage` conceptual for streaming.
      // If `openai.chat.completions.create({stream: true})` does not return usage,
      // cost calculation for streaming will be an estimate or require a follow-up.
      // For now, we'll indicate it might be missing for streams.
      
      // Placeholder for actual final usage if stream is finished.
      // This part is tricky with streaming and exact token counts without a final summary event.
      // Some libraries might offer a way to get this post-stream.
      // For now, we'll construct a conceptual final packet if finish_reason was seen.
      // Let's assume for this example, the last chunk with finish_reason might magically contain usage (not true for current OpenAI API).
      // A practical approach is to sum token approximations from deltas or make a small follow-up non-stream call for usage.

      // Simulate final packet with usage if it could be obtained
      // This part is highly dependent on how the specific OpenAI SDK version handles final usage reporting for streams.
      // As of recent versions, usage is NOT provided in the stream itself.
      // We will return a final packet without usage, and cost calculation for streams becomes more complex.
      // Callers might need to estimate or not rely on per-stream cost from this provider.
      
      // Yield a final packet for consistency, but acknowledge usage might be missing/estimated for streams
      // This is a limitation of many streaming APIs; exact token counts are hard until the full response is known.
      // For this MVP, we'll assume a mechanism to get usage exists, or it's okay if it's sometimes undefined for streams.
      const lastChoice = (await (stream as any).finalChatCompletion?.())?.choices?.[0]; // Conceptual: some SDKs offer this
      if (lastChoice && lastChoice.finish_reason) { // If we conceptually got a final packet
          const accumulatedUsage = (await (stream as any).finalChatCompletion?.())?.usage; // Conceptual
          let usageStats: ModelUsage | undefined;
          if (accumulatedUsage) {
                const costInfo = this.calculateCostForUsage(finalModel, {
                    promptTokens: accumulatedUsage.prompt_tokens,
                    completionTokens: accumulatedUsage.completion_tokens,
                });
                usageStats = {
                    promptTokens: accumulatedUsage.prompt_tokens,
                    completionTokens: accumulatedUsage.completion_tokens,
                    totalTokens: accumulatedUsage.total_tokens,
                    ...costInfo,
                };
          }
          yield {
            id: finalId,
            created: finalCreated,
            modelId: finalModel,
            choices: [{ finish_reason: lastChoice.finish_reason, index: lastChoice.index }], // Minimal final choice info
            isFinal: true,
            usage: usageStats,
          };
      }


    } catch (error: any) {
      console.error(`OpenAIProvider stream error for model ${options.modelId}:`, error);
      yield {
        id: `error-stream-${Date.now()}`,
        created: Math.floor(Date.now() / 1000),
        modelId: options.modelId,
        choices: [],
        isFinal: true,
        error: {
          message: error.message || 'Unknown OpenAI API stream error',
          type: error.type || error.name,
          code: error.status || error.code,
          details: error.error || error,
        },
      };
    }
  }

  public async listAvailableModels(): Promise<ModelInfo[]> {
    // In a real scenario, this might call client.models.list()
    // For now, return statically known models with their pricing from config
    return Object.entries(this.config.pricing || {}).map(([id, p]) => ({
        id,
        providerId: this.providerId,
        name: id, // Could be enhanced with more descriptive names
        pricing: { prompt: p.prompt, completion: p.completion, currency: 'USD' },
        capabilities: ['chat', 'tools', 'streaming', p.id.includes('json') ? 'json_mode' : undefined].filter(Boolean) as string[],
        contextWindow: p.contextWindow || (id.includes('32k') ? 32768 : (id.includes('16k') || id.includes('turbo') || id.includes('4o')) ? (id.includes('4o') ? 128000 : (id.includes('16k') ? 16385 : 8192)) : 4096),
    }));
  }

  public getFormatTypeForModel(modelId: string): ModelTargetInfo['promptFormatType'] {
    // OpenAI chat models generally use 'openai_chat'
    if (modelId.startsWith('gpt-')) {
      return 'openai_chat';
    }
    return 'auto'; // Fallback
  }

  public getToolSupportForModel(modelId: string): ModelTargetInfo['toolSupport'] {
    if (modelId.startsWith('gpt-3.5-turbo') || modelId.startsWith('gpt-4')) {
      return 'openai_tools';
    }
    return 'none';
  }

  public getCheapestModelVariant(modelId: string, taskHint?: string): string | undefined {
    // Example: if task is 'summarization_short' and current model is 'gpt-4', suggest 'gpt-3.5-turbo'
    if (modelId.startsWith("gpt-4") && (taskHint?.includes("simple") || taskHint?.includes("cheap"))) {
        if (this.config.pricing?.["gpt-3.5-turbo"]) return "gpt-3.5-turbo";
    }
    if (modelId.startsWith("gpt-4o") && (taskHint?.includes("simple") || taskHint?.includes("cheap"))) {
        if (this.config.pricing?.["gpt-4o-mini"]) return "gpt-4o-mini";
    }
    return undefined;
  }
}