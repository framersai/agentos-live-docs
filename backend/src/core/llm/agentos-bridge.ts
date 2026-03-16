/**
 * @fileoverview Bridge between legacy backend LLM layer (ILlmService/callLlm)
 * and AgentOS AIModelProviderManager.
 *
 * This module provides `callLlmViaAgentOS()` — a drop-in replacement for
 * `callLlm()` that routes through the AgentOS provider system. Consumers
 * can migrate incrementally by switching their import.
 *
 * Type mapping: IChatMessage <-> ChatMessage, ILlmResponse <-> ModelCompletionResponse
 */

import type {
  IChatMessage,
  IChatCompletionParams,
  ILlmResponse,
  ILlmToolCall,
  ILlmProviderConfig,
} from './llm.interfaces.js';

/**
 * Attempts to call an LLM through the AgentOS integration layer.
 * Falls back to the legacy callLlm if AgentOS is not available.
 *
 * @param messages - Chat messages in legacy IChatMessage format
 * @param modelId - Model identifier (e.g., 'gpt-4o', 'openai/gpt-4o-mini')
 * @param params - Completion parameters (temperature, tools, etc.)
 * @param providerId - Provider identifier (e.g., 'openai', 'openrouter', 'ollama')
 * @returns ILlmResponse in legacy format
 */
export async function callLlmViaAgentOS(
  messages: IChatMessage[],
  modelId?: string,
  params?: IChatCompletionParams,
  providerId?: string,
  _userIdForCostTracking?: string
): Promise<ILlmResponse> {
  // Try to get the AgentOS integration
  let agentosProvider: any;
  try {
    const { agentosService, isAgentOSEnabled } = await import(
      '../../integrations/agentos/agentos.integration.js'
    );
    if (!isAgentOSEnabled()) throw new Error('AgentOS not enabled');
    const integration = agentosService;

    // Get the AIModelProviderManager from the integration's internal AgentOS instance
    agentosProvider =
      (integration as any).agentOS?.modelProviderManager ??
      (integration as any).modelProviderManager;
    if (!agentosProvider) throw new Error('No model provider manager');
  } catch {
    // AgentOS not available — fall back to legacy
    const { callLlm } = await import('./llm.factory.js');
    return callLlm(messages, modelId, params, providerId);
  }

  // Map IChatMessage[] → ChatMessage[] (agentos format)
  const chatMessages = messages.map((m) => ({
    role: m.role as 'system' | 'user' | 'assistant' | 'tool',
    content: m.content ?? '',
    name: m.name,
    tool_calls: m.tool_calls,
    tool_call_id: m.tool_call_id,
  }));

  // Resolve provider
  const resolvedProviderId =
    providerId ?? agentosProvider.getDefaultProvider()?.providerId ?? 'openai';
  const provider =
    agentosProvider.getProvider(resolvedProviderId) ??
    agentosProvider.getProviderForModel(modelId ?? '') ??
    agentosProvider.getDefaultProvider();

  if (!provider) {
    // No agentos provider — fall back
    const { callLlm } = await import('./llm.factory.js');
    return callLlm(messages, modelId, params, providerId);
  }

  const resolvedModel =
    modelId ??
    provider.defaultModel ??
    agentosProvider.getDefaultProvider()?.defaultModel ??
    'gpt-4o';

  // Call through agentos provider
  const response = await provider.generateCompletion(resolvedModel, chatMessages, {
    temperature: params?.temperature,
    max_tokens: params?.max_tokens,
    tools: params?.tools,
    tool_choice: params?.tool_choice,
    response_format: params?.response_format,
  });

  // Map ModelCompletionResponse → ILlmResponse (legacy format)
  const choice = response?.choices?.[0];
  const toolCalls: ILlmToolCall[] | undefined = choice?.message?.tool_calls?.map((tc: any) => ({
    id: tc.id,
    type: tc.type ?? 'function',
    function: {
      name: tc.function?.name ?? tc.name ?? '',
      arguments:
        typeof tc.function?.arguments === 'string'
          ? tc.function.arguments
          : JSON.stringify(tc.function?.arguments ?? tc.arguments ?? '{}'),
    },
  }));

  return {
    text:
      typeof choice?.message?.content === 'string'
        ? choice.message.content
        : Array.isArray(choice?.message?.content)
          ? choice.message.content.map((p: any) => p?.text ?? '').join('')
          : (choice?.text ?? ''),
    model: response?.model ?? resolvedModel,
    stopReason: choice?.finish_reason ?? 'stop',
    toolCalls: toolCalls?.length ? toolCalls : undefined,
    usage: response?.usage
      ? {
          prompt_tokens: response.usage.promptTokens ?? response.usage.prompt_tokens ?? 0,
          completion_tokens:
            response.usage.completionTokens ?? response.usage.completion_tokens ?? 0,
          total_tokens: response.usage.totalTokens ?? response.usage.total_tokens ?? 0,
        }
      : undefined,
  };
}

/**
 * Drop-in replacement for callLlmWithProviderConfig that routes through AgentOS.
 * Falls back to legacy when AgentOS is unavailable.
 */
export async function callLlmWithProviderConfigViaAgentOS(
  messages: IChatMessage[],
  modelId: string | undefined,
  params: IChatCompletionParams | undefined,
  providerConfig: ILlmProviderConfig,
  userIdForCostTracking: string = 'system_user_llm_factory'
): Promise<ILlmResponse> {
  const providerId = String(providerConfig.providerId || '').toLowerCase();
  return callLlmViaAgentOS(messages, modelId, params, providerId);
}
