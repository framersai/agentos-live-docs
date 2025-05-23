// backend/agentos/core/llm/providers/implementations/OpenRouterProvider.ts

import axios, { AxiosInstance } from 'axios';
import {
  IProvider,
  ModelCompletionOptions,
  ModelCompletionResponse,
  ModelUsage,
  ModelInfo
} from '../IProvider';
import { FormattedPrompt, PromptEngineResult, ModelTargetInfo } from '../../IPromptEngine';

/**
 * @fileoverview OpenRouter Provider implementation for AgentOS.
 * @module agentos/core/llm/providers/implementations/OpenRouterProvider
 */

interface OpenRouterProviderConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
  referer?: string; // Recommended by OpenRouter
  appName?: string; // Recommended by OpenRouter
}

// Structure of OpenRouter's cost in response (example)
interface OpenRouterCostInfo {
  cost: number; // Total cost in USD
  // They might also provide token counts, which we should use if available
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export class OpenRouterProvider implements IProvider {
  public readonly providerId = 'openrouter';
  public defaultModelId?: string;
  public isInitialized = false;
  private client!: AxiosInstance;
  private config!: OpenRouterProviderConfig;

  public async initialize(config: OpenRouterProviderConfig): Promise<void> {
    if (!config.apiKey) throw new Error('OpenRouterProvider: API key is required.');
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': config.referer || 'http://localhost:3000', // Replace with your actual site URL
        'X-Title': config.appName || 'AgentOS', // Replace with your app name
      },
    });
    this.defaultModelId = config.defaultModel || 'openai/gpt-3.5-turbo'; // OpenRouter uses prefixed model IDs
    this.isInitialized = true;
    console.log(`OpenRouterProvider initialized. Default model: ${this.defaultModelId}`);
  }

  public calculateCostForUsage(
    modelId: string, // OpenRouter model ID like 'openai/gpt-3.5-turbo'
    usage: { promptTokens: number; completionTokens: number, cost?: number }
  ): Pick<ModelUsage, 'costUSD' | 'promptTokenCostPer1K' | 'completionTokenCostPer1K' | 'currency'> | undefined {
    // OpenRouter often provides the cost directly.
    // If not, we'd need a pricing map for OpenRouter models, which is complex as they aggregate many.
    if (usage.cost !== undefined) {
      return { costUSD: usage.cost, currency: 'USD' }; // Assuming cost is directly provided
    }
    // Fallback: if we had a pricing map for OpenRouter's specific model IDs (hard to maintain)
    // const modelPricing = this.getOpenRouterModelPricing(modelId);
    // if (modelPricing) { /* ... calculate ... */ }
    console.warn(`OpenRouterProvider: Direct cost not available for ${modelId} in usage data, and no pricing map. Cost will be undefined.`);
    return undefined;
  }

  // Placeholder for transforming to OpenRouter's expected message format
  private transformToOpenRouterMessages(prompt: FormattedPrompt): any[] {
     if (typeof prompt === 'string') {
      return [{ role: 'user', content: prompt }];
    }
    return prompt.map(p => ({ // Assuming standard chat message format
      role: p.role,
      content: p.content,
      // OpenRouter might support tool_calls similarly to OpenAI for compatible models
      tool_calls: (p as any).tool_calls,
      tool_call_id: (p as any).tool_call_id,
      name: p.name,
    }));
  }

  public async generateCompletion(
    prompt: FormattedPrompt,
    options: ModelCompletionOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _promptEngineResult?: PromptEngineResult
  ): Promise<ModelCompletionResponse> {
    if (!this.isInitialized) throw new Error("OpenRouterProvider not initialized.");

    const messages = this.transformToOpenRouterMessages(prompt);
    const requestPayload = {
      model: options.modelId, // e.g., "openai/gpt-3.5-turbo", "anthropic/claude-3-haiku"
      messages: messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      top_p: options.top_p,
      frequency_penalty: options.frequency_penalty,
      presence_penalty: options.presence_penalty,
      stop: options.stop,
      stream: false,
      user: options.user,
      tools: options.tools, // Pass through if OpenRouter supports for the model
      tool_choice: options.tool_choice, // Pass through
      // OpenRouter specific: route, transforms
    };

    try {
      const response = await this.client.post('/chat/completions', requestPayload);
      const data = response.data;
      const choice = data.choices[0];

      const openRouterUsage = data.usage || {}; // OpenRouter might put cost here or in a top-level field
      const costInfo = data.usage?.cost_usd ?? data.cost_usd ?? (data.usage ? this.calculateCostForUsage(options.modelId, {
          promptTokens: openRouterUsage.prompt_tokens || 0,
          completionTokens: openRouterUsage.completion_tokens || 0,
          cost: openRouterUsage.cost // Pass direct cost if available
      }) : undefined);


      return {
        id: data.id,
        created: data.created || Math.floor(Date.now() / 1000),
        modelId: data.model,
        choices: [{
          message: choice.message, // Assuming OpenRouter aligns with ModelResponseMessage
          finish_reason: choice.finish_reason,
          index: choice.index,
        }],
        usage: {
          promptTokens: openRouterUsage.prompt_tokens || 0,
          completionTokens: openRouterUsage.completion_tokens || 0,
          totalTokens: openRouterUsage.total_tokens || (openRouterUsage.prompt_tokens || 0) + (openRouterUsage.completion_tokens || 0),
          costUSD: typeof costInfo === 'number' ? costInfo : costInfo?.costUSD,
          currency: 'USD', // OpenRouter typically bills in USD
          // promptTokenCostPer1K, completionTokenCostPer1K might be harder to get generically
        },
        rawResponse: data,
      };
    } catch (error: any) {
      console.error(`OpenRouterProvider error for model ${options.modelId}:`, error.response?.data || error.message);
      return {
        id: `error-${Date.now()}`,
        created: Math.floor(Date.now() / 1000),
        modelId: options.modelId,
        choices: [],
        error: {
          message: error.response?.data?.error?.message || error.message || 'Unknown OpenRouter API error',
          type: error.response?.data?.error?.type,
          code: error.response?.status || error.code,
          details: error.response?.data || error,
        },
      };
    }
  }

  public async *generateCompletionStream(
    prompt: FormattedPrompt,
    options: ModelCompletionOptions,
    _promptEngineResult?: PromptEngineResult
  ): AsyncIterable<ModelCompletionResponse> {
    if (!this.isInitialized) throw new Error("OpenRouterProvider not initialized.");

    const messages = this.transformToOpenRouterMessages(prompt);
    const requestPayload = {
      model: options.modelId,
      messages: messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      // ... (all other options)
      stream: true,
      tools: options.tools,
      tool_choice: options.tool_choice,
    };

    let finalModel = options.modelId;
    let finalId = `or-stream-${Date.now()}`;
    let finalCreated = Math.floor(Date.now()/1000);

    try {
      const response = await this.client.post('/chat/completions', requestPayload, {
        responseType: 'stream',
      });

      const stream = response.data as NodeJS.ReadableStream;

      for await (const chunk of stream) {
        const chunkString = chunk.toString();
        // OpenRouter stream format is typically Server-Sent Events (SSE)
        // data: {"id":"...","model":"...","choices":[{"index":0,"delta":{"content":"..."}}]}
        // Need to parse SSE: multiple "data: ..." lines might arrive together.
        const lines = chunkString.split('\n').filter((line: string) => line.startsWith('data: '));

        for (const line of lines) {
            const jsonData = line.substring('data: '.length);
            if (jsonData.trim() === '[DONE]') {
                // OpenRouter (like OpenAI) signals end of stream with [DONE]
                // Attempt to get final cost/usage if available in headers or a final non-data message
                // This is provider-dependent and complex for generic stream parsing.
                // For OpenRouter, cost is usually determined after the fact or via dashboard.
                // We might have to omit precise per-stream costing here.
                yield {
                    id: finalId,
                    created: finalCreated,
                    modelId: finalModel,
                    choices: [{ finish_reason: 'stop' }], // Assuming stop if DONE is received
                    isFinal: true,
                    usage: undefined, // Cost for OpenRouter stream is harder to get in real-time
                };
                return;
            }
            try {
                const parsedChunk = JSON.parse(jsonData);
                finalId = parsedChunk.id || finalId;
                finalCreated = parsedChunk.created || finalCreated;
                finalModel = parsedChunk.model || finalModel;

                yield {
                    id: parsedChunk.id,
                    created: parsedChunk.created || Math.floor(Date.now() / 1000),
                    modelId: parsedChunk.model || options.modelId,
                    choices: parsedChunk.choices.map((choice: any) => ({
                        delta: choice.delta,
                        finish_reason: choice.finish_reason,
                        index: choice.index,
                    })),
                    isFinal: !!parsedChunk.choices[0]?.finish_reason,
                    rawResponse: parsedChunk,
                };
            } catch (parseError) {
                console.warn('OpenRouterProvider: Could not parse stream chunk:', jsonData, parseError);
            }
        }
      }
    } catch (error: any) {
      console.error(`OpenRouterProvider stream error for model ${options.modelId}:`, error.response?.data || error.message);
      yield {
        id: `error-or-stream-${Date.now()}`,
        created: Math.floor(Date.now() / 1000),
        modelId: options.modelId,
        choices: [],
        isFinal: true,
        error: { message: error.message || 'OpenRouter stream error' },
      };
    }
  }
  
  public async listAvailableModels(): Promise<ModelInfo[]> {
    // OpenRouter has an endpoint to list models, typically /models
    try {
        const response = await this.client.get('/models');
        // Assuming response.data.data is an array of OpenRouter model objects
        return response.data.data.map((model: any) => ({
            id: model.id, // e.g., "openai/gpt-3.5-turbo"
            providerId: this.providerId,
            name: model.name || model.id,
            description: model.description,
            inputTokenLimit: model.context_length,
            outputTokenLimit: model.max_tokens, // May vary, OpenRouter usually specifies context_length
            pricing: model.pricing ? { // OpenRouter pricing is per million tokens
                prompt: parseFloat(model.pricing.prompt) / 1000, // convert to per 1K
                completion: parseFloat(model.pricing.completion) / 1000, // convert to per 1K
                currency: 'USD'
            } : undefined,
            capabilities: ['chat', 'streaming'], // Generic, actual capabilities vary
        }));
    } catch (error: any) {
        console.error("OpenRouterProvider: Failed to list models:", error.message);
        return [];
    }
  }

  public getFormatTypeForModel(modelId: string): ModelTargetInfo['promptFormatType'] {
    // Most models on OpenRouter expect OpenAI chat format if they are chat models.
    // Some might be completion-only. This requires more specific metadata from OpenRouter.
    if (modelId.includes('claude')) return 'anthropic_text'; // Or a specific claude chat format
    return 'openai_chat'; // Common default
  }

  public getToolSupportForModel(modelId: string): ModelTargetInfo['toolSupport'] {
    // Tool support depends on the underlying model OpenRouter routes to.
    // E.g., openai/gpt-4o would support openai_tools.
    if (modelId.startsWith('openai/gpt-3.5-turbo') || modelId.startsWith('openai/gpt-4')) {
      return 'openai_tools';
    }
    // Anthropic models have their own tool format
    if (modelId.includes('claude')) return 'anthropic_tools';
    return 'none';
  }
}