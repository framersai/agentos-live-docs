// backend/agentos/core/llm/providers/implementations/OllamaProvider.ts

import axios, { AxiosInstance } from 'axios';
import {
  IProvider,
  ModelCompletionOptions,
  ModelCompletionResponse,
  ModelUsage,
  ModelInfo,
  ModelResponseMessage
} from '../IProvider';
import { FormattedPrompt, PromptEngineResult, ModelTargetInfo } from '../../IPromptEngine';

/**
 * @fileoverview Ollama Provider implementation for AgentOS (for local LLMs).
 * @module agentos/core/llm/providers/implementations/OllamaProvider
 */

interface OllamaProviderConfig {
  baseURL?: string; // e.g., http://localhost:11434
  defaultModel?: string; // e.g., "llama3"
  requestTimeout?: number; // ms
}

// Ollama /api/chat response structure (simplified)
interface OllamaChatResponse {
  model: string;
  created_at: string;
  message?: { // Non-streaming
    role: 'assistant';
    content: string;
  };
  done: boolean; // True for final non-streaming response or final stream chunk
  // For streaming, message is in each chunk
  // Usage stats from Ollama
  prompt_eval_count?: number;
  eval_count?: number; // Completion tokens
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}


export class OllamaProvider implements IProvider {
  public readonly providerId = 'ollama';
  public defaultModelId?: string;
  public isInitialized = false;
  private client!: AxiosInstance;
  private config!: OllamaProviderConfig;

  public async initialize(config: OllamaProviderConfig): Promise<void> {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL || 'http://localhost:11434/api',
      timeout: config.requestTimeout || 60000, // 60 seconds
    });
    this.defaultModelId = config.defaultModel || 'llama3'; // Common default
    try {
        // Test connection by listing local models
        await this.client.get('/tags');
        this.isInitialized = true;
        console.log(`OllamaProvider initialized. Base URL: ${this.client.defaults.baseURL}. Default model: ${this.defaultModelId}`);
    } catch (error: any) {
        this.isInitialized = false;
        console.error(`OllamaProvider initialization failed: Could not connect to Ollama at ${this.client.defaults.baseURL}. Error: ${error.message}`);
        // Optionally rethrow or handle more gracefully depending on application startup requirements.
        throw new Error(`OllamaProvider: Failed to connect to Ollama service at ${this.client.defaults.baseURL}. Ensure Ollama is running and accessible.`);
    }
  }

  public calculateCostForUsage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _modelId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _usage: { promptTokens: number; completionTokens: number }
  ): Pick<ModelUsage, 'costUSD' | 'promptTokenCostPer1K' | 'completionTokenCostPer1K' | 'currency'> | undefined {
    // Local models typically have no direct monetary cost per token.
    return { costUSD: 0, currency: 'USD' };
  }

  private transformToOllamaMessages(prompt: FormattedPrompt): Array<{role: string; content: string; images?: string[]}> {
    if (typeof prompt === 'string') {
      return [{ role: 'user', content: prompt }];
    }
    // Ollama expects a specific message structure. Map roles.
    return prompt.map(p => {
        let role = p.role;
        if (p.role === 'tool') role = 'tool'; // Ollama supports 'tool' role for tool results
        // TODO: Handle image data if present in p.content and model supports multimodal
        return {
            role: role as string,
            content: p.content || "", // Ensure content is string, even if null from tool calls
            // images: p.images_base64_ HAndle if we support multimodal later
        };
    });
  }

  public async generateCompletion(
    prompt: FormattedPrompt,
    options: ModelCompletionOptions,
    _promptEngineResult?: PromptEngineResult
  ): Promise<ModelCompletionResponse> {
    if (!this.isInitialized) throw new Error("OllamaProvider not initialized.");

    const messages = this.transformToOllamaMessages(prompt);
    const requestPayload = {
      model: options.modelId,
      messages: messages,
      stream: false,
      format: options.response_format?.type === "json_object" ? "json" : undefined,
      options: { // Ollama puts parameters under 'options'
        temperature: options.temperature,
        num_predict: options.max_tokens, // Ollama uses num_predict for max_tokens
        top_p: options.top_p,
        frequency_penalty: options.frequency_penalty, // Map AgentOS names to Ollama names
        presence_penalty: options.presence_penalty,
        stop: options.stop,
        // Add other Ollama-specific parameters if needed
      },
      // Ollama tools are experimental and structure might differ, pass through for now if any
      // tools: options.tools,
    };

    try {
      const response = await this.client.post('/chat', requestPayload);
      const data = response.data as OllamaChatResponse;

      const promptTokens = data.prompt_eval_count || 0;
      const completionTokens = data.eval_count || 0;
      const costInfo = this.calculateCostForUsage(options.modelId, { promptTokens, completionTokens });

      return {
        id: `ollama-${options.modelId}-${Date.now()}`,
        created: new Date(data.created_at).getTime() / 1000,
        modelId: data.model,
        choices: data.message ? [{
          message: data.message as ModelResponseMessage, // Assuming alignment
          finish_reason: data.done ? 'stop' : 'length', // Best guess
        }] : [],
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          ...costInfo,
        },
        rawResponse: data,
      };
    } catch (error: any) {
      console.error(`OllamaProvider error for model ${options.modelId}:`, error.response?.data || error.message);
      const errorData = error.response?.data;
      return {
        id: `error-ollama-${Date.now()}`,
        created: Math.floor(Date.now() / 1000),
        modelId: options.modelId,
        choices: [],
        error: {
          message: errorData?.error || error.message || 'Unknown Ollama API error',
          type: 'ollama_error',
          code: error.response?.status,
          details: errorData,
        },
      };
    }
  }

  public async *generateCompletionStream(
    prompt: FormattedPrompt,
    options: ModelCompletionOptions,
    _promptEngineResult?: PromptEngineResult
  ): AsyncIterable<ModelCompletionResponse> {
    if (!this.isInitialized) throw new Error("OllamaProvider not initialized.");

    const messages = this.transformToOllamaMessages(prompt);
    const requestPayload = {
      model: options.modelId,
      messages: messages,
      stream: true,
      format: options.response_format?.type === "json_object" ? "json" : undefined,
      options: {
        temperature: options.temperature,
        num_predict: options.max_tokens,
        // ... other options
      },
    };

    let accumulatedContent = "";
    let accumulatedPromptTokens = 0;
    let accumulatedCompletionTokens = 0;

    try {
      const response = await this.client.post('/chat', requestPayload, {
        responseType: 'stream',
      });
      const stream = response.data as NodeJS.ReadableStream;

      for await (const chunk of stream) {
        const chunkString = chunk.toString();
        // Ollama stream sends multiple JSON objects, newline-separated
        const jsonObjects = chunkString.split('\n').filter(Boolean);

        for (const jsonObjStr of jsonObjects) {
          try {
            const parsedChunk = JSON.parse(jsonObjStr) as OllamaChatResponse;
            accumulatedContent += parsedChunk.message?.content || "";
            if(parsedChunk.done){ // Final chunk often contains usage stats
                accumulatedPromptTokens = parsedChunk.prompt_eval_count || accumulatedPromptTokens;
                accumulatedCompletionTokens = parsedChunk.eval_count || accumulatedCompletionTokens;
            }

            yield {
              id: `ollama-stream-${options.modelId}-${Date.now()}`,
              created: parsedChunk.created_at ? new Date(parsedChunk.created_at).getTime() / 1000 : Math.floor(Date.now() / 1000),
              modelId: parsedChunk.model || options.modelId,
              choices: parsedChunk.message ? [{
                delta: { content: parsedChunk.message.content },
                finish_reason: parsedChunk.done ? 'stop' : null,
              }] : [],
              isFinal: parsedChunk.done,
              usage: parsedChunk.done ? { // Only include usage in the final chunk
                promptTokens: accumulatedPromptTokens,
                completionTokens: accumulatedCompletionTokens,
                totalTokens: accumulatedPromptTokens + accumulatedCompletionTokens,
                ...(this.calculateCostForUsage(options.modelId, { promptTokens: accumulatedPromptTokens, completionTokens: accumulatedCompletionTokens })),
              } : undefined,
              rawResponse: parsedChunk,
            };
            if (parsedChunk.done) return; // End stream explicitly
          } catch (parseError) {
            console.warn('OllamaProvider: Could not parse stream chunk:', jsonObjStr, parseError);
          }
        }
      }
    } catch (error: any) {
      console.error(`OllamaProvider stream error for model ${options.modelId}:`, error.response?.data || error.message);
      yield {
        id: `error-ollama-stream-${Date.now()}`,
        created: Math.floor(Date.now() / 1000),
        modelId: options.modelId,
        choices: [],
        isFinal: true,
        error: { message: error.message || 'Ollama stream error' },
      };
    }
  }

  public async listAvailableModels(): Promise<ModelInfo[]> {
    if (!this.isInitialized) return [];
    try {
      const response = await this.client.get('/tags'); // Ollama's endpoint for local models
      // Ollama response.data.models is an array of {name, modified_at, size, digest, details: {family, format, parameter_size}}
      return response.data.models.map((model: any) => ({
        id: model.name, // e.g., "llama3:latest"
        providerId: this.providerId,
        name: model.name,
        description: `Family: ${model.details?.family}, Size: ${model.details?.parameter_size}`,
        // Token limits are harder to get generically from Ollama, often model-specific
        // pricing is $0 for local models
        pricing: { prompt: 0, completion: 0, currency: 'USD' },
        capabilities: ['chat', 'streaming'], // Most Ollama models support chat & streaming
        contextWindow: this.getContextWindowForOllamaModel(model.details?.family, model.details?.parameter_size),
      }));
    } catch (error: any) {
      console.error("OllamaProvider: Failed to list models:", error.message);
      return [];
    }
  }

  private getContextWindowForOllamaModel(family?: string, paramSize?: string): number | undefined {
    // Very rough estimates, actual values depend on specific model variant.
    if (!family) return 4096; // Default
    const fam = family.toLowerCase();
    if (fam.includes("llama3") && paramSize?.includes("70b")) return 8192;
    if (fam.includes("llama3")) return 8192; // 8b default
    if (fam.includes("llama2") && paramSize?.includes("70b")) return 4096;
    if (fam.includes("llama2")) return 4096;
    if (fam.includes("codellama") && paramSize?.includes("34b")) return 16000; // Or even 100k for some
    if (fam.includes("codellama")) return 16000;
    if (fam.includes("mistral")) return 32000; // For newer Mistral variants
    if (fam.includes("mixtral")) return 32000;
    if (fam.includes("phi3") && paramSize?.includes("mini") && paramSize?.includes("128k")) return 128000;
    if (fam.includes("phi3")) return 4096; // Default for smaller Phi-3
    return 4096; // General fallback
  }


  public getFormatTypeForModel(_modelId: string): ModelTargetInfo['promptFormatType'] {
    // Ollama generally uses a format similar to OpenAI chat for its /api/chat endpoint
    return 'openai_chat';
  }

  public getToolSupportForModel(modelId: string): ModelTargetInfo['toolSupport'] {
      // Ollama's tool support is experimental and depends on the model.
      // Some newer models like Llama 3 might have some level of function calling.
      // For MVP, assume 'none' or 'openai_tools' if the model is known to be compatible.
      if (modelId.includes('llama3') || modelId.includes('phi3')) return 'openai_tools_experimental'; // Mark as experimental
      return 'none';
  }
}