// File: backend/src/core/llm/ollama.llm.service.ts
/**
 * @file Ollama LLM Service Implementation.
 * @description Implements {@link ILlmService} for Ollama's native `/api/chat` endpoint.
 * This is used for hosted features like the Rabbit Hole "Ollama Tunnel", where a user
 * registers a public HTTPS origin (e.g. `https://xxxx.trycloudflare.com`) that forwards
 * to their local Ollama instance.
 */

import { LlmProviderId } from './llm.config.service.js';
import type {
  IChatCompletionParams,
  IChatMessage,
  ILlmProviderConfig,
  ILlmResponse,
  ILlmService,
  ILlmUsage,
} from './llm.interfaces.js';

type OllamaChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OllamaChatResponse = {
  model?: string;
  created_at?: string;
  message?: {
    role?: string;
    content?: string;
  };
  done?: boolean;
  prompt_eval_count?: number;
  eval_count?: number;
  error?: string;
};

function parsePositiveInt(raw: unknown): number | null {
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN;
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
}

function normalizeBaseUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    // If caller already passes ".../api", keep it; otherwise append.
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  } catch {
    return null;
  }
}

function stripProviderPrefix(modelId: string): string {
  const trimmed = modelId.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('ollama/')) return trimmed.slice('ollama/'.length);
  return trimmed;
}

function mapMessagesToOllama(messages: IChatMessage[]): OllamaChatMessage[] {
  return (messages || []).map((m): OllamaChatMessage => {
    const role = m.role;
    const content = typeof m.content === 'string' ? m.content : '';
    if (role === 'system') return { role: 'system', content };
    if (role === 'assistant') return { role: 'assistant', content };
    if (role === 'tool') {
      const toolName = m.name || m.tool_call_id || 'tool';
      return { role: 'assistant', content: `[tool:${toolName}] ${content}`.trim() };
    }
    return { role: 'user', content };
  });
}

function mapOptionsToOllama(params?: IChatCompletionParams): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!params) return out;
  if (typeof params.temperature === 'number') out.temperature = params.temperature;
  if (typeof params.top_p === 'number') out.top_p = params.top_p;
  if (typeof params.max_tokens === 'number') out.num_predict = params.max_tokens;
  if (typeof params.presence_penalty === 'number') out.presence_penalty = params.presence_penalty;
  if (typeof params.frequency_penalty === 'number')
    out.frequency_penalty = params.frequency_penalty;
  if (typeof params.stop === 'string' || Array.isArray(params.stop)) out.stop = params.stop;
  return out;
}

export class OllamaLlmService implements ILlmService {
  public readonly providerId = LlmProviderId.OLLAMA;

  private readonly baseUrl: string;
  private readonly defaultModel?: string;
  private readonly headers: Record<string, string>;
  private readonly timeoutMs: number;

  constructor(config: ILlmProviderConfig) {
    const baseUrl = normalizeBaseUrl(config.baseUrl);
    if (!baseUrl) {
      throw new Error('Ollama baseUrl is required for OllamaLlmService.');
    }
    this.baseUrl = baseUrl;
    this.defaultModel = config.defaultModel;

    const timeout =
      parsePositiveInt(process.env.OLLAMA_REQUEST_TIMEOUT_MS) ??
      parsePositiveInt((config as any).requestTimeoutMs) ??
      60_000;
    this.timeoutMs = timeout;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.additionalHeaders || {}),
    };
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
    this.headers = headers;
  }

  async generateChatCompletion(
    messages: IChatMessage[],
    modelId: string,
    params?: IChatCompletionParams
  ): Promise<ILlmResponse> {
    const effectiveModel = stripProviderPrefix(modelId || this.defaultModel || '').trim();
    if (!effectiveModel) {
      throw new Error('Ollama modelId is required.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const payload: Record<string, unknown> = {
        model: effectiveModel,
        messages: mapMessagesToOllama(messages),
        stream: false,
      };

      const options = mapOptionsToOllama(params);
      if (Object.keys(options).length > 0) payload.options = options;

      const res = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = (await res.json().catch(() => null)) as OllamaChatResponse | null;
      if (!res.ok) {
        const message =
          (data && typeof data.error === 'string' && data.error) ||
          `Ollama request failed with status ${res.status}`;
        throw new Error(message);
      }

      if (data?.error) {
        throw new Error(String(data.error));
      }

      const prompt = typeof data?.prompt_eval_count === 'number' ? data.prompt_eval_count : null;
      const completion = typeof data?.eval_count === 'number' ? data.eval_count : null;
      const usage: ILlmUsage | undefined =
        typeof prompt === 'number' || typeof completion === 'number'
          ? {
              prompt_tokens: prompt,
              completion_tokens: completion,
              total_tokens:
                typeof prompt === 'number' && typeof completion === 'number'
                  ? prompt + completion
                  : null,
            }
          : undefined;

      const content =
        data?.message && typeof data.message.content === 'string' ? data.message.content : null;

      return {
        text: typeof content === 'string' ? content : null,
        model: (data?.model && String(data.model)) || effectiveModel,
        usage,
        id: `ollama-${Date.now()}`,
        stopReason: data?.done ? 'stop' : undefined,
        providerResponse: data,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Stream a chat completion from Ollama, yielding partial content chunks.
   * Each yielded object contains a `text` delta and optional `done` flag.
   */
  async *generateChatCompletionStream(
    messages: IChatMessage[],
    modelId: string,
    params?: IChatCompletionParams
  ): AsyncGenerator<{ text: string; done: boolean; usage?: ILlmUsage }> {
    const effectiveModel = stripProviderPrefix(modelId || this.defaultModel || '').trim();
    if (!effectiveModel) {
      throw new Error('Ollama modelId is required.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const payload: Record<string, unknown> = {
        model: effectiveModel,
        messages: mapMessagesToOllama(messages),
        stream: true,
      };

      const options = mapOptionsToOllama(params);
      if (Object.keys(options).length > 0) payload.options = options;

      const res = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`Ollama streaming request failed with status ${res.status}: ${errBody}`);
      }

      if (!res.body) {
        throw new Error('Ollama response has no body for streaming');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        buffer += decoder.decode(value, { stream: true });

        // Ollama streams newline-delimited JSON
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let chunk: OllamaChatResponse;
          try {
            chunk = JSON.parse(trimmed);
          } catch {
            continue;
          }

          if (chunk.error) {
            throw new Error(String(chunk.error));
          }

          const text = chunk.message?.content || '';
          const isDone = chunk.done === true;

          const usage: ILlmUsage | undefined = isDone
            ? {
                prompt_tokens:
                  typeof chunk.prompt_eval_count === 'number' ? chunk.prompt_eval_count : null,
                completion_tokens: typeof chunk.eval_count === 'number' ? chunk.eval_count : null,
                total_tokens:
                  typeof chunk.prompt_eval_count === 'number' &&
                  typeof chunk.eval_count === 'number'
                    ? chunk.prompt_eval_count + chunk.eval_count
                    : null,
              }
            : undefined;

          yield { text, done: isDone, usage };
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const chunk: OllamaChatResponse = JSON.parse(buffer.trim());
          const text = chunk.message?.content || '';
          yield { text, done: chunk.done === true };
        } catch {
          // Incomplete final chunk — ignore
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
